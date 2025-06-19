import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api';
import './SearchMeals.css';

const SearchMeals = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [meals, setMeals] = useState([]);
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [notesMap, setNotesMap] = useState({});
  const [categories, setCategories] = useState([]);
  const [areas, setAreas] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    area: '',
    tag: '',
  });

  // Fetch category and area options on mount
  useEffect(() => {
    const fetchFilters = async () => {
      const catRes = await axios.get('https://www.themealdb.com/api/json/v1/1/list.php?c=list');
      const areaRes = await axios.get('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
      setCategories(catRes.data.meals.map((c) => c.strCategory));
      setAreas(areaRes.data.meals.map((a) => a.strArea));
    };
    fetchFilters();
  }, []);

  const handleSearch = async () => {
    try {
      const res = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`);
      const results = res.data.meals || [];
      setMeals(results);
      setFilteredMeals(applyFilters(results));
    } catch (err) {
      console.error('Error fetching meals:', err);
    }
  };

  const applyFilters = (data) => {
    return data.filter((meal) => {
      const categoryMatch = filters.category ? meal.strCategory === filters.category : true;
      const areaMatch = filters.area ? meal.strArea === filters.area : true;
      const tagMatch = filters.tag
        ? meal.strTags?.toLowerCase().includes(filters.tag.toLowerCase())
        : true;
      return categoryMatch && areaMatch && tagMatch;
    });
  };

  useEffect(() => {
    setFilteredMeals(applyFilters(meals));
  }, [filters]);

  const extractIngredients = (meal) => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ing = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ing && ing.trim()) {
        ingredients.push(`${measure ? measure : ''} ${ing}`.trim());
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

      {/* Filter Controls */}
      <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select value={filters.area} onChange={(e) => setFilters({ ...filters, area: e.target.value })}>
          <option value="">All Areas</option>
          {areas.map((area) => (
            <option key={area} value={area}>{area}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Filter by tag..."
          value={filters.tag}
          onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
        />
      </div>

      <div className="meals-list">
        {filteredMeals.map((meal) => (
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
            {meal.strYoutube && (
              <p>
                <a href={meal.strYoutube} target="_blank" rel="noopener noreferrer">
                  🎬 Watch Tutorial
                </a>
              </p>
            )}
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
