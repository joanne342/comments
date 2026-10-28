// Import the assert module from Node.js.
// This module provides methods for checking whether values match expected results.
// In this test, it is used to verify that the function returns the correct user count.
import assert from "node:assert";

// Import the test function from Node.js's built-in test module.
// The test function is used to define and run an individual test case.
// It takes a descriptive name for the test and a callback function containing the test logic.
import test from "node:test";

// Import the countUsers function from the common.mjs file in the same directory.
// This is the function being tested.
// The function is expected to return the number of users.
import { countUsers } from "./common.mjs";

// Define a test case with the name "User count is correct".
// The test function runs the callback below and reports whether the test passes or fails.
// The descriptive name helps identify the purpose of the test in the test results.
test("User count is correct", () => {
  // Call the countUsers function and retrieve its return value.
  // The function is expected to return 4, meaning there are four users.
  // This value is passed as the first argument to assert.equal().
  //
  // The second argument, 4, is the expected value.
  // assert.equal() checks whether the actual result matches the expected value.
  // If the values do not match, the assertion throws an error and the test fails.
  // If they match, the assertion passes and the test is successful.
  assert.equal(countUsers(), 4);
});
