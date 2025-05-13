
/**
 * Utility functions for handling dates in the application
 */

/**
 * Checks if a date string has passed the current date
 * @param dateStr Date string in format like "May 5, 2025" or "June 12-15, 2025"
 * @returns boolean indicating if the date has passed
 */
export const isDatePassed = (dateStr: string): boolean => {
  try {
    // Extract the first date if it's a date range (e.g., "June 12-15, 2025" -> "June 12, 2025")
    let firstDate = dateStr;
    
    if (dateStr.includes('-')) {
      const parts = dateStr.split('-');
      const secondPart = parts[1].trim();
      
      // Check if the second part contains the year
      if (secondPart.includes(',')) {
        // Format like "June 12-15, 2025"
        firstDate = parts[0].trim() + ', ' + secondPart.split(',')[1].trim();
      } else {
        // Format like "June 12-15" (no year in second part)
        firstDate = dateStr.split('-')[0].trim();
      }
    }
    
    // Try to parse the date string
    const eventDate = new Date(firstDate);
    
    // Check if the date is valid
    if (isNaN(eventDate.getTime())) {
      console.error(`Invalid date string: ${dateStr}`);
      return false;
    }
    
    // Get today's date with time set to midnight for proper comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Compare if event date is before today
    return eventDate < today;
  } catch (error) {
    console.error(`Error processing date: ${dateStr}`, error);
    return false;
  }
};
