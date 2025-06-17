const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  mealId: { type: String, required: true, unique: true },
  name: String,
  thumbnail: String,
  category: String,
  area: String,
  notes: String,
});

module.exports = mongoose.model('Recipe', RecipeSchema);
