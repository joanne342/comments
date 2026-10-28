// Import the getUserIDs() function from the data.mjs module.
//
// This function is responsible for retrieving the user IDs from the
// application's data source.
//
// Importing the function allows this module to access the user data
// without needing to duplicate the logic used to retrieve the IDs.
//
// The imported function will be used to determine how many users
// are currently represented in the returned collection.
import { getUserIDs } from "./data.mjs";


// Export a function that counts the number of users.
//
// The export keyword makes countUsers() available to other JavaScript
// modules that import it from this file.
//
// An arrow function is used to define the function concisely.
// The empty parentheses indicate that countUsers() does not require
// any arguments from the code that calls it.
//
// When called, the function retrieves the user IDs by calling getUserIDs()
// and then uses the length property to determine how many IDs are returned.
//
// The length property returns the number of elements in an array.
// For example, if getUserIDs() returns [1, 2, 3], the length is 3.
//
// The resulting number is returned automatically because the arrow function
// uses an expression body rather than a block body with curly braces.
//
// This function therefore provides a simple way for other parts of the
// application to obtain the number of users without needing to retrieve
// the IDs and count them separately.
export const countUsers = () => getUserIDs().length;
