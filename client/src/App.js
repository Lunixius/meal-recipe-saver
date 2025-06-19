import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import SearchMeals from './components/SearchMeals';
import SavedMeals from './components/SavedMeals';
import RandomMeal from './components/RandomMeal';
import { ThemeContext } from './context/ThemeContext'; // Theme context for dark mode

function App() {
  const { darkMode, setDarkMode } = useContext(ThemeContext); // Dark mode state

  return (
    <div className={darkMode ? 'dark-mode' : ''}>
      <Router>
        <nav style={{
          padding: '1rem',
          backgroundColor: darkMode ? '#333' : '#f0f0f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <Link to="/" style={{ marginRight: '1rem', color: darkMode ? '#fff' : '#000' }}>
              🔍 Search Meals
            </Link>
            <Link to="/saved" style={{ color: darkMode ? '#fff' : '#000' }}>
              📚 Saved Meals
            </Link>
            <Link to="/random" style={{ marginLeft: '1rem', color: darkMode ? '#fff' : '#000' }}>
              🎲 Random Meal
            </Link>
          </div>
          <button
            onClick={() => setDarkMode(prev => !prev)}
            style={{
              background: 'none',
              border: '1px solid',
              borderColor: darkMode ? '#eee' : '#333',
              color: darkMode ? '#eee' : '#333',
              padding: '0.3rem 0.8rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </nav>

        <Routes>
          <Route path="/" element={<SearchMeals />} />
          <Route path="/saved" element={<SavedMeals />} />
          <Route path="/random" element={<RandomMeal />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
