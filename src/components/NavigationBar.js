import React, { useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Button, Alert, Modal } from 'react-bootstrap';
import Login from './Login';
import { UserContext } from './UserContext';
import './index.css'; 

const NavigationBar = () => {
    const { user, setUser } = useContext(UserContext);
    const [error, setError] = useState('');
    const [showLogin, setShowLogin] = useState(false);
    const navigate = useNavigate();

    // Function to handle user logout
    const handleLogout = () => {
        fetch("http://localhost:5555/logout", { 
            method: 'DELETE', 
            credentials: 'include'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to logout');
                }
                setUser(null); // Clear user context
                navigate('/'); // Navigate to homepage after logout
            })
            .catch(error => {
                console.error('Logout error:', error);
                setError('Logout failed. Please try again.'); // Set error if logout fails
            });
    };

    // Toggle function for showing/hiding the login modal
    const handleLoginModal = () => setShowLogin(!showLogin);

    return (
        <Navbar className="custom-navbar" expand="lg">
            <Nav className="mr-auto">
                <NavLink to="/" className="nav-button">Home</NavLink>
                <NavLink to="/engage" className="nav-button">Engage</NavLink>
                <NavLink to="/memorial" className="nav-button">Memorial</NavLink>
                <NavLink to="/amend" className="nav-button">Amend</NavLink>
                {user ? (
                    <Button onClick={handleLogout} variant="outline-danger" className="login-button">Logout</Button>
                ) : (
                    <Button onClick={handleLoginModal} variant="outline-success" className="login-button">Login</Button>
                )}
            </Nav>
            {error && <Alert variant="danger">{error}</Alert>}

            <Modal show={showLogin} onHide={handleLoginModal} centered>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <Login onLogin={(user) => { 
                        setUser(user);  // Set user in context
                        setShowLogin(true);  // Close modal on successful login
                        navigate('/');  // Navigate to homepage
                    }} />
                </Modal.Body>
            </Modal>
        </Navbar>
    );
};

export default NavigationBar;
