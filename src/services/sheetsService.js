/**
 * Fetch student data from Firebase Cloud Function
 * The function reads from Google Sheets using a service account (no OAuth popup needed)
 */
export async function fetchStudentData() {
  try {
    const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
    const region = 'us-central1'; // Default Firebase region

    console.log('Fetching student data from Cloud Function...');

    // Call the Cloud Function
    const response = await fetch(
      `https://${region}-${projectId}.cloudfunctions.net/getStudentData`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch student data');
    }

    console.log(`Successfully fetched ${result.data.length} students`);
    return result.data;
  } catch (error) {
    console.error('Error fetching student data:', error);
    throw error;
  }
}
