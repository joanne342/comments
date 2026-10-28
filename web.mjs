
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

  // Create a new <div> element to represent an empty calendar cell.
  const cell = document.createElement("div");


  // Assign the CSS classes used to style the cell.
  //
  // "calendar-day" allows the cell to be selected and removed when the
  // calendar is redrawn.
  //
  // "empty-day" allows CSS to distinguish blank cells from cells containing
  // actual dates.
  cell.className = "calendar-day empty-day";


  // Mark the empty cell as hidden from assistive technologies.
  //
  // Since the cell does not contain a date or other meaningful content,
  // aria-hidden="true" prevents screen readers from treating it as
  // a meaningful calendar item.
  cell.setAttribute("aria-hidden", "true");


  // Return the completed blank cell so that it can be appended
  // to the calendar grid.
  return cell;
}


// Function to generate and display the calendar for the currently selected
// month and year.
//
// This function updates the month heading, synchronises the date picker,
// removes the previous calendar cells, calculates commemorative events,
// and generates the new calendar grid.
//
// It also creates blank cells before and after the dates to ensure that
// every date appears beneath the correct weekday heading.
//
// The function is called when the page first loads and whenever the
// selected month or year changes.
function displayCalendar() {

  // Retrieve the currently selected year from currentDate.
  //
  // getFullYear() returns the full year represented by the Date object.
  const year = currentDate.getFullYear();


  // Retrieve the currently selected zero-based month index from currentDate.
  //
  // getMonth() returns a number between 0 and 11, where January is 0
  // and December is 11.
  const month = currentDate.getMonth();


  // Update the visible heading to display the selected month and year.
  //
  // toLocaleDateString() formats the date using the specified locale
  // and formatting options.
  //
  // The "en-GB" locale uses British English formatting conventions.
  //
  // The options specify that:
  // - month: "long" displays the full month name.
  // - year: "numeric" displays the year numerically.
  //
  // For example, the heading might display "October 2026".
  currentMonth.textContent = currentDate.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });


  // Synchronise the month dropdown with the month currently being displayed.
  //
  // Converting month to a string ensures that its value matches the string
  // values assigned to the dropdown options.
  //
  // This keeps the date picker consistent with the calendar, including
  // after the user navigates using the previous and next buttons.
  monthSelect.value = String(month);


  // Synchronise the year input with the currently selected year.
  //
  // This updates the form so that it reflects the month and year currently
  // displayed on the calendar.
  //
  // Converting the year to a string ensures that it is suitable for use
  // as the value of an HTML input element.
  yearInput.value = String(year);


  // Remove the old date cells before generating the new calendar.
  //
  // querySelectorAll(".calendar-day") selects all elements within the
  // calendar that have the "calendar-day" CSS class.
  //
  // This includes both actual date cells and blank alignment cells,
  // because both types are assigned that class.
  //
  // forEach() loops through the selected elements and removes each one
  // from the document.
  //
  // The weekday headings are preserved because they do not have the
  // "calendar-day" class.
  //
  // Removing the old cells prevents dates from previous months from
  // remaining visible when the calendar is redrawn.
  calendar.querySelectorAll(".calendar-day").forEach((cell) => {
    cell.remove();
  });


  // Calculate the weekday on which the first day of the selected month falls.
  //
  // new Date(year, month, 1) creates a Date object representing the first
  // day of the selected month and year.
  //
  // getDay() returns the weekday index:
  // Sunday = 0, Monday = 1, Tuesday = 2, Wednesday = 3,
  // Thursday = 4, Friday = 5, Saturday = 6.
  //
  // This value determines how many blank cells must be inserted before
  // the first date so that day 1 appears beneath the correct weekday heading.
  const firstWeekday = new Date(year, month, 1).getDay();


  // Calculate the total number of days in the selected month.
  //
  // new Date(year, month + 1, 0) creates a Date object representing
  // day 0 of the following month.
  //
  // In JavaScript, day 0 refers to the final day of the preceding month.
  // Therefore, this expression returns the final day of the selected month.
  //
  // getDate() retrieves that day's numerical value, which is also the
  // total number of days in the selected month.
  //
  // This approach automatically accounts for months with different lengths,
  // including February in leap years.
  const daysInMonth = new Date(year, month + 1, 0).getDate();


  // Retrieve the commemorative days that belong to the selected month and year.
  //
  // getCommemorativeDays() calculates the dates of all matching events
  // and returns them as an array of objects.
  //
  // Each object contains the event's name and numerical day of the month.
  // These events will be matched with their corresponding date cells below.
  const commemorativeDays = getCommemorativeDays(year, month);


  // Insert blank cells before the first date to align the calendar grid.
  //
  // The calendar starts its week on Sunday, so the first date must appear
  // beneath the weekday heading corresponding to its getDay() value.
  //
  // For example, if the first day of the month falls on Wednesday,
  // firstWeekday will be 3. Three blank cells will be added before day 1.
  //
  // The loop starts at 0 and continues while i is less than firstWeekday,
  // creating one blank cell for each weekday position before the first date.
  for (let i = 0; i < firstWeekday; i++) {

    // Create a blank calendar cell and append it to the calendar grid.
    //
    // createEmptyCell() returns a styled empty <div> element.
    // appendChild() adds that element to the end of the calendar container.
    calendar.appendChild(createEmptyCell());
  }


  // Generate a calendar cell for every day in the selected month.
  //
  // The loop starts at day 1 and continues until day reaches daysInMonth.
  //
  // The <= operator ensures that the final day of the month is included.
  //
  // Since daysInMonth is calculated dynamically, this loop works for
  // months containing 28, 29, 30, or 31 days.
  for (let day = 1; day <= daysInMonth; day++) {

    // Create a new <div> element to represent the current date.
    const cell = document.createElement("div");


    // Assign the CSS class used to style an ordinary calendar date cell.
    //
    // The class can be used to control the cell's layout, spacing,
    // borders, and other visual properties through CSS.
    cell.className = "calendar-day";


    // Create a <span> element to display the numerical day of the month.
    //
    // A separate element allows the date number to be styled independently
    // from commemorative event labels displayed within the same cell.
    const number = document.createElement("span");


    // Assign the CSS class used to style the day number.
    number.className = "day-number";


    // Set the visible text of the day-number element to the current day.
    //
    // For example, when day is 8, the element displays "8".
    // textContent inserts the value as text rather than interpreting it
    // as HTML markup.
    number.textContent = day;


    // Add the day number to the current calendar cell.
    //
    // Appending it before the event labels ensures that the numerical
    // date appears first within the cell.
    cell.appendChild(number);


    // Find all commemorative events that fall on the current day.
    //
    // filter() examines every object in the commemorativeDays array
    // and returns a new array containing only objects whose date property
    // matches the current value of day.
    //
    // The arrow function checks whether event.date is equal to day.
    //
    // More than one commemorative event can occur on the same date,
    // so the resulting array may contain multiple events or be empty
    // if no commemorative events occur on that day.
    const events = commemorativeDays.filter((event) => event.date === day);


    // Display every commemorative event that falls on the current date.
    //
    // forEach() loops through the events returned by filter().
    // Each event is displayed as a separate label within the date cell.
    events.forEach((event) => {

      // Create a <span> element for the commemorative event label.
      const label = document.createElement("span");


      // Assign the CSS class used to style commemorative event labels.
      //
      // This allows event names to have a different appearance from
      // the numerical day displayed at the top of the cell.
      label.className = "commemorative-day";


      // Set the visible text of the label to the event's name.
      //
      // textContent inserts the event name as plain text rather than
      // interpreting it as HTML. This is appropriate for displaying
      // event names supplied by the JSON data.
      label.textContent = event.name;


      // Append the commemorative event label to the current date cell.
      //
      // If several events occur on the same day, each label is appended
      // separately, allowing all of them to appear within the same cell.
      cell.appendChild(label);
    });


    // Append the completed date cell to the calendar grid.
    //
    // At this point, the cell contains its numerical day and any
    // commemorative event labels associated with that date.
    calendar.appendChild(cell);
  }


  // Calculate the total number of calendar cells currently used.
  //
  // firstWeekday represents the number of blank cells before the first date.
  // daysInMonth represents the number of actual date cells.
  //
  // Adding these values gives the number of occupied positions in the
  // calendar grid before the trailing blank cells are added.
  //
  // For example, if the month begins on Wednesday and contains 31 days,
  // the calendar uses 3 + 31 = 34 cells at this stage.
  const usedCells = firstWeekday + daysInMonth;


  // Calculate how many blank cells are needed to complete the final week.
  //
  // A complete calendar week contains seven cells.
  //
  // usedCells % 7 calculates the remainder when the number of used cells
  // is divided by seven. This remainder indicates how many positions
  // are occupied in the final row.
  //
  // Subtracting the remainder from 7 gives the number of blank cells
  // needed to complete that row.
  //
  // The outer % 7 ensures that the result is 0 when usedCells is already
  // divisible by 7. Without this final modulo operation, a complete
  // final row would incorrectly result in seven unnecessary blank cells.
  //
  // For example:
  // - If the remainder is 5, two blank cells are needed.
  // - If the remainder is 3, four blank cells are needed.
  // - If the remainder is 0, no additional cells are needed.
  const remainingCells = (7 - (usedCells % 7)) % 7;


  // Add blank cells to complete the final week of the calendar.
  //
  // The loop creates one blank cell for every remaining position
  // calculated above.
  //
  // This keeps the calendar aligned into complete seven-column rows
  // without adding an unnecessary row when the final date already
  // falls at the end of a complete week.
  for (let i = 0; i < remainingCells; i++) {

    // Create and append one blank cell for the current remaining position.
    calendar.appendChild(createEmptyCell());
  }
}


// Function to change the currently selected month by a specified amount.
//
// Parameter:
// amount - The number of months to move forwards or backwards.
//
// A positive amount moves the calendar forwards, while a negative amount
// moves it backwards.
//
// For example:
// changeMonth(-1) moves to the previous month.
// changeMonth(1) moves to the next month.
//
// Using one shared function avoids duplicating the date-update logic
// in the previous-month and next-month event listeners.
function changeMonth(amount) {

  // Create a new Date object representing the first day of the updated month.
  //
  // currentDate.getFullYear() retrieves the currently selected year.
  //
  // currentDate.getMonth() retrieves the current zero-based month index.
  // Adding amount moves the month index forwards or backwards by the
  // specified number of months.
  //
  // The final argument is 1, ensuring that the resulting date is always
  // the first day of the selected month.
  //
  // JavaScript automatically adjusts the year when the month index
  // moves outside the range 0 to 11.
  //
  // For example:
  // - Moving backwards from January 2026 produces December 2025.
  // - Moving forwards from December 2026 produces January 2027.
  //
  // Replacing currentDate with a new Date object updates the selected
  // month and year without modifying the original Date object directly.
  currentDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + amount,
    1,
  );


  // Redraw the calendar using the updated month and year.
  //
  // This updates the heading and form controls, removes the old date cells,
  // and generates the dates and commemorative events for the new month.
  displayCalendar();
}


// Add a click event listener to the previous-month button.
//
// addEventListener() registers a function that runs whenever the specified
// event occurs on the selected element.
//
// In this case, the function runs whenever the user clicks the
// previous-month button.
previousButton.addEventListener("click", () => {

  // Move the calendar backwards by one month.
  //
  // Passing -1 to changeMonth() subtracts one from the current month index.
  // The shared function then updates currentDate and redraws the calendar.
  changeMonth(-1);
});


// Add a click event listener to the next-month button.
//
// This listener allows the user to move forwards through the calendar
// one month at a time.
nextButton.addEventListener("click", () => {

  // Move the calendar forwards by one month.
  //
  // Passing 1 to changeMonth() adds one to the current month index.
  // The shared function handles updating the date and redrawing the calendar.
  changeMonth(1);
});


// Add a submit event listener to the month-and-year selection form.
//
// This allows the user to jump directly to a chosen month and year
// rather than navigating through the calendar one month at a time.
datePicker.addEventListener("submit", (event) => {

  // Prevent the browser's default form submission behaviour.
  //
  // Without this call, submitting the form could reload the page or
  // navigate away from the current document.
  //
  // preventDefault() allows the JavaScript below to process the selected
  // month and year without triggering the normal browser submission.
  event.preventDefault();


  // Retrieve the year entered by the user and convert it into a number.
  //
  // HTML input values are strings, even when the input is intended
  // to contain a numerical value.
  //
  // Number() converts the input value into a number so that it can be
  // validated and used when creating the Date object.
  const year = Number(yearInput.value);


  // Retrieve the selected month index and convert it into a number.
  //
  // The dropdown options use zero-based month indices, matching the
  // indexing expected by JavaScript's Date object.
  //
  // Converting the selected value to a number ensures that it can be
  // checked and used in date calculations.
  const month = Number(monthSelect.value);


  // Validate the year and month before updating the calendar.
  //
  // The conditions check that:
  // - The year is a safe integer.
  // - The month is an integer.
  // - The month is not less than 0.
  // - The month is not greater than 11.
  // - The year input is not empty or made up entirely of whitespace.
  //
  // Number.isSafeInteger(year) checks that year is an integer within
  // JavaScript's safe integer range.
  //
  // Number.isInteger(month) ensures that the month is a whole number.
  //
  // The month range of 0 to 11 is required because JavaScript represents
  // January as 0 and December as 11.
  //
  // yearInput.value.trim() removes whitespace from the beginning and end
  // of the input value. If the result is an empty string, the input
  // contains no meaningful year value.
  //
  // The ! operator reverses the result of the trim() check, making the
  // condition true when the trimmed input is empty.
  //
  // If any of these conditions is true, the form submission is rejected
  // and the calendar remains on its currently selected month.
  if (
    !Number.isSafeInteger(year) ||
    !Number.isInteger(month) ||
    month < 0 ||
    month > 11 ||
    !yearInput.value.trim()
  ) {

    // Ask the browser to display the year input's native validation message.
    //
    // reportValidity() checks the input's built-in HTML validation rules
    // and displays a validation message if the input is invalid.
    //
    // The message displayed depends on the input's HTML attributes
    // and validation state.
    yearInput.reportValidity();


    // Stop processing the form submission.
    //
    // Returning here prevents currentDate from being updated and prevents
    // the calendar from being redrawn using invalid input.
    return;
  }


  // Update currentDate to the first day of the selected month and year.
  //
  // new Date(year, month, 1) creates a Date object using the validated
  // year and month, with the day set to 1.
  //
  // Using the first day avoids problems associated with carrying a day
  // number from the previously selected month into a month that has
  // fewer days.
  //
  // For example, selecting February after displaying a month with 31 days
  // should not cause the selected date to overflow into March.
  currentDate = new Date(year, month, 1);


  // Explicitly set the full year to the year entered by the user.
  //
  // JavaScript's Date constructor treats year values between 0 and 99
  // specially, interpreting them as years from 1900 to 1999.
  //
  // For example, new Date(50, 0, 1) represents 1 January 1950 rather
  // than 1 January of the year 50.
  //
  // Calling setFullYear(year) avoids this special handling and sets
  // the date to the requested full year.
  //
  // For ordinary four-digit years, this generally leaves the year unchanged.
  currentDate.setFullYear(year);


  // Check whether currentDate represents a valid date.
  //
  // getTime() returns the timestamp of a valid Date object in milliseconds
  // relative to the Unix epoch.
  //
  // If the Date object is invalid, getTime() returns NaN instead.
  //
  // Number.isNaN() checks specifically whether the returned timestamp
  // is NaN, indicating that the date could not be represented as a
  // valid JavaScript date.
  //
  // If the date is invalid, stop processing the form submission rather
  // than attempting to redraw the calendar.
  if (Number.isNaN(currentDate.getTime())) {
    return;
  }


  // Display the newly selected month and year.
  //
  // displayCalendar() updates the heading and form controls, clears the
  // previous date cells, calculates the new month's commemorative events,
  // and generates the calendar grid.
  //
  // This ensures that the visible calendar matches the month and year
  // selected by the user.
  displayCalendar();
});


// Display the current month when the page opens.
//
// Calling displayCalendar() immediately initialises the calendar display.
//
// This initial call:
// - Updates the month-and-year heading.
// - Synchronises the month dropdown and year input.
// - Calculates the number of days in the current month.
// - Retrieves the commemorative events for that month.
// - Generates and displays the calendar cells.
//
// Without this call, the calendar would not be populated until the user
// clicked a navigation button or submitted the date picker form.
displayCalendar();
