const { fetchShopifyProducts } = require("../api/shopifyApi");
const { fetchAliExpressProducts } = require("../api/aliexpressApi");

// Function to fetch products from both Shopify and AliExpress
const fetchProducts = async (req, res) => {
  try {
    const searchQuery = req.query.search || "laptop";  // Default: "laptop"
    const shopifyProducts = await fetchShopifyProducts();
    const aliExpressProducts = await fetchAliExpressProducts(searchQuery);

    res.status(200).json({
      shopify: shopifyProducts,
      aliexpress: aliExpressProducts
    });
  } catch (error) {
    console.error("Error in fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};


const impulseControlSimulation = (userShoppingData) => {
    const maxItemsAllowed = 5;
    const impulseThresholdTime = 10000; // 10 seconds to add more than 5 items
  
    let impulseDetected = false;
    let lastAddTime = userShoppingData[0]?.timestamp;
  
    for (let i = 1; i < userShoppingData.length; i++) {
      const currentTime = userShoppingData[i].timestamp;
      const timeDifference = currentTime - lastAddTime;
  
      if (timeDifference < impulseThresholdTime && userShoppingData[i].action === "add") {
        impulseDetected = true;
        break;
      }
      lastAddTime = currentTime;
    }
  
    return impulseDetected;
  };

  module.exports = { fetchProducts, impulseControlSimulation  };
  
