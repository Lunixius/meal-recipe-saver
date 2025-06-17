import React, { useState } from 'react';
import axios from 'axios';
import api from '../api';
import './SearchMeals.css';

const SearchMeals = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [meals, setMeals] = useState([]);
  const [notesMap, setNotesMap] = useState({}); // Holds temporary notes keyed by meal ID

  const handleSearch = async () => {
    try {
      const res = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`);
      setMeals(res.data.meals || []);
    } catch (err) {
      console.error('Error fetching meals:', err);
    }
  };

  const extractIngredients = (meal) => {
    const ingredients = [];

    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];

      if (ingredient && ingredient.trim()) {
        ingredients.push(`${measure ? measure : ''} ${ingredient}`.trim());
      }
    }

    return ingredients;
  };


  const handleNoteChange = (mealId, note) => {
    setNotesMap((prev) => ({
      ...prev,
      [mealId]: note,
    }));
  };

  const handleSave = async (meal) => {
    const userNote = notesMap[meal.idMeal] || '';

    try {
      await api.post('/recipes', {
        mealId: meal.idMeal,
        name: meal.strMeal,
        thumbnail: meal.strMealThumb,
        category: meal.strCategory,
        area: meal.strArea,
        tags: meal.strTags,
        instructions: meal.strInstructions,
        ingredients: extractIngredients(meal),
        notes: userNote,
      });
      alert('Meal saved successfully!');
    } catch (error) {
      console.error('Failed to save meal:', error);
      alert('Error saving meal');
    }
  };

  return (
    <div className="search-meals-container">
  <h2>🍽️ Search Meals</h2>
  <div className="search-bar">
    <input
      type="text"
      placeholder="Search meals..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    <button onClick={handleSearch}>Search</button>
  </div>

  <div className="meals-list">
    {meals.map((meal) => (
      <div key={meal.idMeal} className="meal-card">
        <img src={meal.strMealThumb} alt={meal.strMeal} />
        <h3>{meal.strMeal}</h3>
        <p><strong>Category:</strong> {meal.strCategory}</p>
        <p><strong>Area:</strong> {meal.strArea}</p>
        {meal.strTags && <p><strong>Tags:</strong> {meal.strTags}</p>}
        <p><strong>Instructions:</strong> {meal.strInstructions}</p>
        <div>
          <strong>Ingredients:</strong>
          <ul>
            {extractIngredients(meal).map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
        <textarea
          placeholder="Add notes before saving..."
          rows="2"
          value={notesMap[meal.idMeal] || ''}
          onChange={(e) => handleNoteChange(meal.idMeal, e.target.value)}
        />
        <button onClick={() => handleSave(meal)}>💾 Save Recipe</button>
      </div>
    ))}
  </div>
</div>

  );
};

export default SearchMeals;
