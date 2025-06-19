import React, { useEffect, useState, useContext } from 'react';
import './SavedMeals.css';
import api from '../api';
import { jsPDF } from 'jspdf';
import { ThemeContext } from '../context/ThemeContext';

const SavedMeals = () => {
  const { darkMode } = useContext(ThemeContext);
  const [recipes, setRecipes] = useState([]);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [sortOption, setSortOption] = useState('name');
  const [tagFilter, setTagFilter] = useState('');

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

  const sortMeals = (meals) => {
    switch (sortOption) {
      case 'name':
        return [...meals].sort((a, b) => a.name.localeCompare(b.name));
      case 'category':
        return [...meals].sort((a, b) => (a.category || '').localeCompare(b.category || ''));
      case 'area':
        return [...meals].sort((a, b) => (a.area || '').localeCompare(b.area || ''));
      case 'date':
        return [...meals].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      default:
        return meals;
    }
  };

  const filterMeals = (meals) => {
    if (!tagFilter.trim()) return meals;
    return meals.filter((meal) =>
      (meal.tags || '').toLowerCase().includes(tagFilter.toLowerCase())
    );
  };

  const exportToPDF = (meal) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(meal.name || 'Recipe', 10, 10);

    let y = 20;
    const lineHeight = 8;

    const addText = (label, content) => {
      if (content) {
        doc.setFont(undefined, 'bold');
        doc.text(`${label}:`, 10, y);
        y += lineHeight;
        doc.setFont(undefined, 'normal');
        const lines = doc.splitTextToSize(content, 180);
        doc.text(lines, 10, y);
        y += lines.length * lineHeight;
      }
    };

    addText('Category', meal.category);
    addText('Area', meal.area);
    addText('Tags', meal.tags);
    addText('Ingredients', Array.isArray(meal.ingredients) ? meal.ingredients.join(', ') : meal.ingredients);
    addText('Instructions', meal.instructions);
    addText('Notes', meal.notes);

    doc.save(`${meal.name || 'recipe'}.pdf`);
  };

  useEffect(() => {
    fetchSavedMeals();
  }, []);

  const filteredSortedMeals = sortMeals(filterMeals(recipes));

  return (
    <div className={`saved-meals-container ${darkMode ? 'dark-mode' : ''}`}>
      <h2>📚 Saved Meals</h2>

      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div>
          <label><strong>Sort by: </strong></label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            style={{
              padding: '0.4rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              backgroundColor: darkMode ? '#444' : '#fff',
              color: darkMode ? '#fff' : '#000'
            }}
          >
            <option value="name">Name (A–Z)</option>
            <option value="category">Category</option>
            <option value="area">Area</option>
            <option value="date">Date Saved</option>
          </select>
        </div>
        <div>
          <label><strong>Filter by Tag:</strong></label>
          <input
            type="text"
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            placeholder="e.g. spicy"
            style={{
              padding: '0.4rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              backgroundColor: darkMode ? '#444' : '#fff',
              color: darkMode ? '#fff' : '#000',
              marginLeft: '0.5rem'
            }}
          />
        </div>
      </div>

      <div className="meals-list">
        {filteredSortedMeals.map((meal) => (
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
            <button onClick={() => exportToPDF(meal)} style={{ marginTop: '0.5rem' }}>
              🧾 Export to PDF
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedMeals;
