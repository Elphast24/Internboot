import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
  setFilters
} from '../../redux/slices/productSlice';
import { addToCartSuccess, addToCartFailure } from '../../redux/slices/cartSlice';
import ProductFilter from './ProductFilter';
import './Products.css';

const ProductList = () => {
  const dispatch = useDispatch();
  const { products, loading, filters } = useSelector((state) => state.products);
  const { token } = useSelector((state) => state.auth);
  const [addingToCart, setAddingToCart] = useState({});


  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    dispatch(fetchProductsStart());
    try {
      const queryParams = new URLSearchParams();
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
      if (filters.sort) queryParams.append('sort', filters.sort);
  
      const url = `${import.meta.env.VITE_REACT_APP_API_URL}/products?${queryParams}`;
      console.log('Fetching from:', url); // Debug URL
  
      const response = await axios.get(url);
      console.log('Products response:', response.data); // Debug response
      
      dispatch(fetchProductsSuccess(response.data));
    } catch (error) {
      console.error('Fetch products error:', error.response?.data || error.message);
      dispatch(fetchProductsFailure(error.message));
    }
  };

  // Add this to debug the API URL
console.log('API URL:', import.meta.env.VITE_REACT_APP_API_URL);
console.log('Filters:', filters);

  const handleAddToCart = async (product) => {
    if (!token) {
      alert('Please login first');
      return;
    }

    setAddingToCart((prev) => ({ ...prev, [product._id]: true }));
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_URL}/cart/add`,
        { productId: product._id, quantity: 1, price: product.price },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(addToCartSuccess(response.data));
      alert('Added to cart!');
    } catch (error) {
      dispatch(addToCartFailure(error.message));
      alert('Failed to add to cart');
    } finally {
      setAddingToCart((prev) => ({ ...prev, [product._id]: false }));
    }
  };

  return (
    <div className="products-page">
      <ProductFilter />
      <div className="products-container">
        {loading ? (
          <p className="loading">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="no-products">No products found</p>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <div key={product._id} className="product-card">
                <img
                  src={product.image || 'https://via.placeholder.com/200'}
                  alt={product.name}
                  className="product-image"
                />
                <h3 className="product-name">{product.name}</h3>
                <p className="product-category">{product.category}</p>
                <p className="product-description">{product.description}</p>
                <div className="product-footer">
                  <span className="product-price">${product.price}</span>
                  <button
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(product)}
                    disabled={addingToCart[product._id]}
                  >
                    {addingToCart[product._id] ? 'Adding...' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;