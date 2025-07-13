// utils/googleSheets.js (or .ts)

const GOOGLE_APPS_SCRIPT_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzIF1d_TfKL-2_fprtUz3oBlhAbHW_tDMPWYY5DNd5f-OaDSF17WzN8YMdG3NAOlSY6/exec'; // Make sure this is correct

export const sendToGoogleSheet = async (formData: any, formType: string) => {
  try {
    const response = await fetch(GOOGLE_APPS_SCRIPT_WEB_APP_URL, {
      method: 'POST',
      mode: "no-cors",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    // Now, we *can* reliably check response.ok and parse JSON
    if (!response.ok) {
      // Try to get more specific error info if possible
      let errorMessage = `HTTP error! Status: ${response.status}`;
      try {
        const errorBody = await response.json();
        errorMessage += ` - Details: ${JSON.stringify(errorBody)}`;
      } catch (e) {
        errorMessage += " - Could not parse error response body.";
      }
      throw new Error(errorMessage);
    }

    const result = await response.json(); // Expecting a JSON response from Apps Script
    console.log("Google Sheet submission successful:", result);
    return result; // Return the result from the Apps Script
  } catch (error) {
    console.error("Error sending data to Google Sheet:", error);
    throw error; // Re-throw to be caught by the calling component (Benevolence.tsx)
  }
};