import { parseISO, isValid } from 'date-fns';
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';

export const getDeadlineInLocalTime = (deadline: string | undefined, timezone: string | undefined): Date | null => {
  if (!deadline || deadline === 'TBD') {
    console.log('Early return - deadline is null or TBD:', { deadline, timezone });
    return null;
  }
  
  try {
    console.log('Processing conference deadline:', {
      conferenceName: 'Unknown', // We could pass this as a parameter if helpful
      deadline,
      timezone,
      deadlineType: typeof deadline,
      timezoneType: typeof timezone
    });

    // Parse the deadline string to a Date object
    const deadlineDate = parseISO(deadline);
    console.log('Parsed deadline date:', {
      original: deadline,
      parsed: deadlineDate,
      isValid: isValid(deadlineDate),
      timestamp: deadlineDate.getTime(),
      toISOString: deadlineDate.toISOString()
    });

    if (!isValid(deadlineDate)) {
      console.error('Invalid date parsed from deadline:', deadline);
      return null;
    }
    
    // Handle AoE (Anywhere on Earth) timezone
    if (timezone === 'AoE') {
      console.log('Converting AoE to UTC-12');
      return new Date(deadlineDate.getTime() - 12 * 60 * 60 * 1000);
    }
    
    // Handle UTC offset timezones (e.g., "UTC-12", "UTC+01", "UTC+0")
    const normalizeTimezone = (tz: string | undefined): string => {
      if (!tz) {
        console.log('No timezone provided, using UTC');
        return 'UTC';
      }
      
      console.log('Normalizing timezone:', tz);
      
      // If it's already an IANA timezone, return as is
      if (!tz.toUpperCase().startsWith('UTC')) {
        console.log('Using IANA timezone:', tz);
        return tz;
      }
      
      // Convert UTC±XX to proper format
      const match = tz.match(/^UTC([+-])(\d+)$/);
      if (match) {
        const [, sign, hours] = match;
        const paddedHours = hours.padStart(2, '0');
        const normalized = `${sign}${paddedHours}:00`;
        console.log('Normalized UTC offset:', { original: tz, normalized });
        return normalized;
      }
      
      // Handle special case of UTC+0/UTC-0
      if (tz === 'UTC+0' || tz === 'UTC-0' || tz === 'UTC+00' || tz === 'UTC-00') {
        console.log('Handling UTC+0/-0 case:', tz);
        return 'UTC';
      }
      
      console.log('Falling back to UTC for timezone:', tz);
      return 'UTC';
    };

    const normalizedTimezone = normalizeTimezone(timezone);
    console.log('Using timezone:', { original: timezone, normalized: normalizedTimezone });

    try {
      // Create date in the conference's timezone
      const dateInConfTimezone = utcToZonedTime(deadlineDate, normalizedTimezone);
      console.log('Conference timezone date:', {
        date: dateInConfTimezone,
        isValid: isValid(dateInConfTimezone),
        timezone: normalizedTimezone
      });

      // Get user's local timezone
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      
      // Convert to user's local timezone
      const localDate = utcToZonedTime(dateInConfTimezone, userTimezone);
      console.log('Local timezone date:', {
        date: localDate,
        isValid: isValid(localDate),
        timezone: userTimezone
      });
      
      if (!isValid(localDate)) {
        console.error('Invalid date after timezone conversion:', {
          original: deadline,
          timezone,
          normalizedTimezone,
          localDate
        });
        return null;
      }
      
      return localDate;
    } catch (tzError) {
      console.error('Timezone conversion error:', {
        error: tzError,
        deadline,
        timezone,
        normalizedTimezone
      });
      return deadlineDate;
    }
  } catch (error) {
    console.error('Error parsing deadline:', {
      error,
      deadline,
      timezone
    });
    return null;
  }
}; 