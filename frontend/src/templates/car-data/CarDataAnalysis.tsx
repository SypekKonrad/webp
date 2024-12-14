import React, { useState, useEffect } from 'react';
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
  const [plotImage, setPlotImage] = useState<string | null>(null);

  // Fetch the plot image
useEffect(() => {
  fetch('/api/analyze-car-data/')
    .then((response) => response.json())
    .then((data) => {
      // Assuming the API returns the base64 image string directly
      const base64Image = data.plot_image;
      setPlotImage(`data:image/png;base64,${base64Image}`);
    })
    .catch((error) => {
      console.error('Error fetching the plot image:', error);
    });
}, []);

  if (loading) return <p>Loading analysis data...</p>;
  if (error) return <p>{error}</p>;

  // Guard against undefined seasonal_analysis
  const fuelPriceData =
    analysisData?.seasonal_analysis?.map((item) => ({
      name: item.Season,
      'Fuel Consumption (L/100km)': item['Fuel consumption (L/100km)'],
      'Fuel Efficiency (km/L)': item['Fuel Efficiency (km/L)'],
    })) || [];

  const priceData =
    analysisData?.seasonal_analysis?.map((item) => ({
      name: item.Season,
      'Price per km': analysisData.average_price_per_km,
    })) || [];

return (
  <div className="car-data-visualization">
    <h2>Car Data Analysis</h2>
    <div className="intro-text">
      <p>
        <strong>Data Analysis and Visualization</strong>
      </p>
      <p>
        In this section, we perform data analysis and create visualizations to understand the fuel consumption patterns for the Toyota Avensis T22. The analysis is based on the cleaned data from the previous step.
      </p>
       <p>
        <strong>Car Specifications:</strong>
      </p>
      <p>
        <ul>
          <li><strong>Engine Type:</strong> 2.0L, inline 4, turbocharged</li>
          <li><strong>Power:</strong> 110 horsepower</li>
          <li><strong>Curb Weight:</strong> 1410 kg</li>
          <li><strong>Fuel Type:</strong> Diesel</li>
        </ul>
      </p>
            {/* Plot Image */}
      <div className="fuel-consumption-plot">
        <h3>Fuel Consumption Over Time</h3>
        {plotImage ? (
          <img src={plotImage} alt="Fuel Consumption Over Time" width="100%" />
        ) : (
          <p>Loading fuel consumption plot...</p>
        )}
      </div>
      <p>
        <strong>Seasonal Analysis of Fuel Consumption and Efficiency</strong>
      </p>
      <p>
        In this analysis, we categorize the refueling data by season (Winter, Spring, Summer, and Autumn) based on the month of the refuel date. For each season, we calculate the average fuel consumption (L/100km) and fuel efficiency (km/L). This helps in understanding how these factors change across different seasons.
      </p>
    </div>

    <div className="chart-container">
      {/* Fuel Price Over Time */}
      {fuelPriceData.length > 0 ? (
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
          <Line
            type="monotone"
            dataKey="Fuel Efficiency (km/L)"
            stroke="#82ca9d"
          />
        </LineChart>
      ) : (
        <p>No seasonal data available.</p>
      )}

      {/* Price per Kilometer */}
      {priceData.length > 0 ? (
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
      ) : (
        <p>No price data available.</p>
      )}
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