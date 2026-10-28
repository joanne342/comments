
// Import the assert module from Node.js.
// This module provides functions for checking whether values match
// expected results. If an assertion fails, Node.js reports an error,
// allowing us to identify which test did not behave as expected.
import assert from "node:assert";

// Import the test function from Node.js's built-in testing module.
// The test() function defines individual tests that Node.js can execute
// to verify that the application's functions work correctly.
import test from "node:test";

// Import getUserIds() from storage.js.
// This function returns the list of user IDs available in the application.
// We will use it to check that the application provides the expected
// number of user IDs.
import { getUserIds } from "./storage.js";

// Import sortBookmarks() from utils.js.
// This function sorts bookmarks by their timestamps, placing the newest
// bookmarks before older ones. We will test its sorting behavior and
// check that it does not modify the original array.
import { sortBookmarks } from "./utils.js";


// Define a test to check that the number of user IDs is correct.
// The descriptive test name appears in the test results, making it easier
// to understand what the test is checking.
test("User count is correct", () => {

  // Call getUserIds() to retrieve the array of user IDs.
  // Access its length property to find out how many IDs it contains.
  //
  // assert.equal() checks whether the actual value matches the expected value.
  // In this case, the test expects the array to contain exactly five IDs.
  // If the number is not 5, the assertion fails and the test is reported
  // as unsuccessful.
  assert.equal(getUserIds().length, 5);
});


// Define a test to verify that bookmarks are sorted from newest to oldest.
// This test also checks that sorting does not change the original array.
test("Bookmarks are sorted newest first", () => {

  // Create an array containing three example bookmarks.
  // Each bookmark is represented by an object with a title and a timestamp.
  //
  // The timestamps are ISO 8601 date-time strings in UTC.
  // The "Z" at the end indicates Coordinated Universal Time (UTC).
  //
  // The bookmarks are deliberately arranged in chronological order that
  // is not newest-first:
  //   1. Old bookmark:    August 20, 2026
  //   2. New bookmark:    August 23, 2026
  //   3. Middle bookmark: August 22, 2026
  //
  // This lets us check whether sortBookmarks() correctly reorders them.
  const bookmarks = [
    {
      // The title identifies this as the oldest bookmark in the test data.
      title: "Old bookmark",

      // The timestamp records when this bookmark was created or saved.
      timestamp: "2026-08-20T10:00:00Z"
    },
    {
      // This bookmark has the most recent timestamp.
      title: "New bookmark",

      // August 23 is later than the other two dates.
      timestamp: "2026-08-23T10:00:00Z"
    },
    {
      // This bookmark falls between the other two dates.
      title: "Middle bookmark",

      // August 22 is newer than August 20 but older than August 23.
      timestamp: "2026-08-22T10:00:00Z"
    }
  ];

  // Call sortBookmarks() with the original bookmarks array.
  // Store the returned, sorted array in a separate variable.
  //
  // The expected behavior is that the newest bookmark appears first,
  // followed by the middle bookmark and then the oldest bookmark.
  const sortedBookmarks = sortBookmarks(bookmarks);

  // Check that the first bookmark in the sorted array is the newest one.
  // Index 0 represents the first element of a JavaScript array.
  // Its title should therefore be "New bookmark".
  assert.equal(sortedBookmarks[0].title, "New bookmark");

  // Check that the second bookmark is the one with the middle timestamp.
  // Index 1 represents the second element of the array.
  assert.equal(sortedBookmarks[1].title, "Middle bookmark");

  // Check that the oldest bookmark appears last in the sorted array.
  // Index 2 represents the third element of this three-item array.
  assert.equal(sortedBookmarks[2].title, "Old bookmark");

  // Verify that sorting has not changed the order of the original array.
  //
  // The original bookmarks array started with "Old bookmark".
  // If sortBookmarks() sorts a copy rather than modifying the original array,
  // this first element should still have the same title.
  //
  // This is important when the original array represents stored data:
  // sorting bookmarks for display should not unexpectedly change their
  // original order in memory.
  assert.equal(bookmarks[0].title, "Old bookmark");

  // Verify that the returned sorted array is a different array object
  // from the original bookmarks array.
  //
  // assert.notEqual() checks that the two values are not equal under
  // JavaScript's non-strict inequality comparison.
  // Since arrays are objects, this checks that sortBookmarks() returned
  // a separate array reference rather than the original array reference.
  //
  // Together with the previous assertion, this helps confirm that the
  // original array remains unchanged while the returned array is sorted.
  assert.notEqual(sortedBookmarks, bookmarks);
});


// Define a test to check two additional sorting scenarios:
//   1. An empty array.
//   2. Bookmarks whose timestamps are numbers rather than date strings.
//
// These cases help ensure that sortBookmarks() works with different
// valid inputs and does not depend exclusively on ISO date strings.
test("Sorting handles empty collections and numeric timestamps", () => {

  // Pass an empty array to sortBookmarks().
  //
  // Because there are no elements to sort, the result should also be
  // an empty array. assert.deepEqual() compares the contents and structure
  // of the actual and expected values.
  //
  // This assertion checks that the function handles an empty collection
  // without producing unexpected elements or errors.
  assert.deepEqual(sortBookmarks([]), []);

  // Create an array of bookmarks with numeric timestamps.
  //
  // The timestamps are deliberately provided in an unsorted order:
  //   100
  //   300
  //   200
  //
  // sortBookmarks() should place the largest timestamp first, followed
  // by the next largest and then the smallest.
  //
  // The test expects the resulting order to be 300, 200, 100.
  // This works with the implementation that converts each timestamp
  // using new Date(), because JavaScript's Date constructor accepts
  // numeric timestamps as well as date-time strings.
  //
  // Note: Numeric values passed to new Date() are interpreted as
  // milliseconds since January 1, 1970, UTC. The test only needs their
  // relative order to verify the sorting behavior.
  assert.deepEqual(
    sortBookmarks([
      { timestamp: 100 },
      { timestamp: 300 },
      { timestamp: 200 }
    ]),
    [
      { timestamp: 300 },
      { timestamp: 200 },
      { timestamp: 100 }
    ]
  );
});

