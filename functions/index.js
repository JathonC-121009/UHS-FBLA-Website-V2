const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });
const fs = require('fs');
const path = require('path');
const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const { defineSecret } = require('firebase-functions/params');
const { onRequest } = require('firebase-functions/v2/https');

admin.initializeApp();

const PROJECT_ID = 'uhs-fbla-website';
const QUEUE_LOCATION = 'us-central1';
const QUEUE_NAME = 'moderation-queue';
const TASK_HANDLER_URL = 'https://us-central1-uhs-fbla-website.cloudfunctions.net/processModerationTask';
const TASK_INVOKER_SERVICE_ACCOUNT = 'moderation-task-invoker@uhs-fbla-website.iam.gserviceaccount.com';

/**
 * Convert "Last, First" format to "First Last"
 */
function convertNameFormat(nameStr) {
  if (!nameStr || typeof nameStr !== 'string') return '';
  const parts = nameStr.split(',').map(p => p.trim());
  if (parts.length === 2) {
    return `${parts[1]} ${parts[0]}`;
  }
  return nameStr;
}

/**
 * Cloud Function to fetch student data from Google Sheets
 */
exports.getStudentData = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const { google } = require('googleapis');
      // Load service account from JSON file
      const keyPath = path.join(__dirname, 'uhs-fbla-website-0a59ee529c56.json');
      
      if (!fs.existsSync(keyPath)) {
        throw new Error('Service account key file not found. Make sure uhs-fbla-website-0a59ee529c56.json is in the functions directory.');
      }

      const serviceAccountKey = JSON.parse(
        fs.readFileSync(keyPath, 'utf8')
      );

      // Initialize Google Sheets API with service account
      const auth = new google.auth.GoogleAuth({
        credentials: serviceAccountKey,
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
      });

      const sheets = google.sheets({ version: 'v4', auth });

      // Fetch data from the sheet
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: '1MmgnPpUTWyc_X7M2ogjKerfAGEpnzSisYqmyMalbUng',
        range: 'Yearly Tracker!B2:D',
      });

      const rows = response.data.values || [];

      // Parse the data
      const students = rows
        .filter(row => row[0] && row[1] && row[2]) // Ensure all fields exist
        .map(row => ({
          name: convertNameFormat(row[0]),
          totalPoints: parseInt(row[1], 10) || 0,
          monthlyPoints: parseInt(row[2], 10) || 0,
        }))
        .filter(student => student.name); // Filter out entries with empty names

      res.json({
        success: true,
        data: students,
      });
    } catch (error) {
      console.error('Error fetching student data:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch student data',
      });
    }
  });
});

// ---------------------------------------------------------------------------
// Moderation — OpenAI-powered auto-approval for pending posts and replies.
//
// MODERATION_THRESHOLDS is a first-draft starting point. These values are
// meant to be tuned by the site owner and chapter adviser after watching real
// moderation results — do not treat these as finalized values.
// ---------------------------------------------------------------------------
const OPENAI_API_KEY_SECRET = defineSecret('OPENAI_API_KEY');

const MODERATION_THRESHOLDS = {
  harassment: 0.5,
  'harassment/threatening': 0.3,
  hate: 0.5,
  'hate/threatening': 0.3,
  violence: 0.5,
  'violence/graphic': 0.3,
  'self-harm': 0.5,
  'self-harm/intent': 0.3,
  'self-harm/instructions': 0.3,
  sexual: 0.5,
  'sexual/minors': 0.1,
};

/**
 * Enqueue a Cloud Task to moderate a document, routed through a rate-limited
 * queue to stay under the OpenAI free-tier limit.
 */
async function enqueueModerationTask(collection, docId) {
  try {
    const { CloudTasksClient } = require('@google-cloud/tasks');
    const tasksClient = new CloudTasksClient();
    const queuePath = tasksClient.queuePath(PROJECT_ID, QUEUE_LOCATION, QUEUE_NAME);

    const body = Buffer.from(JSON.stringify({ collection, docId })).toString('base64');

    const task = {
      httpRequest: {
        httpMethod: 'POST',
        url: TASK_HANDLER_URL,
        body,
        headers: { 'Content-Type': 'application/json' },
        oidcToken: {
          serviceAccountEmail: TASK_INVOKER_SERVICE_ACCOUNT,
        },
      },
    };

    await tasksClient.createTask({ parent: queuePath, task });
    console.log(`enqueueModerationTask: enqueued ${collection}/${docId}`);
  } catch (err) {
    console.error('enqueueModerationTask: failed to enqueue', collection, docId, err);
  }
}

/**
 * Run OpenAI moderation on a document and update its status.
 * Shared by the Cloud Tasks handler for both posts and replies.
 */
async function runModeration(collection, docId) {
  const snap = await admin.firestore().collection(collection).doc(docId).get();
  if (!snap.exists) return;

  const data = snap.data();
  if (data.status !== 'pending') return;

  const text = data.message;
  if (!text || !text.trim()) {
    console.error(`runModeration: message field missing or empty for ${collection}/${docId}`);
    return;
  }

  try {
    const { default: OpenAI } = await import('openai');
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const moderation = await openai.moderations.create({
      model: 'omni-moderation-latest',
      input: text,
    });

    const result = moderation.results[0];
    const scores = result.category_scores;
    let autoFlagged = false;

    if (result.flagged) {
      autoFlagged = true;
    } else {
      for (const [category, threshold] of Object.entries(MODERATION_THRESHOLDS)) {
        if (scores[category] !== undefined && scores[category] >= threshold) {
          autoFlagged = true;
          break;
        }
      }
    }

    if (autoFlagged) {
      await snap.ref.update({ autoFlagged: true });
      console.log(`runModeration: flagged ${collection}/${docId}`);
    } else {
      await snap.ref.update({ status: 'visible' });
      console.log(`runModeration: auto-approved ${collection}/${docId}`);
    }
  } catch (err) {
    console.error(`runModeration: error for ${collection}/${docId}`, err);
    // Fail-closed: leave status as 'pending', do NOT auto-approve
  }
}

/**
 * Moderate a newly-created post — enqueue a Cloud Tasks job instead of
 * calling OpenAI inline (rate-limit safe for free-tier accounts).
 */
exports.moderatePost = onDocumentCreated(
  { document: 'posts/{postId}' },
  async (event) => {
    const snap = event.data;
    if (!snap) return;

    const data = snap.data();
    if (data.status !== 'pending') return;

    const text = data.message;
    if (!text || !text.trim()) {
      console.error('moderatePost: message field missing or empty for', snap.id);
      return;
    }

    await enqueueModerationTask('posts', snap.id);
  },
);

/**
 * Moderate a newly-created reply — enqueue a Cloud Tasks job instead of
 * calling OpenAI inline (rate-limit safe for free-tier accounts).
 */
exports.moderateReply = onDocumentCreated(
  { document: 'replies/{replyId}' },
  async (event) => {
    const snap = event.data;
    if (!snap) return;

    const data = snap.data();
    if (data.status !== 'pending') return;

    const text = data.message;
    if (!text || !text.trim()) {
      console.error('moderateReply: message field missing or empty for', snap.id);
      return;
    }

    await enqueueModerationTask('replies', snap.id);
  },
);

/**
 * HTTPS endpoint called by Cloud Tasks to run the actual OpenAI moderation.
 * Restricted to the moderation-task-invoker service account via the invoker option.
 */
exports.processModerationTask = onRequest(
  {
    invoker: [TASK_INVOKER_SERVICE_ACCOUNT],
    secrets: [OPENAI_API_KEY_SECRET],
  },
  async (req, res) => {
    try {
      const { collection, docId } = req.body;

      if (!collection || !docId) {
        res.status(400).send('Missing collection or docId');
        return;
      }

      if (collection !== 'posts' && collection !== 'replies') {
        res.status(400).send('Invalid collection');
        return;
      }

      await runModeration(collection, docId);
      res.status(200).send('ok');
    } catch (err) {
      console.error('processModerationTask: unexpected error', err);
      res.status(500).send('Internal error');
    }
  },
);
