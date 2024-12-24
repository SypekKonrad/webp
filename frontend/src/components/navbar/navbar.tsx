import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';

const Navbar: React.FC = () => (
    <nav className="navbar">
        <div className="navbar-container">
              <ul className="navbar-links">
                <li className="navbar-item">
                  <Link to="/" className="navbar-link">Home</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/contact-me" className="navbar-link">Contact Me</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/car-data" className="navbar-link">Refueling Data</Link>
                </li>
              </ul>
        </div>
    </nav>
);

export default Navbar;
