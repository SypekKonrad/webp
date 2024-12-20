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
  // const [plotImage, setPlotImage] = useState<string | null>(null);



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
    <h3>Fuel Consumption Over Time</h3>
      {analysisData?.plot1_image ? (
          <img
            src={`data:image/png;base64,${analysisData.plot1_image}`}
            alt="Analysis Plot"
            style={{ maxWidth: '100%' }}
          />
        ) : (
          <p>Loading Fuel Consumption Over Time plot...</p>
        )}

    <h3>Fuel Consumption Over Time</h3>
      {analysisData?.plot2_image ? (
          <img
            src={`data:image/png;base64,${analysisData.plot2_image}`}
            alt="Analysis Plot"
            style={{ maxWidth: '100%' }}
          />
        ) : (
          <p>Loading Fuel Consumption Over Time plot...</p>
        )}

    <h3>Fuel Consumption Over Time</h3>
      {analysisData?.plot3_image ? (
          <img
            src={`data:image/png;base64,${analysisData.plot3_image}`}
            alt="Analysis Plot"
            style={{ maxWidth: '100%' }}
          />
        ) : (
          <p>Loading Fuel Consumption Over Time plot...</p>
        )}

    <h3>Fuel Consumption Over Time</h3>
      {analysisData?.plot4_image ? (
          <img
            src={`data:image/png;base64,${analysisData.plot4_image}`}
            alt="Analysis Plot"
            style={{ maxWidth: '100%' }}
          />
        ) : (
          <p>Loading Fuel Consumption Over Time plot...</p>
        )}

    <h3>Fuel Consumption Over Time</h3>
      {analysisData?.plot5_image ? (
          <img
            src={`data:image/png;base64,${analysisData.plot5_image}`}
            alt="Analysis Plot"
            style={{ maxWidth: '100%' }}
          />
        ) : (
          <p>Loading Fuel Consumption Over Time plot...</p>
        )}


        <p>Total Expenditure: {analysisData?.total_expenditure || 'Loading...'}</p>
        <p>Average Expenditure per Refueling: {analysisData?.average_expenditure_per_refueling || 'Loading...'}</p>
        <p>Average Price per KM: {analysisData?.average_price_per_km || 'Loading...'}</p>
        <p>Average Fuel Consumption: {analysisData?.average_fuel_consumption || 'Loading...'}</p>
      <p>
        <strong>Seasonal Analysis of Fuel Consumption and Efficiency</strong>
      </p>
      <p>
        In this analysis, we categorize the refueling data by season (Winter, Spring, Summer, and Autumn) based on the month of the refuel date. For each season, we calculate the average fuel consumption (L/100km) and fuel efficiency (km/L). This helps in understanding how these factors change across different seasons.
      </p>
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