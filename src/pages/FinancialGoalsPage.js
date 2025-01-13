import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FinancialGoalsPage = () => {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    targetAmount: '',
    deadline: '',
  });

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const userId = 1; 
        const response = await axios.get(`/api/goals/${userId}`);
        setGoals(response.data.goals);
      } catch (error) {
        console.error('Error fetching goals:', error);
      }
    };

    fetchGoals();
  }, []);

  const handleInputChange = (e) => {
    setNewGoal({ ...newGoal, [e.target.name]: e.target.value });
  };

  const handleAddGoal = async () => {
    try {
      const userId = 1; 
      const response = await axios.post('/api/goals', {
        ...newGoal,
        userId,
      });
      setGoals([...goals, response.data.goal]);
      setNewGoal({ title: '', description: '', targetAmount: '', deadline: '' });
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  };

  return (
    <div>
      <h2>Financial Goals</h2>

      {/* Add New Goal */}
      <div>
        <h3>Add New Goal</h3>
        <input
          type="text"
          name="title"
          placeholder="Goal Title"
          value={newGoal.title}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="targetAmount"
          placeholder="Target Amount"
          value={newGoal.targetAmount}
          onChange={handleInputChange}
        />
        <input
          type="date"
          name="deadline"
          value={newGoal.deadline}
          onChange={handleInputChange}
        />
        <textarea
          name="description"
          placeholder="Description (optional)"
          value={newGoal.description}
          onChange={handleInputChange}
        />
        <button onClick={handleAddGoal}>Add Goal</button>
      </div>

      {/* Goals List */}
      <div>
        <h3>Current Goals</h3>
        {goals.map((goal) => (
          <div key={goal.id}>
            <h4>{goal.title}</h4>
            <p>Target Amount: ${goal.target_amount}</p>
            <p>Current Amount: ${goal.current_amount}</p>
            <p>Deadline: {new Date(goal.deadline).toLocaleDateString()}</p>
            <p>Description: {goal.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinancialGoalsPage;
