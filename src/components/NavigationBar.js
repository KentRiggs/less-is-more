import React, { useState, useEffect, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Button, Alert, Modal } from 'react-bootstrap';
import Login from './Login';
import { UserContext } from './UserContext'; 

const NavigationBar = () => {
    const { user, setUser } = useContext(UserContext);
    const [error, setError] = useState('');
    const [showLogin, setShowLogin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
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
                    setError(error.message);
                });
        }
    }, [user, setUser]);

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

    const handleLoginModal = () => setShowLogin(!showLogin);

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
                    <Button onClick={handleLoginModal} variant="outline-success" className="login-button">Login</Button>
                )}
            </Nav>
            {error && <Alert variant="danger">{error}</Alert>}

            <Modal show={showLogin} onHide={handleLoginModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Login</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Login onLogin={(user) => { setUser(user); setShowLogin(false); navigate('/'); }} />
                </Modal.Body>
            </Modal>
        </Navbar>
    );
};

export default NavigationBar;
