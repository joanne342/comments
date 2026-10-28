
import { getUserIds, getData, setData } from "./storage.js";
import { sortBookmarks } from "./utils.js";

// Get the required HTML elements.
const userSelect = document.querySelector("#user-select");
const bookmarkForm = document.querySelector("#bookmark-form");
const bookmarkList = document.querySelector("#bookmark-list");
const statusMessage = document.querySelector("#status-message");
const urlInput = document.querySelector("#bookmark-url");
const titleInput = document.querySelector("#bookmark-title");
const descriptionInput = document.querySelector("#bookmark-description");

// Populate the user dropdown with available user IDs.
const userIds = getUserIds();

for (const userId of userIds) {
  const option = document.createElement("option");
  option.value = userId;
  option.textContent = `User ${userId}`;
  userSelect.appendChild(option);
}

// Display the selected user's bookmarks and their controls.
function renderBookmarks(userId) {
  bookmarkList.textContent = "";

  if (userId === "") {
    const message = document.createElement("li");
    message.textContent = "Choose a user to view their bookmarks.";
    bookmarkList.appendChild(message);
    return;
  }

  const bookmarks = getData(userId) ?? [];

  if (bookmarks.length === 0) {
    const message = document.createElement("li");
    message.textContent = "This user has no bookmarks yet.";
    bookmarkList.appendChild(message);
    return;
  }

  // Sort bookmarks with the newest first.
  const sortedBookmarks = sortBookmarks(bookmarks);

  for (const bookmark of sortedBookmarks) {
    const listItem = document.createElement("li");

    // Create a secure external link for the bookmark title.
    const title = document.createElement("a");
    title.href = bookmark.url;
    title.textContent = bookmark.title;
    title.target = "_blank";
    title.rel = "noopener noreferrer";

    // Create a button to copy the bookmark URL.
    const copyButton = document.createElement("button");
    copyButton.type = "button";
    copyButton.textContent = "Copy URL";
    copyButton.setAttribute("aria-label", `Copy URL for ${bookmark.title}`);

    copyButton.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(bookmark.url);
        statusMessage.textContent = `URL copied for "${bookmark.title}".`;
      } catch {
        statusMessage.textContent =
          `Could not copy automatically. Copy this URL: ${bookmark.url}`;
      }
    });

    // Display the bookmark description.
    const description = document.createElement("p");
    description.textContent = bookmark.description;

    // Display the creation date and time.
    const timestamp = document.createElement("time");
    const date = new Date(bookmark.timestamp);
    timestamp.dateTime = date.toISOString();
    timestamp.textContent = `Created: ${date.toLocaleString("en-GB")}`;

    // Create a button showing the current like count.
    const likeButton = document.createElement("button");
    likeButton.type = "button";
    likeButton.textContent = `Like (${bookmark.likes || 0})`;
    likeButton.setAttribute(
      "aria-label",
      `Like ${bookmark.title}. ${bookmark.likes || 0} likes.`
    );

    likeButton.addEventListener("click", () => {
      // Increment the like count and persist the updated bookmarks.
      bookmark.likes = (bookmark.likes || 0) + 1;
      setData(userId, bookmarks);

      likeButton.textContent = `Like (${bookmark.likes})`;
      likeButton.setAttribute(
        "aria-label",
        `Like ${bookmark.title}. ${bookmark.likes} likes.`
      );

      statusMessage.textContent =
        `"${bookmark.title}" now has ${bookmark.likes} likes.`;
    });

    // Assemble and display the bookmark item.
    listItem.appendChild(title);
    listItem.appendChild(copyButton);
    listItem.appendChild(description);
    listItem.appendChild(timestamp);
    listItem.appendChild(likeButton);
    bookmarkList.appendChild(listItem);
  }
}

// Refresh the bookmark list when the selected user changes.
userSelect.addEventListener("change", () => {
  statusMessage.textContent = "";
  renderBookmarks(userSelect.value);
});

// Display bookmarks for the initially selected user.
renderBookmarks(userSelect.value);

// Validate and save submitted bookmarks.
bookmarkForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const selectedUserId = userSelect.value;

  if (selectedUserId === "") {
    statusMessage.textContent = "Please select a user first.";
    userSelect.focus();
    return;
  }

  // Trim whitespace from the form values.
  const url = urlInput.value.trim();
  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();

  // Require a title and description.
  if (title === "" || description === "") {
    statusMessage.textContent = "Please enter a title and description.";
    (title === "" ? titleInput : descriptionInput).focus();
    return;
  }

  // Parse the URL and report invalid input.
  let websiteUrl;

  try {
    websiteUrl = new URL(url);
  } catch {
    statusMessage.textContent = "Please enter a valid website URL.";
    urlInput.focus();
    return;
  }

  // Allow only HTTP and HTTPS website URLs.
  if (
    websiteUrl.protocol !== "http:" &&
    websiteUrl.protocol !== "https:"
  ) {
    statusMessage.textContent =
      "Please enter a website URL starting with http:// or https://.";
    urlInput.focus();
    return;
  }

  // Retrieve the user's existing bookmarks.
  const bookmarks = getData(selectedUserId) ?? [];

  // Create the new bookmark with its timestamp and initial like count.
  const newBookmark = {
    url: websiteUrl.href,
    title,
    description,
    timestamp: Date.now(),
    likes: 0
  };

  // Save the new bookmark alongside the existing entries.
  bookmarks.push(newBookmark);
  setData(selectedUserId, bookmarks);

  // Reset the form and refresh the displayed bookmarks.
  bookmarkForm.reset();
  renderBookmarks(selectedUserId);

  statusMessage.textContent =
    `Saved "${title}" for User ${selectedUserId}.`;
});
