const express = require("express");
const axios = require("axios");
const router = express.Router();

// Your Alpha Vantage API key
const ALPHA_VANTAGE_API_KEY = "cu21029r01ql7sc7487g";

// Function to fetch stock data from Alpha Vantage
const fetchStockData = async (symbol) => {
  try {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${ALPHA_VANTAGE_API_KEY}`;
    const response = await axios.get(url);

    
    const timeSeries = response.data["Time Series (5min)"];
    if (!timeSeries) {
      throw new Error("Unable to fetch stock data");
    }

    const latestTime = Object.keys(timeSeries)[0]; 
    const latestData = timeSeries[latestTime];
    const price = parseFloat(latestData["4. close"]);

    return price;
  } catch (error) {
    console.error("Error fetching stock data:", error);
    throw new Error("Failed to fetch stock data");
  }
};

// Route to get stock prices for predefined stocks
router.get("/stocks", async (req, res) => {
  try {

    const stockSymbols = ["AAPL", "GOOGL", "AMZN"]; 

  
    const stockPrices = await Promise.all(
      stockSymbols.map(async (symbol) => {
        const price = await fetchStockData(symbol);
        return { id: symbol, name: symbol, price: price };
      })
    );

    res.json(stockPrices);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stock data" });
  }
});

module.exports = router;

