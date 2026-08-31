const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { google } = require('googleapis');
const cors = require('cors')({ origin: true });
const fs = require('fs');
const path = require('path');
const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const { defineSecret } = require('firebase-functions/params');

admin.initializeApp();

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
 * Moderate a newly-created post via OpenAI's Moderation API.
 * If the content is clean, auto-approve it (status → 'visible').
 * If flagged or on any error, leave status as 'pending' for manual review.
 */
exports.moderatePost = onDocumentCreated(
  {
    document: 'posts/{postId}',
    secrets: [OPENAI_API_KEY_SECRET],
  },
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
        console.log('moderatePost: flagged', snap.id);
      } else {
        await snap.ref.update({ status: 'visible' });
        console.log('moderatePost: auto-approved', snap.id);
      }
    } catch (err) {
      console.error('moderatePost: error for', snap.id, err);
      // Fail-closed: leave status as 'pending', do NOT auto-approve
    }
  },
);

/**
 * Moderate a newly-created reply via OpenAI's Moderation API.
 * Same logic as moderatePost but scoped to the replies collection.
 */
exports.moderateReply = onDocumentCreated(
  {
    document: 'replies/{replyId}',
    secrets: [OPENAI_API_KEY_SECRET],
  },
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
        console.log('moderateReply: flagged', snap.id);
      } else {
        await snap.ref.update({ status: 'visible' });
        console.log('moderateReply: auto-approved', snap.id);
      }
    } catch (err) {
      console.error('moderateReply: error for', snap.id, err);
      // Fail-closed: leave status as 'pending', do NOT auto-approve
    }
  },
);
