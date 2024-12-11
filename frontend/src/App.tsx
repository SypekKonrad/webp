import React from 'react';
import {  Routes, Route, Link, useLocation } from 'react-router-dom';
import CarDataNavbar from './components/CarDataNavbar/CarDataNavbar';
import Navbar from './components/navbar/navbar';
import { CarDataProvider } from './context/CarDataContext';
import Home from './templates/Home';
import CarDataReadme from './templates/car-data/CarDataReadme';
import CarDataRaw from './templates/car-data/CarDataRaw';
import CarDataAnalysis from "./templates/car-data/CarDataAnalysis";

import './App.css';


function App() {
    const location = useLocation();

    return (
    <div className="App">
        {/*global navbar*/}
      <Navbar />

        {/*car data navbar*/}
      {location.pathname.startsWith('/car-data') && <CarDataNavbar />}

      <Routes>
        <Route path="/" element={<Home />} />

        <Route
            path="/car-data/*"
            element={
              <CarDataProvider>
                <CarDataRoutes />
              </CarDataProvider>
            }
          />

      </Routes>
    </div>
  );
};

const CarDataRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="" element={<CarDataReadme />} />
      <Route path="raw" element={<CarDataRaw />} />
      <Route path="analysis" element={<CarDataAnalysis />} />
    </Routes>
  );
};




export default App;
