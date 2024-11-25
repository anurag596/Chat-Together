const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const codeNames = ['Thor', 'Odin', 'Loki', 'SpiderMan', 'IronMan', 'CaptainAmerica', 'Thanos', 'AntMan', 'Rodie', 'Hulk'];

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('front-end'));
const users = {};
io.on('connection', (socket) => {
    console.log('A user connected');

    const codeName = codeNames[Math.floor(Math.random() * codeNames.length)];
    users[socket.id] = codeName;

    socket.emit('chatMessage', { sender: 'Server', message: `Welcome! Your code name is ${codeName}.` });
    
    socket.broadcast.emit('chatMessage', { sender: 'Server', message: `${codeName} has joined the chat.` });

    socket.on('chatMessage', (message) => {
        socket.broadcast.emit('chatMessage', { sender: users[socket.id], message });
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
        const codeName = users[socket.id];
        socket.broadcast.emit('chatMessage', { sender: 'Server', message: `${codeName} has left the chat.` });
        delete users[socket.id];
    });
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
