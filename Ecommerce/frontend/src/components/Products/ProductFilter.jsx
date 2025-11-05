import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters, resetFilters } from '../../redux/slices/productSlice';
import './Products.css';

const ProductFilter = () => {
  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state.products);
  const [localFilters, setLocalFilters] = useState(filters);

  const handleFilterChange = (key, value) => {
    const updated = { ...localFilters, [key]: value };
    setLocalFilters(updated);
    dispatch(setFilters(updated));
  };

  const handleReset = () => {
    setLocalFilters({
      category: '',
      minPrice: 0,
      maxPrice: 100000,
      search: '',
      sort: 'newest'
    });
    dispatch(resetFilters());
  };

  return (
    <div className="filter-sidebar">
      <h3>Filters</h3>

      <div className="filter-group">
        <label>Search</label>
        <input
          type="text"
          placeholder="Search products..."
          value={localFilters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="filter-input"
        />
      </div>

      <div className="filter-group">
        <label>Category</label>
        <select
          value={localFilters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="filter-select"
        >
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="furniture">Furniture</option>
          <option value="clothing">Clothing</option>
          <option value="books">Books</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Price Range</label>
        <input
          type="number"
          placeholder="Min"
          value={localFilters.minPrice}
          onChange={(e) => handleFilterChange('minPrice', e.target.value)}
          className="filter-input"
        />
        <input
          type="number"
          placeholder="Max"
          value={localFilters.maxPrice}
          onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
          className="filter-input"
        />
      </div>

      <div className="filter-group">
        <label>Sort By</label>
        <select
          value={localFilters.sort}
          onChange={(e) => handleFilterChange('sort', e.target.value)}
          className="filter-select"
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      <button onClick={handleReset} className="reset-btn">
        Reset Filters
      </button>
    </div>
  );
};

export default ProductFilter;