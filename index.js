import http from 'http';
import express from 'express';
import path from 'path';
import { spawn } from 'child_process'
import {Server as SocketIO} from 'socket.io'
const app = express();
const server = http.createServer(app);
const io=new SocketIO(server);

const options = [
    '-i',
    '-',
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
const ffmpeg=spawn('ffmpeg',options);

app.use(express.static(path.resolve('./public')))

io.on('connection',socket=>{
    console.log("Socket connected",socket.id);
    socket.on('binarystream',stream=>{
        console.log('Binary stream incoming');
    })
})

server.listen(3000,()=>{console.log("HTTP Server running on port 3000");})