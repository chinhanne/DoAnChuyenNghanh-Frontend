import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../../asserts/Pay.css';
import Header from '../Home/Header';
import Footer from '../Home/Footer';
import { getCurrentUser } from '../../services/userService';
import { getDiscountByCode } from '../../services/discountService';
import { getToken } from '../../services/localStorageService';
import axios from 'axios';

const Pay = () => {
    const [username, setUsername] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [error, setError] = useState('');
    const [discountCode, setDiscountCode] = useState('');
    const [cartItems, setCartItems] = useState([]);
    const [discount, setDiscount] = useState(null);
    const [totalAmount, setTotalAmount] = useState(0);
    const [discountAmount, setDiscountAmount] = useState(0);
    const location = useLocation();
    const orderProduct = location.state?.orderProduct || {};
    const navigate = useNavigate();
    useEffect(() => {
        const state = location.state || {}; // Dữ liệu từ `navigate`
        const { orderProduct, isDirectBuy } = state;

        if (isDirectBuy && orderProduct) {
            // Trường hợp bấm "Mua Ngay"
            setCartItems([orderProduct]); // Biến sản phẩm thành 1 item trong cartItems
            setTotalAmount(calculateTotalAmount([orderProduct])); // Cập nhật tổng số tiền
        } else {
            // Trường hợp lấy từ giỏ hàng
            const items = JSON.parse(localStorage.getItem("cartItems")) || [];
            setCartItems(items);
            setTotalAmount(calculateTotalAmount(items));
        }
        loadUserData(); // Lấy thông tin người dùng
    }, []);

    const loadUserData = async () => {
        try {
            const userData = await getCurrentUser(); // Gọi API lấy thông tin người dùng từ service
            if (userData) {
                setUsername(userData.username || ''); 
                setPhone(userData.numberPhone || '');
                setEmail(userData.email || '');
                setAddress(userData.address || '');
            } else {
                setError('Không thể lấy thông tin người dùng.');
            }
        } catch (error) {
            setError(error.response?.data?.message );
        }
    };

    const calculateTotalAmount = (items, discount = null) => {
        let discountedAmount = items.reduce((total, item) => {
            const itemPrice = item.priceSale > 0 ? item.priceSale : item.price;
            return total + itemPrice * item.quantity;
        }, 0);

        if (discount) {
            if (discount.discountScope === 'ORDER') {
                if (discount.discountType === 'PERCENTAGE') {
                    discountedAmount -= (discountedAmount * discount.discountValue) / 100;
                } else if (discount.discountType === 'FIXED') {
                    discountedAmount -= discount.discountValue;
                }
            } else if (discount.discountScope === 'PRODUCT') {
                discountedAmount = items.reduce((total, item) => {
                    const itemPrice = item.priceSale > 0 ? item.priceSale : item.price;
                    const itemTotal = itemPrice * item.quantity;
                    if (itemPrice >= discount.minOrderAmount) {
                        return total + itemTotal - (itemTotal * discount.discountValue) / 100;
                    }
                    return total + itemTotal;
                }, 0);
            }
        }

        return Math.max(discountedAmount, 0); // Đảm bảo tổng tiền không âm
    };


    const applyDiscount = async () => {
        try {
            const selectedDiscount = await getDiscountByCode(discountCode);

            if (!selectedDiscount) {
                setError("Mã giảm giá không hợp lệ.");
                setDiscountAmount(0);
                return;
            }

            let discountedAmount = totalAmount;
            if (selectedDiscount.discountScope === 'ORDER') {
                if (selectedDiscount.discountType === 'PERCENTAGE') {
                    discountedAmount -= (totalAmount * selectedDiscount.discountValue) / 100;
                } else if (selectedDiscount.discountType === 'FIXED') {
                    discountedAmount -= selectedDiscount.discountValue;
                }
            } else if (selectedDiscount.discountScope === 'PRODUCT') {
                discountedAmount = cartItems.reduce((total, item) => {
                    const itemTotal = item.price * item.quantity;
                    if (item.price >= selectedDiscount.minOrderAmount) {
                        return total + itemTotal - ((selectedDiscount.discountValue / 100) * itemTotal);
                    }
                    return total + itemTotal;
                }, 0);
            }

            setDiscountAmount(totalAmount - discountedAmount); // Tính toán giá trị giảm giá
            setTotalAmount(discountedAmount); // Cập nhật lại tổng số tiền
            setDiscount(selectedDiscount); // Lưu mã giảm giá
            setError('');
        } catch (error) {
            setError("Không thể áp dụng mã giảm giá.");
            setDiscountAmount(0); // Reset giá trị giảm giá khi có lỗi
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "paymentMethod") setPaymentMethod(value);
        else if (name === "discountCode") setDiscountCode(value);
    };


    const createOrderData = () => {
        return {
            payment: paymentMethod === 'VNPAY' ? 1 : 0,
            discountId: discount ? discount.id : null, // Sử dụng ID của giảm giá nếu có
            amount: totalAmount, // Truyền số tiền cuối cùng (sau giảm giá)
            orderDetails: createOrderDetails(), // Truyền số tiền đã giảm vào orderDetails
        };
    };

    const createOrderDetails = () => {
        return cartItems.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            productPrice: item.price, // Truyền số tiền đã giảm cho từng sản phẩm
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const orderData = createOrderData();

        try {
            const orderResponse = await axios.post('http://localhost:8080/orders', orderData, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log("Order created: ", orderResponse.data);

            if (paymentMethod === 'VNPAY') {
                localStorage.setItem('orderId', orderResponse.data.result.orderId);
                window.location.href = orderResponse.data.result.paymentUrl;
                localStorage.removeItem('cartItems');
            } else {
                alert('Đặt hàng thành công.');
                localStorage.removeItem('cartItems');
                navigate('/pay_success');
            }
        } catch (error) {
            setError(error.response?.data.message || 'Đã xảy ra lỗi trong quá trình gửi yêu cầu.');
            localStorage.removeItem('cartItems');
            navigate('/pay_failure');
        }
    };

    return (
        <div>
            <Header />
            <div className='container' style={{ marginTop: 120 }}>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="back d-flex">
                    <Link to="/cart" className='a-none'>
                        <p className="title-cart-cart">Trở lại</p>
                    </Link>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-checkout">
                        <div className='row'>
                            <div className='col-6'>
                            <div className='d-flex justify-content-center pb-3'>
                                    <h3>Thông Tin Khách Hàng</h3>
                                </div>
                                <div className="form-group mb-3">
                                    <label>Họ và tên:</label>
                                    <span className='mb-1'>{username}</span>
                                </div>
                                <div className="form-group mb-3">
                                    <label>Địa chỉ:</label>
                                    <span className='mb-1'>{address}</span>
                                </div>
                                <div className="form-group mb-3">
                                    <label>Số điện thoại:</label>
                                    <span className='mb-1'>{phone}</span>
                                </div>
                                <div className="form-group">
                                    <label>Email:</label>
                                    <span className='mb-1'>{email}</span>
                                </div>
                            </div>
                            <div className='col-6'>
                                <div className='d-flex justify-content-center'>
                                    <h3>Thông Tin Đơn Hàng</h3>
                                </div>
                                <table className='table'>
                                    <thead>
                                        <tr>
                                            <th>Sản Phẩm</th>
                                            <th>Giá Tiền</th>
                                            <th>SL</th>
                                            <th>Tạm Tính</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cartItems.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.name}</td>
                                                <td>{(item.priceSale > 0 ? item.priceSale : item.price).toLocaleString()}đ</td>
                                                <td>{item.quantity}</td>
                                                <td>{((item.priceSale > 0 ? item.priceSale : item.price) * item.quantity).toLocaleString()}đ</td>
                                            </tr>
                                        ))}
                                    </tbody>

                                </table>
                                <div className='d-flex'>
                                    <span>Tổng:<span className='title-cart ml-3'>{totalAmount.toLocaleString()}đ</span></span>
                                </div>
                                {discountAmount > 0 && (
                                    <div className="d-flex">
                                        <span>Giảm giá: <span className='title-cart ml-3'>{discountAmount.toLocaleString()} đ</span></span>
                                    </div>
                                )}
                                <div className="payment-method" style={{ marginTop: 20 }}>
                                    <label className='text-center d-flex justify-content-start'>Chọn phương thức thanh toán:</label>
                                    <div className='d-flex justify-content-start'>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="COD"
                                            checked={paymentMethod === "COD"}
                                            onChange={handleChange}
                                        />
                                        <span className="ml-2">Thanh toán khi nhận hàng (COD)</span>
                                    </div>
                                    <div className='d-flex justify-content-start'>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="VNPAY"
                                            checked={paymentMethod === "VNPAY"}
                                            onChange={handleChange}
                                        />
                                        <span className="ml-2">Thanh toán qua VNPay</span>
                                    </div>
                                </div>
                                <div className='d-flex justify-content-start mb-3 mt-3'>
                                    <span className='d-flex align-items-center mr-3'>Mã giảm giá: </span>
                                    <input
                                        type="text"
                                        placeholder="Nhập mã giảm giá (nếu có)"
                                        name="discountCode"
                                        value={discountCode}
                                        onChange={handleChange}
                                    />
                                    <button type="button" className='btn btn-primary' onClick={applyDiscount}>Áp dụng</button>
                                </div>
                                <button type="submit" className="submit-btn" style={{ width: 114 }}>Xác nhận</button>
                            </div>
                        </div>
                    </div>
                </form>

            </div>
            <Footer />
        </div>
    );
};

export default Pay;
