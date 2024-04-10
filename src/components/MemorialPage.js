import React, { useState, useEffect } from 'react';
import './index.css';

const MemorialPage = () => {
  const [memorials, setMemorials] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5555/memorial-data/')
      .then(response => response.json())
      .then(data => setMemorials(data)) 
      .catch(error => console.error('Error fetching memorial data:', error));
  }, []);

  return (
    <div className="memorial-container">
      <h1 className="memorial-title">All Apologies</h1>
      {memorials.map((memorial, index) => (
        <p key={index} className="memorial-text">{memorial.message}</p> 
      ))}
    </div>
  );
};

export default MemorialPage;

