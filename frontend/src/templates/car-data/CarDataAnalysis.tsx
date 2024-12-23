import React, { useState, useEffect } from 'react';
import './CarData.css';
import { useAnalysisData } from '../../context/CarDataContext';

const CarDataVisualization: React.FC = () => {
  const { analysisData, loading, error } = useAnalysisData();



  if (loading) return <p>Loading analysis data...</p>;
  if (error) return <p>{error}</p>;

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
          <li><strong>Power:</strong> 110 horsepower, 250 Nm of torque</li>
          <li><strong>Curb Weight:</strong> 1410 kg</li>
          <li><strong>Fuel Type:</strong> Diesel</li>
        </ul>
      </p>
       <p>
        <strong>Data Preparation:</strong>
      </p>
        <p>
            <ul>
                <li>Loaded and prepared data for analysis from CSV format.</li>
                <li>Transformed and cleaned data by converting dates and normalizing metrics.</li>
                <li>Developed a calculation for fuel consumption in liters per 100 kilometers.</li>
                <li>Calculated fuel costs and savings by analyzing average fuel consumption.</li>
            </ul>
        </p>
            {/* Plot Image */}
    {/*<h3>Fuel Consumption Over Time</h3>*/}
    <h3>Visualizing Fuel Consumption Over Time:</h3>
        <p>
            <ul>
                <li>We plot the fuel consumption over time (Date) as a line graph to see how fuel consumption has changed over time.</li>
                <li>A horizontal red dashed line represents the average fuel consumption across the dataset.</li>
            </ul>
        </p>
      {analysisData?.plot1_image ? (
          <img
            src={`data:image/png;base64,${analysisData.plot1_image}`}
            alt="Analysis Plot1"
            style={{ maxWidth: '100%' }}
          />
        ) : (
          <p>Loading Fuel Consumption Over Time plot...</p>
        )}

    {/*<h3>Liters Consumed vs. Kilometers Traveled</h3>*/}
    <h3>Visualizing the Relationship Between Kilometers Traveled and Liters Consumed:</h3>
         <p>
            <ul>
                <li>A scatter plot is created to visualize the relationship between kilometers traveled and liters of fuel consumed.</li>
                <li>A trend line (red dashed line) is fitted using polynomial regression, which helps in understanding the general relationship between the two variables.</li>
            </ul>
        </p>
      {analysisData?.plot2_image ? (
          <img
            src={`data:image/png;base64,${analysisData.plot2_image}`}
            alt="Analysis Plot2"
            style={{ maxWidth: '100%' }}
          />
        ) : (
          <p>Loading Fuel Consumption Over Time plot...</p>
        )}

    {/*<h3>Fuel Price Over Time</h3>*/}
    <h3>Fuel Expenditure and Price per Kilometer</h3>
        <p>
            This cell calculates key metrics for fuel cost analysis:
        </p>
        <p>
            <ul>
                <li>Total Expenditure: Cost of each refueling.</li>
                <li>Price per Kilometer: Cost to drive 1 kilometer.</li>
            </ul>
        </p>
        <p>
            Additionally, it computes:
        </p>
        <p>
            <ul>
                <li>Total Fuel Expenditure: Sum of all refueling costs.</li>
                <li>Average Fuel Expenditure per Refueling: Mean cost of refueling.</li>
                <li>Average Price per Kilometer: Average cost to drive 1 kilometer.</li>
            </ul>
        </p>

    <h3>Visualizing Fuel Price Trends Over Time</h3>
        <p>
            <ul>
                <li>A line plot is created to depict the trend of fuel prices (in PLN per liter) over time.</li>
                <li>Data points are marked with circles to highlight individual measurements.</li>
                <li>This visualization helps identify patterns or fluctuations in fuel prices, aiding in cost analysis.</li>
            </ul>
        </p>


      {analysisData?.plot3_image ? (
          <img
            src={`data:image/png;base64,${analysisData.plot3_image}`}
            alt="Analysis Plot3"
            style={{ maxWidth: '100%' }}
          />
        ) : (
          <p>Loading Fuel Consumption Over Time plot...</p>
        )}

    {/*<h3>Price per Kilometer Over Time</h3>*/}
    <h3>Analyzing Price per Kilometer and Fuel Efficiency</h3>
        <p>
            <ul>
                <li>A line plot visualizes the price per kilometer (PLN) over time, with data points marked for individual refueling events.</li>
                <li>The average price per kilometer is highlighted with a red dashed line, making it easy to compare fluctuations against the average value.</li>
            </ul>
        </p>

      {analysisData?.plot4_image ? (
          <img
            src={`data:image/png;base64,${analysisData.plot4_image}`}
            alt="Analysis Plot4"
            style={{ maxWidth: '100%' }}
          />
        ) : (
          <p>Loading Fuel Consumption Over Time plot...</p>
        )}

    <h3>Seasonal Analysis of Fuel Consumption and Efficiency</h3>
        <p>
            In this analysis, we categorize the refueling data by season (Winter, Spring, Summer, and Autumn) based on the month of the refuel date. For each season, we calculate the average fuel consumption (L/100km) and fuel efficiency (km/L). This helps in understanding how these factors change across different seasons.
        </p>
        <p>
            This visualization compares the average fuel consumption (L/100km) and fuel efficiency (km/L) across different seasons. Two bar charts are displayed side by side:
        </p>
      {analysisData?.plot5_image ? (
          <img
            src={`data:image/png;base64,${analysisData.plot5_image}`}
            alt="Analysis Plot5"
            style={{ maxWidth: '100%' }}
          />
        ) : (
          <p>Loading Fuel Consumption Over Time plot...</p>
        )}




    </div>




  </div>
);
};

export default CarDataVisualization;