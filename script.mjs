
// Import data access functions.
import {
  getUserIDs,
  getListenEvents,
  getSong
} from "./data.mjs";

// Get DOM elements if running in a browser.
const userSelect =
  typeof document !== "undefined"
    ? document.querySelector("#userSelect")
    : null;

const results =
  typeof document !== "undefined"
    ? document.querySelector("#results")
    : null;


// --------------------
// Populate user dropdown
// --------------------

if (userSelect) {
  // Add an option for each user ID.
  getUserIDs().forEach(userID => {
    const option = document.createElement("option");
    option.value = userID;
    option.textContent = userID;
    userSelect.appendChild(option);
  });

  // Display statistics when the selected user changes.
  userSelect.addEventListener("change", event => {
    const userID = event.target.value;
    renderResults(userID);
  });
}


// --------------------
// Shared calculations
// --------------------

// Group events by a key and sum their contributions.
function tallyMetrics(events, keyFunction, valueFunction = () => 1) {
  const totals = {};

  events.forEach(event => {
    const key = keyFunction(event);
    const value = valueFunction(event);

    // Initialize and update the group's total.
    if (!totals[key]) {
      totals[key] = 0;
    }

    totals[key] += value;
  });

  return totals;
}

// Find the key with the highest total.
function getWinner(totals) {
  let winner = null;
  let highestValue = 0;

  for (const key in totals) {
    if (totals[key] > highestValue) {
      highestValue = totals[key];
      winner = key;
    }
  }

  return {
    key: winner,
    count: highestValue
  };
}


// --------------------
// Q1 - Most listened-to song
// --------------------

// Find the song with the most listening events.
function getMostListenedSong(userID) {
  const events = getListenEvents(userID);

  if (events.length === 0) {
    return null;
  }

  const counts = tallyMetrics(
    events,
    event => event.song_id
  );

  return getWinner(counts);
}

// Find the song with the greatest total listening duration.
function getMostListenedSongByTime(userID) {
  const events = getListenEvents(userID);

  if (events.length === 0) {
    return null;
  }

  const totals = tallyMetrics(
    events,
    event => event.song_id,
    event => getSong(event.song_id).duration_seconds
  );

  return getWinner(totals);
}


// --------------------
// Q2 - Most listened-to artist
// --------------------

// Find the artist with the most listening events.
function getMostListenedArtist(userID) {
  const events = getListenEvents(userID);

  if (events.length === 0) {
    return null;
  }

  const counts = tallyMetrics(
    events,
    event => getSong(event.song_id).artist
  );

  return getWinner(counts);
}

// Find the artist with the greatest total listening duration.
function getMostListenedArtistByTime(userID) {
  const events = getListenEvents(userID);

  if (events.length === 0) {
    return null;
  }

  const totals = tallyMetrics(
    events,
    event => getSong(event.song_id).artist,
    event => getSong(event.song_id).duration_seconds
  );

  return getWinner(totals);
}


// --------------------
// Q3 - Friday night
// --------------------

// Check whether a timestamp falls between Friday 17:00 and Saturday 04:00.
function isFridayNight(timestamp) {
  const date = new Date(timestamp);
  const day = date.getDay();
  const hour = date.getHours();

  if (day === 5 && hour >= 17) {
    return true;
  }

  if (day === 6 && hour < 4) {
    return true;
  }

  return false;
}

// Return events occurring during Friday night.
function getFridayNightEvents(userID) {
  const events = getListenEvents(userID);

  return events.filter(
    event => isFridayNight(event.timestamp)
  );
}

// Find the most frequently listened-to song on Friday night.
function getMostListenedFridayNightSong(userID) {
  const events = getFridayNightEvents(userID);

  if (events.length === 0) {
    return null;
  }

  const counts = tallyMetrics(
    events,
    event => event.song_id
  );

  return getWinner(counts);
}

// Find the song with the greatest listening duration on Friday night.
function getMostListenedFridayNightSongByTime(userID) {
  const events = getFridayNightEvents(userID);

  if (events.length === 0) {
    return null;
  }

  const totals = tallyMetrics(
    events,
    event => event.song_id,
    event => getSong(event.song_id).duration_seconds
  );

  return getWinner(totals);
}


// --------------------
// Q5 - Longest listening streak
// --------------------

// Find the longest run of adjacent events featuring the same song.
// Events are assumed to be in chronological order.
function getLongestStreak(userID) {
  const events = getListenEvents(userID);

  if (events.length === 0) {
    return null;
  }

  // Initialize the current and longest streaks with the first event.
  let bestSong = events[0].song_id;
  let bestStreak = 1;
  let currentSong = events[0].song_id;
  let currentStreak = 1;

  // Track consecutive events featuring the same song.
  for (let i = 1; i < events.length; i++) {
    if (events[i].song_id === currentSong) {
      currentStreak++;
    } else {
      currentSong = events[i].song_id;
      currentStreak = 1;
    }

    // Save any new longest streak.
    if (currentStreak > bestStreak) {
      bestStreak = currentStreak;
      bestSong = currentSong;
    }
  }

  return {
    songID: bestSong,
    streak: bestStreak
  };
}


// --------------------
// Q6 - Songs listened to every day
// --------------------

// Extract the YYYY-MM-DD portion of a timestamp.
function getDateOnly(timestamp) {
  return timestamp.slice(0, 10);
}

// Return unique listening dates in chronological order.
function getUniqueDates(events) {
  const dates = events.map(
    event => getDateOnly(event.timestamp)
  );

  return [...new Set(dates)].sort();
}

// Find songs listened to on every date in the user's history.
function getEverydaySongs(userID) {
  const events = getListenEvents(userID);

  if (events.length === 0) {
    return [];
  }

  const allDates = getUniqueDates(events);
  const totalDays = allDates.length;

  // Track the unique dates associated with each song.
  const datesBySong = {};

  events.forEach(event => {
    const songID = event.song_id;
    const date = getDateOnly(event.timestamp);

    if (!datesBySong[songID]) {
      datesBySong[songID] = new Set();
    }

    datesBySong[songID].add(date);
  });

  const everydaySongIDs = [];

  // Include songs heard on every distinct listening date.
  for (const songID in datesBySong) {
    if (datesBySong[songID].size === totalDays) {
      everydaySongIDs.push(songID);
    }
  }

  return everydaySongIDs;
}


// --------------------
// Q7 - Top genres
// --------------------

// Return up to three genres ranked by listening-event count.
function getTopGenres(userID) {
  const events = getListenEvents(userID);

  if (events.length === 0) {
    return [];
  }

  const counts = tallyMetrics(
    events,
    event => getSong(event.song_id).genre
  );

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
}


// --------------------
// Formatting
// --------------------

// Convert seconds to a minutes-and-seconds string.
function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}m ${remainingSeconds}s`;
}

// Format a song result with its title, artist, and listen count.
function formatSongResult(result) {
  if (!result) {
    return null;
  }

  const song = getSong(result.key);

  return `${song.title} — ${song.artist} (${result.count} listens)`;
}

// Format a song result with its total listening duration.
function formatSongTimeResult(result) {
  if (!result) {
    return null;
  }

  const song = getSong(result.key);

  return `${song.title} — ${song.artist} (${formatDuration(result.count)})`;
}

// Format an artist result with its listen count.
function formatArtistResult(result) {
  if (!result) {
    return null;
  }

  return `${result.key} (${result.count} listens)`;
}

// Format an artist result with its total listening duration.
function formatArtistTimeResult(result) {
  if (!result) {
    return null;
  }

  return `${result.key} (${formatDuration(result.count)})`;
}

// Format the longest streak with its song details.
function formatLongestStreak(result) {
  if (!result) {
    return null;
  }

  const song = getSong(result.songID);

  return `${song.title} — ${song.artist} (${result.streak} consecutive listens)`;
}

// Format everyday song IDs as a comma-separated list.
function formatEverydaySongs(songIDs) {
  if (songIDs.length === 0) {
    return null;
  }

  return songIDs
    .map(songID => {
      const song = getSong(songID);
      return `${song.title} — ${song.artist}`;
    })
    .join(", ");
}

// Format genre/count pairs as a comma-separated list of genre names.
function formatTopGenres(genres) {
  if (genres.length === 0) {
    return null;
  }

  return genres
    .map(genre => genre[0])
    .join(", ");
}


// --------------------
// Rendering
// --------------------

// Display a question and its answer if the answer exists.
function renderQuestion(title, answer) {
  if (!answer) {
    return;
  }

  const heading = document.createElement("h2");
  heading.textContent = title;

  const paragraph = document.createElement("p");
  const answerText = answer;
  paragraph.textContent = answerText;

  results.appendChild(heading);
  results.appendChild(paragraph);
}

// Calculate, format, and display all statistics for a user.
function renderResults(userID) {
  const events = getListenEvents(userID);

  // Clear results from the previously selected user.
  results.innerHTML = "";

  if (events.length === 0) {
    results.textContent = "This user didn't listen to any songs.";
    return;
  }

  // Q1: Most listened-to song.
  const mostListenedSong = getMostListenedSong(userID);

  renderQuestion(
    "Most listened-to song",
    formatSongResult(mostListenedSong)
  );

  const songByTime = getMostListenedSongByTime(userID);

  renderQuestion(
    "Most listened-to song by listening time",
    formatSongTimeResult(songByTime)
  );

  // Q2: Most listened-to artist.
  const mostListenedArtist = getMostListenedArtist(userID);

  renderQuestion(
    "Most listened-to artist",
    formatArtistResult(mostListenedArtist)
  );

  const artistByTime = getMostListenedArtistByTime(userID);

  renderQuestion(
    "Most listened-to artist by listening time",
    formatArtistTimeResult(artistByTime)
  );

  // Q3: Friday-night listening.
  const fridayNightSong =
    getMostListenedFridayNightSong(userID);

  renderQuestion(
    "Most listened-to song on Friday night",
    formatSongResult(fridayNightSong)
  );

  const fridaySongByTime =
    getMostListenedFridayNightSongByTime(userID);

  renderQuestion(
    "Most listened-to Friday-night song by listening time",
    formatSongTimeResult(fridaySongByTime)
  );

  // Q5: Longest listening streak.
  const longestStreak = getLongestStreak(userID);

  renderQuestion(
    "Longest listening streak",
    formatLongestStreak(longestStreak)
  );

  // Q6: Songs listened to every day.
  const everydaySongs = getEverydaySongs(userID);

  renderQuestion(
    "Songs listened to every day",
    formatEverydaySongs(everydaySongs)
  );

  // Q7: Top genres.
  const topGenres = getTopGenres(userID);

  const genreTitle =
    topGenres.length === 1
      ? "Top genre"
      : `Top ${topGenres.length} genres`;

  renderQuestion(
    genreTitle,
    formatTopGenres(topGenres)
  );
}


// --------------------
// Exports for testing
// --------------------

// Export calculation helpers for use in tests and other modules.
export {
  tallyMetrics,
  getWinner,
  getMostListenedSong,
  getMostListenedSongByTime,
  getMostListenedArtist,
  getMostListenedArtistByTime,
  getMostListenedFridayNightSong,
  getMostListenedFridayNightSongByTime,
  getLongestStreak,
  getEverydaySongs,
  getTopGenres
};
