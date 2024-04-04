import React, { useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { useOutletContext } from 'react-router-dom';

const HomePage = () => {
  const [apologyText, setApologyText] = useState('');
  const { setShowEngage, setShowAmend } = useOutletContext();


  const handleExperienceRelease = () => {
    fetch(`http://localhost:5555/apologies/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ apology_text: apologyText }),
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Failed to submit apology');
      }
    })
    .then(data => {
      console.log(data);
      setApologyText(''); 
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };
  
  

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center" style={{ height: '100vh' }}>
      <h1 style={{ fontFamily: 'Courier New', textAlign: 'center' }}>What needs to be let go?</h1>
      <Form.Group controlId="apologyText" className="mb-3 w-50">
        <Form.Control
          type="text"
          placeholder="Enter an apology ..."
          value={apologyText}
          onChange={(e) => setApologyText(e.target.value)}
          style={{ textAlign: 'center' }}
        />
      </Form.Group>
      <div className="d-flex justify-content-between w-50">
        <Button variant="primary" onClick={() => setShowEngage(true)}>Dig Deeper</Button>
        <Button variant="success" onClick={handleExperienceRelease}>Experience Release</Button>
        <Button variant="secondary" onClick={() => setShowAmend(true)}>Amendments</Button>
      </div>
    </Container>
  );
};

export default HomePage;


