import React, { useState } from "react";

const BudgetGamePage = () => {
  const income = 5000; 
  const [allocation, setAllocation] = useState({
    housing: 0,
    food: 0,
    savings: 0,
    entertainment: 0,
  });

  const handleAllocationChange = (e) => {
    const { name, value } = e.target;
    setAllocation({ ...allocation, [name]: parseInt(value, 10) || 0 });
  };

  const handleSubmit = () => {
    const totalAllocation = Object.values(allocation).reduce((a, b) => a + b, 0);

    if (totalAllocation === income) {
      alert("Great job! Your budget is balanced.");
    } else if (totalAllocation > income) {
      alert("Your allocation exceeds your income. Try again!");
    } else {
      alert("You still have unallocated income. Adjust your budget.");
    }
  };

  return (
    <div>
      <h2>Budget Allocation Game</h2>
      <p>Monthly Income: ${income}</p>

      <div>
        <label>
          Housing:
          <input
            type="number"
            name="housing"
            value={allocation.housing}
            onChange={handleAllocationChange}
          />
        </label>
        <label>
          Food:
          <input
            type="number"
            name="food"
            value={allocation.food}
            onChange={handleAllocationChange}
          />
        </label>
        <label>
          Savings:
          <input
            type="number"
            name="savings"
            value={allocation.savings}
            onChange={handleAllocationChange}
          />
        </label>
        <label>
          Entertainment:
          <input
            type="number"
            name="entertainment"
            value={allocation.entertainment}
            onChange={handleAllocationChange}
          />
        </label>
      </div>

      <button onClick={handleSubmit}>Submit Budget</button>
    </div>
  );
};

export default BudgetGamePage;

