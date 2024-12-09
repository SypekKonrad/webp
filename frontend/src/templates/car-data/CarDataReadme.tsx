import React, { useEffect } from 'react';import './CarData.css';
import { useCarData } from '../../context/CarDataContext';
const CarDataReadme: React.FC = () => {
    const { fetchCarData } = useCarData();

    useEffect(() => {
        fetchCarData();
    }, [fetchCarData]);
  return (
    <div className="car-data-container">

      <h1>Car Data </h1>
      <p>
        tu bedzie jakies projektowe readme
      </p>
    </div>
  );
};

export default CarDataReadme;
