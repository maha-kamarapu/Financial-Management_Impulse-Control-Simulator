import React from "react";
import { Link } from "react-router-dom";


const Navbar = ({ toggleDarkMode, darkMode }) => {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item">
          <Link to="/">Home</Link>
        </li>
        <li className="navbar-item">
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li className="navbar-item">
          <Link to="/financial-literacy-game">Financial Literacy Game</Link>
        </li>
        <li className="navbar-item">
          <Link to="/financial-insights">Financial Insights</Link>
        </li>
        <li className="navbar-item">
          <Link to="/budget-and-goals">Budget and Goals</Link>
        </li>
        <li className="navbar-item">
        <Link to="/investment-history">Investment History</Link>
        </li>
      </ul>
      <button className="theme-toggle-btn" onClick={toggleDarkMode}>
        {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      </button>
    </nav>
  );
};

export default Navbar;

