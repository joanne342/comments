// Store the names of the weekdays in calendar order.
//
// JavaScript's Date object uses zero-based weekday indexing, meaning Sunday
// is represented by 0, Monday by 1, and Saturday by 6.
//
// This array allows a weekday name supplied as a string to be converted into
// the numerical weekday index required by the Date object's getDay() method.
//
// For example, "Monday" corresponds to index 1 and "Friday" corresponds
// to index 5.
const weekdayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];


// Export an array containing the names of all twelve months of the year.
//
// The export keyword makes this array available to other JavaScript modules
// that import it from this file.
//
// The months are stored in calendar order, beginning with January and ending
// with December.
//
// JavaScript uses zero-based month indexing, meaning January is represented
// by 0 and December by 11. The position of each month in this array therefore
// matches the month index used by JavaScript's Date object.
//
// Keeping the month names in a shared array allows other parts of the
// application to display month names and convert them into numerical indices
// without duplicating the same data.
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


// Function to calculate the date of a particular occurrence of a weekday
// within a specified month and year.
//
// For example, this function can calculate the date of the first Monday,
// the third Wednesday, or the last Friday of a particular month.
//
// Parameters:
// year       - The year in which the required date occurs.
// monthIndex - The zero-based month index, where January is 0 and December is 11.
// dayName    - The name of the required weekday, such as "Monday" or "Friday".
// occurrence - The required occurrence of that weekday, such as "first",
//              "second", "third", "fourth", "fifth", or "last".
//
// Returns:
// A Date object representing the calculated date.
//
// If the supplied weekday or occurrence is not recognised, or if the
// requested occurrence does not exist in the specified month, the function
// throws an Error.
//
// The function sets the time to midday (12:00) when constructing dates.
// Using midday rather than midnight helps reduce potential problems caused
// by daylight-saving-time transitions that occur around midnight.
export function getDateForOccurrence(year, monthIndex, dayName, occurrence) {

  // Convert the supplied weekday name into its numerical weekday index.
  //
  // indexOf() searches the weekdayNames array for the specified string
  // and returns the position of the matching entry.
  //
  // For example, if dayName is "Wednesday", targetWeekday will be 3.
  //
  // If the supplied name does not match any entry in the array,
  // indexOf() returns -1. This value is checked below so that invalid
  // weekday names can be rejected before any date calculations take place.
  const targetWeekday = weekdayNames.indexOf(dayName);


  // Validate the supplied weekday name.
  //
  // A valid weekday must exist in the weekdayNames array.
  // If targetWeekday is -1, the supplied name was not recognised.
  //
  // Throwing an Error stops the function from continuing with an invalid
  // weekday index and provides a message describing the problem.
  if (targetWeekday === -1) {
    throw new Error(`Unknown weekday: ${dayName}`);
  }


  // Handle the special case in which the requested occurrence is "last".
  //
  // The last occurrence of a weekday is calculated differently from the
  // first, second, third, fourth, and fifth occurrences.
  //
  // Instead of starting at the beginning of the month and counting forwards,
  // this branch starts at the final day of the requested month and counts
  // backwards to find the most recent occurrence of the required weekday.
  if (occurrence === "last") {

    // Create a Date object that will be used to calculate the final day
    // of the requested month.
    //
    // new Date(0) creates a Date object initially set to the Unix epoch,
    // which is 1 January 1970 at 00:00:00 UTC.
    //
    // The date is subsequently adjusted using setFullYear(), so the initial
    // date is simply a starting point for constructing the required date.
    const lastDay = new Date(0);


    // Set the date to day 0 of the month immediately following the requested
    // month, which makes JavaScript select the final day of the requested month.
    //
    // setFullYear(year, monthIndex, day) sets the year, month, and day.
    //
    // Adding 1 to monthIndex moves to the following month, while setting
    // the day to 0 moves back one day from its first day.
    //
    // For example, if monthIndex represents October, the month argument
    // becomes 10, representing November. Setting the day to 0 then produces
    // 31 October.
    //
    // This approach automatically accounts for months with different
    // numbers of days, including February in leap years.
    //
    // setFullYear() is used rather than passing the year directly to the
    // Date constructor, avoiding the constructor's special treatment of
    // numeric years between 0 and 99.
    lastDay.setFullYear(year, monthIndex + 1, 0);


    // Set the time to midday.
    //
    // setHours() sets the hours, minutes, seconds, and milliseconds.
    // Using 12:00:00.000 helps avoid potential issues with local
    // daylight-saving-time transitions that occur around midnight.
    //
    // Setting the time explicitly also ensures that the resulting date
    // has a consistent time of day.
    lastDay.setHours(12, 0, 0, 0);


    // Calculate how many days must be subtracted from the final day of
    // the month to reach the most recent occurrence of the target weekday.
    //
    // lastDay.getDay() returns the weekday index of the month's final day.
    // targetWeekday contains the weekday index that the function is searching for.
    //
    // Subtracting targetWeekday from the final day's weekday gives the
    // difference between the two weekday indices.
    //
    // Adding 7 and applying the modulo operator (%) ensures that the result
    // is a non-negative number between 0 and 6.
    //
    // The modulo operator returns the remainder after division.
    // This adjustment handles cases where the target weekday occurs earlier
    // in the weekday sequence than the final day's weekday.
    //
    // For example, if the month ends on a Thursday (4) and the target is
    // Monday (1), the difference is (4 - 1 + 7) % 7 = 3.
    // Subtracting three days from Thursday produces Monday.
    //
    // If the final day already falls on the target weekday, the result is 0,
    // meaning no days need to be subtracted.
    const difference = (lastDay.getDay() - targetWeekday + 7) % 7;


    // Create a new Date object for the calculated occurrence.
    //
    // A separate Date object is used so that lastDay remains unchanged
    // after the final day of the month has been calculated.
    const result = new Date(0);


    // Set the result to the required date within the requested month.
    //
    // The year and month are supplied explicitly.
    //
    // Subtracting difference from lastDay.getDate() moves backwards from
    // the month's final day to the most recent occurrence of the target weekday.
    //
    // For example, if the month ends on the 31st and difference is 3,
    // the calculated date will be the 28th.
    //
    // JavaScript automatically normalises the date if necessary, although
    // this calculation is designed to remain within the requested month.
    result.setFullYear(year, monthIndex, lastDay.getDate() - difference);


    // Set the calculated date's time to midday.
    //
    // This keeps the returned Date object's time consistent with the
    // temporary date used in the calculation and reduces potential issues
    // associated with daylight-saving-time transitions around midnight.
    result.setHours(12, 0, 0, 0);


    // Return the Date object representing the last occurrence of the
    // requested weekday in the specified month and year.
    //
    // The return statement ends the function immediately, so the code
    // below this branch is only executed for occurrences other than "last".
    return result;
  }


  // Handle occurrences other than "last".
  //
  // To calculate the first, second, third, fourth, or fifth occurrence
  // of a weekday, the function first identifies the month's first day.
  //
  // It then calculates the first occurrence of the required weekday
  // and adds seven days for each subsequent occurrence.
  //
  // For example, the second Monday is seven days after the first Monday,
  // and the third Monday is fourteen days after the first Monday.


  // Create a Date object that will be used to calculate the first day
  // of the requested month and year.
  //
  // As above, new Date(0) provides an initial Date object that will be
  // adjusted to the required year, month, and day.
  const firstDay = new Date(0);


  // Set the date to the first day of the requested month.
  //
  // setFullYear(year, monthIndex, 1) sets the year, month, and day.
  //
  // The day argument is 1 because the first day of a month is always
  // represented by day number 1.
  //
  // This also avoids the special handling of years from 0 to 99 that
  // occurs when those values are supplied directly to the Date constructor.
  firstDay.setFullYear(year, monthIndex, 1);


  // Set the time of the first day to midday.
  //
  // This ensures that the temporary Date object uses a consistent time
  // and helps avoid potential problems caused by daylight-saving-time
  // transitions around midnight.
  firstDay.setHours(12, 0, 0, 0);


  // Convert the occurrence name into its corresponding numerical position.
  //
  // The object maps each supported occurrence name to a number:
  // "first"  corresponds to 1,
  // "second" corresponds to 2,
  // "third"  corresponds to 3,
  // "fourth" corresponds to 4,
  // "fifth"  corresponds to 5.
  //
  // Using an object allows the occurrence number to be retrieved directly
  // from the supplied string without needing a separate conditional statement
  // for every possible occurrence.
  //
  // The square-bracket notation [occurrence] accesses the object property
  // whose name matches the value of the occurrence variable.
  //
  // For example, if occurrence is "third", the expression returns 3.
  //
  // If the occurrence name is not present in the object, the expression
  // returns undefined.
  const occurrenceNumber = {
    first: 1,
    second: 2,
    third: 3,
    fourth: 4,
    fifth: 5,
  }[occurrence];


  // Validate the supplied occurrence name.
  //
  // The supported numerical occurrence values range from 1 to 5.
  // If the name is not recognised, occurrenceNumber will be undefined.
  //
  // The ! operator checks whether occurrenceNumber is a falsy value.
  // In this case, it catches an undefined result caused by an unsupported
  // occurrence name.
  //
  // Throwing an Error prevents the function from attempting to calculate
  // a date using an invalid occurrence.
  if (!occurrenceNumber) {
    throw new Error(`Unknown occurrence: ${occurrence}`);
  }


  // Calculate the number of days between the first day of the month
  // and the first occurrence of the required weekday.
  //
  // firstDay.getDay() returns the weekday index of the month's first day.
  // targetWeekday contains the weekday index being searched for.
  //
  // Subtracting the first day's weekday from the target weekday gives
  // the number of days to move forwards to reach the target weekday.
  //
  // Adding 7 and applying % 7 ensures that the result is between 0 and 6.
  //
  // For example, if the month begins on a Wednesday (3) and the target
  // weekday is Friday (5), the difference is (5 - 3 + 7) % 7 = 2.
  // Adding two days to the first day therefore produces the first Friday.
  //
  // If the month begins on the target weekday, the result is 0 because
  // the first occurrence falls on day 1 itself.
  //
  // This calculation finds the first occurrence of the target weekday,
  // regardless of which occurrence the function ultimately needs.
  const difference = (targetWeekday - firstDay.getDay() + 7) % 7;


  // Calculate the numerical day of the month for the requested occurrence.
  //
  // The first occurrence is on day 1 plus the calculated difference.
  //
  // Each subsequent occurrence is exactly seven days after the previous one,
  // because the same weekday repeats every seven days.
  //
  // Therefore, multiplying occurrenceNumber - 1 by 7 calculates how many
  // additional days must be added after the first occurrence.
  //
  // For example, if the first occurrence falls on day 3:
  // - The first occurrence is on day 3.
  // - The second occurrence is on day 10.
  // - The third occurrence is on day 17.
  //
  // If occurrenceNumber is 3, the calculation adds two weeks:
  // 1 + difference + (3 - 1) * 7.
  //
  // The result is a numerical day of the month, rather than a complete
  // Date object. The following statements use it to construct the date.
  const dayOfMonth = 1 + difference + (occurrenceNumber - 1) * 7;


  // Create a new Date object for the calculated occurrence.
  //
  // This object will become the final result returned by the function.
  const result = new Date(0);


  // Set the result to the calculated year, month, and day.
  //
  // The year and month identify the requested calendar month, while
  // dayOfMonth identifies the calculated occurrence within that month.
  //
  // JavaScript automatically adjusts overflowing day values into the
  // following month. For example, setting day 32 in January produces
  // a date in February.
  //
  // Because this automatic adjustment could cause an invalid fifth
  // occurrence to appear to belong to another month, the resulting
  // month and year are checked below.
  result.setFullYear(year, monthIndex, dayOfMonth);


  // Set the result's time to midday.
  //
  // As with the other Date objects in this function, setting the time
  // explicitly provides a consistent time of day and helps avoid
  // potential problems caused by daylight-saving-time transitions
  // around midnight.
  result.setHours(12, 0, 0, 0);


  // Check that the calculated date belongs to the requested month and year.
  //
  // JavaScript normalises dates that extend beyond the end of a month.
  // For example, if the fifth Monday of a month would fall on a day
  // number that exceeds the month's length, the resulting Date object
  // may automatically move into the following month.
  //
  // getMonth() returns the zero-based month index of the resulting date.
  // getFullYear() returns its full year.
  //
  // If either value differs from the requested month or year, the
  // calculated occurrence does not exist within the requested month.
  //
  // For example, some months contain only four occurrences of a particular
  // weekday. In such a month, requesting the fifth occurrence must produce
  // an error rather than returning a date in the following month.
  //
  // This check also prevents the function from returning a date in a
  // different year if the calculation crosses a year boundary.
  if (result.getMonth() !== monthIndex || result.getFullYear() !== year) {

    // Throw an Error explaining that the requested weekday occurrence
    // does not exist in the specified month.
    //
    // A template literal inserts the supplied occurrence and weekday name
    // into the error message, making it easier to identify the invalid
    // request when debugging the application.
    throw new Error(`${occurrence} ${dayName} does not exist in this month`);
  }


  // Return the calculated Date object to the code that called the function.
  //
  // At this point, the weekday and occurrence have been validated, the
  // date has been calculated, and the resulting month and year have been
  // checked to ensure that the requested occurrence actually exists.
  //
  // The calling code can use Date methods such as getDate(), getMonth(),
  // and getFullYear() to retrieve the individual parts of the calculated date.
  return result;
}
