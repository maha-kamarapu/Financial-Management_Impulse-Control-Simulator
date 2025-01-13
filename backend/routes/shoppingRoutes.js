const express = require("express");
const { fetchProducts } = require("../controllers/shoppingController");
const router = express.Router();
const pool = require('../db');


router.post('/clear', async (req, res) => {
  const { userId } = req.body;

  try {
    const deleteQuery = 'DELETE FROM cart WHERE user_id = $1';
    await pool.query(deleteQuery, [userId]);

    res.status(200).send({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).send({ message: 'Error clearing cart' });
  }
});

router.get("/products", fetchProducts);

module.exports = router;
