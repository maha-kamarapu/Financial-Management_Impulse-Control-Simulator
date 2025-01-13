import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import FinancialLiteracyGame from './pages/FinancialLiteracyGame';
import AddDebtPage from './pages/AddDebtPage';  
import AddSavingPage from './pages/AddSavingPage'; 
import './App.css';
import Navbar from "./components/Navbar"; 
import FinancialInsightsPage from "./pages/FinancialInsightsPage";
import BudgetAndGoalsPage from "./pages/BudgetAndGoalsPage";
import authService from "./services/authService"; 
import DebtTrackerPage from "./pages/DebtTrackerPage";
import InvestmentPage from './InvestmentPage';
import PortfolioPage from './PortfolioPage';
import InvestmentHistoryPage from './pages/InvestmentHistoryPage';
import FinancialGoalsPage from './pages/FinancialGoalsPage';
import InvestmentSimulationPage from './pages/InvestmentSimulationPage';
import BudgetGamePage from "./pages/BudgetGamePage";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";


const App = () => {
  const isAuthenticated = authService.isAuthenticated(); 

  // State for dark mode
  const [darkMode, setDarkMode] = useState(false);

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`app-container ${darkMode ? "dark-mode" : ""}`}>
      <Router>
        {/* Pass toggleDarkMode and darkMode state to the Navbar */}
        <Navbar toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/dashboard"
            element={isAuthenticated ? <DashboardPage /> : <Navigate to="/" />}
          />
          <Route
            path="/financial-literacy-game"
            element={isAuthenticated ? <FinancialLiteracyGame /> : <Navigate to="/" />}
          />
          <Route
            path="/financial-insights"
            element={isAuthenticated ? <FinancialInsightsPage /> : <Navigate to="/" />}
          />
          <Route
            path="/budget-and-goals"
            element={isAuthenticated ? <BudgetAndGoalsPage /> : <Navigate to="/" />}
          />
          <Route
            path="/add-debt"
            element={isAuthenticated ? <AddDebtPage /> : <Navigate to="/" />}
          />
          <Route
            path="/add-saving"
            element={isAuthenticated ? <AddSavingPage /> : <Navigate to="/" />}
          />
          <Route
            path="/debt-tracker"
            element={isAuthenticated ? <DebtTrackerPage /> : <Navigate to="/" />}
          />
          <Route
            path="/invest"
            element={isAuthenticated ? <InvestmentPage /> : <Navigate to="/" />}
          />
          <Route
            path="/portfolio"
            element={isAuthenticated ? <PortfolioPage /> : <Navigate to="/" />}
          />
          <Route path="/investment-history" 
            element={isAuthenticated ? <InvestmentHistoryPage /> : <Navigate to="/" />} 
          />
          <Route path="/financial-goals"
           element={isAuthenticated ? <FinancialGoalsPage /> : <Navigate to="/" />}
          />
          <Route path="/investment-simulation"
           element={isAuthenticated ? <InvestmentSimulationPage /> : <Navigate to="/" />} 
           />
           <Route path="/budget-game" 
           element={isAuthenticated ? <BudgetGamePage /> : <Navigate to="/" />} 
           />
           <Route path="/analytics-dashboard" 
           element={isAuthenticated ? <AnalyticsDashboard /> : <Navigate to="/" />} 
           />
        </Routes>
      </Router>
    </div>
  );
};

export default App;














