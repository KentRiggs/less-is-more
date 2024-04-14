import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import './index.css'; 

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
            setUsername('');
            setEmail('');
            setPassword('');
            setError("");
        })
        .catch((error) => {
            console.error('Registration error:', error);
            setError(error.message); 
        });
    };

    return (
        <div className="create-user-modal">
            <Form className="create-user-form" onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicUsername">
                    <Form.Control
                        className="create-user-input"
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="formBasicEmail">
                    <Form.Control
                        className="create-user-input"
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                    <Form.Control
                        className="create-user-input"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>

                {error && <div className="create-user-error">{error}</div>}

                <Button className="create-user-button" variant="primary" type="submit">
                    Create Account
                </Button>
            </Form>
        </div>
    );
}

export default CreateUser;