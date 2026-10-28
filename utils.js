
// Export the sortBookmarks function so it can be imported and used
// in other JavaScript modules.
//
// The function takes an array of bookmarks and returns a new array
// sorted by timestamp, with the newest bookmarks appearing first.
//
// bookmarks: an array of bookmark objects.
// Each bookmark is expected to have a timestamp property that contains
// a date or timestamp value that JavaScript's Date constructor can parse.
export function sortBookmarks(bookmarks) {

  // Create a shallow copy of the bookmarks array using the spread syntax (...).
  //
  // [...bookmarks] creates a new array containing the same bookmark objects
  // as the original array.
  //
  // This is important because the sort() method changes the array it is called on.
  // Sorting the copied array prevents the original bookmarks array from being
  // reordered, so other parts of the application can continue using it unchanged.
  return [...bookmarks].sort(

    // Provide a comparison function to determine the order of two bookmarks.
    //
    // The sort() method passes two elements to this callback:
    // a: the first bookmark being compared.
    // b: the second bookmark being compared.
    //
    // Each bookmark has a timestamp property that represents when it was created
    // or saved. The Date constructor converts each timestamp into a Date object.
    //
    // getTime() could also be used to retrieve each date's numeric value in
    // milliseconds, but subtracting Date objects directly performs this numeric
    // conversion automatically.
    //
    // new Date(b.timestamp) - new Date(a.timestamp) subtracts the timestamp
    // of bookmark a from the timestamp of bookmark b.
    //
    // If the result is negative, bookmark a is newer than bookmark b,
    // so a should appear before b.
    //
    // If the result is positive, bookmark b is newer than bookmark a,
    // so b should appear before a.
    //
    // If the result is zero, the timestamps are equal, so the comparison
    // function considers the two bookmarks equal for sorting purposes.
    //
    // This subtraction orders the bookmarks by descending timestamp,
    // meaning the most recent bookmark appears at the beginning of the array
    // and the oldest bookmark appears at the end.
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );
}
