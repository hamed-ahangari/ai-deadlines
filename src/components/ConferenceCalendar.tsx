import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Conference } from "@/types/conference";
import { parseISO, format, parse, startOfMonth } from "date-fns";

interface ConferenceCalendarProps {
  conferences: Conference[];
}

const ConferenceCalendar = ({ conferences }: ConferenceCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Handle month change
  const handleMonthChange = (month: Date) => {
    setCurrentMonth(month);
    setSelectedDate(undefined); // Clear selected date when changing months
  };

  // Convert conference dates to calendar events
  const conferenceEvents = conferences.map(conf => {
    let startDate: Date | null = null;
    let endDate: Date | null = null;
    
    try {
      // Parse both start and end dates
      if (conf.start && conf.end) {
        startDate = parseISO(conf.start);
        endDate = parseISO(conf.end);
      } 
      // If no start/end fields, try to parse from date field
      else if (conf.date) {
        const [startStr, endStr] = conf.date.split(/[-–]/).map(d => d.trim());
        
        try {
          // Try parsing start date
          startDate = parse(startStr, 'MMM d, yyyy', new Date()) ||
                     parse(startStr, 'MMMM d, yyyy', new Date()) ||
                     parseISO(startStr);
          
          // Try parsing end date if it exists
          if (endStr) {
            endDate = parse(endStr, 'MMM d, yyyy', new Date()) ||
                     parse(endStr, 'MMMM d, yyyy', new Date()) ||
                     parseISO(endStr);
          } else {
            // If no end date, use start date
            endDate = startDate;
          }
        } catch (error) {
          console.warn(`Failed to parse date range for conference ${conf.title}:`, error);
        }
      }

      // Only return event if we successfully parsed both dates
      if (startDate && endDate && isValidDate(startDate) && isValidDate(endDate)) {
        return {
          startDate,
          endDate,
          title: conf.title,
          conference: conf
        };
      }
      return null;
    } catch (error) {
      console.warn(`Failed to parse dates for conference ${conf.title}:`, error);
      return null;
    }
  }).filter(event => event !== null);

  // Helper function to check if date is valid
  function isValidDate(date: Date) {
    return date instanceof Date && !isNaN(date.getTime());
  }

  // Get events for the selected date
  const getEventsForDate = (date: Date) => {
    if (!date || !isValidDate(date)) return [];
    return conferenceEvents.filter(event => 
      event && event.startDate && event.endDate && 
      date >= event.startDate && date <= event.endDate
    );
  };

  // Get events for the current month
  const getEventsForMonth = (date: Date) => {
    const monthStart = startOfMonth(date);
    const nextMonthStart = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    
    return conferenceEvents.filter(event => 
      event && event.startDate && event.endDate &&
      ((event.startDate >= monthStart && event.startDate < nextMonthStart) ||
       (event.endDate >= monthStart && event.endDate < nextMonthStart) ||
       (event.startDate <= monthStart && event.endDate >= nextMonthStart))
    );
  };

  // Create footer content
  const footer = (
    <div className="mt-3">
      <h3 className="font-medium">
        Events in {format(currentMonth, 'MMMM yyyy')}:
      </h3>
      {getEventsForMonth(currentMonth).length > 0 ? (
        <ul className="mt-2 space-y-1">
          {getEventsForMonth(currentMonth).map((event, index) => (
            <li key={index} className="text-sm">
              {event.title} ({format(event.startDate, 'MMM d')}-{format(event.endDate, 'MMM d')}) - {
                event.conference.venue || 
                [event.conference.city, event.conference.country].filter(Boolean).join(", ") ||
                "Location TBD"
              }
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">No events this month</p>
      )}
      {selectedDate && (
        <div className="mt-4">
          <h3 className="font-medium">
            Events on {format(selectedDate, 'MMMM d, yyyy')}:
          </h3>
          {getEventsForDate(selectedDate).length > 0 ? (
            <ul className="mt-2 space-y-1">
              {getEventsForDate(selectedDate).map((event, index) => (
                <li key={index} className="text-sm">
                  {event.title} - {
                    event.conference.venue || 
                    [event.conference.city, event.conference.country].filter(Boolean).join(", ") ||
                    "Location TBD"
                  }
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No events on this date</p>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        footer={footer}
        month={currentMonth}
        onMonthChange={handleMonthChange}
        modifiers={{
          event: (date) => getEventsForDate(date).length > 0
        }}
        modifiersStyles={{
          event: { fontWeight: 'bold', textDecoration: 'underline' }
        }}
      />
    </div>
  );
};

export default ConferenceCalendar; 