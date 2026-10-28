```javascript
// Import the commemorative day data from days.json.
//
// The JSON import attribute tells JavaScript that the imported file
// contains JSON data rather than a JavaScript module.
//
// Each entry is expected to contain information about a commemorative day,
// including its name, month, weekday, and occurrence within that month.
//
// This data is used to determine which commemorative events should appear
// on the calendar for the selected month and year.
import daysData from "./days.json" with { type: "json" };


// Import the shared date-calculation function and month names.
//
// getDateForOccurrence() calculates the date of a particular weekday
// occurrence within a specified month and year.
//
// For example, it can calculate the second Tuesday of October or the
// last Friday of a particular month.
//
// monthNames contains the names of the twelve months in calendar order.
// These names can be used to convert month names from the commemorative
// day data into the numerical month indices required by JavaScript's Date object.
//
// Importing these shared resources avoids duplicating the same date-calculation
// logic and month-name data in multiple files.
import { getDateForOccurrence, monthNames } from "./common.mjs";


// Find the HTML element that will contain the calendar grid.
//
// Individual date cells and blank alignment cells will be created dynamically
// and appended to this element whenever the calendar is displayed.
const calendar = document.querySelector("#calendar");


// Find the HTML element that displays the currently selected month and year.
//
// This heading is updated whenever the user navigates to another month
// or selects a different month and year using the date picker.
const currentMonth = document.querySelector("#current-month");


// Find the button used to navigate to the previous month.
//
// An event listener will be attached to this button so that clicking it
// moves the calendar backwards by one month.
const previousButton = document.querySelector("#previous-month");


// Find the button used to navigate to the next month.
//
// An event listener will be attached to this button so that clicking it
// moves the calendar forwards by one month.
const nextButton = document.querySelector("#next-month");


// Find the form that allows the user to select a specific month and year.
//
// Submitting this form will update the calendar to display the chosen
// month rather than requiring the user to navigate through each month
// individually.
const datePicker = document.querySelector("#date-picker");


// Find the dropdown used to select a month.
//
// The dropdown options will be populated dynamically using monthNames.
// Each option will use the corresponding zero-based month index as its value.
const monthSelect = document.querySelector("#month-select");


// Find the input used to enter the year.
//
// The value entered here will be converted into a number, validated,
// and used to determine which year the calendar should display.
const yearInput = document.querySelector("#year-input");


// Initialise the calendar using the current date.
//
// new Date() creates a Date object representing the current date and time.
// This allows the calendar to open on the month and year that correspond
// to the current date on the user's system.
let currentDate = new Date();


// Set the day of the month to 1.
//
// This ensures that currentDate represents the first day of the current month.
//
// Keeping the selected date on the first of the month simplifies navigation,
// because moving forwards or backwards by one month will not cause the date
// to overflow into another month due to differences in month lengths.
//
// For example, moving one month forwards from 31 January could otherwise
// produce a date in March, depending on how the date is constructed.
currentDate.setDate(1);


// Populate the month selector with the names of all twelve months.
//
// forEach() loops through every entry in the imported monthNames array.
//
// For each iteration:
// - month contains the name of the current month.
// - index contains its zero-based position in the array.
//
// These values are used to create a dropdown option for each month.
monthNames.forEach((month, index) => {

  // Create a new HTML <option> element for the current month.
  //
  // Each option will become an available choice in the month dropdown.
  const option = document.createElement("option");


  // Set the option's value to the numerical month index.
  //
  // JavaScript uses zero-based month indexing, so January has index 0
  // and December has index 11.
  //
  // HTML form controls store their values as strings, so the numerical
  // index is automatically represented as a string when assigned here.
  //
  // This value can later be converted back into a number when the user
  // submits the date picker form.
  option.value = index;


  // Set the visible text of the option to the month name.
  //
  // For example, the option's value will be "0" and its visible text
  // will be "January" for the first month.
  option.textContent = month;


  // Add the option to the month dropdown.
  //
  // Appending the option makes it available for the user to select
  // when choosing a month in the date picker.
  monthSelect.appendChild(option);
});


// Function to retrieve the commemorative days belonging to a specified
// year and month.
//
// Parameters:
// year       - The year for which commemorative dates should be calculated.
// monthIndex - The zero-based month index, where January is 0 and December is 11.
//
// Returns:
// An array of objects containing the name and numerical day of the month
// for every commemorative event that occurs in the requested month.
//
// This function uses the shared getDateForOccurrence() function to calculate
// recurring dates dynamically, allowing commemorative days to appear on
// their correct dates in different years.
function getCommemorativeDays(year, monthIndex) {

  // Process every entry in daysData and combine the matching results
  // into a single array.
  //
  // flatMap() behaves similarly to map(), but also flattens the returned
  // arrays by one level.
  //
  // This is useful here because each commemorative day can return either:
  // - An empty array if it does not belong to the selected month.
  // - An array containing one event object if it does belong to that month.
  //
  // The empty arrays are flattened away, leaving only the matching events.
  return daysData.flatMap((day) => {

    // Convert the month name from the current commemorative day entry
    // into its numerical month index.
    //
    // indexOf() searches the monthNames array for the supplied month name
    // and returns the position of the matching entry.
    //
    // For example, "October" corresponds to index 9.
    const eventMonth = monthNames.indexOf(day.monthName);


    // Check whether the commemorative day belongs to the selected month.
    //
    // eventMonth contains the month index associated with the current event.
    // monthIndex contains the month index currently being displayed.
    //
    // If these values do not match, the event does not belong to the
    // selected month and does not need to be included in the results.
    //
    // Returning an empty array allows flatMap() to exclude the event
    // without adding anything to the final results.
    if (eventMonth !== monthIndex) {
      return [];
    }


    // Calculate the actual date of the commemorative day for the requested year.
    //
    // getDateForOccurrence() determines the date using the year, month,
    // weekday, and occurrence supplied by the commemorative day data.
    //
    // The arguments are:
    // year           - The year currently being displayed.
    // eventMonth     - The month in which the event occurs.
    // day.dayName    - The weekday on which the event falls.
    // day.occurrence - The occurrence of that weekday, such as "second" or "last".
    //
    // For example, if the data describes the second Tuesday of October,
    // this function calculates which day of October that falls on
    // in the selected year.
    const date = getDateForOccurrence(
      year,
      eventMonth,
      day.dayName,
      day.occurrence,
    );


    // Return an object containing the commemorative day's name and
    // numerical day of the month.
    //
    // date.getDate() returns the day number from 1 to 31.
    //
    // Only the day number needs to be stored because the year and month
    // are already known from the calendar currently being displayed.
    //
    // The object is wrapped in an array because flatMap() expects the
    // callback to return a collection of results.
    return [
      {
        name: day.name,
        date: date.getDate(),
      },
    ];
  });
}


// Function to create a blank calendar cell.
//
// Blank cells are required when the first day of the month does not fall
// beneath the first weekday heading of the calendar.
//
// They are also used at the end of the calendar to complete the final week,
// ensuring that the calendar grid remains aligned into seven-day rows.
//
// Returns:
// An empty HTML <div> element with the CSS classes required for styling.
function createEmptyCell() {

  // Create a new <div>
