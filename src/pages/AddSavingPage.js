import React, { useState } from 'react';
import axios from 'axios';

const AddSavingPage = () => {
  const [saving, setSaving] = useState({
    name: '',
    amount: 0,
    targetAmount: 0,
    targetDate: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSaving((prevSaving) => ({
      ...prevSaving,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken'); 
      await axios.post(
        'http://localhost:5000/api/financial/saving',
        saving,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Saving added successfully!');
    } catch (error) {
      console.error('There was an error adding the saving:', error);
    }
  };

  return (
    <div>
      <h1>Add Saving</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Saving Name:</label>
          <input
            type="text"
            name="name"
            value={saving.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Amount:</label>
          <input
            type="number"
            name="amount"
            value={saving.amount}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Target Amount:</label>
          <input
            type="number"
            name="targetAmount"
            value={saving.targetAmount}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Target Date:</label>
          <input
            type="date"
            name="targetDate"
            value={saving.targetDate}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Add Saving</button>
      </form>
    </div>
  );
};

export default AddSavingPage;

