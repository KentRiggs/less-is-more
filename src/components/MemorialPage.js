import React, { useState, useEffect } from 'react';
import './index.css';

const MemorialPage = () => {
  const [memorials, setMemorials] = useState([]);
  const [category, setCategory] = useState(''); // Default to '' which means no filter

  useEffect(() => {
    const fetchMemorials = () => {
      // Default endpoint for all memorials
      let endpoint = 'http://localhost:5555/memorial-data/';
      // If a category is selected (and is not the empty 'no filter' option), fetch filtered memorials
      if (category) {
        endpoint = `http://localhost:5555/memorial-filter/${category}`;
      }

      fetch(endpoint)
        .then(response => response.json())
        .then(data => setMemorials(data))
        .catch(error => console.error('Error fetching memorial data:', error));
    };

    fetchMemorials();
  }, [category]); // Re-fetch when category changes

  return (
    <div className="memorial-container">
      <h1 className="memorial-title">All Apologies</h1>
      <div>
        <label htmlFor="category-select">Filter by Category:</label>
        <select id="category-select" onChange={(e) => setCategory(e.target.value)}>
          <option value="">No Filter</option>
          <option value="1">Family</option>
          <option value="2">Friends</option>
          <option value="3">Coworkers</option>
          <option value="4">Public</option>
        </select>
      </div>
      {memorials.map((memorial, index) => (
        <p key={index} className="memorial-text">{memorial.message}</p>
      ))}
    </div>
  );
};

export default MemorialPage;
