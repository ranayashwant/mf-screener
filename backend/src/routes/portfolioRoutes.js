// backend/src/routes/portfolioRoutes.js
import express from 'express';
import pool from '../db/connection.js'; // Import DB connection

const router = express.Router();

// --- GET PORTFOLIO ---
router.get('/api/portfolio', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM portfolio_holdings where user_id = 1');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- ADD HOLDING ---
router.post('/api/portfolio', async (req, res) => {
  try {
    const { scheme_code, units, purchase_nav, purchase_date } = req.body;
    const sql = `INSERT INTO portfolio_holdings (user_id, scheme_code, units, purchase_nav, purchase_date) VALUES (1, ?, ?, ?, ?)`;
    
    await pool.execute(sql, [scheme_code, units, purchase_nav, purchase_date]);
    res.status(201).json({ message: 'Holding added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- DELETE HOLDING ---
router.delete('/api/portfolio/:id', async (req, res) => {
  try {
    const holdingId = req.params.id;
    const sql = 'DELETE FROM portfolio_holdings WHERE id = ? AND user_id = 1';
    const [result] = await pool.execute(sql, [holdingId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Holding not found" });
    }
    res.json({ success: true, message: "Holding deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;