const express = require('express');
const pool = require('../db');
const router = express.Router();

router.post('/withdraw', async (req, res) => {
  const { userId, investmentId, withdrawalAmount } = req.body;

  try {
    // Fetch current investment details
    const investment = await pool.query(
      'SELECT * FROM investments WHERE id = $1 AND user_id = $2',
      [investmentId, userId]
    );

    if (investment.rowCount === 0) {
      return res.status(404).json({ error: 'Investment not found.' });
    }

    const { current_value, investment_amount } = investment.rows[0];

    // Calculate profit/loss
    const profitLoss = (current_value - investment_amount).toFixed(2);

    // Add withdrawal record
    await pool.query(
      'INSERT INTO withdrawals (user_id, investment_id, withdrawal_amount, profit_loss) VALUES ($1, $2, $3, $4)',
      [userId, investmentId, withdrawalAmount, profitLoss]
    );

    // Update remaining investment value
    const newCurrentValue = (current_value - withdrawalAmount).toFixed(2);
    await pool.query(
      'UPDATE investments SET current_value = $1 WHERE id = $2',
      [newCurrentValue, investmentId]
    );

    res.json({ message: 'Withdrawal successful!', profitLoss });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred during withdrawal.' });
  }
});


// Fetch all investments for a user
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM investments WHERE user_id = $1 ORDER BY last_updated DESC`,
      [userId]
    );
    res.status(200).json({ investments: result.rows });
  } catch (error) {
    console.error('Error fetching investments:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add a new investment
router.post('/', async (req, res) => {
  const { userId, assetName, investmentAmount, dateInvested } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO investments (user_id, asset_name, investment_amount, current_value, date_invested)
       VALUES ($1, $2, $3, $3, $4) RETURNING *`,
      [userId, assetName, investmentAmount, dateInvested]
    );
    res.status(201).json({ message: 'Investment added successfully', investment: result.rows[0] });
  } catch (error) {
    console.error('Error adding investment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update the current value of an investment
router.put('/:investmentId', async (req, res) => {
  const { investmentId } = req.params;
  const { currentValue } = req.body;

  try {
    const result = await pool.query(
      `UPDATE investments SET current_value = $1, last_updated = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      [currentValue, investmentId]
    );
    res.status(200).json({ message: 'Investment updated successfully', investment: result.rows[0] });
  } catch (error) {
    console.error('Error updating investment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete an investment
router.delete('/:investmentId', async (req, res) => {
  const { investmentId } = req.params;

  try {
    await pool.query(`DELETE FROM investments WHERE id = $1`, [investmentId]);
    res.status(200).json({ message: 'Investment deleted successfully' });
  } catch (error) {
    console.error('Error deleting investment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Route to fetch aggregated investment analytics
router.get('/analytics/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
      const totalResult = await pool.query(
        `SELECT SUM(amount) AS total_investment 
         FROM investments 
         WHERE user_id = $1`,
        [userId]
      );
      const totalInvestment = totalResult.rows[0].total_investment || 0;
  
      const distributionResult = await pool.query(
        `SELECT assets.name AS asset_name, SUM(investments.amount) AS total_amount
         FROM investments
         INNER JOIN assets ON investments.asset_id = assets.id
         WHERE investments.user_id = $1
         GROUP BY assets.name
         ORDER BY total_amount DESC`,
        [userId]
      );
      const distribution = distributionResult.rows;
  
      res.status(200).json({
        message: 'Investment analytics fetched successfully',
        totalInvestment,
        distribution,
      });
    } catch (error) {
      console.error('Error fetching investment analytics:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

// Fetch investment history for a user
router.get('/history/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
      const result = await pool.query(
        `SELECT investments.id, investments.amount, investments.created_at, 
                assets.name AS asset_name
         FROM investments
         INNER JOIN assets ON investments.asset_id = assets.id
         WHERE investments.user_id = $1
         ORDER BY investments.created_at DESC`,
        [userId]
      );
  
      res.status(200).json({
        message: 'Investment history fetched successfully',
        investments: result.rows,
      });
    } catch (error) {
      console.error('Error fetching investment history:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

// Handle investments
router.post('/invest', async (req, res) => {
  const { userId, assetId, amount } = req.body;

  if (!userId || !assetId || !amount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO investments (user_id, asset_id, amount, created_at)
       VALUES ($1, $2, $3, NOW()) RETURNING *`,
      [userId, assetId, amount]
    );

    res.status(201).json({
      message: 'Investment saved successfully',
      investment: result.rows[0],
    });
  } catch (error) {
    console.error('Error saving investment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Handle investment request
router.post('/invest', async (req, res) => {
  const { userId, assetId, amount } = req.body;

  
  if (amount <= 0) {
    return res.status(400).send({ message: 'Investment amount must be greater than zero' });
  }

  try {
    
    const userInvestmentCheck = await pool.query(
      'SELECT * FROM user_investments WHERE user_id = $1 AND asset_id = $2',
      [userId, assetId]
    );

    if (userInvestmentCheck.rows.length > 0) {
      return res.status(400).send({ message: 'You have already invested in this asset.' });
    }

    const result = await pool.query(
      'INSERT INTO user_investments (user_id, asset_id, amount) VALUES ($1, $2, $3) RETURNING *',
      [userId, assetId, amount]
    );
    res.status(200).send({ message: 'Investment successful!', investment: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


// Endpoint to handle user investment in a virtual asset
router.post('/invest', async (req, res) => {
  const { userId, assetId, amount } = req.body;

  try {
    const assetResult = await pool.query('SELECT * FROM virtual_assets WHERE id = $1', [assetId]);
    const asset = assetResult.rows[0];

    if (!asset) {
      return res.status(400).send({ message: 'Asset not found' });
    }

    const totalInvestment = asset.current_price * amount;

    await pool.query(
      'INSERT INTO user_investments (user_id, asset_id, amount) VALUES ($1, $2, $3)',
      [userId, assetId, totalInvestment]
    );

    res.status(200).send({ message: 'Investment successful', totalInvestment });
  } catch (error) {
    console.error('Error processing investment:', error);
    res.status(500).send({ message: 'Error processing investment' });
  }
});

// Fetch user portfolio
router.get('/portfolio', async (req, res) => {
  const { userId } = req.query;

  try {
    const result = await pool.query(
      'SELECT ui.*, va.asset_name, va.current_price FROM user_investments ui JOIN virtual_assets va ON ui.asset_id = va.id WHERE ui.user_id = $1',
      [userId]
    );
    
    const portfolio = result.rows.map(investment => ({
      assetName: investment.asset_name,
      currentPrice: investment.current_price,
      amount: investment.amount,
      totalValue: investment.amount * investment.current_price,
    }));

    res.status(200).send(portfolio);
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    res.status(500).send({ message: 'Error fetching portfolio' });
  }
});

module.exports = router;
