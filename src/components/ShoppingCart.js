import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ShoppingCart = ({ userId }) => {
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState('');
  const [cartTotal, setCartTotal] = useState(0);
  const [userBudget, setUserBudget] = useState(0);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const cartResponse = await axios.get(`/api/cart/${userId}`);
        const budgetResponse = await axios.get(`/api/users/${userId}`);

        setCart(cartResponse.data.cart);
        setUserBudget(budgetResponse.data.budget);
      } catch (error) {
        console.error('Error fetching cart and user data:', error);
      }
    };

    fetchCartData();
  }, [userId]);

  const checkImpulseControl = async () => {
    try {
      const response = await axios.post('/api/cart/impulse-control', { userId });
      const { message, cartTotal, userBudget } = response.data;

      setMessage(message);
      setCartTotal(cartTotal);
      setUserBudget(userBudget);
    } catch (error) {
      console.error('Error with impulse control:', error);
      setMessage('There was an error processing your cart.');
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await axios.post('/api/cart/add', { userId, productId });

      checkImpulseControl();
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };
  const proceedWithPurchase = async () => {
    if (cartTotal > userBudget) {
      const userConfirmed = window.confirm(
        `Your total cart value is $${cartTotal}, which exceeds your current budget of $${userBudget}. Do you still want to proceed with the purchase?`
      );
  
      if (!userConfirmed) {
        return; // Stop the process if the user cancels
      }
    }

  
    try {
      const updatedBudget = userBudget - cartTotal;
  
      await axios.put('/api/users/update-budget', { userId, newBudget: updatedBudget });
  
      await axios.post('/api/cart/clear', { userId });
  
      alert(`Purchase successful! Your new budget is $${updatedBudget}.`);
  
      window.location.href = '/payment';
  
    } catch (error) {
      console.error('Error during purchase process:', error);
      alert('There was an error processing your purchase. Please try again later.');
    }
  };
  

  return (
    <div>
      <h2>Your Cart</h2>
      <ul>
        {cart.map(item => (
          <li key={item.id}>
            {item.name} - ${item.price}
          </li>
        ))}
      </ul>

      {message && (
        <div>
          <p>{message}</p>
          {cartTotal > userBudget && (
            <button onClick={() => proceedWithPurchase()}>Proceed Anyway</button>
          )}
        </div>
      )}

      <button onClick={() => handleAddToCart(101)}>Add Item to Cart</button> 
    </div>
  );
};

export default ShoppingCart;

