
// Helper functions for retrieving and storing user data in localStorage.

/** Return the list of available user IDs. */
export function getUserIds() {
  // Return the predefined user IDs as strings.
  return ["1", "2", "3", "4", "5"];
}

/** Retrieve and parse stored data for a specific user. */
export function getData(userId) {
  // Get the user's data from localStorage and convert it from JSON.
  return JSON.parse(localStorage.getItem(`stored-data-user-${userId}`));
}

/** Save data for a specific user in localStorage. */
export function setData(userId, data) {
  // Convert the data to JSON and store it under the user's unique key.
  localStorage.setItem(`stored-data-user-${userId}`, JSON.stringify(data));
}
