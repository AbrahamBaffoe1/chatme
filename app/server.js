// server.js
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const Message = require('./models/Message').default;

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const MONGODB_URI = process.env.MONGODB_URI;

app.prepare().then(() => {
  mongoose.connect(MONGODB_URI, {});

  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = socketIo(server, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('join', (userId) => {
      socket.join('global'); // For simplicity, all users join a 'global' room
      console.log(`User ${userId} joined the chat`);
    });

    socket.on('message', async (data) => {
      const { user, message } = data;
      // Save the message to the database
      const newMessage = new Message({ user, message });
      await newMessage.save();
      // Broadcast the message to all clients
      io.to('global').emit('message', { user, message });
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
