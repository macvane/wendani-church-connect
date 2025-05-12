
/**
 * Utility for sending form data to Google Sheets
 */

// Google Apps Script URL (this should be replaced with your actual deployed script URL)
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbxPYULQxLzI8-HIu9bFdqCf265tpCnMd7IjLjhrIx55oaA_-pygnWLGQCqUc-Olk_Ov/exec";

export type FormType = 'contact' | 'baptism' | 'benevolence' | 'dedication' | 'prayer' | 'library' | 'donation';

/**
 * Send form data to Google Sheets
 * @param data Form data to be sent
 * @param formType Type of form to determine which sheet tab to use
 */
export const sendToGoogleSheet = async (data: Record<string, any>, formType: FormType): Promise<void> => {
  const formData = {
    ...data,
    formType,
    timestamp: new Date().toISOString()
  };

  try {
    await fetch(GOOGLE_SHEET_URL, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "text/plain"
      },
      mode: "no-cors"
    });
    console.log(`Successfully submitted ${formType} form data`);
  } catch (error) {
    console.error(`Error submitting ${formType} form data:`, error);
    throw error; // Re-throw to allow handling in the component
  }
};
