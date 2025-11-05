import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SellerProducts.css';

const SellerProducts = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'electronics',
    stock: '',
    image: ''
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const sellerToken = localStorage.getItem('sellerToken');

  useEffect(() => {
    if (!sellerToken) {
      navigate('/seller/login');
      return;
    }
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_URL}/seller/products`,
        { headers: { Authorization: `Bearer ${sellerToken}` } }
      );
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_URL}/seller/products`,
        formData,
        { headers: { Authorization: `Bearer ${sellerToken}` } }
      );
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'electronics',
        stock: '',
        image: ''
      });
      setShowForm(false);
      fetchProducts();
      alert('Product added successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add product');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure?')) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_REACT_APP_API_URL}/seller/products/${productId}`,
          { headers: { Authorization: `Bearer ${sellerToken}` } }
        );
        fetchProducts();
      } catch (error) {
        alert('Failed to delete product');
      }
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="seller-products">
      <div className="products-header">
        <h1>My Products</h1>
        <button onClick={() => setShowForm(!showForm)} className="add-product-btn">
          {showForm ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {showForm && (
        <div className="product-form">
          <form onSubmit={handleAddProduct}>
            <input
              type="text"
              placeholder="Product Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <input
              type="number"
              placeholder="Price"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="electronics">Electronics</option>
              <option value="furniture">Furniture</option>
              <option value="clothing">Clothing</option>
              <option value="books">Books</option>
            </select>
            <input
              type="number"
              placeholder="Stock"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Image URL"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            />
            <button type="submit">Add Product</button>
          </form>
        </div>
      )}

      <div className="products-grid">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <p className="stock">Stock: {product.stock}</p>
            <div className="product-actions">
              <button onClick={() => navigate(`/seller/product/edit/${product._id}`)}>Edit</button>
              <button onClick={() => handleDeleteProduct(product._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerProducts;