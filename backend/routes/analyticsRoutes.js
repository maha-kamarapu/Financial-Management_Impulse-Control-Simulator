const express = require("express");
const router = express.Router();

// Mock investment stats
const investmentStats = [
  { date: "2025-01-01", value: 10200 },
  { date: "2025-01-02", value: 10350 },
  { date: "2025-01-03", value: 10175 },
  { date: "2025-01-04", value: 10500 },
];

// Mock budget scores
const budgetScores = [
  { gameId: 1, score: 80 },
  { gameId: 2, score: 95 },
  { gameId: 3, score: 90 },
];

router.get("/investment-stats", (req, res) => {
  res.json(investmentStats);
});

router.get("/budget-scores", (req, res) => {
  res.json(budgetScores);
});

module.exports = router;
