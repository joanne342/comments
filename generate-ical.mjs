
// Import file-writing, calendar data, and shared date utilities.
import { writeFile } from "node:fs/promises";
import daysData from "./days.json" with { type: "json" };
import { getDateForOccurrence, monthNames } from "./common.mjs";

// Format a date as YYYYMMDD for all-day calendar events.
function formatDate(date) {
  const year = String(date.getFullYear()).padStart(4, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}${month}${day}`;
}

// Format a date as a compact UTC timestamp for iCalendar.
function formatTimestamp(date) {
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}

// Escape special characters in iCalendar text values.
function escapeICalText(text) {
  return String(text)
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

// Initialize the iCalendar file with its required header.
const lines = [
  "BEGIN:VCALENDAR",
  "VERSION:2.0",
  "PRODID:-//Days Calendar//EN",
  "CALSCALE:GREGORIAN",
];

// Track the number of events generated.
let eventCount = 0;

// Generate calendar events for each year from 2020 through 2030.
for (let year = 2020; year <= 2030; year++) {
  // Process each calendar-day definition.
  for (const day of daysData) {
    // Find the numerical index of the event's month.
    const monthIndex = monthNames.indexOf(day.monthName);

    // Stop execution if the month name is invalid.
    if (monthIndex === -1) {
      throw new Error(`Unknown month: ${day.monthName}`);
    }

    // Calculate the event date using its year, month, weekday, and occurrence.
    const date = getDateForOccurrence(
      year,
      monthIndex,
      day.dayName,
      day.occurrence,
    );

    // Format the date for an all-day calendar event.
    const dateString = formatDate(date);

    // Add the event details to the calendar file.
    lines.push(
      "BEGIN:VEVENT",
      `UID:${year}-${monthIndex + 1}-${date.getDate()}-${eventCount}@days-calendar`,
      `DTSTAMP:${formatTimestamp(new Date())}`,
      `DTSTART;VALUE=DATE:${dateString}`,
      `SUMMARY:${escapeICalText(day.name)}`,
      "END:VEVENT",
    );

    // Increment the event counter.
    eventCount++;
  }
}

// Close the iCalendar document.
lines.push("END:VCALENDAR");

// Write the calendar file using UTF-8 encoding and CRLF line endings.
await writeFile("days.ics", lines.join("\r\n") + "\r\n", "utf8");

// Display the number of generated calendar events.
console.log(`Created days.ics with ${eventCount} all-day events.`);
