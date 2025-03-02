import { Conference } from "@/types/conference";
import { getDeadlineInLocalTime } from './dateUtils';

/**
 * Sort conferences by their adjusted deadline (accounting for timezone)
 */
export function sortConferencesByDeadline(conferences: Conference[]): Conference[] {
  return [...conferences].sort((a, b) => {
    const aDeadline = getDeadlineInLocalTime(a.deadline, a.timezone);
    const bDeadline = getDeadlineInLocalTime(b.deadline, b.timezone);
    
    // If either date is invalid, place it later in the list
    if (!aDeadline || !bDeadline) {
      if (!aDeadline && !bDeadline) return 0;
      if (!aDeadline) return 1;
      if (!bDeadline) return -1;
    }
    
    // Both dates are valid, compare them
    if (aDeadline && bDeadline) {
      return aDeadline.getTime() - bDeadline.getTime();
    }
    
    return 0;
  });
} 