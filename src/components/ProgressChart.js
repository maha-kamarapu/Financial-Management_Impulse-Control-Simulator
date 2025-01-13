import React from "react";
import { Line } from "react-chartjs-2";

const ProgressChart = ({ data, labels }) => {
  const chartData = {
    labels: labels, 
    datasets: [
      {
        label: "Debt Reduction Progress",
        data: data, 
        borderColor: "#007BFF",
        backgroundColor: "rgba(0, 123, 255, 0.2)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  return (
    <div>
      <h3>Debt Reduction Progress</h3>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default ProgressChart;
