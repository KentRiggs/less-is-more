import React, { useState, useContext } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import { UserContext } from './UserContext'; // Adjust the import path as needed

function Login() {
    const { setUser } = useContext(UserContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");  // State to handle any login errors

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch("http://localhost:5555/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Login failed. Please check your username and password and try again.');
            }
            return response.json();
        })
        .then((user) => {
            setUser(user);  
            setError("");  
        })
        .catch((error) => {
            console.error('Login error:', error);
            setError(error.message);
        });
    };

    return (
        <Form onSubmit={handleSubmit}>
            error && <Alert variant="danger">{error}</Alert>
            <Form.Group controlId="formBasicUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    required
                />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
            </Form.Group>
            <Button variant="primary" type="submit">
                Login
            </Button>
        </Form>
    );
}

export default Login;
