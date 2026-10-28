
// Import the writeFile function from Node.js's built-in file system promises module.
// This function allows the program to write data to a file asynchronously.
// Because it returns a Promise, we can use await to wait until the file
// has been written before continuing.
import { writeFile } from "node:fs/promises";

// Import the calendar-day data from days.json.
//
// The "with { type: "json" }" import attribute tells Node.js that this file
// should be interpreted as JSON data.
// The imported data is assigned to daysData and is expected to contain
// information about the calendar days or occasions we want to include.
import daysData from "./days.json" with { type: "json" };

// Import two shared values from common.mjs.
//
// getDateForOccurrence() calculates the actual calendar date for a particular
// year, month, weekday, and occurrence number.
// For example, it could calculate the date of the second Monday in a month.
//
// monthNames is an array of month names used to match the month names
// in days.json to their corresponding numerical month indexes.
import { getDateForOccurrence, monthNames } from "./common.mjs";


// Define a function that converts a JavaScript Date object into a date string
// formatted as YYYYMMDD.
//
// This format is required for the all-day event dates used later in the
// iCalendar file.
//
// The function returns a string containing the year, month, and day,
// with no hyphens or other separators.
function formatDate(date) {

  // Get the year from the Date object and convert it to a string.
  //
  // getFullYear() returns the year using the local time zone's calendar fields.
  // String() converts the numeric year into text.
  //
  // padStart(4, "0") ensures that the string contains at least four characters.
  // If necessary, zeros are added to the beginning.
  // For example, "25" becomes "0025".
  const year = String(date.getFullYear()).padStart(4, "0");

  // Get the month from the Date object.
  //
  // JavaScript's getMonth() returns a zero-based month index:
  // January is 0, February is 1, and December is 11.
  // Adding 1 converts this into the conventional month number from 1 to 12.
  //
  // String() converts the result into text.
  // padStart(2, "0") ensures the month always has at least two digits.
  // For example, "3" becomes "03".
  const month = String(date.getMonth() + 1).padStart(2, "0");

  // Get the day of the month.
  //
  // getDate() returns a number from 1 to 31, depending on the date.
  // Convert it to a string and add a leading zero when it has only one digit.
  // For example, "7" becomes "07".
  const day = String(date.getDate()).padStart(2, "0");

  // Combine the year, month, and day into a single string.
  //
  // Template literals insert the three variables into the output.
  // For example, March 7, 2026 becomes "20260307".
  //
  // Returning this string makes the date suitable for the DATE value
  // used in the iCalendar event entries.
  return `${year}${month}${day}`;
}


// Define a function that converts a JavaScript Date object into an iCalendar
// timestamp string.
//
// Unlike formatDate(), which produces a date without a time, this function
// includes the time and represents it in UTC.
// The output is used for the DTSTAMP property of each calendar event.
function formatTimestamp(date) {

  // Convert the Date object to an ISO 8601 string.
  //
  // toISOString() always formats the date and time in UTC and produces
  // a string similar to:
  // "2026-10-28T11:30:45.123Z".
  //
  // The following string operations remove characters that are not needed
  // in the compact iCalendar timestamp format.

  return date

    // Convert the Date object into its standardized ISO 8601 representation.
    // The result includes hyphens in the date and colons in the time.
    .toISOString()

    // Remove every hyphen and colon from the string.
    //
    // The regular expression /[-:]/g matches every hyphen or colon.
    // The g flag means all matches are replaced, not just the first one.
    //
    // For example:
    // "2026-10-28T11:30:45.123Z"
    // becomes:
    // "20261028T113045.123Z".
    .replace(/[-:]/g, "")

    // Remove the decimal point and the three digits representing milliseconds.
    //
    // The regular expression /\.\d{3}/ matches a decimal point followed
    // by exactly three digits.
    // The replacement is an empty string, so those characters are removed.
    //
    // For example:
    // "20261028T113045.123Z"
    // becomes:
    // "20261028T113045Z".
    //
    // The resulting string is a compact UTC timestamp suitable for DTSTAMP.
    .replace(/\.\d{3}/, "");
}


// Define a function that escapes text so it can safely be included
// in an iCalendar text property, such as an event's SUMMARY.
//
// iCalendar uses certain characters as separators or special syntax.
// Text containing those characters must be escaped so that calendar
// applications interpret them as part of the text rather than as syntax.
//
// The function accepts a value, converts it to a string, escapes the relevant
// characters, and returns the escaped text.
function escapeICalText(text) {

  // Convert the supplied value into a string.
  //
  // String() ensures that the following replace() calls operate on text,
  // even if the original value is not already a string.
  return String(text)

    // Escape existing backslashes first.
    //
    // The regular expression /\\/g matches every literal backslash.
    // Each backslash is replaced with two backslashes.
    //
    // This replacement must happen before the other replacements so that
    // the backslashes introduced by later escaping operations are not escaped
    // a second time.
    .replace(/\\/g, "\\\\")

    // Replace newline characters with the literal sequence "\n".
    //
    // The regular expression /\n/g matches every line-feed character.
    // The replacement string represents a backslash followed by the letter n,
    // which is the iCalendar escape sequence for a newline in text.
    .replace(/\n/g, "\\n")

    // Escape every comma by adding a backslash before it.
    //
    // Commas can have special meaning in iCalendar text values, so escaping
    // them ensures they are interpreted as part of the text.
    .replace(/,/g, "\\,")

    // Escape every semicolon by adding a backslash before it.
    //
    // This prevents semicolons in the text from being confused with
    // iCalendar syntax.
    .replace(/;/g, "\\;");
}


// Create an array of strings representing the opening lines of an iCalendar file.
//
// Each element is one line in the calendar file.
// The entries are added in the required order, starting with BEGIN:VCALENDAR
// and ending this initial section with CALSCALE:GREGORIAN.
//
// The program will append individual calendar events to this array later.
const lines = [

  // Mark the beginning of the overall iCalendar document.
  "BEGIN:VCALENDAR",

  // Declare that this file follows iCalendar version 2.0.
  // This is the standard version supported by modern calendar applications.
  "VERSION:2.0",

  // Identify the program or product that generated this calendar.
  // PRODID is the iCalendar product identifier property.
  "PRODID:-//Days Calendar//EN",

  // Specify the Gregorian calendar system.
  // This is the calendar system commonly used for civil dates.
  "CALSCALE:GREGORIAN",
];

// Initialize a counter for the number of calendar events created.
//
// The value starts at zero because no events have been added yet.
// It is incremented each time an event is generated.
//
// The counter is also used when creating each event's UID so that the
// generated identifiers can be distinguished from one another.
let eventCount = 0;


// Loop through every year from 2020 through 2030, inclusive.
//
// The loop starts at 2020 and continues while year is less than or equal
// to 2030. The increment expression year++ increases the year by one
// after each iteration.
//
// This produces 11 years of calendar events, including both endpoints.
for (let year = 2020; year <= 2030; year++) {

  // For the current year, loop through every calendar-day definition
  // imported from days.json.
  //
  // Each day object is expected to contain properties such as:
  //   monthName  - the name of the month
  //   dayName    - the name of the weekday
  //   occurrence - which occurrence of that weekday is intended
  //   name       - the display name of the calendar event
  //
  // The exact values depend on the contents of days.json.
  for (const day of daysData) {

    // Find the position of the event's month name in the monthNames array.
    //
    // indexOf() returns the zero-based index of the first matching element.
    // For example, if monthNames is ordered from January to December,
    // January returns 0, February returns 1, and December returns 11.
    //
    // If the month name cannot be found, indexOf() returns -1.
    // This index is passed to getDateForOccurrence() if it is valid.
    const monthIndex = monthNames.indexOf(day.monthName);

    // Check whether the supplied month name exists in monthNames.
    //
    // An index of -1 means that no matching month name was found.
    // This can happen if days.json contains a misspelled month or a name
    // that does not match the entries in monthNames.
    if (monthIndex === -1) {

      // Throw an error to stop execution when an unknown month is encountered.
      //
      // The error message includes the unexpected month name to help identify
      // the problematic entry in days.json.
      //
      // Throwing an error prevents the program from silently generating
      // an incorrect event date.
      throw new Error(`Unknown month: ${day.monthName}`);
    }

    // Calculate the actual date of the event for the current year.
    //
    // getDateForOccurrence() receives four arguments:
    //   1. year       - the year currently being processed.
    //   2. monthIndex - the zero-based month index found above.
    //   3. day.dayName - the desired weekday, such as "Monday".
    //   4. day.occurrence - which occurrence of that weekday is intended.
    //
    // For example, a definition might request the third Friday in a month.
    // The helper function calculates the corresponding Date object.
    //
    // The exact occurrence rules are implemented in common.mjs.
    const date = getDateForOccurrence(
      year,
      monthIndex,
      day.dayName,
      day.occurrence,
    );

    // Convert the calculated date into the YYYYMMDD format required
    // for an all-day calendar event.
    //
    // For example, a Date representing March 7, 2026 would become "20260307".
    const dateString = formatDate(date);

    // Append the lines for one calendar event to the lines array.
    //
    // push() adds all the supplied arguments to the end of the array.
    // Each string becomes a separate line in the eventual iCalendar file.
    lines.push(

      // Mark the beginning of a new calendar event.
      "BEGIN:VEVENT",

      // Create a unique identifier for this event using its date, year,
      // month, day of the month, and the running event counter.
      //
      // UID is the iCalendar property used to identify an event.
      // The counter helps distinguish entries generated by this script,
      // including events whose other date components might overlap.
      //
      // The @days-calendar suffix provides a domain-like identifier.
      // For reliable uniqueness across independent calendar generators,
      // a UID should ideally use a domain or identifier controlled by
      // the calendar's publisher.
      `UID:${year}-${monthIndex + 1}-${date.getDate()}-${eventCount}@days-calendar`,

      // Record the date and time when this event entry is generated.
      //
      // new Date() creates a Date object representing the current time.
      // formatTimestamp() converts it into the compact UTC timestamp format.
      //
      // DTSTAMP is a metadata timestamp for the calendar event.
      // It is not the date on which the event itself occurs.
      //
      // Because this expression is evaluated for every event, separate
      // events can have slightly different DTSTAMP values.
      `DTSTAMP:${formatTimestamp(new Date())}`,

      // Specify the date on which the event occurs.
      //
      // DTSTART is the event's start date or start date-time.
      // VALUE=DATE indicates that this is a date-only value rather than
      // a date-time value.
      //
      // The dateString variable contains the formatted YYYYMMDD value.
      // Because this is an all-day event, no time or time zone is included.
      `DTSTART;VALUE=DATE:${dateString}`,

      // Set the event's summary, which is the title displayed by calendar apps.
      //
      // day.name contains the event's name from days.json.
      // escapeICalText() escapes special characters so the name can be
      // interpreted correctly as an iCalendar text value.
      `SUMMARY:${escapeICalText(day.name)}`,

      // Mark the end of this individual calendar event.
      "END:VEVENT",
    );

    // Increase the event counter after adding this event.
    //
    // The ++ operator increments eventCount by one.
    // The updated value will be used for the next event's UID and for
    // the final total displayed in the console.
    eventCount++;
  }
}


// Add the closing line for the overall iCalendar document.
//
// This line marks the end of the VCALENDAR component.
// It is added after all years and all day definitions have been processed.
lines.push("END:VCALENDAR");


// Write the generated calendar data to a file named days.ics.
//
// writeFile() creates the file if it does not exist, or replaces its contents
// if the file already exists.
//
// The first argument specifies the output filename.
// The second argument combines all the lines into one string.
// The third argument specifies UTF-8 text encoding.
//
// lines.join("\r\n") joins the individual lines using CRLF line endings:
//   \r represents a carriage return.
//   \n represents a line feed.
//
// CRLF is the standard line-ending convention for iCalendar files.
// The additional "\r\n" at the end ensures the file finishes with a line ending.
//
// await waits for the write operation to finish before execution continues.
// If writing fails, the rejected Promise causes this top-level await to fail.
await writeFile("days.ics", lines.join("\r\n") + "\r\n", "utf8");


// Print a success message in the terminal.
//
// The message includes eventCount, which records the number of VEVENT
// components added to the calendar.
//
// This lets the user know the output file was created and how many
// all-day events the script generated.
console.log(`Created days.ics with ${eventCount} all-day events.`);
