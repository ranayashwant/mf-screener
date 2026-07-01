// backend/server.js
import express from 'express';
import cors from 'cors';
import pool from './src/db/connection.js';

// Import the route files
import fundRoutes from './src/routes/fundRoutes.js';
import portfolioRoutes from './src/routes/portfolioRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['https://mf-screener-three.vercel.app', 'http://localhost:5173'], 
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// "Plug in" the route files
app.use(fundRoutes);
app.use(portfolioRoutes);

// Health check (Keep this one in server.js, it's fine)
app.get('/api/health', (req, res) => {
  res.json({ status: 'success', message: 'MF Screener API is running' });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on 0.0.0.0:${PORT}`);
  console.log(`Server address: ${JSON.stringify(server.address())}`);
});