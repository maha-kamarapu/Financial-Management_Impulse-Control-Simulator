const Budget = require("../models/migration").Budget;
const Goal = require("../models/migration").Goal;

// Add Budget
const addBudget = async (req, res) => {
  try {
    const { month, totalBudget } = req.body;
    const userId = req.user.id; // Extract user ID from token
    const budget = await Budget.create({ userId, month, totalBudget });
    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ error: "Failed to add budget" });
  }
};

// Get Budget
const getBudget = async (req, res) => {
  try {
    const userId = req.user.id;
    const budgets = await Budget.findAll({ where: { userId } });
    res.status(200).json(budgets);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch budgets" });
  }
};

// Add Goal
const addGoal = async (req, res) => {
  try {
    const { goalName, targetAmount, deadline } = req.body;
    const userId = req.user.id; // Extract user ID from token
    const goal = await Goal.create({ userId, goalName, targetAmount, deadline });
    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ error: "Failed to add goal" });
  }
};

// Get Goals
const getGoals = async (req, res) => {
  try {
    const userId = req.user.id;
    const goals = await Goal.findAll({ where: { userId } });
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch goals" });
  }
};

module.exports = { addBudget, getBudget, addGoal, getGoals };
