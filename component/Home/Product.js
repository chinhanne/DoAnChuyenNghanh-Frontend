import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Pagination from '../Pagination/Pagination';

const Product = () => {
    const [products, setProduct] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 8; // Số sản phẩm hiển thị mỗi trang
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(window.location.search); 
    const keyword = queryParams.get('search'); 

    useEffect(() => {
        if (keyword) {
            fetchProducts(keyword);
        }
    }, [keyword]);

    const fetchProducts = async (searchTerm) => {
        try {
            const response = await fetch(`http://localhost:8080/product/header-search?keyword=${searchTerm}`);
            const data = await response.json();
            const filteredProducts = (data.result || []).filter(product => !product.isDelete);
            setProduct(filteredProducts);
            setTotalPages(Math.ceil(filteredProducts.length / itemsPerPage));
        } catch (error) {
            const errorMessage = error.response?.data?.message;
            throw new Error(errorMessage);
        }
    };

    const formatPrice = (price) => {
        return price.toLocaleString();
    };

    const handleProductClick = (product) => {
        if (product.quantity > 0) {
            navigate(`/detail/${product.id}`, { state: { product } });
        }
    };

    const handleAddToCart = (product) => {
        const user = localStorage.getItem("accessToken");
        if (!user) {
            alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
            return;
        }
        const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
        const existingItemIndex = cartItems.findIndex(item => item.id === product.id);

        if (existingItemIndex >= 0) {
            cartItems[existingItemIndex].quantity += 1;
        } else {
            cartItems.push({ ...product, quantity: 1 });
        }

        window.dispatchEvent(new CustomEvent('cartUpdated'));
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        alert("Sản phẩm đã được thêm vào giỏ hàng!");
    };

    // Lọc sản phẩm hiển thị theo trang
    const paginatedProducts = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div>
            <Header />
            <div className='container' style={{ marginTop: 120 }}>
                <h4>Kết quả tìm theo: {keyword}</h4>
                <div className="row">
                    {paginatedProducts.length > 0 ? (
                        paginatedProducts.map((product) => (
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
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );
};

export default Product;
