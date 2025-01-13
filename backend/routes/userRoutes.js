const express = require('express');
const pool = require('../db');  
const router = express.Router();

router.put('/update-budget', async (req, res) => {
  const { userId, newBudget } = req.body;

  try {
    const updateQuery = 'UPDATE users SET budget = $1 WHERE id = $2';
    await pool.query(updateQuery, [newBudget, userId]);

    res.status(200).send({ message: 'Budget updated successfully' });
  } catch (error) {
    console.error('Error updating budget:', error);
    res.status(500).send({ message: 'Error updating budget' });
  }
});



// Simulate impulse control
router.post('/cart/impulse-control', async (req, res) => {
  const { userId } = req.body;

  try {
  
    const cartResult = await pool.query(
      'SELECT * FROM carts WHERE user_id = $1', 
      [userId]
    );
    
    const userResult = await pool.query(
      'SELECT * FROM users WHERE id = $1', 
      [userId]
    );
    
    const userBudget = userResult.rows[0].budget;
    const cartTotal = cartResult.rows.reduce((total, item) => total + item.price, 0);
    

    if (cartTotal > userBudget) {
      return res.status(400).json({
        message: 'You have exceeded your budget. Are you sure you want to proceed?',
        cartTotal,
        userBudget,
      });
    }

    res.status(200).json({
      message: 'You can proceed with the purchase.',
      cartTotal,
      userBudget,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to process impulse control' });
  }
});


// Add item to user's cart
router.post('/cart', async (req, res) => {
  const { userId, productId } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO carts (user_id, product_id) VALUES ($1, $2) RETURNING *', 
      [userId, productId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

// Get all products in a user's cart
router.get('/cart/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM carts JOIN products ON carts.product_id = products.id WHERE user_id = $1', 
      [userId]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve cart' });
  }
});

// Update user's budget
router.put('/user/:id/budget', async (req, res) => {
  const { id } = req.params;
  const { budget } = req.body;
  try {
    const result = await pool.query(
      'UPDATE users SET budget = $1 WHERE id = $2 RETURNING *', 
      [budget, id]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update budget' });
  }
});

module.exports = router;
