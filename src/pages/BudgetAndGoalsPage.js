import React, { useState, useEffect } from "react";
import axios from "axios";
import './App.css';

const BudgetAndGoalsPage = () => {
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [newBudget, setNewBudget] = useState({ month: "", totalBudget: "" });
  const [newGoal, setNewGoal] = useState({
    goalName: "",
    targetAmount: "",
    deadline: "",
  });

  useEffect(() => {
    fetchBudgets();
    fetchGoals();
  }, []);

  const fetchBudgets = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get("http://localhost:5000/financial/budget", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setBudgets(response.data);
  };

  const fetchGoals = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get("http://localhost:5000/financial/goal", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setGoals(response.data);
  };

  const handleAddBudget = async () => {
    const token = localStorage.getItem("token");
    await axios.post(
      "http://localhost:5000/financial/budget",
      newBudget,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    fetchBudgets();
  };

  const handleAddGoal = async () => {
    const token = localStorage.getItem("token");
    await axios.post(
      "http://localhost:5000/financial/goal",
      newGoal,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    fetchGoals();
  };

  return (
    <div>
      <h1>Budget and Goals</h1>

      <h2>Set Budget</h2>
      <input
        type="text"
        placeholder="Month"
        value={newBudget.month}
        onChange={(e) => setNewBudget({ ...newBudget, month: e.target.value })}
      />
      <input
        type="number"
        placeholder="Total Budget"
        value={newBudget.totalBudget}
        onChange={(e) =>
          setNewBudget({ ...newBudget, totalBudget: e.target.value })
        }
      />
      <button onClick={handleAddBudget}>Add Budget</button>

      <h2>Set Goal</h2>
      <input
        type="text"
        placeholder="Goal Name"
        value={newGoal.goalName}
        onChange={(e) => setNewGoal({ ...newGoal, goalName: e.target.value })}
      />
      <input
        type="number"
        placeholder="Target Amount"
        value={newGoal.targetAmount}
        onChange={(e) =>
          setNewGoal({ ...newGoal, targetAmount: e.target.value })
        }
      />
      <input
        type="date"
        value={newGoal.deadline}
        onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
      />
      <button onClick={handleAddGoal}>Add Goal</button>

      <h2>Your Budgets</h2>
      {budgets.map((budget, index) => (
        <div key={index}>
          <p>
            {budget.month}: ${budget.totalBudget} (Spent: ${budget.spent})
          </p>
        </div>
      ))}

      <h2>Your Goals</h2>
      {goals.map((goal, index) => (
        <div key={index}>
          <p>
            {goal.goalName}: Target ${goal.targetAmount} (Saved: $
            {goal.savedAmount})
          </p>
          <p>Deadline: {new Date(goal.deadline).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
};

export default BudgetAndGoalsPage;
