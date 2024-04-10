import React, { useState, useContext } from 'react';
import { UserContext } from './UserContext'; 
import './index.css'; // Ensure CSS is imported

function Login({ onClose }) { // `onClose` function passed as a prop to handle modal closing
    const { setUser } = useContext(UserContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");  

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
            setUsername(""); // Clear the username field
            setPassword(""); // Clear the password field
            if (onClose) {
                onClose(); // Close the modal
            }
        })
        .catch((error) => {
            console.error('Login error:', error);
            setError(error.message);
        });
    };

    return (
        <div className="login-modal">
            {error && <div className="login-alert alert alert-danger">{error}</div>}
            <form className="login-form" onSubmit={handleSubmit}>
                <input
                    className="login-input"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    required
                />
                <input
                    className="login-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button className="login-button btn btn-primary" type="submit">
                    Login
                </button>
            </form>
        </div>
    );
}

export default Login;
