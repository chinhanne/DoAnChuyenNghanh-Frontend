import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../Home/Header';
import Slide from '../Slide/Slide';
import Body from '../Home/Body';
import Footer from '../Home/Footer';
import { getUserRole } from '../../services/authenticationService';

import DetailOfProduct from '../Product_Detail/DetailOfProduct';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

const User = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [userRole, setUserRole] = useState(null); // State to store user role
  const navigate = useNavigate(); // useNavigate hook

  useEffect(() => {
    fetchProduct();
    fetchUserRole(); // Fetch the user role when the component is mounted
  }, []);

  const fetchProduct = async () => {
    try {
      const response = await axios.get('http://localhost:8080/product');
      setProducts(response.data.result);
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      setError(errorMessage);
    }
  };

  const fetchUserRole = async () => {
    try {
      const role = await getUserRole(); // Assuming getUserRole() returns the role of the user
      setUserRole(role); // Set the user role in state
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      setError(errorMessage);
    }
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    fetchFilteredProducts(category);
  };

  const handleBrandSelect = (brand) => {
    setSelectedBrand(brand);
    fetchFilteredProductsByBrand(brand);
  };

  const fetchFilteredProducts = async (category) => {
    try {
      const response = await axios.get('http://localhost:8080/product/search', {
        params: { categoryName: category.name },
      });
      setProducts(response.data.result);
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      setError(errorMessage);
    }
  };

  const fetchFilteredProductsByBrand = async (brand) => {
    try {
      const response = await axios.get('http://localhost:8080/product/search', {
        params: { brandName: brand.name },
      });
      setProducts(response.data.result);
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      setError(errorMessage);
    }
  };

  return (
    <div>
      <Header onCategorySelect={handleCategorySelect} onBrandSelect={handleBrandSelect} />
      <Slide />
      <Body 
        error={error} 
        selectedCategory={selectedCategory} 
        selectedBrand={selectedBrand} 
        products={products} 
        onProductSelect={handleProductSelect} // Truyền hàm chọn sản phẩm
      />{selectedProduct && <DetailOfProduct product={selectedProduct} />}
      <Footer />

      {userRole === 'ADMIN' && (
        <button onClick={() => navigate('/admin')} style={styles.btnBackToAdmin}>
          Trở lại trang quản lý
        </button>
      )}
    </div>
  );
};

const styles = {
  btnBackToAdmin: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '10px',
    cursor: 'pointer',
    position: 'fixed', // Đổi từ 'absolute' thành 'fixed'
    bottom: '20px',
    left: '20px',
    textAlign: 'center',
    zIndex: 1000, // Đảm bảo nút luôn hiển thị trên các phần tử khác
  },
  bodyContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'center',
    marginTop: '20px',
  },
  productCard: {
    width: '200px',
    height: '350px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    padding: '10px',
    textAlign: 'center',
    transition: 'transform 0.3s ease',
  },
  productCardHover: {
    transform: 'translateY(-10px)',
  },
  productImg: {
    width: '100%',
    height: '180px',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  productInfo: {
    marginTop: '10px',
  },
  productName: {
    fontSize: '16px',
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: '14px',
    color: '#e74c3c',
  },
  productButton: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    padding: '8px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  productButtonHover: {
    backgroundColor: '#45a049',
  },
};

export default User;