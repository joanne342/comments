// Import the strict assertion module from Node.js.
// This module provides functions for checking whether actual values match
// expected values in tests.
//
// The strict version uses strict comparison rules, so values of different types
// are not treated as equal. For example, the number 4 is not equal to the string "4".
import assert from "node:assert/strict";


// Import the functions that will be tested from script.mjs.
//
// Each function calculates a statistic based on a user's music listening history:
//
// getMostListenedSong() finds the song with the highest number of listens.
// getMostListenedSongByTime() finds the song with the greatest total listening time.
// getMostListenedArtist() finds the artist with the highest number of listens.
// getMostListenedArtistByTime() finds the artist with the greatest total listening time.
// getMostListenedFridayNightSong() finds the most frequently listened-to Friday-night song.
// getMostListenedFridayNightSongByTime() finds the Friday-night song with the greatest
// total listening time.
// getLongestStreak() finds the longest sequence of consecutive listens to one song.
// getEverydaySongs() finds songs listened to on every distinct listening date.
// getTopGenres() finds the most frequently listened-to genres.
//
// These functions are imported so their actual results can be compared
// against the expected results using assertions.
import {
  getMostListenedSong,
  getMostListenedSongByTime,
  getMostListenedArtist,
  getMostListenedArtistByTime,
  getMostListenedFridayNightSong,
  getMostListenedFridayNightSongByTime,
  getLongestStreak,
  getEverydaySongs,
  getTopGenres
} from "./script.mjs";


// --------------------
// Q1 — Most listened-to song
// --------------------

// Test the most frequently listened-to song for user 1.
//
// getMostListenedSong("1") calculates the song with the highest listen count
// for the user whose ID is the string "1".
//
// The .key property contains the ID of the winning song.
// assert.equal() checks that this ID matches the expected value, "song-8".
// If the IDs differ, the assertion throws an error and the test run fails.
assert.equal(
  getMostListenedSong("1").key,
  "song-8"
);


// Test the most frequently listened-to song for user 2.
//
// The expected result is "song-5".
// This verifies that the function selects the correct song for this user's history.
assert.equal(
  getMostListenedSong("2").key,
  "song-5"
);


// Test the most frequently listened-to song for user 3.
//
// The expected result is "song-2".
// This checks that the function also produces the correct result for a third user.
assert.equal(
  getMostListenedSong("3").key,
  "song-2"
);


// --------------------
// Q1 — Most listened-to song by listening time
// --------------------

// Test which song accounts for the greatest total listening duration for user 1.
//
// Unlike the previous tests, this function compares accumulated listening time
// rather than simply counting the number of listening events.
// The .key property contains the ID of the song with the greatest total duration.
//
// The expected song is "song-7".
assert.equal(
  getMostListenedSongByTime("1").key,
  "song-7"
);


// Test the song with the greatest total listening duration for user 2.
//
// The expected result is "song-5".
assert.equal(
  getMostListenedSongByTime("2").key,
  "song-5"
);


// Test the song with the greatest total listening duration for user 3.
//
// The expected result is "song-7".
assert.equal(
  getMostListenedSongByTime("3").key,
  "song-7"
);


// --------------------
// Q2 — Most listened-to artist
// --------------------

// Test which artist has the highest number of listening events for user 1.
//
// The function groups listening events by artist, so listens to different songs
// by the same artist contribute to the same artist total.
//
// The .key property contains the name of the winning artist.
// The expected artist is "Frank Turner".
assert.equal(
  getMostListenedArtist("1").key,
  "Frank Turner"
);


// Test the most frequently listened-to artist for user 2.
//
// The expected artist is also "Frank Turner".
assert.equal(
  getMostListenedArtist("2").key,
  "Frank Turner"
);


// Test the most frequently listened-to artist for user 3.
//
// This verifies that the same artist also has the highest listen count
// in the third user's listening history.
assert.equal(
  getMostListenedArtist("3").key,
  "Frank Turner"
);


// --------------------
// Q2 — Most listened-to artist by listening time
// --------------------

// Test which artist accounts for the greatest accumulated listening duration
// for user 1.
//
// This checks listening time rather than the number of listening events.
// The expected winning artist is "Frank Turner".
assert.equal(
  getMostListenedArtistByTime("1").key,
  "Frank Turner"
);


// Test the artist with the greatest total listening duration for user 2.
//
// The expected result is "Frank Turner".
assert.equal(
  getMostListenedArtistByTime("2").key,
  "Frank Turner"
);


// Test the artist with the greatest total listening duration for user 3.
//
// The expected result is also "Frank Turner".
assert.equal(
  getMostListenedArtistByTime("3").key,
  "Frank Turner"
);


// --------------------
// Q3 — Most listened-to Friday-night song
// --------------------

// Test the most frequently listened-to song during Friday night for user 1.
//
// The function considers only listening events that fall within the defined
// Friday-night period: Friday from 17:00 onward and Saturday before 04:00.
//
// The .key property contains the ID of the most frequently listened-to song
// during that period.
// The expected result is "song-8".
assert.equal(
  getMostListenedFridayNightSong("1").key,
  "song-8"
);


// Test the most frequently listened-to Friday-night song for user 2.
//
// The expected result is "song-5".
assert.equal(
  getMostListenedFridayNightSong("2").key,
  "song-5"
);


// Test the result for user 3 when no Friday-night listening events are available.
//
// In this case, the function is expected to return null because it cannot identify
// a most-listened-to song without any matching events.
//
// The assertion compares the entire return value with null.
// It does not try to access .key, because null has no properties.
assert.equal(
  getMostListenedFridayNightSong("3"),
  null
);


// --------------------
// Q3 — Friday-night song by listening time
// --------------------

// Test which song accounts for the greatest total listening duration
// during Friday night for user 1.
//
// The calculation considers only events within the defined Friday-night period.
// The expected winning song is "song-8".
assert.equal(
  getMostListenedFridayNightSongByTime("1").key,
  "song-8"
);


// Test the Friday-night song with the greatest accumulated listening duration
// for user 2.
//
// This result may differ from the most frequently listened-to song because
// the function compares total duration rather than the number of events.
// The expected result is "song-4".
assert.equal(
  getMostListenedFridayNightSongByTime("2").key,
  "song-4"
);


// Test the result for user 3 when there are no Friday-night listening events.
//
// The function should return null when no matching events exist.
// Comparing the complete return value with null verifies that behavior.
assert.equal(
  getMostListenedFridayNightSongByTime("3"),
  null
);


// --------------------
// Q5 — Longest consecutive listening streak
// --------------------

// Test the song ID belonging to user 1's longest listening streak.
//
// getLongestStreak("1") returns an object containing two properties:
// - songID: the ID of the song involved in the longest streak.
// - streak: the number of consecutive listening events involving that song.
//
// This assertion checks that the winning song is "song-1".
assert.equal(
  getLongestStreak("1").songID,
  "song-1"
);


// Test the length of user 1's longest listening streak.
//
// The expected streak length is 34 consecutive listening events.
// This checks the streak length separately from the song ID.
assert.equal(
  getLongestStreak("1").streak,
  34
);


// Test the song ID belonging to user 2's longest listening streak.
//
// The expected song is "song-5".
assert.equal(
  getLongestStreak("2").songID,
  "song-5"
);


// Test the length of user 2's longest listening streak.
//
// The expected result is 44 consecutive listening events.
assert.equal(
  getLongestStreak("2").streak,
  44
);


// Store user 3's longest-streak result in a variable.
//
// This avoids calling getLongestStreak("3") separately for every assertion
// about this user's result.
//
// The returned object can now be reused to check multiple properties.
const user3Streak = getLongestStreak("3");


// Verify that user 3's longest listening streak contains 42 consecutive events.
//
// This assertion checks the streak length.
// Unlike the earlier tests for users 1 and 2, this test does not check
// the song ID associated with user 3's longest streak.
assert.equal(
  user3Streak.streak,
  42
);


// --------------------
// Q6 — Songs listened to every day
// --------------------

// Test which songs user 1 listened to on every distinct date in their history.
//
// getEverydaySongs("1") returns an array of song IDs.
// The expected array contains only "song-8".
//
// assert.deepEqual() compares the contents of arrays and objects,
// rather than checking whether two variables refer to the exact same array object.
// For arrays, it checks that the expected elements match in the expected order.
assert.deepEqual(
  getEverydaySongs("1"),
  ["song-8"]
);


// Test the songs listened to every day by user 2.
//
// The expected result contains two song IDs: "song-4" and "song-9".
//
// The array order matters for this assertion.
// The actual array must match the expected array in both contents and order.
assert.deepEqual(
  getEverydaySongs("2"),
  ["song-4", "song-9"]
);


// Test the result for user 3.
//
// The expected result is an empty array, meaning that no song qualifies
// as having been listened to on every distinct date in this user's history.
//
// This assertion verifies both that the result is an array and that it
// contains no song IDs.
assert.deepEqual(
  getEverydaySongs("3"),
  []
);


// --------------------
// Q7 — Top genres
// --------------------

// Test the three most frequently listened-to genres for user 1.
//
// getTopGenres("1") returns an array of pairs.
// Each pair contains a genre name at index 0 and its listening-event count at index 1.
//
// For example:
// [["Pop", 10], ["Folk", 7], ["Punk", 4]]
//
// The .map() method creates a new array containing only the genre names.
// For each genre pair, genre => genre[0] extracts the genre name and ignores its count.
//
// The assertion therefore checks the names and their order, without checking
// the individual listening counts.
//
// The expected top genres are Pop, Folk, and Punk, in that order.
assert.deepEqual(
  getTopGenres("1").map(genre => genre[0]),
  ["Pop", "Folk", "Punk"]
);


// Test the top genres for user 2.
//
// Only one genre is expected: "Pop".
// This verifies that the function can return fewer than three genres
// when the user's listening history contains only one distinct genre.
assert.deepEqual(
  getTopGenres("2").map(genre => genre[0]),
  ["Pop"]
);


// Test the top genres for user 3.
//
// The expected genres, in descending order of listening-event count, are
// Pop, Folk, and House.
assert.deepEqual(
  getTopGenres("3").map(genre => genre[0]),
  ["Pop", "Folk", "House"]
);


// --------------------
// User 4 — No listening data
// --------------------

// The following tests verify how the functions behave when user 4 has no
// listening events.
//
// These checks are important because functions should handle empty data
// without trying to access properties of missing results or producing
// incorrect statistics.


// Check that getMostListenedSong() returns null for user 4.
//
// Since there are no listening events, there cannot be a most-listened-to song.
// The expected result is null.
assert.equal(
  getMostListenedSong("4"),
  null
);


// Check that getMostListenedArtist() returns null for user 4.
//
// With no listening events, there is no artist to rank by listen count.
assert.equal(
  getMostListenedArtist("4"),
  null
);


// Check that getMostListenedFridayNightSong() returns null for user 4.
//
// Since user 4 has no listening events at all, there are also no Friday-night
// listening events to analyze.
assert.equal(
  getMostListenedFridayNightSong("4"),
  null
);


// Check that getEverydaySongs() returns an empty array for user 4.
//
// No songs can qualify as songs listened to every day when there is no
// listening history to analyze.
//
// The function is expected to return [] rather than null.
assert.deepEqual(
  getEverydaySongs("4"),
  []
);


// Check that getTopGenres() returns an empty array for user 4.
//
// With no listening events, there are no genre counts to calculate or rank.
// The expected result is an empty array.
assert.deepEqual(
  getTopGenres("4"),
  []
);


// --------------------
// Test completion message
// --------------------

// Print a success message to the console after all assertions have passed.
//
// If any assertion above fails, it throws an error and interrupts normal
// execution before this line is reached.
//
// Therefore, seeing this message indicates that all assertions in this file
// completed successfully.
console.log("All Music Data tests passed!");
