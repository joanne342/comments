// Import the strict assertion module from Node.js.
//
// The assert module provides functions that allow tests to check whether
// the actual results of the code match the expected results.
//
// The "strict" version uses strict comparison behaviour, meaning values
// must match without automatic type conversion.
//
// For example, assert.equal(8, "8") would fail in strict assertion mode
// because the number 8 and the string "8" are different types.
//
// The module is imported from Node.js rather than installed separately,
// because it is part of Node.js's built-in functionality.
import assert from "node:assert/strict";


// Import Node.js's built-in test function.
//
// The test() function allows individual test cases to be defined and run
// by Node.js's test runner.
//
// Each test has a descriptive name and a callback function containing
// the code that should be executed when the test runs.
//
// If an assertion fails or an unexpected error occurs, Node.js reports
// the test as failed. If all assertions pass, the test is reported
// as successful.
import test from "node:test";


// Import the getDateForOccurrence() function from the shared common.mjs file.
//
// This is the function being tested throughout this file.
//
// Importing the actual function ensures that the tests check the real
// date-calculation logic used by the application, rather than a separate
// implementation created specifically for the tests.
import { getDateForOccurrence } from "./common.mjs";


// Test that the function correctly calculates Ada Lovelace Day
// in October 2024.
//
// Ada Lovelace Day is observed on the second Tuesday of October.
// This test checks that the function identifies the correct date
// when given the year 2024, October's month index, the weekday Tuesday,
// and the occurrence "second".
test("finds Ada Lovelace Day in October 2024", () => {

  // Calculate the date of the second Tuesday in October 2024.
  //
  // The arguments supplied to getDateForOccurrence() are:
  // 2024      - The requested year.
  // 9         - October's zero-based month index.
  // "Tuesday" - The required weekday.
  // "second"  - The required occurrence of that weekday.
  //
  // JavaScript numbers months from 0 to 11, so October is represented
  // by 9 rather than 10.
  //
  // The function returns a Date object representing the calculated date.
  const date = getDateForOccurrence(
    2024, 9, "Tuesday", "second"
  );


  // Check that the calculated date belongs to the year 2024.
  //
  // getFullYear() returns the full year represented by the Date object.
  //
  // assert.equal() checks that the returned year matches the expected
  // value. If the function returns a different year, the assertion fails.
  assert.equal(date.getFullYear(), 2024);


  // Check that the calculated date belongs to October.
  //
  // getMonth() returns a zero-based month index, where January is 0
  // and December is 11.
  //
  // October therefore has the expected index 9.
  //
  // This assertion ensures that the function has not accidentally
  // returned a date in a neighbouring month.
  assert.equal(date.getMonth(), 9);


  // Check that the calculated date is the eighth day of the month.
  //
  // getDate() returns the numerical day of the month, ranging from 1
  // to 31 depending on the month.
  //
  // The second Tuesday of October 2024 falls on 8 October.
  // If the calculated day is not 8, this assertion fails.
  assert.equal(date.getDate(), 8);
});


// Test that the function correctly calculates Ada Lovelace Day
// in October 2025.
//
// This test uses a different year to verify that the function calculates
// recurring weekday-based dates dynamically rather than relying on a
// fixed calendar date.
//
// Although Ada Lovelace Day is still the second Tuesday of October,
// its numerical day of the month can change from year to year.
test("finds Ada Lovelace Day in October 2025", () => {

  // Calculate the date of the second Tuesday in October 2025.
  //
  // The arguments specify the year 2025, October's zero-based month index
  // of 9, the weekday Tuesday, and its second occurrence.
  //
  // The returned Date object is stored in date so that its components
  // can be checked using the Date object's methods.
  const date = getDateForOccurrence(
    2025, 9, "Tuesday", "second"
  );


  // Check that the calculated day of the month is 14.
  //
  // The second Tuesday of October 2025 falls on 14 October.
  //
  // This assertion verifies the numerical date. Unlike the previous test,
  // the year and month are not checked separately in this test.
  assert.equal(date.getDate(), 14);
});


// Test that the function correctly calculates International Binturong Day
// in May 2030.
//
// This test checks a different month, year, weekday, and occurrence
// from the previous tests.
//
// International Binturong Day is represented here as the second Saturday
// of May. The test verifies that the function can calculate the correct
// date using these different inputs.
test("finds International Binturong Day in May 2030", () => {

  // Calculate the date of the second Saturday in May 2030.
  //
  // The arguments supplied are:
  // 2030       - The requested year.
  // 4          - May's zero-based month index.
  // "Saturday" - The required weekday.
  // "second"   - The required occurrence of that weekday.
  //
  // May is represented by index 4 because JavaScript's month indices
  // start at 0, with January as the first month.
  const date = getDateForOccurrence(
    2030, 4, "Saturday", "second"
  );


  // Check that the calculated date falls on day 11 of the month.
  //
  // The second Saturday of May 2030 falls on 11 May.
  //
  // If the function calculates a different day number, the assertion
  // fails and Node.js reports the test as unsuccessful.
  assert.equal(date.getDate(), 11);
});


// Test that the function correctly calculates the last Friday
// of October 2024.
//
// This test checks the special "last" occurrence supported by
// getDateForOccurrence().
//
// Unlike the first, second, third, fourth, and fifth occurrences,
// which are calculated by counting forwards from the beginning of
// the month, the last occurrence is calculated by working backwards
// from the final day of the month.
test("finds World Lemur Day in October 2024", () => {

  // Calculate the date of the last Friday in October 2024.
  //
  // The arguments supplied are:
  // 2024      - The requested year.
  // 9         - October's zero-based month index.
  // "Friday"  - The required weekday.
  // "last"    - The final occurrence of that weekday in the month.
  //
  // The function uses the final day of October to work backwards
  // to the most recent Friday.
  const date = getDateForOccurrence(
    2024, 9, "Friday", "last"
  );


  // Check that the calculated date is the 25th day of the month.
  //
  // The last Friday of October 2024 falls on 25 October.
  //
  // This assertion verifies that the function correctly handles the
  // "last" occurrence instead of treating it as a numbered occurrence.
  assert.equal(date.getDate(), 25);
});


// Test that the function rejects an invalid weekday name.
//
// This test checks the error-handling behaviour of
// getDateForOccurrence().
//
// The function should only accept weekday names that exist in its
// weekdayNames array, such as "Monday", "Tuesday", or "Sunday".
// Supplying an unrecognised weekday should cause the function to throw
// an Error rather than attempting to calculate an invalid date.
test("rejects an invalid weekday", () => {

  // Check that getDateForOccurrence() throws an appropriate error
  // when the supplied weekday name is invalid.
  //
  // assert.throws() expects the supplied callback function to throw
  // an error when it is executed.
  //
  // The arrow function delays the call to getDateForOccurrence()
  // until assert.throws() executes it. This is important because
  // assert.throws() needs to catch the error itself.
  //
  // The function is called with:
  // 2024      - The requested year.
  // 9         - October's zero-based month index.
  // "Funday"  - An invalid weekday name.
  // "second"  - The requested occurrence.
  //
  // Since "Funday" does not exist in weekdayNames, the function should
  // throw an Error with a message containing "Unknown weekday".
  //
  // The final argument, /Unknown weekday/, is a regular expression
  // that checks whether the thrown error's message contains that text.
  //
  // If no error is thrown, or if the error message does not match
  // the expected pattern, the assertion fails.
  assert.throws(
    () => getDateForOccurrence(
      2024, 9, "Funday", "second"
    ),
    /Unknown weekday/
  );
});

