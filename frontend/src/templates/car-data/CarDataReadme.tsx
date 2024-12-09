import React, { useEffect } from 'react';import './CarData.css';
import { useCarData } from '../../context/CarDataContext';
const CarDataReadme: React.FC = () => {
    const { fetchCarData } = useCarData();

    useEffect(() => {
        fetchCarData();
    }, [fetchCarData]);

    return (
    <div className="readme-container">
      <h1>Car Refueling Data Analysis</h1>

      <section className="overview">
        <h2>🚗 Overview</h2>
        <p>
          Welcome to my car refueling data analysis project! I’ve collected real-world data from my car refueling habits to analyze key trends related to fuel consumption, costs, and driving behavior. This project showcases my skills in data collection, cleaning, and visualization, as well as how personal data can reveal actionable insights.
        </p>
      </section>

      <section className="goals">
        <h2>🎯 Project Goals</h2>
        <p><strong>Data Collection:</strong> Gathering real-world data on car refueling habits.</p>
        <p><strong>Data Cleaning:</strong> Structuring, completing, and cleaning the data.</p>
        <p><strong>Data Analysis:</strong> Analyzing fuel consumption, cost trends, and distance.</p>
        <p><strong>Visualization:</strong> Presenting insights in an easy-to-understand manner.</p>
        <p><strong>Learning Outcome:</strong> Improving my skills in data analysis and web development integration.</p>
      </section>

      <section className="features">
        <h2>🔍 Key Features</h2>
        <p><strong>Data Source:</strong> Real-world refueling log data.</p>
        <p><strong>Interactive Frontend:</strong> Built with React to display analysis results.</p>
        <p><strong>API Integration:</strong> Django backend serves processed data through an API.</p>
        <p><strong>Data Visualization:</strong> Graphs and charts to visualize trends in fuel efficiency and costs.</p>
      </section>

      <section className="technologies">
        <h2>🛠 Technologies Used</h2>
        <h3>Frontend</h3>
        <p><strong>React:</strong> Interactive and responsive UI.</p>
        <p><strong>Axios:</strong> For seamless API communication.</p>
        <p><strong>Chart.js/D3.js:</strong> For engaging data visualizations.</p>

        <h3>Backend</h3>
        <p><strong>Python:</strong> Core data processing and analysis.</p>
        <p><strong>Django REST Framework:</strong> For the API endpoint.</p>
        <p><strong>Pandas:</strong> For data cleaning and manipulation.</p>
        <p><strong>NumPy:</strong> For numerical operations.</p>

        <h3>Data Storage</h3>
        <p><strong>Google Sheets:</strong> A lightweight, real-time database for storing refueling logs.</p>

        <h3>Deployment</h3>
        <p><strong>AWS:</strong> Hosting and deployment (subject to final setup).</p>
      </section>

      <section className="insights">
        <h2>📊 Data Insights</h2>
        <p><strong>Fuel Economy:</strong> Track fuel consumption over time.</p>
        <p><strong>Travel Efficiency:</strong> Compare fuel usage against kilometers traveled.</p>
        <p><strong>Cost Analysis:</strong> Monitor fuel price changes and overall expenses.</p>
        <p><strong>Driving Trends:</strong> Understand seasonal and behavioral factors affecting efficiency.</p>
      </section>

      <section className="how-it-works">
        <h2>🚀 How It Works</h2>
        <p><strong>Data Collection:</strong> Logs stored in Google Sheets capture details like date, cost, kilometers traveled, and liters filled.</p>
        <p><strong>Backend API:</strong> A Django-based API processes and structures the raw data.</p>
        <p><strong>Frontend Display:</strong> React fetches the processed data and visualizes it through interactive charts.</p>
      </section>

      <section className="conclusion">
        <h2>📄 Conclusion</h2>
        <p>
          This project demonstrates how everyday data can provide valuable insights when analyzed properly. It showcases my ability to work across the entire development stack—from data collection to building interactive visualizations—while leveraging modern tools and technologies.
        </p>
      </section>
    </div>
  );

};

export default CarDataReadme;
