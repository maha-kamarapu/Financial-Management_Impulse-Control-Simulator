import axios from "axios";

const API_KEY = "cu21029r01ql7sc74860cu21029r01ql7sc7486g";
const BASE_URL = "https://www.alphavantage.co/query";

export const fetchStockPrices = async (symbol) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: "TIME_SERIES_INTRADAY", 
        symbol: symbol, 
        interval: "1min", 
        apikey: API_KEY,
      },
    });

    const timeSeries = response.data["Time Series (1min)"];
    if (!timeSeries) throw new Error("No data available for this stock");

    // Format the data for charting
    const formattedData = Object.entries(timeSeries).map(([time, value]) => ({
      time,
      price: parseFloat(value["4. close"]), // Closing price
    }));

    return formattedData;
  } catch (error) {
    console.error("Error fetching stock prices:", error);
    return [];
  }
};
