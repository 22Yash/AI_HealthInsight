const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app)
const {Server} = require('socket.io')
const dotenv =require('dotenv')
require('dotenv').config();

const cors = require('cors');
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const io = new Server(server,{
    cors:{
        origin:"http://127.0.0.1:5173",
        methods: ["GET", "POST"],
        credentials: true 
    }
})

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
  
    // Listen for a report upload event from the frontend
    socket.on('upload_report', async (data) => {
      console.log(`Received report: ${data.filename}`);
  
      try {
        // Emit the uploaded report to all connected clients
        io.emit('report_uploaded', data);
      } catch (error) {
        console.error('Error handling report upload:', error);
      }
    });
  
    // Handle user disconnection
    socket.on('disconnect', () => {
      console.log('A user disconnected:', socket.id);
    });
  });

  const uploadReport = require('./routes/reportRoutes')
  app.use('/api',uploadReport)

  
  server.listen(PORT , ()=>{
    console.log(`server running on port no :${PORT} `);
    
  })