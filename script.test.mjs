
// Import strict assertions and the music statistics functions.
import assert from "node:assert/strict";
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

// Q1 — Most listened-to song.
assert.equal(getMostListenedSong("1").key, "song-8");
assert.equal(getMostListenedSong("2").key, "song-5");
assert.equal(getMostListenedSong("3").key, "song-2");

// Q1 — Most listened-to song by total listening time.
assert.equal(getMostListenedSongByTime("1").key, "song-7");
assert.equal(getMostListenedSongByTime("2").key, "song-5");
assert.equal(getMostListenedSongByTime("3").key, "song-7");

// Q2 — Most listened-to artist by listen count.
assert.equal(getMostListenedArtist("1").key, "Frank Turner");
assert.equal(getMostListenedArtist("2").key, "Frank Turner");
assert.equal(getMostListenedArtist("3").key, "Frank Turner");

// Q2 — Most listened-to artist by total listening time.
assert.equal(getMostListenedArtistByTime("1").key, "Frank Turner");
assert.equal(getMostListenedArtistByTime("2").key, "Frank Turner");
assert.equal(getMostListenedArtistByTime("3").key, "Frank Turner");

// Q3 — Most listened-to Friday-night song.
assert.equal(getMostListenedFridayNightSong("1").key, "song-8");
assert.equal(getMostListenedFridayNightSong("2").key, "song-5");
assert.equal(getMostListenedFridayNightSong("3"), null);

// Q3 — Friday-night song with the greatest total listening time.
assert.equal(getMostListenedFridayNightSongByTime("1").key, "song-8");
assert.equal(getMostListenedFridayNightSongByTime("2").key, "song-4");
assert.equal(getMostListenedFridayNightSongByTime("3"), null);

// Q5 — Longest consecutive listening streak.
assert.equal(getLongestStreak("1").songID, "song-1");
assert.equal(getLongestStreak("1").streak, 34);
assert.equal(getLongestStreak("2").songID, "song-5");
assert.equal(getLongestStreak("2").streak, 44);

// Check user 3's longest streak length.
const user3Streak = getLongestStreak("3");
assert.equal(user3Streak.streak, 42);

// Q6 — Songs listened to on every distinct listening date.
assert.deepEqual(getEverydaySongs("1"), ["song-8"]);
assert.deepEqual(getEverydaySongs("2"), ["song-4", "song-9"]);
assert.deepEqual(getEverydaySongs("3"), []);

// Q7 — Top genres ranked by listening-event count.
assert.deepEqual(
  getTopGenres("1").map(genre => genre[0]),
  ["Pop", "Folk", "Punk"]
);
assert.deepEqual(
  getTopGenres("2").map(genre => genre[0]),
  ["Pop"]
);
assert.deepEqual(
  getTopGenres("3").map(genre => genre[0]),
  ["Pop", "Folk", "House"]
);

// User 4 — Verify that empty listening data returns appropriate results.
assert.equal(getMostListenedSong("4"), null);
assert.equal(getMostListenedArtist("4"), null);
assert.equal(getMostListenedFridayNightSong("4"), null);
assert.deepEqual(getEverydaySongs("4"), []);
assert.deepEqual(getTopGenres("4"), []);

// Print a success message if all assertions pass.
console.log("All Music Data tests passed!");
