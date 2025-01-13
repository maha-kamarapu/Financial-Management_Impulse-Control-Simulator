const express = require("express");
const router = express.Router();
const pool = require("./db"); 


const getUserData = async (userId) => {
  try {
    const userQuery = 'SELECT income, spending FROM users WHERE id = $1';
    const investmentsQuery = 'SELECT type, value FROM investments WHERE user_id = $1';

    const userResult = await pool.query(userQuery, [userId]);
    const investmentsResult = await pool.query(investmentsQuery, [userId]);

    if (userResult.rows.length === 0) {
      throw new Error("User not found");
    }

    // Combine user data and investments data
    const userData = {
      income: userResult.rows[0].income,
      spending: userResult.rows[0].spending,
      investments: investmentsResult.rows, 
    };

    return userData;
  } catch (error) {
    console.error("Error fetching user data from the database:", error);
    throw new Error("Database query failed");
  }
};

// Logic to calculate spending alert
const calculateSpendingAlert = (userData) => {
  const spendingPercentage = (userData.spending / userData.income) * 100;
  if (spendingPercentage > 90) {
    return "Your spending is on the higher side this week. Try to reduce non-essential expenses.";
  }
  return "Your spending is within healthy limits this week.";
};

// Suggest investment diversification
const calculateInvestmentAlert = (userData) => {
  const totalInvestments = userData.investments.reduce((sum, inv) => sum + inv.value, 0);
  const stockPercentage = (userData.investments.find((inv) => inv.type === "stocks")?.value || 0) / totalInvestments * 100;
  
  if (stockPercentage > 70) {
    return "Consider diversifying your portfolio. Too much exposure to stocks may be risky.";
  }
  return "Your portfolio is well-diversified. Keep it up!";
};

// Suggestions based on user's data
const generateSuggestions = (userData) => {
  const suggestions = [];
  if (userData.spending / userData.income > 0.8) {
    suggestions.push("Try to save at least 20% of your income to build your emergency fund.");
  }
  if (userData.investments.some((inv) => inv.type === "stocks" && inv.value < 2000)) {
    suggestions.push("Consider investing more in low-risk assets such as bonds or mutual funds.");
  }
  suggestions.push("Review your budget allocations for entertainment and dining out to see if savings can be made.");
  return suggestions;
};

// Route for recommendations
router.get("/recommendations/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const userData = await getUserData(userId); // Get actual user data from the DB

    const spendingAlert = calculateSpendingAlert(userData); // Get spending alert
    const investmentAlert = calculateInvestmentAlert(userData); // Get investment alert
    const suggestions = generateSuggestions(userData); // Generate suggestions

    const recommendations = {
      spendingAlert,
      investmentAlert,
      suggestions,
    };

    res.json(recommendations); // Send recommendations as response
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to generate recommendations" });
  }
});

module.exports = router;


