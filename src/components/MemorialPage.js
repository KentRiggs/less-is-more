import React, { useState, useEffect } from 'react';
import './index.css';

const MemorialPage = () => {
  const [memorials, setMemorials] = useState([]);
  const [category, setCategory] = useState(''); // Default to '' which means no filter

  useEffect(() => {
    const endpoint = category ? `http://localhost:5555/memorials/?category=${category}` : 'http://localhost:5555/memorials/';

    fetch(endpoint)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch data, status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => setMemorials(data))
      .catch(error => console.error('Error fetching memorial data:', error));
  }, [category]); // Re-fetch when category changes

  return (
    <div className="memorial-container">
      <h1 className="memorial-title">All Apologies</h1>
      <div>
        <label htmlFor="category-select">Filter by Category:</label>
        <select id="category-select" onChange={(e) => setCategory(e.target.value)}>
          <option value="">No Filter</option>
          <option value="Family">Family</option>
          <option value="Friends">Friends</option>
          <option value="Coworkers">Coworkers</option>
          <option value="Public">Public</option>
        </select>
      </div>
      {memorials.map((memorial, index) => (
        <p key={index} className="memorial-text">{memorial.message}</p>
      ))}
    </div>
  );
};

export default MemorialPage;
