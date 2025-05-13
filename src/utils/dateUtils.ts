
/**
 * Utility functions for handling dates in the application
 */

/**
 * Checks if a date string has passed the current date
 * @param dateStr Date string in format like "May 5, 2025" or "June 12-15, 2025"
 * @returns boolean indicating if the date has passed
 */
export const isDatePassed = (dateStr: string): boolean => {
  // Extract the first date if it's a date range (e.g., "June 12-15, 2025" -> "June 12, 2025")
  const firstDate = dateStr.includes('-') 
    ? dateStr.split('-')[0] + dateStr.split(',')[1]
    : dateStr;
    
  // Try to parse the date string
  const eventDate = new Date(firstDate);
  
  // Get today's date with time set to midnight for proper comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Compare if event date is before today
  return eventDate < today;
};
