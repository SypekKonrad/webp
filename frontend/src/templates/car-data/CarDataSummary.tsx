import React, { useState, useEffect } from 'react';
import './CarData.css';
import { useAnalysisData } from '../../context/CarDataContext';

const CarDataSummary: React.FC = () => {

  useEffect(() => {
    document.title = 'Summary';
  }, []);

    const {analysisData, loading, error} = useAnalysisData();

    if (loading) return <p>Loading analysis data...</p>;
    if (error) return <p>{error}</p>;

    const seasonalAnalysis =
        analysisData?.seasonal_analysis?.map((season) => (
            <div key={season.Season} className="seasonal-analysis">
                <h4>{season.Season}</h4>
                <p>Fuel Consumption (L/100km): {season['Fuel consumption (L/100km)']}</p>
                <p>Fuel Efficiency (km/L): {season['Fuel Efficiency (km/L)']}</p>
            </div>
        )) || <p>No seasonal data available.</p>;

    return (
        <div className="car-data-summary">
            <h2>Car Data Analysis Summary</h2>
            <p>
                This summary provides insights into the fuel consumption patterns,
                expenditures, and seasonal efficiency trends for the Toyota Avensis T22.
            </p>

            <h3>Key Metrics</h3>
            <p>Total Fuel Expenditure: {analysisData?.total_expenditure?.toFixed(2)} PLN</p>
            <p>Total Fuel Used: {analysisData?.total_liters?.toFixed(2)} L</p>
            <p>Total Kilometers Traveled: {analysisData?.total_kms?.toFixed(2)}</p>
            <p>
                Average Fuel Expenditure per
                Refueling: {analysisData?.average_expenditure_per_refueling?.toFixed(2)} PLN
            </p>
            <p>Average Price per Kilometer: {analysisData?.average_price_per_km?.toFixed(2)} PLN</p>
            <p>Average Fuel Consumption: {analysisData?.average_fuel_consumption?.toFixed(2)} L/100km</p>

            <h3>Seasonal Analysis</h3>
            {seasonalAnalysis}


        </div>
    );
};
export default CarDataSummary;