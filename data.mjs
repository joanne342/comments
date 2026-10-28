
// Define and export a function that returns the IDs of all users
// available in this application's dataset.
//
// The export keyword allows other JavaScript files to import and use
// this function.
//
// Each user ID is represented as a string rather than a number.
// These IDs can be passed to other functions in this file to retrieve
// song information or listening events for a particular user.
export function getUserIDs() {

    // Return an array containing the four available user IDs.
    //
    // The array contains the strings "1", "2", "3", and "4".
    // Other functions can use these IDs to identify which user's
    // listening history should be retrieved.
    return ["1", "2", "3", "4"];
}


// Define and export a function that retrieves information about a song
// using its unique song ID.
//
// songID is the ID of the song we want to find.
// The function searches the song collection and returns the matching
// song object if one exists.
export function getSong(songID) {

    // Create an array containing the song information available
    // in the application's dataset.
    //
    // Each object represents one song and contains the following properties:
    //
    // id:
    //   A unique identifier used to look up the song.
    //
    // artist:
    //   The name of the artist or group that performs the song.
    //
    // title:
    //   The song's title.
    //
    // duration_seconds:
    //   The song's duration in seconds.
    //
    // genre:
    //   The musical genre assigned to the song.
    //
    // These objects provide the basic metadata needed by the application
    // to identify songs and display information about them.
    const songs = [

        // Song 1: "I Got Love" by The King Blues.
        {
            "id": "song-1",
            "artist": "The King Blues",
            "title": "I Got Love",
            "duration_seconds": 190,
            "genre": "Punk"
        },

        // Song 2: "Be More Kind" by Frank Turner.
        {
            "id": "song-2",
            "artist": "Frank Turner",
            "title": "Be More Kind",
            "duration_seconds": 247,
            "genre": "Pop"
        },

        // Song 3: "The Ballad of Me and My Friends" by Frank Turner.
        {
            "id": "song-3",
            "artist": "Frank Turner",
            "title": "The Ballad of Me and My Friends",
            "duration_seconds": 153,
            "genre": "Folk"
        },

        // Song 4: "Photosynthesis" by Frank Turner.
        {
            "id": "song-4",
            "artist": "Frank Turner",
            "title": "Photosynthesis",
            "duration_seconds": 254,
            "genre": "Pop"
        },

        // Song 5: "I Still Believe" by Frank Turner.
        {
            "id": "song-5",
            "artist": "Frank Turner",
            "title": "I Still Believe",
            "duration_seconds": 227,
            "genre": "Pop"
        },

        // Song 6: "Go!" by Public Service Broadcasting.
        {
            "id": "song-6",
            "artist": "Public Service Broadcasting",
            "title": "Go!",
            "duration_seconds": 253,
            "genre": "Alternative"
        },

        // Song 7: "Insomnia" by Faithless.
        {
            "id": "song-7",
            "artist": "Faithless",
            "title": "Insomnia",
            "duration_seconds": 518,
            "genre": "House"
        },

        // Song 8: "When Your Mind's Made Up" by The Swell Season.
        {
            "id": "song-8",
            "artist": "The Swell Season",
            "title": "When Your Mind's Made Up",
            "duration_seconds": 221,
            "genre": "Folk"
        },

        // Song 9: "Tonight We Fly" by The Divine Comedy.
        {
            "id": "song-9",
            "artist": "The Divine Comedy",
            "title": "Tonight We Fly",
            "duration_seconds": 181,
            "genre": "Pop"
        },

        // Song 10: "As Is" by Ani DiFranco.
        {
            "id": "song-10",
            "artist": "Ani DiFranco",
            "title": "As Is",
            "duration_seconds": 246,
            "genre": "Pop"
        }
    ];

    // Search the songs array for the song whose ID matches songID.
    //
    // The find() method examines the array from beginning to end.
    // For each song, the arrow function checks whether song.id is
    // strictly equal (===) to the supplied songID.
    //
    // As soon as a matching song is found, find() returns that song object.
    // If no song has the requested ID, find() returns undefined.
    //
    // For example:
    //   getSong("song-1") returns the object for "I Got Love".
    //   getSong("song-7") returns the object for "Insomnia".
    //   getSong("song-99") returns undefined.
    return songs.find(song => song.id === songID);
}


// Define and export a function that retrieves the listening events
// associated with a particular user.
//
// userID identifies the user whose listening history is requested.
// The function looks up that user's events in a dataset organized by user ID.
//
// A listening event represents a recorded occasion when a user listened
// to a particular song. Each event includes a timestamp, the number of
// seconds since midnight, and the ID of the song that was played.
export function getListenEvents(userID) {

    // Create an object containing listening-event data grouped by user ID.
    //
    // Each property name ("1", "2", "3", or "4") identifies a user.
    // The corresponding value is an array of listening-event objects.
    //
    // Each event object contains:
    //
    // timestamp:
    //   A date-and-time string indicating when the listening event occurred.
    //
    // seconds_since_midnight:
    //   The number of seconds elapsed since midnight on that date.
    //   This value can be useful for analyzing listening patterns throughout
    //   the day, such as which hours a user listens to music most often.
    //
    // song_id:
    //   The unique ID of the song associated with the listening event.
    //   This ID can be passed to getSong() to retrieve the song's metadata.
    //
    // The data shown in the original snippet has been truncated, so the
    // complete contents of the listening-event arrays are not visible here.
    // Keep the complete original dataset in this object when using the code.
    return {

        // User "1" has an array of listening events.
        //
        // Each object records one event. The events shown in the supplied
        // snippet include examples such as:
        //
        // {
        //   timestamp: "2024-08-01T00:20:07",
        //   seconds_since_midnight: 1207,
        //   song_id: "song-9"
        // }
        //
        // This example records a listening event shortly after midnight
        // on August 1, 2024, involving the song identified by "song-9".
        //
        // IMPORTANT: Insert the complete original array for user "1" here.
        // Its contents cannot be reconstructed from the truncated snippet.
        "1": [
            // Original listening-event objects for user "1" go here.
        ],

        // User "2" has their own array of listening events.
        // Keep the complete original array for this user here.
        "2": [
            // Original listening-event objects for user "2" go here.
        ],

        // User "3" has their own array of listening events.
        // Keep the complete original array for this user here.
        "3": [
            // Original listening-event objects for user "3" go here.
        ],

        // User "4" has an empty array in the supplied snippet.
        // This indicates that no listening events are recorded for this user
        // in the visible dataset.
        "4": []

    // Use the supplied userID to retrieve the corresponding array.
    //
    // The square-bracket notation accesses an object property dynamically.
    // For example, if userID is "1", this expression returns the array
    // stored under the "1" property.
    //
    // If userID does not match an existing property, the expression returns
    // undefined because no matching user entry exists.
    }[userID];
}

