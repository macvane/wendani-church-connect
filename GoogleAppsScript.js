
/**
 * Kahawa Wendani SDA Church Form Processor
 * 
 * This script handles form submissions from the church website
 * and records them in the appropriate sheet tabs.
 */

// Define the doPost function that will handle POST requests from the website
function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    const formType = data.formType;
    
    // Save the data to the appropriate sheet
    const result = saveToSheet(data, formType);
    
    // Return a success response
    return ContentService.createTextOutput(JSON.stringify({
      result: "success",
      data: result
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Log the error and return an error response
    console.error("Error processing form submission:", error);
    return ContentService.createTextOutput(JSON.stringify({
      result: "error", 
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Save form data to the appropriate sheet tab
 * @param {Object} data - The form data to save
 * @param {String} formType - The type of form (determines which sheet tab to use)
 * @return {Object} The saved data
 */
function saveToSheet(data, formType) {
  // Get the spreadsheet and sheet tab
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet;
  
  // Select the appropriate sheet based on form type
  switch(formType) {
    case 'contact':
      sheet = ss.getSheetByName('Contact') || ss.insertSheet('Contact');
      break;
    case 'baptism':
      sheet = ss.getSheetByName('Baptism') || ss.insertSheet('Baptism');
      break;
    case 'benevolence':
      sheet = ss.getSheetByName('Benevolence') || ss.insertSheet('Benevolence');
      break;
    case 'dedication':
      sheet = ss.getSheetByName('Dedication') || ss.insertSheet('Dedication');
      break;
    case 'prayer':
      sheet = ss.getSheetByName('Prayer') || ss.insertSheet('Prayer');
      break;
    case 'library':
      sheet = ss.getSheetByName('Library') || ss.insertSheet('Library');
      break;
    case 'donation':
      sheet = ss.getSheetByName('Donation') || ss.insertSheet('Donation');
      break;
    default:
      sheet = ss.getSheetByName('Form Submissions') || ss.insertSheet('Form Submissions');
  }
  
  // Check if headers exist, if not add them
  const headers = getHeadersForFormType(formType, data);
  const existingHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  if (existingHeaders.length === 0 || existingHeaders[0] === '') {
    sheet.appendRow(headers);
  }
  
  // Prepare row data in the same order as headers
  const rowData = headers.map(header => {
    // Special case for timestamp
    if (header === 'timestamp' && !data[header]) {
      return new Date().toISOString();
    }
    return data[header] || '';
  });
  
  // Append the new row
  sheet.appendRow(rowData);
  
  return { success: true, message: "Data saved successfully" };
}

/**
 * Get appropriate headers based on form type
 * @param {String} formType - The type of form
 * @param {Object} data - The form data (used as fallback for dynamic headers)
 * @return {Array} Array of header strings
 */
function getHeadersForFormType(formType, data) {
  // Default headers that should be present in all form submissions
  const defaultHeaders = ['timestamp'];
  
  // Form-specific headers
  switch(formType) {
    case 'contact':
      return [...defaultHeaders, 'name', 'email', 'phone', 'subject', 'message'];
    
    case 'baptism':
      return [...defaultHeaders, 'name', 'email', 'phone', 'age', 'preferredDate', 'previousChurch', 'address', 'additionalInfo'];
    
    case 'benevolence':
      return [...defaultHeaders, 'name', 'email', 'phone', 'requestType', 'urgency', 'description', 'address'];
    
    case 'dedication':
      return [...defaultHeaders, 'parentName', 'email', 'phone', 'childName', 'childDOB', 'preferredDate', 'additionalInfo'];
    
    case 'prayer':
      return [...defaultHeaders, 'name', 'email', 'phone', 'prayerRequest', 'isConfidential'];
    
    case 'library':
      return [...defaultHeaders, 'name', 'email', 'phone', 'bookTitle', 'requestType'];
      
    case 'donation':
      return [...defaultHeaders, 'name', 'email', 'phoneNumber', 'amount', 'purpose', 'message'];
    
    default:
      // Fallback: create headers dynamically based on the submitted data
      return [...defaultHeaders, ...Object.keys(data).filter(key => key !== 'formType' && key !== 'timestamp')];
  }
}

/**
 * Test function - can be run manually to check if the script is working
 */
function testScript() {
  const testData = {
    name: "Test User",
    email: "test@example.com",
    message: "This is a test submission",
    formType: "contact",
    timestamp: new Date().toISOString()
  };
  
  const result = saveToSheet(testData, testData.formType);
  Logger.log(result);
  return result;
}

/**
 * Set up a trigger to automatically process emails containing form submissions
 * This is not currently used but can be enabled if needed
 */
function setUpTrigger() {
  ScriptApp.newTrigger('processEmails')
    .timeBased()
    .everyHours(1)
    .create();
}
