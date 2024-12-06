import React from 'react';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {  Routes, Route, Link, useLocation } from 'react-router-dom';
// BrowserRouter,
import CarDataNavbar from './components/CarDataNavbar/CarDataNavbar';
import Navbar from './components/navbar/navbar';



import Home from './templates/Home';
import CarDataReadme from './templates/car-data/CarDataReadme';
import CarDataRaw from './templates/car-data/CarDataRaw';

import './App.css';


function App() {
    const location = useLocation();

    return (
    <div className="App">
      {/* Always render the main Navbar */}
      <Navbar />

      {/* Conditionally render the CarDataNavbar only for /car-data routes */}
      {location.pathname.startsWith('/car-data') && <CarDataNavbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/car-data" element={<CarDataReadme />} />
        <Route path="/car-data/raw" element={<CarDataRaw />} />
      </Routes>
    </div>
  );
};





export default App;
