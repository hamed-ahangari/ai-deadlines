import { Conference } from "@/types/conference";
import { getDeadlineInLocalTime } from './dateUtils';
import { getPrimaryDeadline } from './deadlineUtils';

/**
 * Sort conferences by their primary deadline (next upcoming or most recent past)
 */
export function sortConferencesByDeadline(conferences: Conference[]): Conference[] {
  return [...conferences].sort((a, b) => {
    const aPrimaryDeadline = getPrimaryDeadline(a);
    const bPrimaryDeadline = getPrimaryDeadline(b);
    
    // If either conference has no deadlines, place it later in the list
    if (!aPrimaryDeadline || !bPrimaryDeadline) {
      if (!aPrimaryDeadline && !bPrimaryDeadline) return 0;
      if (!aPrimaryDeadline) return 1;
      if (!bPrimaryDeadline) return -1;
    }
    
    // Both have deadlines, compare them
    if (aPrimaryDeadline && bPrimaryDeadline) {
      const aDeadline = getDeadlineInLocalTime(aPrimaryDeadline.date, aPrimaryDeadline.timezone || a.timezone);
      const bDeadline = getDeadlineInLocalTime(bPrimaryDeadline.date, bPrimaryDeadline.timezone || b.timezone);
      
      if (!aDeadline || !bDeadline) {
        if (!aDeadline && !bDeadline) return 0;
        if (!aDeadline) return 1;
        if (!bDeadline) return -1;
      }
      
      if (aDeadline && bDeadline) {
        return aDeadline.getTime() - bDeadline.getTime();
      }
    }
    
    return 0;
  });
} 