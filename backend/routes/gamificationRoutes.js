const express = require("express");
const router = express.Router();

router.get("/gamification/:userId", (req, res) => {
  const userId = req.params.userId;

  // Mock logic for gamification data
  const gamificationData = {
    savings: 1200,
    budgetAdherence: 25,
    investmentGrowth: 12,
    streak: 5,
  };

  res.json(gamificationData);
});

module.exports = router;
