const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../models/db');

// Helper function to validate required fields
const validateFields = (fields, res) => {
  for (const field of fields) {
    if (!field) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }
  }
  return null; 
};

// Register user
const registerUser = async (req, res) => {
  const { name, email, password, date_of_birth } = req.body;

  // Validate input
  const validationError = validateFields([name, email, password, date_of_birth], res);
  if (validationError) return validationError;

  try {
    // Check if user already exists
    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save new user to database
    const result = await pool.query(
      'INSERT INTO users (name, email, password, date_of_birth) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, hashedPassword, date_of_birth]
    );

    // Create JWT token
    const token = jwt.sign(
      { userId: result.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
    });
  } catch (err) {
    console.error('Error registering user:', err.message);
    res.status(500).json({ message: 'Error registering user' });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  const validationError = validateFields([email, password], res);
  if (validationError) return validationError;

  try {
    // Find user by email
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (!result.rows[0]) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
    });
  } catch (err) {
    console.error('Error logging in:', err.message);
    res.status(500).json({ message: 'Error logging in' });
  }
};

const getUserProfile = async (req, res) => {
  const userId = req.user.userId;  
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (!result.rows[0]) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching user profile:', err.message);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
};

module.exports = { registerUser, loginUser, getUserProfile };


  

