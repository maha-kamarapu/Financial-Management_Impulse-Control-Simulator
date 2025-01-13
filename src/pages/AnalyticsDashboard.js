import React, { useEffect, useState } from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";
import Recommendations from "../components/Recommendations";
import Gamification from "../components/Gamification";
import axios from 'axios';

const AnalyticsDashboard = () => {
  const [investmentStats, setInvestmentStats] = useState([]);
  const [budgetGameScores, setBudgetGameScores] = useState([]);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [totalBudgetGames, setTotalBudgetGames] = useState(0);
  const [budgetStats, setBudgetStats] = useState([]);
  const [userStats, setUserStats] = useState({
    savings: 0,
    budgetAdherence: 0,
    investmentGrowth: 0,
    streak: 0,
  });
    
  useEffect(() => {
    // Fetch investment data from API
    const fetchInvestmentData = async () => {
      try {
        const response = await axios.get("/api/investment");  
        const investmentData = response.data;
        setInvestmentStats(investmentData);
        setPortfolioValue(investmentData[investmentData.length - 1].value);
      } catch (error) {
        console.error("Error fetching investment data:", error);
      }
    };

    // Fetch budget game scores from API
    const fetchBudgetGameScores = async () => {
      try {
        const response = await axios.get("/api/budget-game-scores"); 
        const budgetData = response.data;
        setBudgetGameScores(budgetData);
        setTotalBudgetGames(budgetData.length);
      } catch (error) {
        console.error("Error fetching budget game data:", error);
      }
    };

    // Fetch budget stats (e.g., spending categories) from API
    const fetchBudgetStats = async () => {
      try {
        const response = await axios.get("/api/budget-stats"); 
        const budgetData = response.data;
        setBudgetStats(budgetData);
      } catch (error) {
        console.error("Error fetching budget stats:", error);
      }
    };

    // Fetch user stats
    const fetchUserStats = async () => {
      try {
        const userId = 1; 
        const response = await axios.get(`/api/gamification/${userId}`);
        setUserStats(response.data); 
      } catch (error) {
        console.error("Error fetching user stats:", error);
      }
    };
  
    fetchInvestmentData();
    fetchBudgetGameScores();
    fetchBudgetStats();
    fetchUserStats();
  }, []);

  // Prepare data for charts
  const investmentChartData = {
    labels: investmentStats.map((data) => data.date),
    datasets: [
      {
        label: "Portfolio Value",
        data: investmentStats.map((data) => data.value),
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
      },
    ],
  };

  const budgetChartData = {
    labels: budgetGameScores.map((data) => `Game ${data.gameId}`),
    datasets: [
      {
        label: "Scores",
        data: budgetGameScores.map((data) => data.score),
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
      },
    ],
  };

  const pieChartData = {
    labels: budgetStats.map((stat) => stat.category),
    datasets: [
      {
        data: budgetStats.map((stat) => stat.amount),
        backgroundColor: [
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 206, 86, 0.2)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h2>Analytics Dashboard</h2>

      {/* Investment Simulator Section */}
      <div>
        <h3>Investment Simulator</h3>
        <p>Total Portfolio Value: ${portfolioValue.toFixed(2)}</p>
        <Line data={investmentChartData} />
      </div>

      {/* Budget Game Performance Section */}
      <div>
        <h3>Budget Game Performance</h3>
        <p>Total Games Played: {totalBudgetGames}</p>
        <Bar data={budgetChartData} />
      </div>

      {/* Budget Allocation Breakdown Section */}
      <div>
        <h3>Budget Allocation Breakdown</h3>
        <Pie data={pieChartData} />
      </div>

      {/* Recommendations Section */}
      <div>
        <h3>Personalized Insights and Recommendations</h3>
        <Recommendations
          budgetStats={budgetStats}
          investmentStats={investmentStats}
        />
      </div>
      {/* Add Gamification Section */}
      <div>
        <h3>Dopamine Games</h3>
        <Gamification userStats={userStats} />
      </div>
    
    </div>
  );
};

export default AnalyticsDashboard;

