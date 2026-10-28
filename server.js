
// Import the createServer function from Node.js's built-in HTTP module.
// This function allows us to create a web server that can receive HTTP requests
// from a browser and send HTTP responses back.
import { createServer } from "node:http";

// Import the readFile function from Node.js's built-in file system promises module.
// This function allows us to read the contents of files asynchronously.
// Because it returns a Promise, we can use await to wait for a file to be read.
import { readFile } from "node:fs/promises";

// Create an object that maps the URLs the server supports to the files
// that should be served for those URLs.
//
// Each key is a URL path requested by the browser.
// Each value is an array containing two elements:
//   [0] The name of the file to read from the project directory.
//   [1] The Content-Type to send in the HTTP response.
//
// The Content-Type tells the browser what kind of content it is receiving,
// so the browser knows how to interpret the response.
const files = {
  // When someone visits the root URL "/", serve index.html as HTML.
  "/": ["index.html", "text/html"],

  // Also allow index.html to be requested explicitly.
  "/index.html": ["index.html", "text/html"],

  // Serve the CSS stylesheet with the appropriate CSS content type.
  "/style.css": ["style.css", "text/css"],

  // Serve the main JavaScript file with a JavaScript content type.
  "/script.js": ["script.js", "text/javascript"],

  // Serve the storage helper module as JavaScript.
  "/storage.js": ["storage.js", "text/javascript"],

  // Serve the utilities helper module as JavaScript.
  "/utils.js": ["utils.js", "text/javascript"]
};

// Create the HTTP server.
// The callback runs whenever the server receives a request from a client,
// such as a browser requesting an HTML page, stylesheet, or JavaScript file.
//
// The callback is marked async so that it can use await when reading files.
// The request parameter contains information about the incoming request.
// The response parameter is used to send an HTTP response back to the client.
createServer(async (request, response) => {

  // Construct a URL object from the requested URL.
  //
  // request.url contains the request path and may also include a query string.
  // "http://localhost" provides a base URL so that the relative request URL
  // can be parsed correctly.
  //
  // The pathname property extracts only the path portion of the URL.
  // For example:
  //   "/style.css?v=1" becomes "/style.css".
  //
  // This allows the server to look up the requested path in the files object
  // without being affected by query-string parameters.
  const path = new URL(request.url, "http://localhost").pathname;

  // Look up the requested path in the files object.
  // If path is "/index.html", for example, file will be:
  // ["index.html", "text/html"].
  //
  // If the requested path is not listed in files, file will be undefined.
  const file = files[path];

  // Check whether the requested path is supported by this server.
  // A falsy file value means there is no matching entry in the files object.
  if (!file) {

    // Send an HTTP 404 status code, meaning "Not Found".
    // end("Not found") sends the response body and finishes the response.
    // This tells the browser that the requested resource is not available
    // through the server's list of supported paths.
    response.writeHead(404).end("Not found");

    // Stop processing this request.
    // This prevents the code below from trying to read a file when
    // no matching file has been found.
    return;
  }

  // Use a try block to handle potential errors while reading the requested file.
  // For example, the file might not exist or the server might not have permission
  // to read it.
  try {

    // Read the contents of the requested file asynchronously.
    //
    // file[0] contains the filename from the files object.
    // new URL(file[0], import.meta.url) creates a URL pointing to that file
    // relative to the current JavaScript module's location.
    //
    // import.meta.url is the URL of this module itself. Using it as the base
    // means the server looks for the requested file relative to this script,
    // rather than relying on whichever directory the command was run from.
    //
    // await pauses execution of this async callback until readFile finishes.
    // The resulting content is stored in the content variable as a Buffer.
    const content = await readFile(new URL(file[0], import.meta.url));

    // Send an HTTP 200 status code, meaning the request was successful.
    //
    // The Content-Type header is set using file[1], which contains the
    // appropriate MIME type from the files object.
    // For example, HTML files receive "text/html" and CSS files receive
    // "text/css".
    response.writeHead(200, { "Content-Type": file[1] });

    // Send the file's contents to the browser and finish the response.
    // The browser can then render the HTML, apply the CSS, or execute
    // the JavaScript, depending on the type of file requested.
    response.end(content);

  } catch {

    // If an error occurs while reading the file, send an HTTP 500 status code.
    // This means "Internal Server Error" and indicates that the server could
    // not complete the request because something went wrong on the server.
    //
    // The response body provides a simple error message for the browser.
    // The catch block does not expose the underlying error details.
    response.writeHead(500).end("Could not load this file.");
  }

// Start listening for incoming HTTP requests on port 8000,
// using the loopback IP address 127.0.0.1.
//
// Port 8000 is the port clients must connect to in order to reach this server.
// The address 127.0.0.1 restricts access to the local computer, so other
// devices cannot connect through the computer's network interface.
//
// The callback passed to listen() runs once the server has successfully
// started listening for connections.
}).listen(8000, "127.0.0.1", () => {

  // Display a message in the terminal telling the user where to open the app.
  // Visiting this address in a browser sends a request to the local server.
  console.log("Open http://127.0.0.1:8000 in your browser. Press Ctrl+C to stop.");

});
