import React, { useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Button, Alert, Modal } from 'react-bootstrap';
import Login from './Login';
import CreateUser from './CreateUser'; // Ensure you import CreateUser if it is used as a modal similar to Login
import { UserContext } from './UserContext';
import './index.css';

const NavigationBar = () => {
    const { user, setUser } = useContext(UserContext);
    const [error, setError] = useState('');
    const [showLogin, setShowLogin] = useState(false);
    const [showCreate, setShowCreate] = useState(false);  // State for showing the CreateUser modal
    const navigate = useNavigate();

    const handleLogout = () => {
        fetch("http://localhost:5555/logout", {
            method: 'DELETE',
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to logout');
            }
            localStorage.removeItem('user');  // Clear user from localStorage
            setUser(null);  // Clear user context
            navigate('/');  // Navigate to homepage after logout
        })
        .catch(error => {
            console.error('Logout error:', error);
            setError('Logout failed. Please try again.');  // Set error if logout fails
        });
    };

    const handleLoginModal = () => setShowLogin(!showLogin);
    const handleCreateModal = () => setShowCreate(!showCreate);  // Toggle function for showing/hiding the CreateUser modal

    return (
        <Navbar className="custom-navbar" expand="lg">
            <Nav className="mr-auto">
                <NavLink to="/" className="nav-button">Home</NavLink>
                <NavLink to="/engage" className="nav-button">Engage</NavLink>
                <NavLink to="/memorial" className="nav-button">Memorial</NavLink>
                <NavLink to="/amend" className="nav-button">Amend</NavLink>
                {user ? (
                    <>
                        <Button onClick={handleLogout} variant="outline-danger" className="login-button">Logout</Button>
                    </>
                ) : (
                    <>
                        <Button onClick={handleLoginModal} variant="outline-success" className="login-button">Login</Button>
                        <Button onClick={handleCreateModal} variant="outline-primary" className="login-button">Register</Button>
                    </>
                )}
            </Nav>
            {error && <Alert variant="danger">{error}</Alert>}
            <Modal show={showLogin} onHide={handleLoginModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Login</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Login onLogin={(user) => { 
                        localStorage.setItem('user', JSON.stringify(user));  // Store user in localStorage
                        setUser(user);  // Set user in context
                        setShowLogin(false);  // Close modal on successful login
                        navigate('/');  // Navigate to homepage
                    }} />
                </Modal.Body>
            </Modal>
            <Modal show={showCreate} onHide={handleCreateModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Create Account</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CreateUser onUserCreated={(user) => { 
                        localStorage.setItem('user', JSON.stringify(user));  // Store new user in localStorage
                        setUser(user);  // Set user in context
                        setShowCreate(false);  // Close modal on successful account creation
                        navigate('/');  // Navigate to homepage
                    }} />
                </Modal.Body>
            </Modal>
        </Navbar>
    );
};

export default NavigationBar;
