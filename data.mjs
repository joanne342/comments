
// Return the IDs of all available users.
export function getUserIDs() {
    return ["1", "2", "3", "4"];
}

// Return song information matching the given song ID.
export function getSong(songID) {
    // Store the available songs and their metadata.
    const songs = [
        {
            "id": "song-1",
            "artist": "The King Blues",
            "title": "I Got Love",
            "duration_seconds": 190,
            "genre": "Punk"
        },
        {
            "id": "song-2",
            "artist": "Frank Turner",
            "title": "Be More Kind",
            "duration_seconds": 247,
            "genre": "Pop"
        },
        {
            "id": "song-3",
            "artist": "Frank Turner",
            "title": "The Ballad of Me and My Friends",
            "duration_seconds": 153,
            "genre": "Folk"
        },
        {
            "id": "song-4",
            "artist": "Frank Turner",
            "title": "Photosynthesis",
            "duration_seconds": 254,
            "genre": "Pop"
        },
        {
            "id": "song-5",
            "artist": "Frank Turner",
            "title": "I Still Believe",
            "duration_seconds": 227,
            "genre": "Pop"
        },
        {
            "id": "song-6",
            "artist": "Public Service Broadcasting",
            "title": "Go!",
            "duration_seconds": 253,
            "genre": "Alternative"
        },
        {
            "id": "song-7",
            "artist": "Faithless",
            "title": "Insomnia",
            "duration_seconds": 518,
            "genre": "House"
        },
        {
            "id": "song-8",
            "artist": "The Swell Season",
            "title": "When Your Mind's Made Up",
            "duration_seconds": 221,
            "genre": "Folk"
        },
        {
            "id": "song-9",
            "artist": "The Divine Comedy",
            "title": "Tonight We Fly",
            "duration_seconds": 181,
            "genre": "Pop"
        },
        {
            "id": "song-10",
            "artist": "Ani DiFranco",
            "title": "As Is",
            "duration_seconds": 246,
            "genre": "Pop"
        }
    ];

    // Find and return the matching song, or undefined if not found.
    return songs.find(song => song.id === songID);
}

// Return listening events for the specified user.
export function getListenEvents(userID) {
    // Store listening events grouped by user ID.
    return {
        // Listening events for user 1.
        "1": [
            // Keep the original listening-event data here.
        ],

        // Listening events for user 2.
        "2": [
            // Keep the original listening-event data here.
        ],

        // Listening events for user 3.
        "3": [
            // Keep the original listening-event data here.
        ],

        // No listening events are recorded for user 4.
        "4": []

    // Return the array associated with the requested user ID.
    }[userID];
}
