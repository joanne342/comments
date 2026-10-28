
// Import functions to create an HTTP server and read files.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";

// Map supported URL paths to filenames and their content types.
const files = {
  "/": ["index.html", "text/html"],
  "/index.html": ["index.html", "text/html"],
  "/style.css": ["style.css", "text/css"],
  "/script.js": ["script.js", "text/javascript"],
  "/storage.js": ["storage.js", "text/javascript"],
  "/utils.js": ["utils.js", "text/javascript"]
};

// Create a server to handle incoming HTTP requests.
createServer(async (request, response) => {
  // Extract the requested URL path, excluding query parameters.
  const path = new URL(request.url, "http://localhost").pathname;

  // Find the corresponding file in the files object.
  const file = files[path];

  // Return a 404 error if the requested path is unsupported.
  if (!file) {
    response.writeHead(404).end("Not found");
    return;
  }

  // Read the requested file and send it with the appropriate content type.
  try {
    const content = await readFile(new URL(file[0], import.meta.url));
    response.writeHead(200, { "Content-Type": file[1] });
    response.end(content);

  // Return a 500 error if the file cannot be loaded.
  } catch {
    response.writeHead(500).end("Could not load this file.");
  }

// Start the server on localhost port 8000.
}).listen(8000, "127.0.0.1", () => {
  // Display the local server address in the terminal.
  console.log("Open http://127.0.0.1:8000 in your browser. Press Ctrl+C to stop.");
});
