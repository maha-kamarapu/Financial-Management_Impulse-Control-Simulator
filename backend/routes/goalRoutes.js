const express = require('express');
const pool = require('../db');
const router = express.Router();

// Fetch all goals for a user
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM goals WHERE user_id = $1 ORDER BY deadline ASC`,
      [userId]
    );
    res.status(200).json({ goals: result.rows });
  } catch (error) {
    console.error('Error fetching goals:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new goal
router.post('/', async (req, res) => {
  const { userId, title, description, targetAmount, deadline } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO goals (user_id, title, description, target_amount, deadline)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [userId, title, description, targetAmount, deadline]
    );
    res.status(201).json({ message: 'Goal created successfully', goal: result.rows[0] });
  } catch (error) {
    console.error('Error creating goal:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a goal's current amount
router.put('/:goalId', async (req, res) => {
  const { goalId } = req.params;
  const { currentAmount } = req.body;

  try {
    const result = await pool.query(
      `UPDATE goals SET current_amount = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      [currentAmount, goalId]
    );
    res.status(200).json({ message: 'Goal updated successfully', goal: result.rows[0] });
  } catch (error) {
    console.error('Error updating goal:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a goal
router.delete('/:goalId', async (req, res) => {
  const { goalId } = req.params;

  try {
    await pool.query(`DELETE FROM goals WHERE id = $1`, [goalId]);
    res.status(200).json({ message: 'Goal deleted successfully' });
  } catch (error) {
    console.error('Error deleting goal:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Fetch all goals for a user
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM goals WHERE user_id = $1 ORDER BY deadline ASC`,
      [userId]
    );
    res.status(200).json({ goals: result.rows });
  } catch (error) {
    console.error('Error fetching goals:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new goal
router.post('/', async (req, res) => {
  const { userId, title, description, targetAmount, deadline } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO goals (user_id, title, description, target_amount, deadline)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [userId, title, description, targetAmount, deadline]
    );
    res.status(201).json({ message: 'Goal created successfully', goal: result.rows[0] });
  } catch (error) {
    console.error('Error creating goal:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a goal's current amount
router.put('/:goalId', async (req, res) => {
  const { goalId } = req.params;
  const { currentAmount } = req.body;

  try {
    const result = await pool.query(
      `UPDATE goals SET current_amount = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      [currentAmount, goalId]
    );
    res.status(200).json({ message: 'Goal updated successfully', goal: result.rows[0] });
  } catch (error) {
    console.error('Error updating goal:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a goal
router.delete('/:goalId', async (req, res) => {
  const { goalId } = req.params;

  try {
    await pool.query(`DELETE FROM goals WHERE id = $1`, [goalId]);
    res.status(200).json({ message: 'Goal deleted successfully' });
  } catch (error) {
    console.error('Error deleting goal:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

