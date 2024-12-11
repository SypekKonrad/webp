import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import './CarData.css';
import { useAnalysisData } from '../../context/CarDataContext';

const CarDataVisualization: React.FC = () => {
  const { analysisData, loading, error } = useAnalysisData();

  if (loading) return <p>Loading analysis data...</p>;
  if (error) return <p>{error}</p>;

  const fuelPriceData = analysisData?.seasonal_analysis.map((item) => ({
    name: item.Season,
    'Fuel Consumption (L/100km)': item['Fuel consumption (L/100km)'],
    'Fuel Efficiency (km/L)': item['Fuel Efficiency (km/L)'],
  }));

  const priceData = analysisData?.seasonal_analysis.map((item) => ({
    name: item.Season,
    'Price per km': analysisData.average_price_per_km,
  }));

  return (
    <div className="car-data-visualization">
      <h2>Car Data Analysis</h2>
      <div className="chart-container">
        {/* Fuel Price Over Time */}
        <LineChart
          width={600}
          height={300}
          data={fuelPriceData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="Fuel Consumption (L/100km)"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
          <Line type="monotone" dataKey="Fuel Efficiency (km/L)" stroke="#82ca9d" />
        </LineChart>

        {/* Price per Kilometer */}
        <LineChart
          width={600}
          height={300}
          data={priceData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="Price per km"
            stroke="#ff7300"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </div>

      <div className="summary-stats">
        <h3>Summary Statistics</h3>
        <p>Total Fuel Expenditure: {analysisData?.total_expenditure} PLN</p>
        <p>
          Average Fuel Expenditure per Refueling:{' '}
          {analysisData?.average_expenditure_per_refueling} PLN
        </p>
        <p>Average Price per Kilometer: {analysisData?.average_price_per_km} PLN</p>
        <p>
          Average Fuel Consumption (L/100km):{' '}
          {analysisData?.average_fuel_consumption} L/100km
        </p>
      </div>
    </div>
  );
};

export default CarDataVisualization;