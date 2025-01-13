const { PythonShell } = require('python-shell');

// Function to call the Python script for predicting spending
const predictSpending = async (historicalData) => {
  return new Promise((resolve, reject) => {
    // Convert historical data to a JSON string
    const dataString = JSON.stringify(historicalData);

    // Run the Python script
    PythonShell.run('backend/mlModels/financialPrediction.py', {
      args: [dataString]
    }, (err, results) => {
      if (err) {
        console.error('Error in Python script:', err);
        return reject(err);
      }
      // Parse the prediction results and return
      const prediction = JSON.parse(results[0]);
      resolve(prediction);
    });
  });
};

module.exports = { predictSpending };
