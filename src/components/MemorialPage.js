import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';

const MemorialPage = () => {
  const [memorials, setMemorials] = useState([]);

  useEffect(() => {
    // Fetch the combined data from the server
    fetch('http://localhost:5555/memorial-data/')
      .then(response => response.json())
      .then(data => setMemorials(data))
      .catch(error => console.error('Error fetching memorial data:', error));
  }, []);

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center" style={{ height: '100vh' }}>
      <h1>Welcome to the Memorial Page</h1>
      {memorials.map((memorial, index) => (
        <p key={index} style={{ textAlign: 'center' }}>
          {`${memorial.username} says ${memorial.apology_text} to ${memorial.recipient} from ${memorial.event_location} ${memorial.event_date} ${memorial.category_name}`}
        </p>
      ))}
    </Container>
  );
};

export default MemorialPage;
