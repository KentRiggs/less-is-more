import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

function CreateUser({ onUserCreated }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch("http://localhost:5555/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, email, password }),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to create user. Please try different credentials.');
            }
            return response.json();
        })
        .then((user) => {
            if (typeof onUserCreated === "function") {
                onUserCreated(user);
            }
            // Clear the form fields after successful registration
            setUsername('');
            setEmail('');
            setPassword('');
            setError(""); // Also clear any existing error messages
        })
        .catch((error) => {
            console.error('Registration error:', error);
            setError(error.message); 
        });
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </Form.Group>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <Button variant="primary" type="submit">
                Create Account
            </Button>
        </Form>
    );
}

export default CreateUser;
