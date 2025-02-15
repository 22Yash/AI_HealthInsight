const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();  // Ensure .env is loaded

const PORT = process.env.PORT || 5000;

// Configure Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5173", // Replace with your actual frontend origin
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware
app.use(cors());
app.use(express.json());  // For parsing JSON bodies

// Database connection (assuming you have this)
require('./db/conn');

// Routes
const reportRoutes = require('./routes/reportRoutes'); // Corrected variable name
app.use('/api', reportRoutes);

// Socket.IO event handling
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});


server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export the io instance so reportRoutes can use it to emit updates
module.exports = { io };