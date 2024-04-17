import React, { useState, useContext } from 'react';
import { UserContext } from './UserContext';
import './index.css';

function Login() {
    const { setUser } = useContext(UserContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(""); 

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
            setSuccess("Login successful!"); 
            setUsername(""); // Clear the username field
            setPassword(""); // Clear the password field
        })
        .catch((error) => {
            console.error('Login error:', error);
            setError(error.message);
            setSuccess(""); 
        });
    };

    return (
        <div className="login-modal">
            {error && <div className="login-alert alert alert-danger">{error}</div>}
            {success && <div className="login-alert alert alert-success">{success}</div>}
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
                    Log in
                </button>
            </form>
        </div>
    );
}

export default Login;
