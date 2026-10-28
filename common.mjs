
const weekdayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Month names in JavaScript's zero-based month order.
export const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Returns the requested weekday occurrence as a Date, or throws an Error if invalid.
export function getDateForOccurrence(year, monthIndex, dayName, occurrence) {
  // Convert the weekday name to its zero-based index.
  const targetWeekday = weekdayNames.indexOf(dayName);

  if (targetWeekday === -1) {
    throw new Error(`Unknown weekday: ${dayName}`);
  }

  // Calculate the last occurrence by counting backwards from the month's final day.
  if (occurrence === "last") {
    const lastDay = new Date(0);
    lastDay.setFullYear(year, monthIndex + 1, 0);
    lastDay.setHours(12, 0, 0, 0);

    const difference = (lastDay.getDay() - targetWeekday + 7) % 7;
    const result = new Date(0);
    result.setFullYear(year, monthIndex, lastDay.getDate() - difference);
    result.setHours(12, 0, 0, 0);

    return result;
  }

  // Set the first day of the requested month to midday.
  const firstDay = new Date(0);
  firstDay.setFullYear(year, monthIndex, 1);
  firstDay.setHours(12, 0, 0, 0);

  // Map occurrence names to their numerical positions.
  const occurrenceNumber = {
    first: 1,
    second: 2,
    third: 3,
    fourth: 4,
    fifth: 5,
  }[occurrence];

  if (!occurrenceNumber) {
    throw new Error(`Unknown occurrence: ${occurrence}`);
  }

  // Find the first matching weekday and calculate the requested occurrence.
  const difference = (targetWeekday - firstDay.getDay() + 7) % 7;
  const dayOfMonth = 1 + difference + (occurrenceNumber - 1) * 7;

  const result = new Date(0);
  result.setFullYear(year, monthIndex, dayOfMonth);
  result.setHours(12, 0, 0, 0);

  // Reject dates that overflow into another month or year.
  if (result.getMonth() !== monthIndex || result.getFullYear() !== year) {
    throw new Error(`${occurrence} ${dayName} does not exist in this month`);
  }

  return result;
}
