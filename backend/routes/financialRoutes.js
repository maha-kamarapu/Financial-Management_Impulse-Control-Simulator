const express = require('express');
const { getTransactionSummary, addDebt, getDebts, deleteDebt, getAchievements  } = require('../controllers/financialController');
const router = express.Router();
const { Expense, Debt, Saving } = require('../models/financialModels');
const authenticateToken = require('../middleware/authMiddleware');
const { predictSpending } = require('../mlModels/financialPrediction');
const { authenticateToken } = require("../middleware/authMiddleware");
const {
  addBudget,
  getBudget,
  addGoal,
  getGoals,
} = require("../controllers/budgetGoalsController");


// Expense Routes
router.post('/addExpense', authenticateToken, async (req, res) => {
  try {
    const { category, amount, date } = req.body;
    const userId = req.user.id;
    const expense = await Expense.create({ category, amount, date, userId });
    res.status(200).json(expense);
  } catch (error) {
    res.status(500).send('Error adding expense');
  }
});

// Debt Routes
router.post('/addDebt', authenticateToken, async (req, res) => {
  try {
    const { name, amount, interestRate, dueDate } = req.body;
    const userId = req.user.id;
    const debt = await Debt.create({ name, amount, interestRate, dueDate, userId });
    res.status(200).json(debt);
  } catch (error) {
    res.status(500).send('Error adding debt');
  }
});

// Savings Routes
router.post('/addSaving', authenticateToken, async (req, res) => {
  try {
    const { goalName, targetAmount, currentAmount, targetDate } = req.body;
    const userId = req.user.id;
    const saving = await Saving.create({ goalName, targetAmount, currentAmount, targetDate, userId });
    res.status(200).json(saving);
  } catch (error) {
    res.status(500).send('Error adding saving goal');
  }
});


// Route for spending prediction
router.post('/predictSpending', authenticateToken, async (req, res) => {
    try {
      const { historicalData } = req.body; // Data format: [{ date: 'YYYY-MM-DD', spending: number }]
      const prediction = await predictSpending(historicalData);
      res.status(200).json({ prediction });
    } catch (error) {
      res.status(500).send('Error in spending prediction');
    }
  });



// Budget routes
router.post("/budget", authenticateToken, addBudget);
router.get("/budget", authenticateToken, getBudget);

// Goals routes
router.post("/goal", authenticateToken, addGoal);
router.get("/goal", authenticateToken, getGoals);


router.get("/achievements", authenticateToken, getAchievements);
router.get('/transactions', getTransactionSummary);
router.post("/debt", authenticateToken, addDebt);
router.get("/debts", authenticateToken, getDebts);
router.delete("/debt/:id", authenticateToken, deleteDebt);

module.exports = router;


