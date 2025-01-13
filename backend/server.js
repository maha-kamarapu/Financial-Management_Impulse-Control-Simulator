require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const financialRoutes = require('./routes/financialRoutes');
const authRoutes = require('./routes/authRoutes');
const db = require('./models/db');
const app = express();
const shoppingRoutes = require("./routes/shoppingRoutes");
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
const userRoutes = require('./routes/userRoutes'); 
const investmentRoutes = require('./routes/investmentRoutes');
const cron = require('node-cron');
const pool = require('./db');
const stockRoutes = require("./routes/stockRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const recommendationsRoutes = require("./routes/recommendationsRoutes");
const gamificationRoutes = require("./routes/gamificationRoutes");

// Simulate market trends
cron.schedule('0 * * * *', async () => { 
  try {
    const investments = await pool.query('SELECT * FROM investments');
    const updates = investments.rows.map(async (investment) => {
      const randomChange = (Math.random() * 2 - 1).toFixed(2); 
      const newValue = (
        investment.current_value +
        (investment.current_value * randomChange) / 100
      ).toFixed(2);

      return pool.query(
        `UPDATE investments SET current_value = $1, last_updated = CURRENT_TIMESTAMP WHERE id = $2`,
        [newValue, investment.id]
      );
    });

    await Promise.all(updates);
    console.log('Market trends simulated successfully.');
  } catch (error) {
    console.error('Error simulating market trends:', error);
  }
});


app.use("/api", stockRoutes);
app.use('/api/investments', investmentRoutes);
app.use("/api", analyticsRoutes);


// Register routes
app.use('/api', userRoutes); 

app.use(express.json());
app.use("/api/shopping", shoppingRoutes);
app.use("/api", recommendationsRoutes);
app.use("/api", gamificationRoutes);

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);  // Authentication Routes

app.use('/api', financialRoutes);  // Financial Routes

app.get('/', (req, res) => {
  res.send('Impulse Control and Financial Wellness Simulator API');
});

db.sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });





