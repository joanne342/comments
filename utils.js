
// Export a function that sorts bookmarks by timestamp, newest first.
export function sortBookmarks(bookmarks) {
  // Sort a copy of the array to preserve the original order.
  return [...bookmarks].sort(
    // Compare timestamps in descending order.
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );
}
