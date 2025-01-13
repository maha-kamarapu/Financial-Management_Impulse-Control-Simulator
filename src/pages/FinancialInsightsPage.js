import React, { useState } from 'react';
import axios from 'axios';

const FinancialInsightsPage = () => {
  const [historicalData, setHistoricalData] = useState([]);
  const [predictions, setPredictions] = useState(null);

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/financial/predictSpending',
        { historicalData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPredictions(response.data.prediction);
    } catch (err) {
      console.error('Error predicting spending:', err);
    }
  };

  return (
    <div>
      <h1>Financial Insights</h1>
      <div>
        <textarea
          placeholder="Enter historical data (e.g. [{date: '2022-01-01', spending: 100}, ...])"
          value={JSON.stringify(historicalData)}
          onChange={(e) => setHistoricalData(JSON.parse(e.target.value))}
        />
      </div>
      <button onClick={handleSubmit}>Predict Future Spending</button>
      {predictions && (
        <div>
          <h2>Predicted Spending</h2>
          <p>{JSON.stringify(predictions)}</p>
        </div>
      )}
    </div>
  );
};

export default FinancialInsightsPage;
