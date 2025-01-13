import React, { useState } from 'react';
import axios from 'axios';

const AddDebtPage = () => {
  const [debt, setDebt] = useState({
    name: '',
    amount: 0,
    interestRate: 0,
    dueDate: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDebt((prevDebt) => ({
      ...prevDebt,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken'); 
      await axios.post(
        'http://localhost:5000/api/financial/debt',
        debt,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Debt added successfully!');
    } catch (error) {
      console.error('There was an error adding the debt:', error);
    }
  };

  return (
    <div>
      <h1>Add Debt</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Debt Name:</label>
          <input
            type="text"
            name="name"
            value={debt.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Amount:</label>
          <input
            type="number"
            name="amount"
            value={debt.amount}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Interest Rate (%):</label>
          <input
            type="number"
            name="interestRate"
            value={debt.interestRate}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Due Date:</label>
          <input
            type="date"
            name="dueDate"
            value={debt.dueDate}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Add Debt</button>
      </form>
    </div>
  );
};

export default AddDebtPage;

