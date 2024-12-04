import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar/navbar';
import Home from './templates/Home';
import CarDataReadme from './templates/car-data/CarDataReadme';

import './App.css';


function App() {
    return (
        <BrowserRouter>
              {/* Wrap everything with BrowserRouter */}
            <div className="App">
                <Navbar /> {/* Render the Navbar */}

                {/* Routes handles rendering only the first matching route */}
                <Routes>
                  <Route path="/" element={<Home />} /> {/* Define route for Home */}
                  <Route path="/car-data" element={<CarDataReadme />} /> {/* Define route for Car Data */}
                </Routes>
            </div>
        </BrowserRouter>



    );
}

export default App;
