
import daysData from "./days.json" with { type: "json" };
import { getDateForOccurrence, monthNames } from "./common.mjs";

// Get the calendar and date-picker elements.
const calendar = document.querySelector("#calendar");
const currentMonth = document.querySelector("#current-month");
const previousButton = document.querySelector("#previous-month");
const nextButton = document.querySelector("#next-month");
const datePicker = document.querySelector("#date-picker");
const monthSelect = document.querySelector("#month-select");
const yearInput = document.querySelector("#year-input");

// Initialise the selected date to the first day of the current month.
let currentDate = new Date();
currentDate.setDate(1);

// Populate the month dropdown.
monthNames.forEach((month, index) => {
  const option = document.createElement("option");
  option.value = index;
  option.textContent = month;
  monthSelect.appendChild(option);
});

// Return commemorative events occurring in the specified month and year.
function getCommemorativeDays(year, monthIndex) {
  return daysData.flatMap((day) => {
    const eventMonth = monthNames.indexOf(day.monthName);

    if (eventMonth !== monthIndex) {
      return [];
    }

    const date = getDateForOccurrence(
      year,
      eventMonth,
      day.dayName,
      day.occurrence,
    );

    return [{
      name: day.name,
      date: date.getDate(),
    }];
  });
}

// Create a blank calendar cell for alignment.
function createEmptyCell() {
  const cell = document.createElement("div");
  cell.className = "calendar-day empty-day";
  cell.setAttribute("aria-hidden", "true");
  return cell;
}

// Generate the calendar grid and display commemorative events.
function displayCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Update the heading and synchronise the date-picker controls.
  currentMonth.textContent = currentDate.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  monthSelect.value = String(month);
  yearInput.value = String(year);

  // Remove the previous month's date and alignment cells.
  calendar.querySelectorAll(".calendar-day").forEach((cell) => {
    cell.remove();
  });

  // Calculate the first weekday and the number of days in the month.
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const commemorativeDays = getCommemorativeDays(year, month);

  // Add blank cells before the first date to align weekdays.
  for (let i = 0; i < firstWeekday; i++) {
    calendar.appendChild(createEmptyCell());
  }

  // Create a cell for each date and display its commemorative events.
  for (let day = 1; day <= daysInMonth; day++) {
    const cell = document.createElement("div");
    cell.className = "calendar-day";

    const number = document.createElement("span");
    number.className = "day-number";
    number.textContent = day;
    cell.appendChild(number);

    const events = commemorativeDays.filter((event) => event.date === day);

    events.forEach((event) => {
      const label = document.createElement("span");
      label.className = "commemorative-day";
      label.textContent = event.name;
      cell.appendChild(label);
    });

    calendar.appendChild(cell);
  }

  // Add trailing blank cells to complete the final week.
  const usedCells = firstWeekday + daysInMonth;
  const remainingCells = (7 - (usedCells % 7)) % 7;

  for (let i = 0; i < remainingCells; i++) {
    calendar.appendChild(createEmptyCell());
  }
}

// Move the calendar forwards or backwards by the specified number of months.
function changeMonth(amount) {
  currentDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + amount,
    1,
  );

  displayCalendar();
}

// Navigate to the previous or next month.
previousButton.addEventListener("click", () => {
  changeMonth(-1);
});

nextButton.addEventListener("click", () => {
  changeMonth(1);
});

// Display the month and year selected in the date-picker form.
datePicker.addEventListener("submit", (event) => {
  event.preventDefault();

  const year = Number(yearInput.value);
  const month = Number(monthSelect.value);

  // Validate the year and month before updating the calendar.
  if (
    !Number.isSafeInteger(year) ||
    !Number.isInteger(month) ||
    month < 0 ||
    month > 11 ||
    !yearInput.value.trim()
  ) {
    yearInput.reportValidity();
    return;
  }

  // Set the selected date and preserve years below 100 correctly.
  currentDate = new Date(year, month, 1);
  currentDate.setFullYear(year);

  if (Number.isNaN(currentDate.getTime())) {
    return;
  }

  displayCalendar();
});

// Render the current month when the page loads.
displayCalendar();
