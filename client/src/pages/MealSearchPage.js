// client/src/pages/MealSearchPage.js
import React, { useState } from 'react';
import axios from 'axios';

const MealSearchPage = () => {
  const [search, setSearch] = useState('');
  const [meals, setMeals] = useState([]);

  const handleSearch = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/meals?search=${search}`);
      setMeals(res.data.meals || []);
    } catch (err) {
      console.error('Error fetching meals:', err);
    }
  };

  return (
    <div className="p-4">
      <h2>🍽 Search for Meals</h2>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Enter meal name..."
      />
      <button onClick={handleSearch}>Search</button>

      <div className="meals">
        {meals.map((meal) => (
          <div key={meal.idMeal} className="meal-card">
            <h3>{meal.strMeal}</h3>
            <img src={meal.strMealThumb} alt={meal.strMeal} width="200" />
            <p><strong>Category:</strong> {meal.strCategory}</p>
            <p><strong>Area:</strong> {meal.strArea}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealSearchPage;
