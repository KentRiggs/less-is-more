import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Button, Alert } from 'react-bootstrap';

const NavigationBar = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:5555/check_session", {
            credentials: 'include'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Session not valid or expired');
                }
                return response.json();
            })
            .then(data => setUser(data))
            .catch(error => {
                setUser(null);
                setError(error.message);
            });
    }, []);

    const handleLogout = () => {
        fetch("http://localhost:5555/logout", { 
            method: 'DELETE', 
            credentials: 'include'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to logout');
                }
                setUser(null);
                navigate('/');
            })
            .catch(error => {
                console.error('Logout error:', error);
                setError('Logout failed. Please try again.');
            });
    };

    return (
        <Navbar className="custom-navbar" expand="lg">
            <Nav className="mr-auto">
                <Nav.Link as={NavLink} to="/" className="nav-button">Home</Nav.Link>
                <Nav.Link as={NavLink} to="/engage" className="nav-button">Engage</Nav.Link>
                <Nav.Link as={NavLink} to="/memorial" className="nav-button">Memorial</Nav.Link>
                <Nav.Link as={NavLink} to="/amend" className="nav-button">Amend</Nav.Link>
                {user ? (
                    <Button onClick={handleLogout} variant="outline-danger" className="login-button">Logout</Button>
                ) : (
                    <Nav.Link as={NavLink} to="/login" className="login-button">Login</Nav.Link>
                )}
            </Nav>
            {error && <Alert variant="danger">{error}</Alert>}
        </Navbar>
    );
};

export default NavigationBar;
