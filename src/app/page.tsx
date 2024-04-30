'use client';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import  HomePage from './Home';
import Nav from './Home';

const App: React.FC = () => {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
    </Router>
  );
};

export default App;
