// import React from 'react';
import { Link } from 'react-router-dom';
// import './CarData.css';
// import CarDataReadme from "./CarDataReadme";
// tu będzie wyswietlona tabelka z rawem
// export default CarDataRaw;

import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import './CarData.css';



const CarDataRaw: React.FC = () => {
  const [carData, setCarData] = useState<any[]>([]);

  useEffect(() => {
    const fetchCarData = async () => {
      try {
        const response = await fetch('/api/get_car_data/');
        const data = await response.json();
        setCarData(data);
      } catch (error) {
        console.error('Error fetching raw data:', error);
      }
    };

    fetchCarData();
  }, []);

  return (
    <div className="car-data-container">
      <h1>Raw Car Data</h1>
      {carData.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Price</th>
              <th>Kilometers Traveled</th>
              <th>Liters</th>
            </tr>
          </thead>
          <tbody>
            {carData.map((car, index) => (
              <tr key={index}>
                <td>{car.Date}</td>
                <td>{car.Price}</td>
                <td>{car['Kilometers Traveled']}</td>
                <td>{car.Liters}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No raw data available</p>
      )}
    </div>
  );
};

export default CarDataRaw;
