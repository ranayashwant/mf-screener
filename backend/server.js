// server.js
import express from 'express';

const app = express();
const PORT = 5000;

// This is called "Middleware" - it allows your server to read JSON data
app.use(express.json());

// Your very first API route!
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'success', 
    message: 'MF Screener API is running' 
  });
});

// This starts the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});