import React, { useState, useEffect, useContext } from 'react';
import { Button, Form } from 'react-bootstrap';
import { UserContext } from './UserContext';
import './index.css';

function CreateUser({ onUserCreated }) {
    const { setUser } = useContext(UserContext);  
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [apologyText, setApologyText] = useState("");
    const [recipient, setRecipient] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [eventLocation, setEventLocation] = useState("");
    const [category, setCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch('http://localhost:5555/categories/')
        .then(response => response.json())
        .then(data => setCategories(data))
        .catch(error => console.error('Error fetching categories:', error));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const userData = {
            username, 
            email, 
            password, 
            apology_text: apologyText, 
            recipient, 
            event_date: eventDate, 
            event_location: eventLocation, 
            category_id: category
        };

        fetch("http://localhost:5555/users_with_apology/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to create user and submit apology. Please try different credentials.');
            }
            return response.json();
        })
        .then((user) => {
            setUser(user);  
            if (typeof onUserCreated === "function") {
                onUserCreated(user);
            }
            // Clear all fields after successful registration and apology submission
            setUsername('');
            setEmail('');
            setPassword('');
            setApologyText('');
            setRecipient('');
            setEventDate('');
            setEventLocation('');
            setCategory('');
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
                    <Form.Control type="text" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </Form.Group>
                <Form.Group controlId="formBasicEmail">
                    <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                    <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </Form.Group>
                <Form.Group controlId="formApologyText">
                    <Form.Control type="text" placeholder="Apology text" value={apologyText} onChange={(e) => setApologyText(e.target.value)} />
                </Form.Group>
                <Form.Group controlId="formRecipient">
                    <Form.Control type="text" placeholder="Recipient" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
                </Form.Group>
                <Form.Group controlId="formEventDate">
                    <Form.Control type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
                </Form.Group>
                <Form.Group controlId="formEventLocation">
                    <Form.Control type="text" placeholder="Event location" value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} />
                </Form.Group>
                <Form.Group controlId="formCategory">
                    <Form.Control as="select" value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="">Select an apology Category</option>
                        {categories.map((category) => (
                            <option key={category.category_id} value={category.category_id}>{category.category_name}</option>
                        ))}
                    </Form.Control>
                </Form.Group>
                {error && <div className="create-user-error">{error}</div>}
                <Button className="create-user-button" variant="primary" type="submit">Create Account and Submit Apology</Button>
            </Form>
        </div>
    );
}

export default CreateUser;
