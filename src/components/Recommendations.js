import React from "react";

const Recommendations = ({ budgetStats, investmentStats }) => {
  // Analyze budget stats
  const totalSpent = budgetStats.reduce((acc, stat) => acc + stat.amount, 0);
  const totalSavings = budgetStats.find((stat) => stat.category === "Savings")?.amount || 0;
  const spendingAlert =
    totalSpent > 500
      ? "Your spending is higher than usual. Consider cutting down on discretionary expenses."
      : "Great job keeping your spending under control this week!";

  // Analyze investment stats
  const latestPortfolioValue =
    investmentStats.length > 0 ? investmentStats[investmentStats.length - 1].value : 0;
  const portfolioGrowth =
    investmentStats.length > 1
      ? (
          ((latestPortfolioValue - investmentStats[0].value) / investmentStats[0].value) *
          100
        ).toFixed(2)
      : 0;
  const investmentAlert =
    portfolioGrowth > 5
      ? "Your portfolio is growing steadily. Keep up the good work!"
      : "Consider diversifying your investments for better returns.";

  return (
    <div>
      <h3>Personalized Insights</h3>
      <p>{spendingAlert}</p>
      <p>{investmentAlert}</p>

      <h3>Recommendations</h3>
      <ul>
        <li>
          {totalSavings < 200
            ? "Your savings are a bit low. Aim to save at least 20% of your income."
            : "You’re on track with your savings goals. Keep it up!"}
        </li>
        <li>Review your budget and allocate more towards long-term goals.</li>
        <li>
          Explore low-risk investment options if you’re new to investing.
        </li>
      </ul>
    </div>
  );
};

export default Recommendations;
