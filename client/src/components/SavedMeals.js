import React, { useEffect, useState, useContext } from 'react';
import './SavedMeals.css';
import api from '../api';
import { ThemeContext } from '../context/ThemeContext'; // ✅

const SavedMeals = () => {
  const { darkMode } = useContext(ThemeContext); // ✅
  const [recipes, setRecipes] = useState([]);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [newNote, setNewNote] = useState('');

  const fetchSavedMeals = async () => {
    try {
      const res = await api.get('/recipes');
      setRecipes(res.data);
    } catch (err) {
      console.error('Failed to fetch saved meals');
    }
  };

  const deleteMeal = async (mealId) => {
    await api.delete(`/recipes/${mealId}`);
    fetchSavedMeals();
  };

  const updateNote = async (mealId) => {
    await api.put(`/recipes/${mealId}`, { notes: newNote });
    setEditingNoteId(null);
    setNewNote('');
    fetchSavedMeals();
  };

  useEffect(() => {
    fetchSavedMeals();
  }, []);

  return (
    <div className={`saved-meals-container ${darkMode ? 'dark-mode' : ''}`}> {/* ✅ */}
      <h2>📚 Saved Meals</h2>
      <div className="meals-list"> {/* ✅ */}
        {recipes.map((meal) => (
          <div key={meal.mealId} className="meal-card">
            <img src={meal.thumbnail} alt={meal.name} />
            <h3>{meal.name}</h3>
            <p><strong>Category:</strong> {meal.category}</p>
            <p><strong>Area:</strong> {meal.area}</p>
            {meal.tags && <p><strong>Tags:</strong> {meal.tags}</p>}

            {meal.instructions && (
              <p style={{ textAlign: 'justify' }}>
                <strong>Instructions:</strong> {meal.instructions}
              </p>
            )}

            {meal.ingredients && (
              <div>
                <strong>Ingredients:</strong>
                <ul style={{ textAlign: 'left', paddingLeft: '1.2rem' }}>
                  {Array.isArray(meal.ingredients)
                    ? meal.ingredients.map((ing, idx) => <li key={idx}>{ing}</li>)
                    : meal.ingredients.split(',').map((ing, idx) => <li key={idx}>{ing.trim()}</li>)}
                </ul>
              </div>
            )}

            <p><strong>Notes:</strong> {meal.notes}</p>

            {editingNoteId === meal.mealId ? (
              <>
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Update your note"
                />
                <button onClick={() => updateNote(meal.mealId)}>✅ Save Note</button>
              </>
            ) : (
              <button
                onClick={() => {
                  setEditingNoteId(meal.mealId);
                  setNewNote(meal.notes || '');
                }}
                style={{
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginTop: '0.5rem'
                }}
              >
                ✏️ Edit Note
              </button>
            )}

            <button onClick={() => deleteMeal(meal.mealId)}>❌ Delete</button>
          </div>

        ))}
      </div>
    </div>
  );
};

export default SavedMeals;
