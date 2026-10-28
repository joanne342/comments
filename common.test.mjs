
// Import strict assertions and Node.js's test runner.
import assert from "node:assert/strict";
import test from "node:test";

// Import the date calculation function to test.
import { getDateForOccurrence } from "./common.mjs";

// Test the second Tuesday of October 2024.
test("finds Ada Lovelace Day in October 2024", () => {
  const date = getDateForOccurrence(2024, 9, "Tuesday", "second");

  // Verify the year, month, and day.
  assert.equal(date.getFullYear(), 2024);
  assert.equal(date.getMonth(), 9);
  assert.equal(date.getDate(), 8);
});

// Test the second Tuesday of October 2025.
test("finds Ada Lovelace Day in October 2025", () => {
  const date = getDateForOccurrence(2025, 9, "Tuesday", "second");

  // Verify the expected day.
  assert.equal(date.getDate(), 14);
});

// Test the second Saturday of May 2030.
test("finds International Binturong Day in May 2030", () => {
  const date = getDateForOccurrence(2030, 4, "Saturday", "second");

  // Verify the expected day.
  assert.equal(date.getDate(), 11);
});

// Test the last Friday of October 2024.
test("finds World Lemur Day in October 2024", () => {
  const date = getDateForOccurrence(2024, 9, "Friday", "last");

  // Verify the expected day.
  assert.equal(date.getDate(), 25);
});

// Test that an invalid weekday throws the expected error.
test("rejects an invalid weekday", () => {
  assert.throws(
    () => getDateForOccurrence(2024, 9, "Funday", "second"),
    /Unknown weekday/
  );
});
