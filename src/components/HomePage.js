import React, { useState } from 'react';
import { Button, Container, Form, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; 

const HomePage = () => {
  const [apologyText, setApologyText] = useState('');
  const [submittedText, setSubmittedText] = useState(''); 
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate(); 

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
        setSubmittedText(apologyText); 
        setApologyText(''); 
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
    <Container className="custom-container d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <h1 style={{ fontFamily: 'Courier New', textAlign: 'center' }}>What needs to be let go?</h1>
      <Form.Group as={Row} controlId="apologyText" className="mb-3">
        <Col sm={12}>
          <Form.Control
            type="text"
            placeholder="Enter an apology ..."
            value={apologyText}
            onChange={(e) => setApologyText(e.target.value)}
            className="text-input"
          />
        </Col>
      </Form.Group>
      <div className="text-container mb-3">
        {isSubmitted && submittedText.split('').map((letter, index) => (
          <span key={index} className="letter" style={{ animationDelay: `${index * 0.05}s` }}>
            {letter}
          </span>
        ))}
      </div>
      <Row className="w-100 justify-content-center mb-3">
        <Col xs={12} md={4}>
          <Button variant="primary" className="custom-button" block onClick={() => navigate('/engage')}>Save and Add Details</Button>
        </Col>
        <Col xs={12} md={4}>
          <Button variant="success" className="custom-button" block onClick={handleExperienceRelease}>Anonymous Submit</Button>
        </Col>
        <Col xs={12} md={4}>
          <Button variant="secondary" className="custom-button" block onClick={() => navigate('/amend')}>Edits</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
