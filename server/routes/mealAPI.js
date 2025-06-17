const express = require('express');
const axios = require('axios');
const router = express.Router();

// GET /api/meals?search=chicken
router.get('/', async (req, res) => {
  const search = req.query.search || '';
  try {
    const response = await axios.get(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${search}`
    );
    res.json(response.data);
  } catch (err) {
    console.error('Error fetching from TheMealDB:', err.message);
    res.status(500).json({ error: 'Failed to fetch meals' });
  }
});

module.exports = router;
