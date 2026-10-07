require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const meetingRoutes = require('./routes/meetings');
const { setupSignaling } = require('./websocket/signaling');

const app = express();
const server = http.createServer(app);

// Allow CORS for development & client origin
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// REST routes
app.use('/api/meetings', meetingRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    platform: 'MEETRA',
    version: '1.0.0 (Phase 1)',
    timestamp: new Date().toISOString()
  });
});

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

setupSignaling(io);

// Serve static files in production
const path = require('path');
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '../client/dist');
  app.use(express.static(clientBuildPath));

  app.get('*', (req, res) => {
    // Only serve index.html for non-API routes (React Router support)
    if (!req.path.startsWith('/api') && !req.path.startsWith('/socket.io')) {
      res.sendFile(path.join(clientBuildPath, 'index.html'));
    }
  });
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`[MEETRA] Backend Server running on http://localhost:${PORT}`);
});
