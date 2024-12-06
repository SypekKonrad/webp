// CarDataNavbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';

import './CarDataNavbar.css';


const CarDataNavbar: React.FC = () => {
  return (
    <nav className="car-data-navbar">
      <div className="car-data-container">
        <div className="button-container">
          <Link to="/car-data">
            <button className="button">Readme</button>
          </Link>
          <Link to="/car-data/raw">
            <button className="button">Raw Data</button>
          </Link>
          <Link to="/car-data/analysis">
            <button className="button">Analysis</button>
          </Link>
          <Link to="/car-data/summary">
            <button className="button">Project Summary</button>
          </Link>

        </div>
      </div>
    </nav>
  );
};

export default CarDataNavbar;