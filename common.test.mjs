// Import Node.js assertion and test modules.
import assert from "node:assert";
import test from "node:test";

// Import the function to test.
import { countUsers } from "./common.mjs";

// Test that the user count matches the expected value.
test("User count is correct", () => {
  // Verify that countUsers() returns 4.
  assert.equal(countUsers(), 4);
});
