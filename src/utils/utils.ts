export function calculateStartedDate(createdDateString: string, durationString: string): Date | null {
    // --- 1. Parse createdDateString ---
    // Replace colons in the date part with hyphens for standard parsing
    const [datePart, timePart] = createdDateString.split(' ');
    if (!datePart || !timePart) {
      console.error("Invalid createdDateString format. Expected 'YYYY:MM:DD HH:MM:SS'. Received:", createdDateString);
      return null;
    }
    const standardizedDatePart = datePart.replace(/:/g, '-'); // Replace all colons in date part
    const fullDateTimeString = `${standardizedDatePart}T${timePart}`;
  
    let createdDate = new Date(fullDateTimeString);
  
    // Validate createdDate
    if (isNaN(createdDate.getTime())) {
      console.error("Invalid createdDateString format after standardization. Attempted to parse:", fullDateTimeString, "Original:", createdDateString);
      return null;
    }
  
    // --- 3. Parse durationString to total seconds ---
    const durationParts = durationString.split(':').map(Number);
    if (durationParts.length !== 3 || durationParts.some(isNaN)) {
      console.error("Invalid durationString format. Expected 'H:MM:SS'. Received:", durationString);
      return null;
    }
    const [hours, minutes, seconds] = durationParts;
    const durationInSeconds = (hours * 3600) + (minutes * 60) + seconds;
  
    // --- 4. Subtract duration from the (adjusted) createdDate ---
    // Get the timestamp in milliseconds
    const createdTimestamp = createdDate.getTime();
    const durationInMilliseconds = durationInSeconds * 1000;
  
    // Calculate the started timestamp
    const startedTimestamp = createdTimestamp - durationInMilliseconds;
  
    // --- 5. Create new Date object for startedDate ---
    const startedDate = new Date(startedTimestamp);
  
    return startedDate;
  }

  export function convertAndAddTwoHours(dateString: string): Date | null {
    const parts = dateString.match(/(\d{4}):(\d{2}):(\d{2}) (\d{2}):(\d{2}):(\d{2})/);
  
    if (!parts) {
      console.error("Invalid date string format. Expected 'YYYY:MM:DD HH:MM:SS'");
      return null;
    }
  
    // parts[0] is the full match, parts[1] is year, parts[2] is month, etc.
    const year = parseInt(parts[1], 10);
    const month = parseInt(parts[2], 10) - 1; // JavaScript months are 0-indexed (0=Jan, 11=Dec)
    const day = parseInt(parts[3], 10);
    const hours = parseInt(parts[4], 10);
    const minutes = parseInt(parts[5], 10);
    const seconds = parseInt(parts[6], 10);
  
    // Create the initial date object based on the parsed local time components
    const date = new Date(year, month, day, hours, minutes, seconds);
  
    return date;
  }