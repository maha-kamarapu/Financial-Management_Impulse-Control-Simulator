const axios = require("axios");

// Replace with your actual Ali Express API Key
const API_KEY = 'QDKH9ABL57IQUM4E';

// Function to fetch products from AliExpress
const fetchAliExpressProducts = async (searchQuery) => {
  try {
    const response = await axios.get("https://ali-express1.p.rapidapi.com/search", {
      params: { query: searchQuery, category: "all", page: "1" },
      headers: {
        "X-RapidAPI-Key": '33c204239f9d2584104b0b14d25791ec',
        "X-RapidAPI-Host": "ali-express1.p.rapidapi.com",
      },
    });

    return response.data.data.items;
  } catch (error) {
    console.error("Error fetching products from AliExpress:", error);
    throw new Error('Failed to fetch products from AliExpress');
  }
};

module.exports = { fetchAliExpressProducts };
