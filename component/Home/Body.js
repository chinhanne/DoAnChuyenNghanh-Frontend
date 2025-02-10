import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Pagination from '../Pagination/Pagination';
import SidebarFilter from './SidebarFilter';
import Discount from './Discount';
import '../../asserts/Body.css';

const Body = ({ error, selectedCategory, selectedBrand }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({ category: '', brand: '', maxPrice: '' });
  const productsPerPage = 8;

  const fetchAllProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/product');
      const filteredProducts = response.data.result.filter(
        (product) => !product.isDelete && product.isCategoryVisible && product.isBrandVisible
      );
      setProducts(filteredProducts);
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      throw new Error(errorMessage);
    }
  };

   // Hàm lọc sản phẩm theo hãng, thể loại, giá
   const fetchFilterProductsBody = async (filters) => {
    try {
      const response = await axios.get('http://localhost:8080/product/search', {
        params: {
          categoryName: filters.category,
          brandName: filters.brand,
          price: filters.maxPrice ? parseFloat(filters.maxPrice) : null,
        }
      });
      const products = (response.data.result).filter(product => !product.isDelete && product.isCategoryVisible && product.isBrandVisible)
      setProducts(products);
    } catch (error) {
      console.error("Lỗi khi xuất sản phẩm:", error);
    }
  };

  const fetchFilteredProducts = async (type, value) => {
    let params = {};
    if (type === 'category') params.categoryName = value?.name || '';
    if (type === 'brand') params.brandName = value?.name || '';

    try {
      const response = await axios.get('http://localhost:8080/product/search', { params });
      const products = (response.data.result).filter(product => !product.isDelete && product.isCategoryVisible && product.isBrandVisible)
      setProducts(products);
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    if (selectedCategory) {
      fetchFilteredProducts('category', selectedCategory);
    } else if (!selectedBrand) {
      fetchAllProducts();
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedBrand) {
      fetchFilteredProducts('brand', selectedBrand);
    } else if (!selectedCategory) {
      fetchAllProducts();
    }
  }, [selectedBrand]);

  useEffect(() => {
    if (selectedCategory || selectedBrand) {
      fetchFilteredProducts(selectedCategory, selectedBrand);
    } else {
      fetchAllProducts(); 
    }
  }, [selectedCategory, selectedBrand]); 

  const handleProductClick = (product) => {
    if (product.quantity > 0) {
      navigate(`/detail/${product.id}`, { state: { product } });
    }
  };

  const handleAddToCart = (product) => {
    const user = localStorage.getItem('accessToken');
    if (!user) {
      alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
      return;
    }

    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existingItemIndex = cartItems.findIndex((item) => item.id === product.id);

    if (existingItemIndex >= 0) {
      cartItems[existingItemIndex].quantity += 1;
    } else {
      cartItems.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    const event = new CustomEvent('cartUpdated');
    window.dispatchEvent(event);
    alert('Sản phẩm đã được thêm vào giỏ hàng!');
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);  
    setCurrentPage(1);
    fetchFilterProductsBody(newFilters);  
  };

  const handleResetFilters = () => {
    setFilters({ category: '', brand: '', maxPrice: '' });  
    setCurrentPage(1);
    fetchAllProducts();  
  };


  const formatPrice = (price) => {
    return price.toLocaleString();
  };

  // Tính toán sản phẩm hiển thị theo phân trang
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-2'>
        </div>
        <div className='col-10'>
          <Discount />
        </div>
      </div>
      <div className="d-flex">
        <div className="sidebar" style={{ width: '20%', padding: '20px' }}>
          <SidebarFilter
          onFilterChange={handleFilterChange} onResetFilters={handleResetFilters}
          />
        </div>

        <div className="product-list" style={{ width: '80%', marginTop: 20 }}>
          <div className="product-title">
            <h1>Sản Phẩm</h1>
          </div>

          <div className="row">
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <div className="col-3 mb-4" key={product.id}>
                  <div className="product-item">
                    <div className="card" style={{ height: '400px', width: '250px' }}>
                      <img
                        className="card-img-top"
                        src={product.images[0]}
                        alt={product.name}
                        style={{ height: '200px', objectFit: 'cover', cursor: product.quantity > 0 ? 'pointer' : 'not-allowed' }}
                        onClick={() => handleProductClick(product)}
                      />
                      <div className="card-body" style={{ height: '150px' }}>
                        <h4 className="card-title d-flex justify-content-start" style={{ fontSize: '20px' }}>
                          {product.name.length > 30 ? `${product.name.substring(0, 30)}...` : product.name}
                        </h4>
                        {product.priceSale === 0 ? (
                          <div className='d-flex'>
                            <span className="card-text" style={{ fontSize: '16px' }}>
                              Giá gốc: <span className="price-format pb-3" style={{ color: '#dc3545', fontWeight: 'bold' }}>{formatPrice(product.price)}đ</span>
                            </span>
                            <span className="card-text" style={{ fontSize: '16px' }}>
                              Giá giảm: <del className="price-format pb-3">{formatPrice(product.priceSale)}đ</del>
                            </span>
                          </div>
                        ) : (
                          <div className='d-flex'>
                            <span className="card-text" style={{ fontSize: '16px' }}>
                              Giá gốc: <del className="price-format pb-3">{formatPrice(product.price)}đ</del>
                            </span>
                            <span className="card-text" style={{ fontSize: '16px' }}>
                              Giá giảm: <span className="price-format pb-3" style={{ color: '#dc3545', fontWeight: 'bold' }}>{formatPrice(product.priceSale)}đ</span>
                            </span>
                          </div>

                        )}
                        {product.quantity > 0 ? (
                          <button
                            className="btn btn-danger w-100 mt-3"
                            onClick={() => handleAddToCart(product)}
                          >
                            Thêm vào giỏ hàng
                          </button>
                        ) : (
                          <button className="btn btn-secondary w-100 mt-3" disabled>
                            Hết hàng
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>Không có sản phẩm</p>
            )}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(products.length / productsPerPage)}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default Body;
