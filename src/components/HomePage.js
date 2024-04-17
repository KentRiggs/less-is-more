import React, { useState, useContext } from 'react';
import { Button, Container, Form, Row, Col, Modal } from 'react-bootstrap';
import CreateUser from './CreateUser';  
import { UserContext } from './UserContext';  
import './index.css';

const HomePage = () => {
  const { user } = useContext(UserContext);
  const [apologyText, setApologyText] = useState('');
  const [submittedText, setSubmittedText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [particles, setParticles] = useState([]);
  const [showCreateUser, setShowCreateUser] = useState(false);

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
        setParticles(createParticles()); // Create particles when text is submitted
        setTimeout(() => {
          setIsSubmitted(false);
          setParticles([]);
        }, 4000); // Reset after animation
      } else {
        throw new Error('Failed to submit apology');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Failed to submit your apology. Please try again.');
    });
  };

  const createParticles = () => {
    return Array.from({ length: 20 }, (_, index) => ({
      id: index,
      style: {
        left: `${50 + Math.random() * 50 - 25}%`, 
        top: `${Math.random() * 20 - 10}px`, 
      }
    }));
  };
  

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
        {particles.map(particle => (
          <div key={particle.id} className="particle" style={particle.style}></div>
        ))}
      </div>
      <Row className="button-container">
        <Col>
          <Button className="submit-button" onClick={handleExperienceRelease}>Apologize Anonymously</Button>
        </Col>
        <Col>
          {!user && (
            <Button className="details-button" onClick={() => setShowCreateUser(true)}>Make it personal</Button>
          )}
        </Col>
      </Row>
      <Modal show={showCreateUser} onHide={() => setShowCreateUser(false)} centered>
        <Modal.Body>
          <CreateUser onUserCreated={() => setShowCreateUser(false)} />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default HomePage;
