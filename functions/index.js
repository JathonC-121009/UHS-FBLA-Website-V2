const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });
const fs = require('fs');
const path = require('path');

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

// Bulletin board moderation is manual: every post and reply is created
// 'pending' and an officer or adviser approves or discards it in the review
// dashboard on /bulletin. The earlier OpenAI auto-approval pipeline (Cloud
// Tasks + moderatePost/moderateReply/processModerationTask) was removed; it is
// in git history if it is ever wanted back.
