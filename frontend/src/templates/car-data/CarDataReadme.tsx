import React from 'react';
import { Link } from 'react-router-dom';
import './CarData.css';

const CarDataReadme: React.FC = () => {
  return (
    <div className="car-data-container">
      <div className="button-container">

        <Link to="/car-data/raw">
          <button className="button">Raw Data</button>
        </Link>
        <Link to="/car-data/analysis">
          <button className="button">Analysis</button>
        </Link>
        <Link to="/car-data/summary">
          <button className="button">Project Summary</button>
        </Link>
        <Link to="/car-data/other">
          <button className="button">Other</button>
        </Link>
      </div>

      {/* Render a project summary or any other text */}
      <h1>Car Data Overview</h1>
      <p>
        Welcome to the Car Data project! This section gives an overview of the car data.
        You can navigate to different sections using the buttons above to explore raw data, analysis, or project summary.
      </p>
    </div>
  );
};

export default CarDataReadme;
