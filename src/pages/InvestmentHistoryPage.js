import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';

const InvestmentHistoryPage = () => {
  const [investments, setInvestments] = useState([]);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [assetDistribution, setAssetDistribution] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = 1; 

        // Fetch investment history
        const historyResponse = await axios.get(`/api/investments/history/${userId}`);
        setInvestments(historyResponse.data.investments);

        // Fetch analytics data
        const analyticsResponse = await axios.get(`/api/investments/analytics/${userId}`);
        setTotalInvestment(analyticsResponse.data.totalInvestment);
        setAssetDistribution(analyticsResponse.data.distribution);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Prepare data for the pie chart
  const pieData = {
    labels: assetDistribution.map((item) => item.asset_name),
    datasets: [
      {
        data: assetDistribution.map((item) => item.total_amount),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      },
    ],
  };

  return (
    <div>
      <h2>Investment History</h2>

      {/* Analytics Section */}
      <div>
        <h3>Total Investment: ${totalInvestment.toFixed(2)}</h3>
        <h4>Asset-Wise Distribution</h4>
        <Pie data={pieData} />
      </div>

      {/* Investment History Table */}
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Asset Name</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {investments.map((investment, index) => (
            <tr key={investment.id}>
              <td>{index + 1}</td>
              <td>{investment.asset_name}</td>
              <td>${investment.amount}</td>
              <td>{new Date(investment.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvestmentHistoryPage;





  