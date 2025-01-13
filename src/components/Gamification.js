import React, { useEffect, useState } from "react";

const Gamification = ({ userStats }) => {
  const [badges, setBadges] = useState([]);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const earnedXp =
      (userStats.savings / 100) * 10 + 
      (userStats.budgetAdherence * 5) + 
      (userStats.investmentGrowth > 0 ? 50 : 0); // Bonus for positive investment growth
    setXp(earnedXp);

    setStreak(userStats.streak || 0);

    // Assign badges
    const earnedBadges = [];
    if (userStats.savings >= 1000) earnedBadges.push("Savings Pro");
    if (userStats.investmentGrowth > 10) earnedBadges.push("Investor Extraordinaire");
    if (userStats.budgetAdherence >= 30) earnedBadges.push("Budget Master");
    setBadges(earnedBadges);
  }, [userStats]);

  return (
    <div>
      <h3>Gamification Dashboard</h3>
      <div>
        <h4>XP Earned: {xp}</h4>
        <progress value={xp % 100} max="100"></progress>
        <p>Level: {Math.floor(xp / 100)}</p>
      </div>
      <div>
        <h4>Current Streak: {streak} days</h4>
      </div>
      <div>
        <h4>Badges Earned:</h4>
        <ul>
          {badges.map((badge, index) => (
            <li key={index}>{badge}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Gamification;
