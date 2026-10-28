// Import three functions from the data.mjs file.
// These functions provide access to the user IDs, listening events, and song information.
//
// getUserIDs() returns the IDs of the available users.
// getListenEvents(userID) returns the listening events for a particular user.
// getSong(songID) returns information about a particular song, such as its title,
// artist, genre, and duration.
import {
  getUserIDs,
  getListenEvents,
  getSong
} from "./data.mjs";


// Check whether the document object exists before trying to access the HTML page.
// The document object is provided by the browser and allows JavaScript to interact
// with HTML elements.
//
// typeof document !== "undefined" prevents an error if this file is imported or
// executed in an environment without a browser, such as Node.js during testing.
//
// If the document exists, querySelector("#userSelect") searches the HTML document
// for the element whose ID is "userSelect", which is expected to be a user dropdown.
//
// If the document does not exist, assign null instead.
const userSelect =
  typeof document !== "undefined"
    ? document.querySelector("#userSelect")
    : null;


// Find the HTML element where the results will be displayed.
//
// querySelector("#results") searches for the element with the ID "results".
// This element will contain the headings and answers generated for the selected user.
//
// If the code is running without a browser document, assign null.
const results =
  typeof document !== "undefined"
    ? document.querySelector("#results")
    : null;


// --------------------
// Populate the user dropdown
// --------------------

// Only populate the dropdown if the userSelect element was found.
// If it is null, skip this entire block to avoid accessing properties of null.
if (userSelect) {

  // Retrieve all available user IDs.
  // forEach() executes the callback once for every user ID in the returned array.
  // Each ID is passed to the callback as the userID parameter.
  getUserIDs().forEach(userID => {

    // Create a new HTML <option> element for this user.
    // Each option becomes an item that can be selected in the dropdown.
    const option = document.createElement("option");

    // Set the option's value to the current user ID.
    // This value is what the dropdown provides when the user selects this option.
    option.value = userID;

    // Set the visible text of the option to the user ID.
    // This is the text displayed to the user in the dropdown.
    option.textContent = userID;

    // Add the newly created option to the user dropdown.
    // appendChild() places the option inside the userSelect element.
    userSelect.appendChild(option);
  });


  // Listen for a "change" event on the dropdown.
  // This event occurs when the selected option changes.
  //
  // addEventListener() takes the event name ("change") and a callback function
  // that will run whenever the event occurs.
  userSelect.addEventListener("change", event => {

    // Read the value of the option currently selected in the dropdown.
    // event.target refers to the element that triggered the event,
    // which in this case is the userSelect dropdown.
    const userID = event.target.value;

    // Generate and display the listening statistics for the selected user.
    // renderResults() calculates the answers and adds them to the results element.
    renderResults(userID);
  });
}


// --------------------
// Shared calculations
// --------------------


// Define a reusable function for calculating totals grouped by a chosen key.
//
// events: an array of listening events to process.
// keyFunction: a function that determines which group each event belongs to.
//              For example, it can return a song ID, artist name, or genre.
// valueFunction: an optional function that determines how much each event
//                contributes to its group's total.
//                It defaults to () => 1, meaning each event contributes 1.
//
// This function can therefore count events or add another numeric value,
// such as the duration of each listened-to song.
function tallyMetrics(events, keyFunction, valueFunction = () => 1) {

  // Create an empty object to store the totals for each group.
  // Each property will use a group key, such as a song ID or artist name.
  // Its value will be the accumulated total for that group.
  const totals = {};


  // Process every event in the events array.
  // The callback receives one listening event at a time.
  events.forEach(event => {

    // Use keyFunction to determine which group this event belongs to.
    // For example, event => event.song_id returns the event's song ID.
    const key = keyFunction(event);

    // Use valueFunction to determine the numeric contribution of this event.
    // If no valueFunction was supplied, the default function returns 1.
    // This means the event contributes one listen when counting occurrences.
    const value = valueFunction(event);


    // Check whether this group already has a total.
    // If totals[key] is falsy, initialize it to 0.
    // This creates the starting total before adding the event's contribution.
    if (!totals[key]) {
      totals[key] = 0;
    }


    // Add the current event's contribution to the group's existing total.
    //
    // If value is 1, this counts another event.
    // If value is a song's duration, this adds that duration to the total.
    totals[key] += value;
  });


  // Return the completed object containing the totals for every group.
  // Example: { song1: 3, song2: 5 } means song1 occurred 3 times
  // and song2 occurred 5 times, assuming each event contributes 1.
  return totals;
}


// Define a function that finds the group with the highest total.
//
// totals: an object whose keys represent groups and whose values represent
// the totals calculated for those groups.
//
// The function returns an object containing the winning key and its total.
function getWinner(totals) {

  // Initialize the winning key to null.
  // This means no winner has been selected yet.
  let winner = null;

  // Initialize the highest total to 0.
  // Only totals greater than this value will become the current winner.
  let highestValue = 0;


  // Loop through each enumerable property key in the totals object.
  // For each key, totals[key] provides the corresponding numeric total.
  for (const key in totals) {

    // Check whether this group's total is greater than the highest total found so far.
    if (totals[key] > highestValue) {

      // Update the highest total because a larger value has been found.
      highestValue = totals[key];

      // Record the key belonging to the group with this new highest total.
      winner = key;
    }
  }


  // Return an object containing the winning key and its total.
  //
  // key: the group with the highest total, or null if no positive total was found.
  // count: the highest total found, or 0 if no positive total was found.
  //
  // The property is named count even when the total represents listening time
  // rather than the number of listens.
  return {
    key: winner,
    count: highestValue
  };
}


// --------------------
// Q1 - Most listened-to song
// --------------------


// Find the song a user listened to most frequently.
//
// userID: the ID of the user whose listening history should be analyzed.
//
// The function returns the song ID and its listen count in the format
// returned by getWinner(), or null if the user has no listening events.
function getMostListenedSong(userID) {

  // Retrieve all listening events associated with this user.
  const events = getListenEvents(userID);


  // If the user has no listening events, there is no most-listened-to song.
  // Return null to indicate that no result is available.
  if (events.length === 0) {
    return null;
  }


  // Count how many times each song appears in the listening events.
  //
  // The first argument is the array of events to analyze.
  // The second argument is a callback that returns the song ID for each event.
  // The third argument is omitted, so tallyMetrics() uses its default value of 1.
  // Therefore, each listening event adds one to the corresponding song's count.
  const counts = tallyMetrics(
    events,
    event => event.song_id
  );


  // Find the song ID with the highest listen count.
  // Return an object containing the winning song ID and its count.
  return getWinner(counts);
}


// Find the song that accounts for the greatest total listening time.
//
// Unlike getMostListenedSong(), this function does not simply count events.
// It adds the full duration of the song for every listening event.
//
// userID: the ID of the user whose listening history should be analyzed.
//
// Returns the song ID and total accumulated duration, or null if there are no events.
function getMostListenedSongByTime(userID) {

  // Retrieve all listening events for the selected user.
  const events = getListenEvents(userID);


  // If there are no events, there is no listening-time result to calculate.
  if (events.length === 0) {
    return null;
  }


  // Calculate the total listening duration for each song.
  const totals = tallyMetrics(

    // The array of listening events that should be processed.
    events,

    // Group each event by its song ID.
    // Events involving the same song will contribute to the same total.
    event => event.song_id,

    // Determine the contribution of each event by looking up the song's duration.
    // getSong(event.song_id) retrieves the song's information.
    // .duration_seconds accesses its duration in seconds.
    // That duration is added to the total for the corresponding song.
    event => getSong(event.song_id).duration_seconds
  );


  // Find the song with the greatest accumulated duration.
  // The returned count property represents total seconds in this function.
  return getWinner(totals);
}


// --------------------
// Q2 - Most listened-to artist
// --------------------


// Find the artist whose songs were listened to most frequently.
//
// userID: the ID of the user whose listening history should be analyzed.
//
// Returns the artist name and total number of listening events,
// or null if the user has no listening events.
function getMostListenedArtist(userID) {

  // Retrieve all listening events for this user.
  const events = getListenEvents(userID);


  // Return null if there is no listening data to analyze.
  if (events.length === 0) {
    return null;
  }


  // Count listening events grouped by artist rather than by individual song.
  const counts = tallyMetrics(
    events,

    // Look up the song associated with this listening event.
    // Then return its artist name.
    //
    // All events for songs by the same artist are grouped together,
    // even when the user listened to several different songs by that artist.
    event => getSong(event.song_id).artist
  );


  // Find the artist with the highest total number of listening events.
  return getWinner(counts);
}


// Find the artist whose songs account for the greatest total listening time.
//
// userID: the ID of the user whose listening history should be analyzed.
//
// Returns the artist name and accumulated duration in seconds,
// or null if the user has no listening events.
function getMostListenedArtistByTime(userID) {

  // Retrieve all listening events for this user.
  const events = getListenEvents(userID);


  // If there are no listening events, return null.
  if (events.length === 0) {
    return null;
  }


  // Calculate total listening time grouped by artist.
  const totals = tallyMetrics(
    events,

    // Determine the artist associated with each listening event.
    // This causes all songs by the same artist to share one total.
    event => getSong(event.song_id).artist,

    // Return the duration of the song associated with this event.
    // This duration is added to the total for that artist.
    event => getSong(event.song_id).duration_seconds
  );


  // Find the artist with the greatest accumulated listening duration.
  return getWinner(totals);
}


// --------------------
// Q3 - Friday night
// --------------------


// Determine whether a listening event occurred during the defined Friday-night period.
//
// timestamp: the timestamp associated with a listening event.
//
// This function defines Friday night as:
// - Friday from 17:00 onward.
// - Saturday before 04:00.
//
// It returns true if the timestamp falls within either period,
// and false otherwise.
function isFridayNight(timestamp) {

  // Convert the supplied timestamp into a JavaScript Date object.
  // Date provides methods for extracting the day of the week and hour.
  // The timestamp must be in a format that JavaScript's Date constructor can parse.
  const date = new Date(timestamp);

  // Get the day of the week as a number.
  // JavaScript uses 0 for Sunday, 1 for Monday, and so on through 6 for Saturday.
  const day = date.getDay();

  // Get the hour of the day using the local time zone of the JavaScript environment.
  // The result is an integer from 0 to 23.
  const hour = date.getHours();


  // Check whether the event occurred on Friday at 17:00 or later.
  // Friday is represented by 5.
  // hour >= 17 includes 17:00 through 23:59.
  if (day === 5 && hour >= 17) {
    return true;
  }


  // Check whether the event occurred on Saturday before 04:00.
  // Saturday is represented by 6.
  // hour < 4 includes 00:00 through 03:59.
  if (day === 6 && hour < 4) {
    return true;
  }


  // If neither condition matches, the event is outside the defined period.
  return false;
}


// Retrieve all listening events that occurred during Friday night.
//
// userID: the ID of the user whose listening events should be checked.
//
// Returns a filtered array containing only events that satisfy isFridayNight().
function getFridayNightEvents(userID) {

  // Retrieve all listening events for this user.
  const events = getListenEvents(userID);


  // filter() creates a new array containing only the elements for which
  // the callback returns true.
  //
  // For each event, pass its timestamp to isFridayNight().
  // Events that occurred during the defined Friday-night period are retained.
  return events.filter(
    event => isFridayNight(event.timestamp)
  );
}


// Find the song listened to most frequently during Friday night.
//
// userID: the ID of the user whose Friday-night listening history should be analyzed.
//
// Returns the song ID and number of listens during the defined period,
// or null if there are no Friday-night listening events.
function getMostListenedFridayNightSong(userID) {

  // Retrieve only the listening events that occurred during Friday night.
  const events = getFridayNightEvents(userID);


  // If there are no matching events, there is no result to return.
  if (events.length === 0) {
    return null;
  }


  // Count the number of Friday-night listening events for each song.
  const counts = tallyMetrics(
    events,

    // Group each event by its song ID.
    // The default valueFunction adds 1 for every event.
    event => event.song_id
  );


  // Find the song with the highest Friday-night listen count.
  return getWinner(counts);
}


// Find the song with the greatest total listening duration during Friday night.
//
// userID: the ID of the user whose Friday-night listening history should be analyzed.
//
// Returns the song ID and accumulated duration in seconds,
// or null if there are no Friday-night listening events.
function getMostListenedFridayNightSongByTime(userID) {

  // Retrieve the user's listening events from the defined Friday-night period.
  const events = getFridayNightEvents(userID);


  // Return null if no events occurred during this period.
  if (events.length === 0) {
    return null;
  }


  // Calculate total listening duration for each song during Friday night.
  const totals = tallyMetrics(
    events,

    // Group the events by song ID.
    event => event.song_id,

    // Use the song's duration in seconds as the contribution for each event.
    event => getSong(event.song_id).duration_seconds
  );


  // Return the song with the greatest accumulated listening duration.
  return getWinner(totals);
}


// --------------------
// Q5 - Longest listening streak
// --------------------


// Find the longest consecutive sequence of listening events involving the same song.
//
// userID: the ID of the user whose listening history should be analyzed.
//
// Returns an object containing the song ID and the length of the longest streak.
// Returns null if the user has no listening events.
//
// Important: this function assumes that events are already in chronological order.
// A streak is based on adjacent events in the array, not necessarily on consecutive days
// or on uninterrupted time.
function getLongestStreak(userID) {

  // Retrieve all listening events for this user.
  const events = getListenEvents(userID);


  // If there are no events, no streak exists.
  if (events.length === 0) {
    return null;
  }


  // Initialize the best-known streak using the first event.
  // Since at least one event exists, the initial streak length is 1.
  // bestSong stores the song ID belonging to the longest streak found so far.
  let bestSong = events[0].song_id;
  let bestStreak = 1;


  // Initialize the current streak using the first event.
  // currentSong records the song ID in the streak currently being examined.
  // currentStreak records how many consecutive events in this streak involve that song.
  let currentSong = events[0].song_id;
  let currentStreak = 1;


  // Start at index 1 because the first event was already used for initialization.
  // Continue through the rest of the events until every event has been examined.
  for (let i = 1; i < events.length; i++) {

    // Compare the current event's song ID with the song ID of the current streak.
    if (events[i].song_id === currentSong) {

      // The song matches the current streak.
      // Increase the streak length by one.
      currentStreak++;

    } else {

      // The song has changed, so the previous streak has ended.
      // Start a new streak with the song from the current event.
      currentSong = events[i].song_id;

      // The new streak begins with one event.
      currentStreak = 1;
    }


    // Check whether the current streak is longer than the best streak found so far.
    if (currentStreak > bestStreak) {

      // Update the longest streak length.
      bestStreak = currentStreak;

      // Record the song ID responsible for this new longest streak.
      bestSong = currentSong;
    }
  }


  // Return the song ID and length of the longest consecutive streak.
  //
  // songID: the ID of the song that produced the longest streak.
  // streak: the number of consecutive listening events involving that song.
  return {
    songID: bestSong,
    streak: bestStreak
  };
}


// --------------------
// Q6 - Songs listened to every day
// --------------------


// Extract the date portion of a timestamp.
//
// timestamp: a timestamp represented as a string.
//
// slice(0, 10) returns the characters starting at index 0 and ending
// immediately before index 10.
// For a timestamp such as "2025-03-14T18:30:00", the result is "2025-03-14".
//
// This assumes the timestamp string begins with a date in YYYY-MM-DD format.
function getDateOnly(timestamp) {

  // Return only the first ten characters, which represent the calendar date.
  return timestamp.slice(0, 10);
}


// Find all distinct dates represented in an array of listening events.
//
// events: an array of listening events, each containing a timestamp.
//
// Returns an array of unique date strings sorted in ascending order.
function getUniqueDates(events) {

  // Convert every listening event into its date-only string.
  // map() creates a new array by applying getDateOnly() to each event's timestamp.
  const dates = events.map(
    event => getDateOnly(event.timestamp)
  );


  // Create a Set from the dates array.
  // A Set stores each distinct value only once, automatically removing duplicates.
  //
  // The spread syntax (...) converts the Set back into an array.
  // sort() sorts the date strings in ascending order.
  // Because the dates use the YYYY-MM-DD format, alphabetical sorting also sorts
  // them chronologically, provided they consistently use that format.
  return [...new Set(dates)].sort();
}


// Find the songs that the user listened to on every date represented in their history.
//
// userID: the ID of the user whose listening history should be analyzed.
//
// Returns an array of song IDs that appear on every distinct listening date.
// Returns an empty array if the user has no listening events.
function getEverydaySongs(userID) {

  // Retrieve all listening events for this user.
  const events = getListenEvents(userID);


  // If there are no listening events, no song can qualify as an everyday song.
  // Return an empty array to indicate that no song IDs were found.
  if (events.length === 0) {
    return [];
  }


  // Retrieve all distinct dates on which the user listened to at least one song.
  const allDates = getUniqueDates(events);

  // Store the total number of distinct listening dates.
  // A song must appear on every one of these dates to qualify.
  const totalDays = allDates.length;


  // Create an empty object that will track the dates associated with each song.
  // Each property will use a song ID as its key and a Set of dates as its value.
  //
  // For example:
  // {
  //   song1: Set { "2025-03-14", "2025-03-15" },
  //   song2: Set { "2025-03-14" }
  // }
  const datesBySong = {};


  // Process every listening event.
  events.forEach(event => {

    // Extract the song ID from the current listening event.
    const songID = event.song_id;

    // Extract the date on which the listening event occurred.
    const date = getDateOnly(event.timestamp);


    // Check whether a Set of dates has already been created for this song.
    // If not, create an empty Set to store its listening dates.
    if (!datesBySong[songID]) {
      datesBySong[songID] = new Set();
    }


    // Add the current date to the Set for this song.
    // A Set stores each date only once, so listening to the same song
    // multiple times on one day does not increase the number of distinct dates.
    datesBySong[songID].add(date);
  });


  // Create an empty array to store the IDs of songs listened to on every date.
  const everydaySongIDs = [];


  // Loop through each song ID recorded in datesBySong.
  // Each song ID corresponds to a Set containing the dates on which it was heard.
  for (const songID in datesBySong) {

    // Compare the number of distinct dates for this song with the total number
    // of distinct listening dates in the user's history.
    //
    // If the numbers match, the song was listened to on every date represented
    // in the user's listening history.
    if (datesBySong[songID].size === totalDays) {

      // Add this song ID to the list of songs that qualify.
      everydaySongIDs.push(songID);
    }
  }


  // Return the array of song IDs that were listened to on every distinct date.
  // If no songs qualify, this returns an empty array.
  return everydaySongIDs;
}


// --------------------
// Q7 - Top genres
// --------------------


// Find the three most frequently listened-to genres for a user.
//
// userID: the ID of the user whose listening history should be analyzed.
//
// Returns an array containing up to three [genre, count] pairs,
// ordered from the most frequent genre to the least frequent.
// Returns an empty array if the user has no listening events.
function getTopGenres(userID) {

  // Retrieve all listening events for this user.
  const events = getListenEvents(userID);


  // If the user has no listening events, there are no genres to rank.
  if (events.length === 0) {
    return [];
  }


  // Count listening events grouped by genre.
  const counts = tallyMetrics(
    events,

    // Look up the song associated with each event and return its genre.
    // Events involving songs from the same genre are grouped together.
    // The default valueFunction adds 1 for each listening event.
    event => getSong(event.song_id).genre
  );


  // Convert the counts object into an array of [key, value] pairs.
  // For example, { Pop: 10, Rock: 6 } becomes [["Pop", 10], ["Rock", 6]].
  return Object.entries(counts)

    // Sort the genre pairs in descending order by their counts.
    // In each pair:
    // a[0] is the genre name and a[1] is its count.
    // b[1] - a[1] places the larger count before the smaller count.
    .sort((a, b) => b[1] - a[1])

    // Keep only the first three entries after sorting.
    // If fewer than three genres exist, return all available entries.
    .slice(0, 3);
}


// --------------------
// Formatting
// --------------------


// Convert a duration measured in seconds into a readable minutes-and-seconds string.
//
// seconds: the total duration in seconds.
//
// Returns a string such as "3m 25s" for 205 seconds.
function formatDuration(seconds) {

  // Divide the total seconds by 60 and round down to get the whole minutes.
  // Math.floor() removes the fractional part rather than rounding to the nearest minute.
  const minutes = Math.floor(seconds / 60);

  // Use the remainder operator (%) to find the seconds left over after
  // removing all complete minutes.
  // For example, 205 % 60 equals 25.
  const remainingSeconds = seconds % 60;


  // Return a template literal containing the minutes and remaining seconds.
  // The ${...} expressions insert the values into the resulting string.
  return `${minutes}m ${remainingSeconds}s`;
}


// Format the result of a most-listened-to-song calculation.
//
// result: an object containing a song ID in result.key and a listen count
// in result.count, or a falsy value if no result is available.
//
// Returns a readable string containing the song title, artist, and listen count,
// or null if no result was supplied.
function formatSongResult(result) {

  // Check whether a result exists.
  // If result is null or otherwise falsy, return null instead of trying to access it.
  if (!result) {
    return null;
  }


  // Look up the full song information using the song ID stored in result.key.
  const song = getSong(result.key);


  // Return a readable string containing:
  // - The song title.
  // - The artist name.
  // - The number of listens recorded in result.count.
  return `${song.title} — ${song.artist} (${result.count} listens)`;
}


// Format the result of a most-listened-to-song-by-time calculation.
//
// result: an object containing a song ID in result.key and the accumulated duration
// in seconds in result.count, or a falsy value if no result is available.
//
// Returns a readable song-and-duration string, or null if no result exists.
function formatSongTimeResult(result) {

  // If no result is available, return null.
  if (!result) {
    return null;
  }


  // Retrieve the song's information using the winning song ID.
  const song = getSong(result.key);


  // Return the song title, artist, and accumulated listening duration.
  // formatDuration() converts the duration in seconds into minutes and seconds.
  return `${song.title} — ${song.artist} (${formatDuration(result.count)})`;
}


// Format the result of a most-listened-to-artist calculation.
//
// result: an object containing the artist name in result.key and the number
// of listening events in result.count, or a falsy value if no result exists.
//
// Returns a readable artist-and-count string, or null if no result exists.
function formatArtistResult(result) {

  // Return null if there is no result to format.
  if (!result) {
    return null;
  }


  // Return the artist name and the number of listening events.
  // result.key contains the artist name, and result.count contains the listen count.
  return `${result.key} (${result.count} listens)`;
}


// Format the result of a most-listened-to-artist-by-time calculation.
//
// result: an object containing the artist name in result.key and the accumulated
// listening duration in seconds in result.count, or a falsy value if no result exists.
//
// Returns a readable artist-and-duration string, or null if no result exists.
function formatArtistTimeResult(result) {

  // Return null if there is no result to format.
  if (!result) {
    return null;
  }


  // Return the artist name and the accumulated listening duration.
  // formatDuration() converts the duration from seconds into minutes and seconds.
  return `${result.key} (${formatDuration(result.count)})`;
}


// Format the result of the longest listening streak calculation.
//
// result: an object containing the song ID in result.songID and the streak length
// in result.streak, or a falsy value if no result exists.
//
// Returns a readable description of the longest streak, or null if no result exists.
function formatLongestStreak(result) {

  // If the result is null or otherwise falsy, there is no streak to format.
  if (!result) {
    return null;
  }


  // Retrieve the song information using the song ID from the streak result.
  const song = getSong(result.songID);


  // Return the song title, artist, and length of the consecutive listening streak.
  return `${song.title} — ${song.artist} (${result.streak} consecutive listens)`;
}


// Format an array of song IDs representing songs listened to every day.
//
// songIDs: an array of song IDs returned by getEverydaySongs().
//
// Returns a comma-separated list of song titles and artists,
// or null if the array is empty.
function formatEverydaySongs(songIDs) {

  // Check whether the array contains any song IDs.
  // If it is empty, return null to indicate that there is no result to display.
  if (songIDs.length === 0) {
    return null;
  }


  // Convert each song ID into a readable song-and-artist string.
  return songIDs

    // map() processes each song ID in the array and returns a new array of strings.
    .map(songID => {

      // Look up the full song information for the current song ID.
      const song = getSong(songID);

      // Return the song title followed by the artist name.
      return `${song.title} — ${song.artist}`;
    })

    // Join all formatted song strings into one string separated by commas.
    // For example: "Song A — Artist A, Song B — Artist B".
    .join(", ");
}


// Format an array of genre/count pairs returned by getTopGenres().
//
// genres: an array of pairs, where each pair contains a genre name and its count.
// For example: [["Pop", 10], ["Rock", 6], ["Jazz", 4]].
//
// Returns a comma-separated list of genre names, or null if the array is empty.
function formatTopGenres(genres) {

  // If the array is empty, there are no genres to display.
  if (genres.length === 0) {
    return null;
  }


  // Convert each genre/count pair into its genre name.
  return genres

    // Each genre pair is an array:
    // genre[0] is the genre name.
    // genre[1] is the number of listening events for that genre.
    //
    // Return only genre[0], leaving the counts out of the displayed result.
    .map(genre => genre[0])

    // Combine the genre names into a single comma-separated string.
    .join(", ");
}


// --------------------
// Rendering
// --------------------


// Create and display one question-and-answer section in the results area.
//
// title: the heading text describing the question or statistic.
// answer: the formatted answer that should appear below the heading.
//
// If answer is falsy, nothing is rendered.
function renderQuestion(title, answer) {

  // Check whether an answer is available.
  // Values such as null or an empty string are falsy, so this prevents
  // empty question-and-answer sections from being displayed.
  if (!answer) {
    return;
  }


  // Create a new HTML <h2> element to display the question title.
  const heading = document.createElement("h2");

  // Set the visible text of the heading to the supplied title.
  // textContent inserts text rather than interpreting it as HTML.
  heading.textContent = title;


  // Create a new HTML <p> element to display the answer.
  const paragraph = document.createElement("p");

  // Set the paragraph's visible text to the formatted answer.
  const answerText = answer;
  paragraph.textContent = answerText;


  // Add the heading to the results element.
  // This makes the question title appear on the page.
  results.appendChild(heading);

  // Add the paragraph after the heading.
  // The final display contains the heading followed by its answer.
  results.appendChild(paragraph);
}


// Generate and display all listening statistics for a selected user.
//
// userID: the ID of the user whose statistics should be calculated and displayed.
//
// This function coordinates the calculations, formatting, and rendering
// for each question in the application.
function renderResults(userID) {

  // Retrieve all listening events for the selected user.
  // This is used first to check whether the user has any listening data.
  const events = getListenEvents(userID);


  // Clear any results left over from a previously selected user.
  // Setting innerHTML to an empty string removes the element's existing contents.
  // This ensures the new user's statistics do not appear alongside the previous user's.
  results.innerHTML = "";


  // Check whether the selected user has any listening events.
  if (events.length === 0) {

    // Display a message instead of attempting to calculate statistics.
    results.textContent = "This user didn't listen to any songs.";

    // Stop executing this function.
    // The return statement prevents the remaining calculations from running.
    return;
  }


  // --------------------
  // Q1 - Most listened-to song
  // --------------------

  // Calculate which song the user listened to most frequently.
  const mostListenedSong = getMostListenedSong(userID);


  // Display the result of the most-listened-to-song calculation.
  //
  // The first argument is the heading shown to the user.
  // The second argument converts the calculation result into a readable string.
  // If no result is available, formatSongResult() returns null and
  // renderQuestion() skips rendering the section.
  renderQuestion(
    "Most listened-to song",
    formatSongResult(mostListenedSong)
  );


  // Calculate which song accounts for the greatest total listening duration.
  const songByTime = getMostListenedSongByTime(userID);


  // Display the song with the greatest accumulated listening time.
  // formatSongTimeResult() formats the song title, artist, and duration.
  renderQuestion(
    "Most listened-to song by listening time",
    formatSongTimeResult(songByTime)
  );


  // --------------------
  // Q2 - Most listened-to artist
  // --------------------

  // Calculate which artist has the highest number of listening events.
  const mostListenedArtist = getMostListenedArtist(userID);


  // Display the artist with the greatest number of listening events.
  // formatArtistResult() converts the result into a readable string.
  renderQuestion(
    "Most listened-to artist",
    formatArtistResult(mostListenedArtist)
  );


  // Calculate which artist accounts for the greatest total listening duration.
  const artistByTime = getMostListenedArtistByTime(userID);


  // Display the artist with the greatest accumulated listening time.
  // formatArtistTimeResult() converts the duration into minutes and seconds.
  renderQuestion(
    "Most listened-to artist by listening time",
    formatArtistTimeResult(artistByTime)
  );


  // --------------------
  // Q3 - Friday night
  // --------------------

  // Find the song listened to most frequently during the defined Friday-night period.
  const fridayNightSong =
    getMostListenedFridayNightSong(userID);


  // Display the most frequently listened-to Friday-night song.
  // formatSongResult() formats the result in the same way as the general song result.
  renderQuestion(
    "Most listened-to song on Friday night",
    formatSongResult(fridayNightSong)
  );


  // Find the song with the greatest total listening duration during Friday night.
  const fridaySongByTime =
    getMostListenedFridayNightSongByTime(userID);


  // Display the Friday-night song with the greatest accumulated listening duration.
  renderQuestion(
    "Most listened-to Friday-night song by listening time",
    formatSongTimeResult(fridaySongByTime)
  );


  // --------------------
  // Q5 - Longest listening streak
  // --------------------

  // Calculate the longest consecutive sequence of listening events involving one song.
  const longestStreak = getLongestStreak(userID);


  // Display the song and the number of consecutive listens in the longest streak.
  // formatLongestStreak() converts the result into a readable string.
  renderQuestion(
    "Longest listening streak",
    formatLongestStreak(longestStreak)
  );


  // --------------------
  // Q6 - Songs listened to every day
  // --------------------

  // Find all songs that were listened to on every distinct date in the user's history.
  const everydaySongs = getEverydaySongs(userID);


  // Display the titles and artists of the qualifying songs.
  // formatEverydaySongs() combines the results into a comma-separated string.
  // If the array is empty, the formatter returns null and the section is skipped.
  renderQuestion(
    "Songs listened to every day",
    formatEverydaySongs(everydaySongs)
  );


  // --------------------
  // Q7 - Top genres
  // --------------------

  // Calculate the three most frequently listened-to genres.
  // The result is an array of genre/count pairs sorted by descending count.
  const topGenres = getTopGenres(userID);


  // Decide which heading to use based on the number of genres returned.
  //
  // If exactly one genre exists, use the singular title "Top genre".
  // Otherwise, use a template literal to include the number of genres.
  // For example, two genres produce "Top 2 genres".
  //
  // If no genres are returned, the title becomes "Top 0 genres".
  // The subsequent renderQuestion() call will skip the section because
  // formatTopGenres() returns null for an empty array.
  const genreTitle =
    topGenres.length === 1
      ? "Top genre"
      : `Top ${topGenres.length} genres`;


  // Display the selected genre heading and the comma-separated genre names.
  renderQuestion(
    genreTitle,
    formatTopGenres(topGenres)
  );
}


// --------------------
// Exports for testing
// --------------------

// Export selected functions so they can be imported by other JavaScript modules,
// including automated test files.
//
// Exporting these functions allows tests to call the calculations directly
// without having to interact with the HTML page or the user dropdown.
//
// The functions are exported by name, so another module can import only
// the functions it needs using named imports.
export {
  // Shared helper that groups events and calculates totals.
  tallyMetrics,

  // Shared helper that finds the key with the highest total.
  getWinner,

  // Q1: Find the most frequently listened-to song.
  getMostListenedSong,

  // Q1: Find the song with the greatest accumulated listening duration.
  getMostListenedSongByTime,

  // Q2: Find the artist with the most listening events.
  getMostListenedArtist,

  // Q2: Find the artist with the greatest accumulated listening duration.
  getMostListenedArtistByTime,

  // Q3: Find the song listened to most frequently during Friday night.
  getMostListenedFridayNightSong,

  // Q3: Find the Friday-night song with the greatest accumulated listening duration.
  getMostListenedFridayNightSongByTime,

  // Q5: Find the longest consecutive listening streak for a single song.
  getLongestStreak,

  // Q6: Find songs listened to on every distinct date in the user's history.
  getEverydaySongs,

  // Q7: Find the three most frequently listened-to genres.
  getTopGenres
};
