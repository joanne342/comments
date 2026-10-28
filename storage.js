// This is a scaffolding file provided for the project.
// It contains helper functions for managing data that is stored in the browser.
// The file can be included in the application's index.html file so that
// other parts of the application can use these functions.
//
// You should not need to modify this file to complete the project,
// because it already provides the basic functionality needed to retrieve,
// access, and save data for different users.

/**
 * Get a list of user ids.
 *
 * This function returns a predefined list of user IDs.
 * These IDs can be used by other parts of the application to identify
 * users and retrieve the data associated with each user.
 *
 * @returns {string[]} An array of user ID strings.
 *                    Each ID is represented as a string rather than a number.
 */
export function getUserIds() {
  // Return an array containing the IDs of the users available in this example.
  // The IDs are stored as strings: "1", "2", "3", "4", and "5".
  //
  // Because the array is returned directly, the caller receives this list
  // and can use it to determine which users' data can be accessed.
  return ["1", "2", "3", "4", "5"];
}

/**
 * Get data associated with a specific user.
 *
 * This function retrieves a user's previously stored data from the browser's
 * localStorage. Each user's data is saved under a unique key that includes
 * their user ID.
 *
 * @param {string} userId The ID of the user whose data should be retrieved.
 *                        This value is inserted into the localStorage key.
 * @returns {any | null} The data associated with the user, parsed from JSON.
 *                       Returns null if the key does not exist in localStorage.
 */
export function getData(userId) {
  // Retrieve the value stored in localStorage using a key specific to this user.
  //
  // Template literals (the backticks) allow userId to be inserted into the
  // key dynamically. For example, if userId is "2", the key becomes:
  // "stored-data-user-2".
  //
  // localStorage.getItem() returns the stored value as a string, or null
  // if no value exists for the requested key.
  //
  // JSON.parse() converts a JSON-formatted string back into a JavaScript value.
  // For example, a stored string such as '{"name":"Alex"}' becomes an object.
  //
  // If getItem() returns null because the key is missing, JSON.parse(null)
  // returns null. If the stored value contains invalid JSON, JSON.parse()
  // throws an error.
  return JSON.parse(localStorage.getItem(`stored-data-user-${userId}`));
}

/**
 * Store data for a specific user.
 *
 * This function saves data in the browser's localStorage so that it can
 * be retrieved later using getData() and the same user ID.
 *
 * @param {string} userId The ID of the user whose data should be stored.
 *                        This ID determines the localStorage key.
 * @param {any} data The JavaScript value to store. This could be an object,
 *                   an array, a string, a number, or another JSON-serializable value.
 *                   Values that cannot be represented in JSON may not be preserved
 *                   exactly when converted and restored.
 * @returns {void} This function does not explicitly return a value.
 */
export function setData(userId, data) {
  // Convert the user-specific key into a string using the supplied user ID.
  // For example, if userId is "2", the key becomes:
  // "stored-data-user-2".
  //
  // JSON.stringify() converts the JavaScript data into a JSON-formatted string,
  // because localStorage stores values as strings rather than as JavaScript objects.
  //
  // For example, an object such as { name: "Alex" } is converted into:
  // '{"name":"Alex"}'.
  //
  // localStorage.setItem() then saves that string under the generated key.
  // If the key already exists, its previous value is replaced.
  //
  // The data can later be retrieved by calling getData(userId), which reads
  // the stored string and converts it back into a JavaScript value using JSON.parse().
  localStorage.setItem(`stored-data-user-${userId}`, JSON.stringify(data));
}
