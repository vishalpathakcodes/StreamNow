# StreamNow: Real-Time Video Streaming Application

StreamNow is a real-time video streaming application built using Node.js, Express, Socket.IO, and FFmpeg. The application captures video streams from a client, processes them using FFmpeg, and streams the processed video to a YouTube RTMP server.

## Prerequisites

Ensure you have the following installed on your machine:
- Node.js (version 14.x or higher)
- npm (Node package manager)
- Docker (for containerization)

## Installation

1. **Clone the repository:**
    ```sh
    git clone https://github.com/vishalpathakcodes/StreamNow
    cd StreamNow
    ```

2. **Install the dependencies:**
    ```sh
    npm install
    ```

## Project Structure

- `index.js` (or `app.js`): The main file containing the server and streaming logic.
- `public/`: Directory containing static files served by Express.
- `package.json`: Contains metadata about the project and its dependencies.
- `Dockerfile`: Docker configuration for containerizing the application.

## Code Explanation

### Import Required Modules

```javascript
import http from 'http';
import express from 'express';
import path from 'path';
import { spawn } from 'child_process';
import { Server as SocketIO } from 'socket.io';
```

- `http`: Core Node.js module for creating an HTTP server.
- `express`: A minimal and flexible Node.js web application framework.
- `path`: Core Node.js module for handling file and directory paths.
- `child_process`: Core Node.js module for spawning child processes.
- `socket.io`: Real-time bidirectional event-based communication.

### Initialize Express App and Server

```javascript
const app = express();
const server = http.createServer(app);
const io = new SocketIO(server);
```

- `app`: Instance of Express.
- `server`: HTTP server created using the Express app.
- `io`: Socket.IO server instance attached to the HTTP server.

### FFmpeg Options

```javascript
const options = [
    '-i', '-',
    '-c:v', 'libx264',
    '-preset', 'ultrafast',
    '-tune', 'zerolatency',
    '-r', `${25}`,
    '-g', `${25 * 2}`,
    '-keyint_min', 25,
    '-crf', '25',
    '-pix_fmt', 'yuv420p',
    '-sc_threshold', '0',
    '-profile:v', 'main',
    '-level', '3.1',
    '-c:a', 'aac',
    '-b:a', '128k',
    '-ar', 128000 / 4,
    '-f', 'flv',
    `rtmp://a.rtmp.youtube.com/live2/3wv5-sqds-3p2c-yrw4-84rb`,
];
const ffmpeg = spawn('ffmpeg', options);
```

- `options`: Array of FFmpeg options for video processing and streaming.
- `ffmpeg`: Spawns a child process to run FFmpeg with the specified options.

### Serve Static Files

```javascript
app.use(express.static(path.resolve('./public')));
```

- Serves static files from the `public` directory.

### Socket.IO Connection

```javascript
io.on('connection', socket => {
    console.log("Socket connected", socket.id);
    socket.on('binarystream', stream => {
        console.log('Binary stream incoming');
    });
});
```

- Listens for new socket connections and logs the socket ID.
- Listens for `binarystream` events and logs when a binary stream is received.

### Start Server

```javascript
server.listen(3000, () => {
    console.log("HTTP Server running on port 3000");
});
```

- Starts the HTTP server on port 3000.

## Running the Application

1. **Start the server:**
    ```sh
    node index.js
    ```

2. **Access the application:**
    - Open a web browser and navigate to `http://localhost:3000`.

## Docker Containerization

### Dockerfile

Create a `Dockerfile` in the root directory with the following content:

```Dockerfile
# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["node", "index.js"]
```

### Build and Run the Docker Container

1. **Build the Docker image:**
    ```sh
    docker build -t streamnow .
    ```

2. **Run the Docker container:**
    ```sh
    docker run -p 3000:3000 streamnow
    ```

## Notes

- **FFmpeg Options:** Customize the FFmpeg options based on your streaming requirements and target platform specifications.
- **Socket.IO Events:** Implement proper handling of incoming binary streams and integrate them with the FFmpeg process.

By following this guide, you will have a working real-time video streaming application using Node.js, Express, Socket.IO, and FFmpeg. The application can be containerized and deployed using Docker for easier scalability and management.
