const axios = require("axios");

// Replace with your actual Shopify API Key and Store URL
const API_KEY = 'fcb17263f2aef4cd479d969c1bca656b';
const STORE_URL = 'x36ksc-1a.myshopify.com';

// Function to fetch products from Shopify store
const fetchShopifyProducts = async () => {
  try {
    const response = await axios.get(`https://${STORE_URL}/admin/api/2023-01/products.json`, {
      headers: {
        'X-Shopify-Access-Token': API_KEY
      }
    });

    return response.data.products;
  } catch (error) {
    console.error("Error fetching products from Shopify:", error);
    throw new Error('Failed to fetch products from Shopify');
  }
};

module.exports = { fetchShopifyProducts };
