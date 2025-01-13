import React, { useEffect, useState } from "react";
import axios from "axios";

// Function to fetch products from the backend
const fetchProducts = async (searchQuery, setShopifyProducts, setAliExpressProducts, setLoading) => {
  setLoading(true);
  try {
    const response = await axios.get(`/api/shopping/products`, {
      params: { search: searchQuery },
    });
    setShopifyProducts(response.data.shopify || []);
    setAliExpressProducts(response.data.aliexpress || []);
  } catch (error) {
    console.error("Error fetching products:", error);
  } finally {
    setLoading(false);
  }
};

const ShoppingPage = () => {
  const [shopifyProducts, setShopifyProducts] = useState([]);
  const [aliExpressProducts, setAliExpressProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("laptop");
  const [cart, setCart] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [budget] = useState(100); // Set initial budget to $100
  const [impulseWarning, setImpulseWarning] = useState(false);
  const [lastAddTime, setLastAddTime] = useState(0);

  useEffect(() => {
    fetchProducts(searchQuery, setShopifyProducts, setAliExpressProducts, setLoading);
  }, [searchQuery]);

  const handleAddToCart = (product, platform) => {
    const itemPrice =
      platform === "shopify" ? parseFloat(product.variants[0].price) : parseFloat(product.productPrice);

    // Check if adding the item exceeds the budget
    if (totalSpent + itemPrice > budget) {
      alert("You don't have enough budget to buy this item.");
      return;
    }

    // Check for impulse control behavior
    const currentTime = Date.now();
    const timeDifference = currentTime - lastAddTime;

    if (timeDifference < 5000 && cart.length >= 5) {
      setImpulseWarning(true); 
    } else {
      setImpulseWarning(false); 
    }

    // Add product to cart
    setCart([...cart, product]);
    setTotalSpent(totalSpent + itemPrice);
    setLastAddTime(currentTime);
  };

  // Render products for a given platform
  const renderProducts = (products, platform) => {
    return products.map((product, index) => (
      <div key={index} style={{ border: "1px solid black", padding: "10px", margin: "10px" }}>
        <h3>{platform === "shopify" ? product.title : product.productTitle}</h3>
        <p>Price: ${platform === "shopify" ? product.variants[0].price : product.productPrice}</p>
        <button onClick={() => handleAddToCart(product, platform)}>Add to Cart</button>
      </div>
    ));
  };

  return (
    <div>
      <h1>Impulse Control Shopping Simulation</h1>

      {/* Search Input */}
      <div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products..."
        />
        <button onClick={() => fetchProducts(searchQuery, setShopifyProducts, setAliExpressProducts, setLoading)}>
          Search
        </button>
      </div>

      {/* Budget and Total Spent */}
      <div>
        <h3>Budget: ${budget}</h3>
        <h3>Total Spent: ${totalSpent}</h3>
      </div>

      {/* Impulse Warning */}
      {impulseWarning && (
        <p style={{ color: "red" }}>
          Impulse Control Warning: You are adding items too quickly! Please take a moment before making another
          purchase.
        </p>
      )}

      {/* Loading state */}
      {loading && <p>Loading products...</p>}

      {/* Display Shopify Products */}
      <div>
        <h2>Shopify Products</h2>
        <div className="product-list">{renderProducts(shopifyProducts, "shopify")}</div>
      </div>

      {/* Display AliExpress Products */}
      <div>
        <h2>AliExpress Products</h2>
        <div className="product-list">{renderProducts(aliExpressProducts, "aliexpress")}</div>
      </div>

      {/* Cart */}
      <div>
        <h2>Your Cart</h2>
        <ul>
          {cart.map((item, index) => (
            <li key={index}>
              {item.title || item.productTitle} - $
              {item.variants ? item.variants[0].price : item.productPrice}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ShoppingPage;



