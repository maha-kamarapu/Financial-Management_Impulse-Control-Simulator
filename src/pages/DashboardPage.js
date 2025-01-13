import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProgressChart from '../components/ProgressChart';
import Notifications from "../components/Notifications";
import Achievements from "../components/Achievements";

const token = localStorage.getItem("token");

const DashboardPage = () => {
  
  const progressData = [1000, 850, 700, 550, 400]; // Example: Debt reduction over months
  const progressLabels = ["January", "February", "March", "April", "May"]; // Months as labels

  const [notificationMessage, setNotificationMessage] = useState("");

  useEffect(() => {

    setNotificationMessage("Your next debt payment is due in 3 days!");
  }, []);

  return (
    <div>
      <h1>Your Financial Dashboard</h1>
      <p>Track your spending, savings, and financial goals here.</p>

      {/* Notifications */}
      {notificationMessage && <Notifications message={notificationMessage} />}

      {/* Progress Chart */}
      <ProgressChart data={progressData} labels={progressLabels} />

      {/* Financial Literacy Game Link */}
      <Link to="/game">
        <button>Start Financial Literacy Game</button>
      </Link>
      <Achievements token={token} />

      {/* Stocks simulation  */}
    <Link to="/investment-simulation">Investment Simulation</Link>

    {/* Budget Game Link */}
    <Link to="/budget-game">Budget Game</Link>

    {/* Analytics Link */}
    <Link to="/analytics-dashboard">Analytics Dashboard</Link>
  
    </div>
  );
}

export default DashboardPage;


