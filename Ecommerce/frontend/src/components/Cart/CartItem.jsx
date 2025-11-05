import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { removeFromCart, updateQuantity } from '../../redux/slices/cartSlice';
import './Cart.css';

const CartItem = ({ item, onUpdate }) => {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [updating, setUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return;
    setUpdating(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_REACT_APP_API_URL}/cart/update`,
        { productId: item.productId._id, quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(updateQuantity({ productId: item.productId._id, quantity: newQuantity }));
      onUpdate();
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update quantity');
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async () => {
    if (!window.confirm('Remove this item from cart?')) {
      return;
    }
    
    setUpdating(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_REACT_APP_API_URL}/cart/update`,
        { productId: item.productId._id, quantity: 0 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(removeFromCart(item.productId._id));
      onUpdate();
    } catch (error) {
      console.error('Remove error:', error);
      alert('Failed to remove item');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="cart-item">
      <div className="item-info">
        <h4>{item.productId?.name || 'Product'}</h4>
        <p className="item-price">${item.price}</p>
      </div>
      <div className="item-quantity">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          disabled={updating || item.quantity === 1}
        >
          -
        </button>
        <span>{item.quantity}</span>
        <button onClick={() => handleQuantityChange(item.quantity + 1)} disabled={updating}>
          +
        </button>
      </div>
      <div className="item-total">
        <p>${(item.price * item.quantity).toFixed(2)}</p>
      </div>
      <button onClick={handleRemove} className="remove-btn" disabled={updating}>
        {updating ? 'Removing...' : 'Remove'}
      </button>
    </div>
  );
};

export default CartItem;