
// Import Node.js assertion and test modules.
import assert from "node:assert";
import test from "node:test";

// Import the functions to test.
import { getUserIds } from "./storage.js";
import { sortBookmarks } from "./utils.js";

// Test that the application returns five user IDs.
test("User count is correct", () => {
  assert.equal(getUserIds().length, 5);
});

// Test that bookmarks are sorted newest first without modifying the original array.
test("Bookmarks are sorted newest first", () => {
  const bookmarks = [
    { title: "Old bookmark", timestamp: "2026-08-20T10:00:00Z" },
    { title: "New bookmark", timestamp: "2026-08-23T10:00:00Z" },
    { title: "Middle bookmark", timestamp: "2026-08-22T10:00:00Z" }
  ];

  // Sort the bookmarks and verify their order.
  const sortedBookmarks = sortBookmarks(bookmarks);
  assert.equal(sortedBookmarks[0].title, "New bookmark");
  assert.equal(sortedBookmarks[1].title, "Middle bookmark");
  assert.equal(sortedBookmarks[2].title, "Old bookmark");

  // Verify that the original array remains unchanged and a new array is returned.
  assert.equal(bookmarks[0].title, "Old bookmark");
  assert.notEqual(sortedBookmarks, bookmarks);
});

// Test sorting with empty arrays and numeric timestamps.
test("Sorting handles empty collections and numeric timestamps", () => {
  // An empty array should return an empty array.
  assert.deepEqual(sortBookmarks([]), []);

  // Numeric timestamps should also be sorted from newest to oldest.
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
