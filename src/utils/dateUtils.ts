import { parseISO, isValid } from 'date-fns';
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';

export const getDeadlineInLocalTime = (deadline: string | undefined, timezone: string | undefined): Date | null => {
  if (!deadline || deadline === 'TBD') {
    return null;
  }
  
  try {
    // Parse the deadline string to a Date object
    const parsedDate = parseISO(deadline);
    
    if (!isValid(parsedDate)) {
      console.error('Invalid date parsed from deadline:', deadline);
      return null;
    }
    
    // Handle timezone normalization
    const normalizeTimezone = (tz: string | undefined): string => {
      if (!tz) return 'UTC';
      
      // Handle AoE (Anywhere on Earth) timezone
      if (tz === 'AoE') return '-12:00';
      
      // Handle GMT±XX format
      const gmtMatch = tz.match(/^GMT([+-])(\d+)$/);
      if (gmtMatch) {
        const [, sign, hours] = gmtMatch;
        const paddedHours = hours.padStart(2, '0');
        return `${sign}${paddedHours}:00`;
      }
      
      // If it's already an IANA timezone, return as is
      if (!tz.toUpperCase().startsWith('UTC') && !tz.toUpperCase().startsWith('GMT')) return tz;
      
      // Convert UTC±XX to proper format
      const utcMatch = tz.match(/^UTC([+-])(\d+)$/);
      if (utcMatch) {
        const [, sign, hours] = utcMatch;
        const paddedHours = hours.padStart(2, '0');
        return `${sign}${paddedHours}:00`;
      }
      
      // Handle special case of UTC+0/UTC-0
      if (tz === 'UTC+0' || tz === 'UTC-0' || tz === 'UTC+00' || tz === 'UTC-00') {
        return 'UTC';
      }
      
      return 'UTC';
    };

    const normalizedTimezone = normalizeTimezone(timezone);
    
    try {
      // Get user's local timezone
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      
      // We need to:
      // 1. Treat the parsed date as being in the conference's timezone
      // 2. Convert it to UTC
      // 3. Then convert to the user's local timezone
      
      // Convert from conference timezone to UTC
      const utcDate = zonedTimeToUtc(parsedDate, normalizedTimezone);
      
      // Convert from UTC to user's local timezone
      const localDate = utcToZonedTime(utcDate, userTimezone);
      
      return isValid(localDate) ? localDate : null;
    } catch (error) {
      console.error('Timezone conversion error:', error);
      return parsedDate; // Fall back to the parsed date if conversion fails
    }
  } catch (error) {
    console.error('Error processing deadline:', error);
    return null;
  }
}; 