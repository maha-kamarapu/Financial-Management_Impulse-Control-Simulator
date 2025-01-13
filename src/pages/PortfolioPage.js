import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PortfolioPage = () => {
  const [portfolio, setPortfolio] = useState([]);
  
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await axios.get('/api/investments/portfolio', { params: { userId: 1 } });
        setPortfolio(response.data);
      } catch (error) {
        console.error('Error fetching portfolio:', error);
      }
    };

    fetchPortfolio();
  }, []);

  return (
    <div>
      <h1>Your Investment Portfolio</h1>
      <table>
        <thead>
          <tr>
            <th>Asset Name</th>
            <th>Current Price</th>
            <th>Amount Invested</th>
            <th>Total Value</th>
          </tr>
        </thead>
        <tbody>
          {portfolio.map((investment, index) => (
            <tr key={index}>
              <td>{investment.assetName}</td>
              <td>${investment.currentPrice}</td>
              <td>{investment.amount}</td>
              <td>${investment.totalValue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PortfolioPage;
