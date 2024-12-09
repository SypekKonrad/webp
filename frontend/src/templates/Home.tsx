import React, { useEffect } from 'react';
import './Home.css';


const Home = () => {
  useEffect(() => {
    document.title = 'Home ';
  }, []);

  return (
    <div className="body">
      <h2>Konrad Sypek</h2>
      <p>CS student @ University of Siedlce</p>
    </div>
  );
};

export default Home;