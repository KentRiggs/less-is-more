import React, { useState, useEffect } from 'react';
import { Button, Container, Form, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './index.css';

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
    .then(response => response.json())
    .then(data => {
      if (data.apology_id) {
        sessionStorage.setItem('apology_id', data.apology_id);
        setIsSubmitted(true);
        setSubmittedText(apologyText);
        setApologyText('');
      } else {
        throw new Error('Failed to submit apology');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Failed to submit your apology. Please try again.');
    });
  };

  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        setIsSubmitted(false);
        setSubmittedText('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSubmitted]);

  return (
    <Container className="home-page-container">
      <h1 className="page-title">What needs to be let go?</h1>
      <Form.Group className="text-input-group" controlId="apologyText">
        <Form.Control
          type="text"
          placeholder="Enter an apology ..."
          value={apologyText}
          onChange={(e) => setApologyText(e.target.value)}
          className="text-input"
        />
      </Form.Group>
      <div className="text-container">
        {isSubmitted && submittedText.split('').map((letter, index) => (
          <span key={index} className="animated-letter" style={{ animationDelay: `${index * 0.05}s` }}>
            {letter}
          </span>
        ))}
      </div>
      <Row className="button-container">
        <Col>
          <Button className="submit-button" onClick={handleExperienceRelease}>Submit Anonymously</Button>
        </Col>
        <Col>
          <Button className="details-button" onClick={() => navigate('/engage')}>Add Details</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
