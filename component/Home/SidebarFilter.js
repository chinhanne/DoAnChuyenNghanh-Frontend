import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../asserts/Sidebar.css';

const SidebarFilter = ({ onFilterChange, onResetFilters }) => {
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    maxPrice: ''
  });
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchCategoriesAndBrands = async () => {
      try {
        const [categoryRes, brandRes] = await Promise.all([
          axios.get('http://localhost:8080/category'),
          axios.get('http://localhost:8080/brand')
        ]);
        const brand = (brandRes.data.result).filter(b => !b.isDelete )
        const cate = (categoryRes.data.result).filter(c => !c.isDelete)

        setCategories(cate);
        setBrands(brand);
      } catch (error) {
        const errorMessage = error.response?.data?.message;
        throw new Error(errorMessage);
      }
    };

    fetchCategoriesAndBrands();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleApplyFilter = () => {
    onFilterChange(filters);  // Gửi điều kiện lọc lên `Body`
  };

  const handleResetFilters = () => {
    setFilters({ category: '', brand: '', maxPrice: '' });  // Reset bộ lọc
    onResetFilters();  // Gọi hàm để lấy tất cả sản phẩm
  };

  return (
    <div className="sidebar-filter">
      <h4>Lọc sản phẩm theo</h4>
      <div>
        <label>Thể loại</label>
        <select
          name="category"
          value={filters.category}
          onChange={handleInputChange}
        >
          <option value="">Tất cả thể loại</option>
          {categories.map(category => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Hãng</label>
        <select
          name="brand"
          value={filters.brand}
          onChange={handleInputChange}
        >
          <option value="">Tất cả hãng</option>
          {brands.map(brand => (
            <option key={brand.id} value={brand.name}>
              {brand.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Giá</label>
        <input
          type="number"
          name="maxPrice"
          placeholder="Giá"
          value={filters.maxPrice}
          onChange={handleInputChange}
        />
      </div>
      <button onClick={handleApplyFilter}>Lọc</button>
      <button onClick={handleResetFilters}>Tất cả sản phẩm</button> 
    </div>
  );
};

export default SidebarFilter;