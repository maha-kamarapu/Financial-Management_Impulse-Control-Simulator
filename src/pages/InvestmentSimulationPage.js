import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { fetchStockPrices } from "../services/stockService"; // Import the service to fetch stock prices

const InvestmentSimulationPage = () => {
  const [investments, setInvestments] = useState([]);
  const [newInvestment, setNewInvestment] = useState({
    assetName: "",
    investmentAmount: "",
    dateInvested: "",
  });
  const [stockSymbol, setStockSymbol] = useState(""); 
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [XP, setXP] = useState(0); 
  const [badges, setBadges] = useState([]); 

  // Function to calculate profit/loss and percentage
  const calculateProfitLoss = (investment) => {
    const profitLoss = investment.current_value - investment.investment_amount;
    const profitLossPercent = ((profitLoss / investment.investment_amount) * 100).toFixed(2);
    return { profitLoss: profitLoss.toFixed(2), profitLossPercent };
  };

  // Check if ROI has changed significantly (greater than 5%)
  const checkSignificantROIChange = (investment) => {
    const { profitLossPercent } = calculateProfitLoss(investment);
    if (Math.abs(profitLossPercent) > 5) {
      alert(
        `Significant ROI change detected for ${investment.asset_name}: ${profitLossPercent}%`
      );
      setXP((prevXP) => prevXP + 100); // Award XP for significant profit/loss
      checkBadgeAchievements(100); // Check for badges after significant ROI change
    }
  };

  // Award badges based on XP thresholds
  const checkBadgeAchievements = (earnedXP) => {
    if (earnedXP >= 100) {
      setBadges((prevBadges) => [...prevBadges, "Big Investor Badge"]);
    }
    if (earnedXP > 200) {
      setBadges((prevBadges) => [...prevBadges, "Smart Investor Badge"]);
    }
    if (earnedXP >= 500) {
      setBadges((prevBadges) => [...prevBadges, "Master Investor Badge"]);
    }

    if (earnedXP >= 20) {
      setBadges((prevBadges) => [...prevBadges, "Big Gains Badge"]);
    }
    
    if (earnedXP <= -10) {
      setBadges((prevBadges) => [...prevBadges, "Loss Control Badge"]);
    }

  
    if (earnedXP >= 1 && !badges.includes("First Investment Badge")) {
      setBadges((prevBadges) => [...prevBadges, "First Investment Badge"]);
    }
  };


  const checkProfitLossBadges = (investment) => {
    const { profitLossPercent } = calculateProfitLoss(investment);

    // Big Gains badge for profit above 20%
    if (profitLossPercent > 20) {
      alert(`🎉 Achievement Unlocked! Big Gains on ${investment.asset_name}`);
      setBadges((prevBadges) => [...prevBadges, "Big Gains Badge"]);
      setXP((prevXP) => prevXP + 150); // Award XP for big gains
    }

    // Loss Control badge for loss below -10%
    if (profitLossPercent < -10) {
      alert(`⚠️ Achievement Unlocked! Loss Control on ${investment.asset_name}`);
      setBadges((prevBadges) => [...prevBadges, "Loss Control Badge"]);
      setXP((prevXP) => prevXP + 150); // Award XP for managing losses
    }


    // Frequent Investor
    if (investments.length >= 5) {
      setBadges((prevBadges) => [...prevBadges, "Frequent Investor Badge"]);
    }
    // Long-Term Investor
    const longTermInvestments = investments.filter(
      (investment) => new Date() - new Date(investment.date_invested) > 365 * 24 * 60 * 60 * 1000
    );
    if (longTermInvestments.length > 0) {
      setBadges((prevBadges) => [...prevBadges, "Long-Term Investor Badge"]);
    }

    
  };

  // Chart data for stock prices and investment performance
  const chartData = {
    labels: stockData.map((point) => new Date(point.time).toLocaleTimeString()),
    datasets: [
      {
        label: `Stock Price: ${stockSymbol}`,
        data: stockData.map((point) => point.price),
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 2,
        fill: false,
      },
      {
        label: "Investment Performance",
        data: investments.map((inv) => inv.current_value),
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  // Fetch investments from the API
  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const userId = 1; // Replace with dynamic user ID
        const response = await axios.get(`/api/investments/${userId}`);
        setInvestments(response.data.investments);
      } catch (error) {
        console.error("Error fetching investments:", error);
      }
    };

    fetchInvestments();
  }, []);

  // Fetch stock prices from the API
  const handleFetchStockData = async () => {
    setLoading(true);
    try {
      const data = await fetchStockPrices(stockSymbol);
      if (data.length === 0) {
        alert("No data available or API limit reached. Please try again later.");
      } else {
        setStockData(data);
      }
    } catch (error) {
      alert("Error fetching stock data. Please check your symbol or try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setNewInvestment({ ...newInvestment, [e.target.name]: e.target.value });
  };

  // Add a new investment
  const handleAddInvestment = async () => {
    try {
      const userId = 1; // Replace with dynamic user ID
      const response = await axios.post("/api/investments", {
        ...newInvestment,
        userId,
      });
      setInvestments([...investments, response.data.investment]);
      setNewInvestment({ assetName: "", investmentAmount: "", dateInvested: "" });

      // Reward XP for adding an investment
      setXP((prevXP) => prevXP + 30); 
      checkBadgeAchievements(30); 
    } catch (error) {
      console.error("Error adding investment:", error);
    }
  };

  // Function to handle withdrawals
  const handleWithdraw = async (investmentId, withdrawalAmount) => {
    try {
      const userId = 1; 
      const response = await axios.post("/api/investments/withdraw", {
        userId,
        investmentId,
        withdrawalAmount,
      });
      alert(response.data.message);

      setInvestments((prevInvestments) =>
        prevInvestments.map((inv) =>
          inv.id === investmentId
            ? { ...inv, current_value: inv.current_value - withdrawalAmount }
            : inv
        )
      );

      setXP((prevXP) => prevXP + 50);       checkBadgeAchievements(50); 
    } catch (error) {
      console.error("Error withdrawing funds:", error);
    }
  };

  return (
    <div>
      <h2>Investment Simulation</h2>

      {/* Add New Investment */}
      <div>
        <h3>Add New Investment</h3>
        <input
          type="text"
          name="assetName"
          placeholder="Asset Name"
          value={newInvestment.assetName}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="investmentAmount"
          placeholder="Investment Amount"
          value={newInvestment.investmentAmount}
          onChange={handleInputChange}
        />
        <input
          type="date"
          name="dateInvested"
          value={newInvestment.dateInvested}
          onChange={handleInputChange}
        />
        <button onClick={handleAddInvestment}>Add Investment</button>
      </div>

      {/* Investments List */}
      <div>
        <h3>Current Investments</h3>
        {investments.map((investment) => {
          const { profitLoss, profitLossPercent } = calculateProfitLoss(investment);
          checkSignificantROIChange(investment); // Check for significant ROI change
          checkProfitLossBadges(investment); // Check for profit/loss-related badges
          return (
            <div key={investment.id}>
              <h4>{investment.asset_name}</h4>
              <p>Investment Amount: ${investment.investment_amount}</p>
              <p>Current Value: ${investment.current_value}</p>
              <p>
                Profit/Loss: ${profitLoss} ({profitLossPercent}%)
              </p>
              <p>Date Invested: {new Date(investment.date_invested).toLocaleDateString()}</p>
              <button
                onClick={() =>
                  handleWithdraw(investment.id, prompt("Enter withdrawal amount:"))
                }
              >
                Withdraw
              </button>
            </div>
          );
        })}
      </div>

      {/* Stock Symbol Input */}
      <div>
        <input
          type="text"
          placeholder="Enter Stock Symbol (e.g., AAPL)"
          value={stockSymbol}
          onChange={(e) => setStockSymbol(e.target.value.toUpperCase())}
        />
        <button onClick={handleFetchStockData} disabled={loading}>
          {loading ? "Fetching..." : "Fetch Stock Prices"}
        </button>
      </div>

      {/* Display Chart */}
      <div>
        <h3>Investment Performance</h3>
        <Line data={chartData} />
      </div>

      {/* Display XP and Badges */}
      <div>
        <h3>Your XP: {XP}</h3>
        <h4>Badges:</h4>
        <ul>
          {badges.map((badge, index) => (
            <li key={index}>{badge}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InvestmentSimulationPage;







