// routes/dashboard.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const FinancialMetrics = require('../models/FinancialMetrics');

// Protected route - requires authentication
router.get('/metrics', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    // Query financial metrics for the specific user
    const userMetrics = await FinancialMetrics.findOne({ userId });

    if (!userMetrics) {
      return res.status(404).json({ message: 'User metrics not found' });
    }

    res.json(userMetrics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
