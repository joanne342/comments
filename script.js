
// Import the functions needed to manage user data from storage.js.
//
// getUserIds() returns the list of available user IDs.
// getData(userId) retrieves the bookmarks stored for a specific user.
// setData(userId, data) saves updated data for a specific user.
import { getUserIds, getData, setData } from "./storage.js";

// Import sortBookmarks() from utils.js.
// This function returns a copy of the bookmarks array sorted by timestamp,
// with the newest bookmarks appearing first.
import { sortBookmarks } from "./utils.js";


// Find the HTML elements that the application needs to interact with.
//
// document.querySelector() searches the HTML document for the first element
// matching the specified CSS selector. The # symbol selects an element by ID.
//
// These variables let the JavaScript read form values, update the bookmark list,
// respond to user interactions, and display status messages.

// The dropdown that allows the user to select which user's bookmarks to view.
const userSelect = document.querySelector("#user-select");

// The form used to submit a new bookmark.
const bookmarkForm = document.querySelector("#bookmark-form");

// The HTML element that will contain the displayed bookmark list.
const bookmarkList = document.querySelector("#bookmark-list");

// The element used to display messages, such as successful saves or errors.
const statusMessage = document.querySelector("#status-message");

// The input field where the user enters the website URL.
const urlInput = document.querySelector("#bookmark-url");

// The input field where the user enters the bookmark title.
const titleInput = document.querySelector("#bookmark-title");

// The input field where the user enters a description of the bookmark.
const descriptionInput = document.querySelector("#bookmark-description");


// Get the IDs of all users supported by the application.
// The getUserIds() function returns an array of user ID strings.
const userIds = getUserIds();

// Loop through every user ID in the array.
// For each ID, create a dropdown option so the user can select that account.
for (const userId of userIds) {

  // Create a new HTML <option> element.
  // This element represents one selectable entry in the dropdown.
  const option = document.createElement("option");

  // Set the option's value to the user ID.
  // This is the value that userSelect.value will contain when this option
  // is selected.
  option.value = userId;

  // Set the text displayed to the user in the dropdown.
  // Template literals allow the user ID to be inserted into the text.
  // For example, an ID of "1" produces the label "User 1".
  option.textContent = `User ${userId}`;

  // Add the new option to the user selection dropdown.
  // Each iteration adds another user without replacing existing options.
  userSelect.appendChild(option);
}


// Define a function that displays the bookmarks belonging to a particular user.
//
// userId identifies whose bookmarks should be displayed.
// The function retrieves the user's saved bookmarks, sorts them, and creates
// the necessary HTML elements to display each bookmark and its controls.
//
// This function is called when the selected user changes and after bookmarks
// are added or updated.
function renderBookmarks(userId) {

  // Clear the current bookmark list before displaying the selected user's data.
  //
  // Setting textContent to an empty string removes all existing child content.
  // This prevents bookmarks belonging to a previously selected user from
  // remaining visible when a different user is selected.
  bookmarkList.textContent = "";

  // Check whether the user selection is empty.
  // An empty string means that no valid user has been selected in the dropdown.
  if (userId === "") {

    // Create an HTML list item to display an informative message.
    const message = document.createElement("li");

    // Set the message shown to the user.
    message.textContent = "Choose a user to view their bookmarks.";

    // Add the message to the bookmark list so it appears on the page.
    bookmarkList.appendChild(message);

    // Stop the function here because there is no selected user whose
    // bookmarks can be retrieved.
    return;
  }

  // Retrieve the selected user's bookmarks from storage.
  //
  // getData(userId) reads the user's saved data from localStorage.
  // The nullish coalescing operator (??) provides an empty array if the
  // retrieved value is null or undefined.
  //
  // This allows the rest of the function to work with an array even when
  // the user has not saved any bookmarks yet.
  const bookmarks = getData(userId) ?? [];

  // Check whether the user has any bookmarks.
  // An array's length property indicates how many elements it contains.
  if (bookmarks.length === 0) {

    // Create a list item to explain that the user has no saved bookmarks.
    const message = document.createElement("li");

    // Set the message text.
    message.textContent = "This user has no bookmarks yet.";

    // Add the message to the list so the empty state is visible on the page.
    bookmarkList.appendChild(message);

    // Stop here because there are no bookmarks to display.
    return;
  }

  // Sort the bookmarks so the newest ones appear first.
  //
  // sortBookmarks() returns a sorted copy of the array rather than sorting
  // the original array in place. This means the original bookmarks array
  // remains in its existing order unless another operation changes it.
  const sortedBookmarks = sortBookmarks(bookmarks);

  // Loop through the sorted bookmarks one at a time.
  // The bookmark variable refers to the current bookmark object in each iteration.
  for (const bookmark of sortedBookmarks) {

    // Create a list item to hold all the elements for this bookmark.
    // Each bookmark will have its own title link, copy button, description,
    // timestamp, and like button.
    const listItem = document.createElement("li");


    // ------------------------------
    // Create the clickable bookmark title
    // ------------------------------

    // Create an HTML anchor (<a>) element.
    // An anchor provides a clickable link that can take the user to a website.
    const title = document.createElement("a");

    // Set the link destination to the URL saved in the bookmark object.
    title.href = bookmark.url;

    // Set the visible link text to the bookmark's title.
    // Using textContent inserts the title as text rather than interpreting it
    // as HTML markup.
    title.textContent = bookmark.title;

    // Open the linked website in a new browser tab or window.
    title.target = "_blank";

    // Add security-related link attributes.
    //
    // "noopener" prevents the opened page from accessing the originating page
    // through window.opener.
    //
    // "noreferrer" prevents the browser from sending referrer information
    // when navigating to the linked website. It also implies noopener behavior
    // in modern browsers.
    //
    // These attributes help protect the application when opening external links.
    title.rel = "noopener noreferrer";


    // ------------------------------
    // Create the Copy URL button
    // ------------------------------

    // Create a button that allows the user to copy the bookmark's URL.
    const copyButton = document.createElement("button");

    // Explicitly set the button type to "button".
    // This prevents it from acting as a submit button if it is placed inside
    // a form element.
    copyButton.type = "button";

    // Set the text displayed on the button.
    copyButton.textContent = "Copy URL";

    // Provide an accessible label describing what the button will copy.
    // The bookmark title is included so screen-reader users can distinguish
    // between the copy buttons for different bookmarks.
    copyButton.setAttribute("aria-label", `Copy URL for ${bookmark.title}`);

    // Listen for click events on the Copy URL button.
    //
    // The callback is async because copying text to the clipboard uses
    // a Promise that can be awaited.
    copyButton.addEventListener("click", async () => {

      // Use try/catch to handle cases where the browser cannot copy the URL.
      try {

        // Ask the browser's Clipboard API to copy the bookmark URL.
        //
        // await waits for the clipboard operation to succeed or fail before
        // continuing to the next line.
        // Clipboard access generally requires a secure context, such as HTTPS
        // or localhost, and may also depend on browser permissions.
        await navigator.clipboard.writeText(bookmark.url);

        // If copying succeeds, display a confirmation message.
        // The bookmark title is included to identify which URL was copied.
        statusMessage.textContent = `URL copied for "${bookmark.title}".`;

      } catch {

        // If the clipboard operation fails, tell the user that automatic
        // copying was unsuccessful.
        //
        // Include the actual URL in the message so the user can copy it manually.
        statusMessage.textContent = `Could not copy automatically. Copy this URL: ${bookmark.url}`;
      }
    });


    // ------------------------------
    // Create the bookmark description
    // ------------------------------

    // Create a paragraph element to display the bookmark's description.
    const description = document.createElement("p");

    // Insert the description stored in the bookmark object.
    // textContent displays the value as text rather than interpreting it as HTML.
    description.textContent = bookmark.description;


    // ------------------------------
    // Create and display the timestamp
    // ------------------------------

    // Create an HTML <time> element.
    // This element represents a date or time and can provide both a machine-readable
    // value and a human-readable display.
    const timestamp = document.createElement("time");

    // Convert the stored timestamp into a JavaScript Date object.
    //
    // The Date constructor accepts supported date strings and numeric timestamps.
    // In this application, new bookmarks receive numeric timestamps from Date.now().
    const date = new Date(bookmark.timestamp);

    // Set the dateTime property to an ISO 8601 date-time string.
    //
    // toISOString() produces a standardized UTC representation, such as:
    // "2026-08-23T10:00:00.000Z".
    //
    // This provides a machine-readable date value for the <time> element.
    // Note that toISOString() throws an error if date is invalid.
    timestamp.dateTime = date.toISOString();

    // Set the text displayed to the user.
    //
    // toLocaleString("en-GB") formats the date and time using the British
    // English locale conventions, such as day/month/year ordering.
    // The displayed time uses the browser's local time zone.
    //
    // Prefix the formatted value with "Created:" to explain what the date means.
    timestamp.textContent = `Created: ${date.toLocaleString("en-GB")}`;


    // ------------------------------
    // Create the Like button
    // ------------------------------

    // Create a button that allows the user to like the bookmark.
    const likeButton = document.createElement("button");

    // Set the type to "button" so it does not submit a surrounding form.
    likeButton.type = "button";

    // Set the button's initial text, including the current number of likes.
    //
    // The logical OR operator (||) provides 0 when bookmark.likes is falsy,
    // such as when it is undefined, null, or 0.
    //
    // This allows bookmarks that do not yet have a likes property to display
    // a count of zero.
    likeButton.textContent = `Like (${bookmark.likes || 0})`;

    // Provide an accessible label describing the action and the current count.
    // This gives screen-reader users more context than the word "Like" alone.
    likeButton.setAttribute(
      "aria-label",
      `Like ${bookmark.title}. ${bookmark.likes || 0} likes.`
    );

    // Listen for clicks on the Like button.
    // Every click increases the bookmark's like count by one and saves
    // the updated data.
    likeButton.addEventListener("click", () => {

      // Increase the current like count by one.
      //
      // If bookmark.likes is falsy, use 0 as the starting count.
      // Then add 1 and assign the result back to bookmark.likes.
      //
      // For example:
      //   undefined becomes 1
      //   0 becomes 1
      //   3 becomes 4
      bookmark.likes = (bookmark.likes || 0) + 1;

      // Save the updated bookmarks array for the selected user.
      //
      // The bookmark object belongs to the bookmarks array, so changing its
      // likes property also changes the corresponding object in that array.
      // setData() serializes the array and stores it in localStorage.
      //
      // This makes the updated like count persist across page reloads and
      // later visits in the same browser storage context.
      setData(userId, bookmarks);

      // Update the visible button text so the new like count appears immediately.
      likeButton.textContent = `Like (${bookmark.likes})`;

      // Update the accessible label so it matches the new count.
      likeButton.setAttribute(
        "aria-label",
        `Like ${bookmark.title}. ${bookmark.likes} likes.`
      );

      // Display a status message confirming the updated like count.
      statusMessage.textContent = `"${bookmark.title}" now has ${bookmark.likes} likes.`;
    });


    // ------------------------------
    // Add the bookmark elements to the list item
    // ------------------------------

    // Add the clickable title link to the list item.
    listItem.appendChild(title);

    // Add the Copy URL button.
    listItem.appendChild(copyButton);

    // Add the bookmark description.
    listItem.appendChild(description);

    // Add the timestamp.
    listItem.appendChild(timestamp);

    // Add the Like button.
    listItem.appendChild(likeButton);

    // Add the completed list item to the main bookmark list in the HTML.
    // This makes the current bookmark visible on the page.
    bookmarkList.appendChild(listItem);
  }
}


// ------------------------------
// Handle changes to the selected user
// ------------------------------

// Listen for the "change" event on the user dropdown.
// This event occurs when the user selects a different option.
userSelect.addEventListener("change", function () {

  // Read the value of the currently selected dropdown option.
  // Each option's value was set to the corresponding user ID earlier.
  const selectedUserId = userSelect.value;

  // Clear any previous status message so an old confirmation or error
  // does not remain visible after changing users.
  statusMessage.textContent = "";

  // Display the bookmarks belonging to the newly selected user.
  renderBookmarks(selectedUserId);
});


// Render the bookmarks for the dropdown's current value when the script runs.
//
// This initializes the bookmark list on page load.
// If the dropdown has no selected user, renderBookmarks() displays its
// prompt message instead.
renderBookmarks(userSelect.value);


// ------------------------------
// Handle submission of the bookmark form
// ------------------------------

// Listen for the form's "submit" event.
// This event occurs when the user submits the form, for example by clicking
// its submit button or pressing Enter in a suitable input field.
bookmarkForm.addEventListener("submit", function (event) {

  // Prevent the browser's default form-submission behavior.
  //
  // Normally, submitting a form can navigate to another page or reload
  // the current page. preventDefault() stops that behavior so JavaScript
  // can validate the inputs and save the bookmark without reloading.
  event.preventDefault();

  // Read the ID of the currently selected user.
  // The new bookmark will be saved under this user's stored data.
  const selectedUserId = userSelect.value;

  // Ensure a user has been selected before attempting to save a bookmark.
  if (selectedUserId === "") {

    // Tell the user that selecting a user is required.
    statusMessage.textContent = "Please select a user first.";

    // Move keyboard focus to the user dropdown to help the user correct
    // the problem without needing to search for the control.
    userSelect.focus();

    // Stop processing the form because there is no selected user.
    return;
  }


  // ------------------------------
  // Read and clean the form values
  // ------------------------------

  // Read the URL input and remove whitespace from its beginning and end.
  // trim() does not remove spaces from the middle of the string.
  const url = urlInput.value.trim();

  // Read the title and remove leading and trailing whitespace.
  const title = titleInput.value.trim();

  // Read the description and remove leading and trailing whitespace.
  const description = descriptionInput.value.trim();


  // ------------------------------
  // Validate the title and description
  // ------------------------------

  // Check whether either the title or the description is empty after trimming.
  //
  // A value containing only spaces becomes an empty string after trim(),
  // so it is rejected by this condition.
  //
  // Both fields are required for a bookmark to be saved.
  if (title === "" || description === "") {

    // Display an error message explaining which information is required.
    statusMessage.textContent = "Please enter a title and description.";

    // Use a conditional expression to choose which input should receive focus.
    //
    // If the title is empty, focus the title field.
    // Otherwise, the description must be empty, so focus the description field.
    //
    // This directs the user to the first missing required field.
    (title === "" ? titleInput : descriptionInput).focus();

    // Stop processing because the required fields are incomplete.
    return;
  }


  // ------------------------------
  // Validate the website URL
  // ------------------------------

  // Declare a variable that will hold the parsed URL object if validation succeeds.
  // It is declared outside the try block so it can be used later when creating
  // the new bookmark.
  let websiteUrl;

  // Attempt to parse the supplied string as a URL.
  // The URL constructor checks whether the value can be interpreted as a valid URL.
  try {

    // Create a URL object from the input string.
    // If the input is invalid or cannot be parsed as a URL, this can throw an error.
    websiteUrl = new URL(url);

  } catch {

    // If parsing fails, display a message explaining that a valid website URL
    // must be entered.
    statusMessage.textContent = "Please enter a valid website URL.";

    // Return focus to the URL field so the user can correct the input.
    urlInput.focus();

    // Stop processing because the URL could not be parsed.
    return;
  }

  // Check that the parsed URL uses either HTTP or HTTPS.
  //
  // The protocol property contains the URL's protocol, including the colon.
  // For example:
  //   "http://example.com"  has protocol "http:"
  //   "https://example.com" has protocol "https:"
  //
  // The logical AND operator (&&) means both conditions must be true
  // for the error branch to run: the protocol must not be HTTP and must
  // not be HTTPS.
  //
  // This prevents other protocols, such as "javascript:", from being accepted
  // as bookmark destinations.
  if (
    websiteUrl.protocol !== "http:" &&
    websiteUrl.protocol !== "https:"
  ) {

    // Display an error explaining which URL protocols are allowed.
    statusMessage.textContent = "Please enter a website URL starting with http:// or https://.";

    // Focus the URL field so the user can correct the address.
    urlInput.focus();

    // Stop processing because the URL uses an unsupported protocol.
    return;
  }


  // ------------------------------
  // Retrieve the user's existing bookmarks
  // ------------------------------

  // Retrieve the currently selected user's saved bookmarks.
  //
  // If getData() returns null or undefined, use an empty array instead.
  // This allows a new bookmark to be added even when the user has no
  // previously saved bookmarks.
  const bookmarks = getData(selectedUserId) ?? [];


  // ------------------------------
  // Create the new bookmark object
  // ------------------------------

  // Create an object containing all the information that should be saved
  // for the new bookmark.
  const newBookmark = {

    // Store the normalized URL from the URL object.
    // websiteUrl.href contains the URL as serialized by the URL API.
    // For example, it may normalize the URL's formatting.
    url: websiteUrl.href,

    // Store the cleaned title entered by the user.
    title: title,

    // Store the cleaned description entered by the user.
    description: description,

    // Record the time the bookmark is created.
    //
    // Date.now() returns the number of milliseconds elapsed since
    // January 1, 1970, at 00:00:00 UTC.
    // This numeric timestamp can later be used to sort bookmarks by date.
    timestamp: Date.now(),

    // Initialize the bookmark's like count to zero.
    likes: 0
  };


  // ------------------------------
  // Add and save the new bookmark
  // ------------------------------

  // Add the new bookmark object to the end of the existing bookmarks array.
  // push() modifies the array by adding the supplied element.
  bookmarks.push(newBookmark);

  // Save the updated bookmarks array for the selected user.
  //
  // setData() converts the array into a JSON string and stores it in
  // localStorage under a key associated with selectedUserId.
  // This allows the bookmark to remain available after the page is reloaded.
  setData(selectedUserId, bookmarks);


  // ------------------------------
  // Reset the form and refresh the page content
  // ------------------------------

  // Reset the form controls to their default values.
  // This clears the entered URL, title, and description if their defaults
  // are empty strings.
  bookmarkForm.reset();

  // Re-render the selected user's bookmarks.
  //
  // This refreshes the displayed list using the updated data.
  // The new bookmark will appear in the appropriate position because
  // renderBookmarks() sorts bookmarks with the newest first.
  renderBookmarks(selectedUserId);

  // Display a confirmation message indicating that the bookmark was saved
  // for the selected user.
  statusMessage.textContent = `Saved "${title}" for User ${selectedUserId}.`;
});
