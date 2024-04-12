import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './components/UserContext';
import NavigationBar from './components/NavigationBar';
import HomePage from './components/HomePage';
import EngageModal from './components/Engage';  
import MemorialPage from './components/MemorialPage';
import AmendModal from './components/Amend';  

const App = () => {
    return (
        <UserProvider>
            <Router>
                <NavigationBar />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/engage" element={<EngageModal />} />
                    <Route path="/memorial" element={<MemorialPage />} />
                    <Route path="/amend" element={<AmendModal />} />
                </Routes>
            </Router>
        </UserProvider>
    );
};

export default App;
