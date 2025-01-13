import React, { useState, useEffect } from "react";
import axios from "../services/authService";
import { Bar } from "react-chartjs-2";



function DebtTrackerPage() {
  const [debts, setDebts] = useState([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    fetchDebts();
  }, []);

  const fetchDebts = async () => {
    try {
      const response = await axios.get("/api/debts");
      setDebts(response.data);
    } catch (err) {
      console.error("Failed to fetch debts", err);
    }
  };

  const addDebt = async () => {
    try {
      await axios.post("/api/debt", { name, amount, dueDate });
      setName("");
      setAmount("");
      setDueDate("");
      fetchDebts();
    } catch (err) {
      console.error("Failed to add debt", err);
    }
  };

  const deleteDebt = async (id) => {
    try {
      await axios.delete(`/api/debt/${id}`);
      fetchDebts();
    } catch (err) {
      console.error("Failed to delete debt", err);
    }
  };

  
const chartData = {
    labels: debts.map((debt) => debt.name),
    datasets: [
      {
        label: "Debt Amount",
        data: debts.map((debt) => debt.amount),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };
  
  <Bar data={chartData} />;

  return (
    <div className="page-container">
      <h1>Debt Tracker</h1>
      <input
        type="text"
        placeholder="Debt Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <button onClick={addDebt}>Add Debt</button>

      <div className="debts-list">
        {debts.map((debt) => (
          <div key={debt.id} className="debt-item">
            <p>{debt.name} - ${debt.amount} (Due: {debt.dueDate})</p>
            <button onClick={() => deleteDebt(debt.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DebtTrackerPage;
