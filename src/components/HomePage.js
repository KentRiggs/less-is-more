import React, { useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { useOutletContext } from 'react-router-dom';

const HomePage = () => {
  const [apologyText, setApologyText] = useState('');
  const [submittedText, setSubmittedText] = useState(''); // New state for storing submitted text
  const [isSubmitted, setIsSubmitted] = useState(false);
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
        setIsSubmitted(true);
        setSubmittedText(apologyText); // Update the submitted text for display
        setApologyText(''); // Clear the input field
        return response.json();
      } else {
        throw new Error('Failed to submit apology');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  // Clear the submission effect after a delay
  React.useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        setIsSubmitted(false);
        setSubmittedText('');
      }, 10000); // Adjust based on total animation duration
      return () => clearTimeout(timer);
    }
  }, [isSubmitted]);

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
      <div className="text-container">
        {isSubmitted && submittedText.split('').map((letter, index) => (
          <span key={index} className="letter" style={{animationDelay: `${index * 0.05}s`}}>
            {letter}
          </span>
        ))}
      </div>
      <div className="d-flex justify-content-between w-50">
        <Button variant="primary" onClick={() => setShowEngage(true)}>Dig Deeper</Button>
        <Button variant="success" onClick={handleExperienceRelease}>Experience Release</Button>
        <Button variant="secondary" onClick={() => setShowAmend(true)}>Amendments</Button>
      </div>
    </Container>
  );
};

export default HomePage;
