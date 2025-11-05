import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setCartItems } from '../../redux/slices/cartSlice';
import CartItem from './CartItem';
import './Cart.css';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalPrice, loading } = useSelector((state) => state.cart);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    if (!token) return;
    try {
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      dispatch(setCartItems(response.data));
    } catch (error) {
      console.error('Failed to fetch cart', error);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (!token) {
    return (
      <div className="cart-container">
        <p>Please login to view your cart</p>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>
      {items.length === 0 ? (
        <p className="empty-cart">Your cart is empty</p>
      ) : (
        <>
          <div className="cart-items">
            {items.map((item) => (
              <CartItem key={item.productId} item={item} onUpdate={fetchCart} />
            ))}
          </div>
          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>$0 (Free)</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <button onClick={handleCheckout} className="checkout-btn">
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;