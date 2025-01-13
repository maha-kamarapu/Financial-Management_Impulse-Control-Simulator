const pool = require('../models/db');

const getAchievements = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming JWT middleware adds `req.user`
    const achievements = await Achievement.findAll({ where: { userId } });
    res.status(200).json(achievements);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch achievements." });
  }
};

// Add a new debt
exports.addDebt = async (req, res) => {
  try {
    const { name, amount, dueDate } = req.body;
    const userId = req.user.id;

    const debt = await Debt.create({
      userId,
      name,
      amount,
      dueDate,
    });

    res.status(201).json({ message: "Debt added successfully", debt });
  } catch (err) {
    res.status(500).json({ error: "Failed to add debt" });
  }
};

// Get all debts for a user
exports.getDebts = async (req, res) => {
  try {
    const userId = req.user.id;
    const debts = await Debt.findAll({ where: { userId } });

    res.status(200).json(debts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch debts" });
  }
};

// Delete a debt
exports.deleteDebt = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const debt = await Debt.findOne({ where: { id, userId } });
    if (!debt) return res.status(404).json({ error: "Debt not found" });

    await debt.destroy();
    res.status(200).json({ message: "Debt deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete debt" });
  }
};

// Get the transaction summary
const getTransactionSummary = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM transactions');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error querying the database');
  }
};

module.exports = { getTransactionSummary };
