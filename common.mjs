
 // Import the function that retrieves user IDs from the data module.
import { getUserIDs } from "./data.mjs";

// Export a function that returns the total number of users.
export const countUsers = () => getUserIDs().length;
