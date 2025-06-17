const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');

// GET all saved meals
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch saved recipes' });
  }
});

// POST save a new meal
router.post('/', async (req, res) => {
  const { mealId, name, thumbnail, category, area, notes } = req.body;

  try {
    const existing = await Recipe.findOne({ mealId });
    if (existing) return res.status(400).json({ error: 'Meal already saved' });

    const newRecipe = new Recipe({ mealId, name, thumbnail, category, area, notes });
    await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save recipe' });
  }
});

// PUT update notes for a saved meal
router.put('/:mealId', async (req, res) => {
  const { mealId } = req.params;
  const { notes } = req.body;

  try {
    const updated = await Recipe.findOneAndUpdate({ mealId }, { notes }, { new: true });
    if (!updated) return res.status(404).json({ error: 'Recipe not found' });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update recipe' });
  }
});

// DELETE a saved meal
router.delete('/:mealId', async (req, res) => {
  const { mealId } = req.params;

  try {
    const deleted = await Recipe.findOneAndDelete({ mealId });
    if (!deleted) return res.status(404).json({ error: 'Recipe not found' });

    res.json({ message: 'Recipe deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete recipe' });
  }
});

module.exports = router;
