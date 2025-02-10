import React, { Component, useState, useEffect } from 'react';
import Header from '../Home/Header';
import Footer from '../Home/Footer';
import { Link, useNavigate } from 'react-router-dom'; // Import withRouter
import '../../asserts/Cart.css'; // Import CSS cho giỏ hàng

const Cart_Main = () => {
    const [cartItems, setCartItems] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng

    useEffect(() => {
        const cartData = JSON.parse(localStorage.getItem("cartItems")) || [];
        setCartItems(cartData);
    }, []);
    const handleIncrement = (index) => {
        const newCartItems = [...cartItems];
        newCartItems[index].quantity += 1;
        setCartItems(newCartItems);
        localStorage.setItem("cartItems", JSON.stringify(newCartItems));
    };

    const handleDecrement = (index) => {
        const newCartItems = [...cartItems];
        if (newCartItems[index].quantity > 1) {
            newCartItems[index].quantity -= 1;
            setCartItems(newCartItems);
            localStorage.setItem("cartItems", JSON.stringify(newCartItems));
        }
    };
    const handleRemoveItem = (index) => {
        const item = cartItems[index];
        const confirmDelete = window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${item.name}" khỏi giỏ hàng không?`);
        if (confirmDelete) {
            const newCartItems = cartItems.filter((_, i) => i !== index);
            setCartItems(newCartItems);
            localStorage.setItem("cartItems", JSON.stringify(newCartItems));
        }
    };

    const handleCheckout = () => {
        if (!cartItems || cartItems.length === 0) {
            setError("Không tìm thấy sản phẩm trong giỏ hàng.");
        } else {
            navigate('/pay', { state: { cartItems,totalAmount } }); // Chuyển hướng và truyền dữ liệu giỏ hàng
        }
    };
    const totalAmount = cartItems.reduce((total, item) => {
        return total + ((item.priceSale > 0 ? item.priceSale : item.price) * item.quantity);
    }, 0);
    return (
        <div>
            <Header />
            <div className="cart-background" style={{ marginTop: 108 }}>
                <div className="wrapper">
                    <div className="container-fluid">
                        <div className="back d-flex">
                            <Link to="/" className='a-none'>
                                <p className="title-cart-cart">Trở lại mua hàng</p>
                            </Link>
                        </div>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <div className="row">
                            <div className="col-8 border rounded-sm">
                                <div className="cart-top">
                                    <div className="cart-table">
                                        <div className="row rounded-sm border">
                                            <div className="col-6">
                                                <p className="title-cart">Sản Phẩm</p>
                                            </div>
                                            <div className="col-2">
                                                <p className="title-cart">Số Lượng</p>
                                            </div>
                                            <div className="col-2">
                                                <p className="title-cart">Giá</p>
                                            </div>
                                            <div className="col-2">
                                                <p className="title-cart">Thao Tác</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {cartItems.map((item, index) => (
                                    <div className="cart-bottom mt-2" key={index}>
                                        <div className="cart-table">
                                            <div className="cart-item row">
                                                <div className="col-2">
                                                    <img src={item.images[0]} alt={item.name} style={{ width: '100%' }} />
                                                </div>
                                                <div className="col-4 d-flex align-items-center">
                                                    <p className="title-cart">{item.name}</p>
                                                </div>
                                                <div className="col-2 d-flex justify-content-center align-items-center">
                                                    <button
                                                        onClick={() => handleDecrement(index)}
                                                        className="btn-quantity"
                                                    >
                                                        -
                                                    </button>
                                                    <input
                                                        className="input-quantity"
                                                        type="text"
                                                        value={item.quantity || 1} // Sử dụng quantity từ item
                                                        readOnly
                                                    />
                                                    <button
                                                        onClick={() => handleIncrement(index)}
                                                        className="btn-quantity"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                {item.priceSale === 0 ? (
                                                    <div className="col-2 d-flex align-items-center">
                                                        <p className="title-cart pl-3">{item.price.toLocaleString()}đ</p>
                                                    </div>
                                                ) : (
                                                    <div className="col-2 d-flex align-items-center">
                                                        <p className="title-cart pl-3">{item.priceSale.toLocaleString()}đ</p>
                                                    </div>
                                                )}

                                                <div className="col-2 d-flex align-items-center">
                                                    <button style={{
                                                        marginLeft: 35,
                                                        backgroundColor: '#FF4C4C',
                                                        color: '#fff',
                                                        border: 'none',
                                                        borderRadius: '5px',
                                                        cursor: 'pointer',
                                                        padding: '8px 12px',
                                                    }} onClick={() => handleRemoveItem(index)}>
                                                        Xóa
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="col-4">
                                <div className="cart-summary">
                                    <h5 className="summary-title">Thông Tin Đơn Hàng</h5>
                                    <div className="summary-item">
                                        <p className="summary-label">Số Lượng Sản Phẩm:</p>
                                        <p className="summary-value">{cartItems.reduce((total, item) => total + (item.quantity || 1), 0)}</p>
                                    </div>
                                    <div className="summary-item">
                                        <p className="summary-label">Tổng số tiền:</p>
                                        <p className="summary-value">{totalAmount.toLocaleString()} VND</p>
                                    </div>
                                    <div className="summary-btn">
                                        <button className="btn btn-danger btn-block" onClick={handleCheckout}>Đặt Mua Ngay</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}
export default Cart_Main;