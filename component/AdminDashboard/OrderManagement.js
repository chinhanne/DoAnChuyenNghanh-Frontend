import React, { useState, useEffect } from 'react';
import { editOrderById, getAllOrder } from '../../services/orderService';
import { deleteOrderById } from '../../services/orderService';
import Pagination from '../Pagination/Pagination';

const OrderManagement = () => {
    const [orders, setOrder] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [orderStatus, setOrderStatus] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('');
    const [orderId, setOrderId] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchAllOrder();
    }, []);

    useEffect(() => {
        if (successMessage || errorMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
                setErrorMessage('');
            }, 3000); // Ẩn thông báo sau 3 giây
            return () => clearTimeout(timer);
        }
    }, [successMessage, errorMessage]);

    const fetchAllOrder = async () => {
        try {
            const response = await getAllOrder();
            const ordersData = Array.isArray(response) ? response : [];
            setOrder(ordersData);
            setTotalPages(Math.ceil(ordersData.length / ordersPerPage));
        } catch (error) {
            console.error('Không lấy được dữ liệu của đơn hàng:', error.message);
            setErrorMessage('Không có dữ liệu đơn hàng');
        }
    };

    const checkDiscountCode = (discountCode) => {
        return discountCode || "Không có mã giảm giá";
    };

    const deleteOrder = async (id) => {
        const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này không?');
        if (confirmDelete) {
            try {
                await deleteOrderById(id);
                setSuccessMessage('Xóa đơn hàng thành công');
                fetchAllOrder();
            } catch (error) {
                console.error('Không xóa được đơn hàng:', error.message);
                setErrorMessage('Không thể xóa được đơn hàng');
            }
        }
    };

    const handleEdit = (id, orderStatus, paymentStatus) => {
        setShowModal(true);
        setOrderId(id);
        setOrderStatus(orderStatus);
        setPaymentStatus(paymentStatus);
    };

    const handleSave = async () => {
        try {
            if (orderId) {
                const updatedData = {
                    orderStatus,
                    orderStatusPayment: paymentStatus,
                };
                await editOrderById(orderId, updatedData);
                setShowModal(false);
                fetchAllOrder();
                setSuccessMessage('Sửa đơn hàng thành công');
            }
        } catch (error) {
            console.error('Sửa thất bại:', error.message);
            setErrorMessage('Sửa đơn hàng thất bại');
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

    return (
        <div>
            <div className='container-fluid'>
            <h2 className='mb-5' style={styles.heading}>Quản Lý Đơn hàng</h2>
                <div className='product'>
                    {successMessage && <div className='alert alert-success'>{successMessage}</div>}
                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">STT</th>
                                <th scope="col">Tên người dùng</th>
                                <th scope="col">Hình thức thanh toán</th>
                                <th scope="col">Mã đơn hàng</th>
                                <th scope="col">Ngày đặt hàng</th>
                                <th scope="col">Trạng thái đơn hàng</th>
                                <th scope="col">Giá đơn hàng</th>
                                <th scope="col">Mã giảm giá</th>
                                <th scope="col">Trạng thái thanh toán</th>
                                <th scope="col">Hành động</th>
                            </tr>
                        </thead>
                        {currentOrders.length === 0 ? (
                            <tbody>
                                <tr><td colSpan="10" className="text-center">Không có đơn hàng nào</td></tr>
                            </tbody>
                        ) : (
                            <tbody>
                                {currentOrders.map((order, index) => (
                                    <tr key={order.id}>
                                        <th scope="row">{index + 1 + (currentPage - 1) * ordersPerPage}</th>
                                        <td>{order.userName}</td>
                                        <td>{order.payment === 0 ? 'Ship COD' : 'VN Pay'}</td>
                                        <td>{order.transactionId}</td>
                                        <td>{order.orderDate}</td>
                                        <td>{order.orderStatus}</td>
                                        <td>{order.totalPrice}</td>
                                        <td>{checkDiscountCode(order.discountCode)}</td>
                                        <td>{order.statusPayment}</td>
                                        <td>
                                            <div className='d-flex'>
                                                <button className='mr-2' style={styles.editBtn} onClick={() => handleEdit(order.id, order.orderStatus, order.statusPayment)}>Sửa</button>
                                                <button style={styles.deleteButton} onClick={() => deleteOrder(order.id)}>Xóa</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        )}
                    </table>

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>

            {showModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <h3>Sửa trạng thái đơn hàng</h3>
                        <div style={styles.selectContainer}>
                            <div style={styles.selectWrapper}>
                                <label>Trạng thái đơn hàng</label>
                                <select value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)} style={styles.select}>
                                    <option value="CHO_XU_LY">CHO_XU_LY</option>
                                    <option value="DANG_XU_LY">DANG_XU_LY</option>
                                    <option value="DANG_GIAO">DANG_GIAO</option>
                                    <option value="DA_HOAN_THANH">DA_HOAN_THANH</option>
                                    <option value="DA_HUY">DA_HUY</option>
                                </select>
                            </div>

                            <div style={styles.selectWrapper}>
                                <label>Trạng thái thanh toán</label>
                                <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} style={styles.select}>
                                    <option value="DANG_CHO_XU_LY">DANG_CHO_XU_LY</option>
                                    <option value="THANH_TOAN_THANH_CONG">THANH_TOAN_THANH_CONG</option>
                                    <option value="THANH_TOAN_THAT_BAI">THANH_TOAN_THAT_BAI</option>
                                </select>
                            </div>
                        </div>

                        <div className='d-flex mt-3 justify-content-end'>
                            <button className='mr-2' style={styles.button} onClick={handleSave}>Lưu</button>
                            <button style={styles.deleteButton} onClick={() => setShowModal(false)}>Hủy</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    button: {
        padding: '10px',
        backgroundColor: '#3d99f5',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    editBtn: {
        backgroundColor: '#3d99f5',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        padding: '8px 12px',
    },
    deleteButton: {
        backgroundColor: '#FF4C4C',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        padding: '8px 12px',
    },
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '10px',
        width: '400px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    selectContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    selectWrapper: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    select: {
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
    },
};

export default OrderManagement;
