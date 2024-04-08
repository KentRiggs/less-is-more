import React from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';

const NavigationBar = () => {
    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand as={NavLink} to="/">My Apology App</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link as={NavLink} to="/">Home</Nav.Link>
                    <Nav.Link as={NavLink} to="/engage">Engage</Nav.Link>
                    <Nav.Link as={NavLink} to="/memorial">Memorial</Nav.Link>
                    <Nav.Link as={NavLink} to="/amend">Amend</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default NavigationBar;


