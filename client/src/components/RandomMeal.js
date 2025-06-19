// src/components/RandomMeal.js
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import api from '../api';
import { ThemeContext } from '../context/ThemeContext';
import './SearchMeals.css';

const RandomMeal = () => {
  const { darkMode } = useContext(ThemeContext);
  const [meal, setMeal] = useState(null);
  const [note, setNote] = useState('');

  const fetchRandomMeal = async () => {
    try {
      const res = await axios.get('https://www.themealdb.com/api/json/v1/1/random.php');
      const mealData = res.data.meals[0];
      setMeal(mealData);
    } catch (error) {
      console.error('Failed to fetch random meal:', error);
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

  const handleSave = async () => {
    if (!meal) return;
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
        notes: note,
      });
      alert('Meal saved successfully!');
    } catch (error) {
      console.error('Failed to save meal:', error);
      alert('Error saving meal');
    }
  };

  useEffect(() => {
    fetchRandomMeal();
  }, []);

  if (!meal) return <p style={{ padding: '2rem' }}>Loading...</p>;

  return (
    <div className={`search-meals-container ${darkMode ? 'dark-mode' : ''}`}>
      <h2>🎲 Random Meal</h2>
      <button onClick={fetchRandomMeal} style={{ marginBottom: '1rem' }}>🔁 Get Another</button>

      <div className="random-meal-card" style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <img src={meal.strMealThumb} alt={meal.strMeal} style={{ width: '300px', borderRadius: '8px' }} />

        <div style={{ maxWidth: '600px', textAlign: 'justify' }}>
          <h3>{meal.strMeal}</h3>
          <p><strong>Category:</strong> {meal.strCategory}</p>
          <p><strong>Area:</strong> {meal.strArea}</p>
          {meal.strTags && <p><strong>Tags:</strong> {meal.strTags}</p>}
          <p><strong>Instructions:</strong> {meal.strInstructions}</p>
          <div>
            <strong>Ingredients:</strong>
            <ul>
              {extractIngredients(meal).map((item, idx) => <li key={idx}>{item}</li>)}
            </ul>
          </div>

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add your note here..."
            style={{ width: '100%', marginTop: '1rem' }}
            rows={3}
          />

          <button onClick={handleSave} style={{ marginTop: '0.5rem' }}>💾 Save Recipe</button>
        </div>
      </div>
    </div>
  );
};

export default RandomMeal;
