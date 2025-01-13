import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { login, register } from '../services/authService';

const HomePage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const data = await login(email, password);
        console.log('Login successful:', data);
      } else {
        const data = await register(name, email, password);
        console.log('Registration successful:', data);

      }
      setError('');
    } catch (err) {
      setError('Error: ' + (err.response?.data || err.message || err));
    }
  };

  return (
    <div>
      <h1>Welcome to the Impulse Control and Financial Wellness Simulator</h1>
      <p>Take control of your financial health today by signing in or registering.</p>
      
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div>
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <p>
        {isLogin ? (
          <span>
            Don't have an account?{' '}
            <button onClick={() => setIsLogin(false)}>Register</button>
          </span>
        ) : (
          <span>
            Already have an account?{' '}
            <button onClick={() => setIsLogin(true)}>Login</button>
          </span>
        )}
      </p>

      <Link to="/dashboard">
        <button>Start Now (After Logging In)</button>
      </Link>
    </div>
  );
};

export default HomePage;

