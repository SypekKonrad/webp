// tu będzie wyswietlona tabelka z rawem
import React, {useEffect} from 'react';
import { useCarData } from '../../context/CarDataContext';

import './CarData.css';


const CarDataRaw: React.FC = () => {

  useEffect(() => {
    document.title = 'Raw Data';
  }, []);

  const { carData, loading, error } = useCarData();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="car-data-container">
      <h1>Raw Car Data</h1>
      {carData.length > 0 ? (
        <table className="car-data-table">
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
                <td>{car['Kilometers_Traveled']}</td>
                <td>{car.Liters}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default CarDataRaw;