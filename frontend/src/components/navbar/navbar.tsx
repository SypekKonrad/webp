import React from 'react';
import './navbar.css';

const Navbar: React.FC = () => (
    <nav className="navbar">
        <div className="navbar-container">
            {/*<div className="navbar-logo">tu bylo  niby logo"my app"</div>*/}
            <ul className="navbar-links">
                <li className="navbar-item"><a href="/" className="navbar-link">Home</a></li>
                <li className="navbar-item"><a href="/contact" className="navbar-link">Contact Me</a></li>
                {/*reful url dac*/}
                <li className="navbar-item"><a href="/contact" className="navbar-link">Refueling Data</a></li>

                {/*dac guzik do jakiegos socjalu/gita*/}
                {/*<li className="navbar-item"><a href="/contact" className="navbar-link">Github</a></li>*/}
            </ul>
        </div>
    </nav>
);

export default Navbar;
