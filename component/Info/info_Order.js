import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import { getOrderHistoryByUser } from '../../services/orderService';

const OrderHistory = () => {
    const [orderHistory, setOrderHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrderHistory = async () => {
        try {
            const history = await getOrderHistoryByUser();
            console.log('Lịch sử đơn hàng:', history);
            setOrderHistory(history);
        } catch (error) {
            console.error('Lỗi khi lấy lịch sử đơn hàng:', error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderHistory();
    }, []);

    // Cấu hình các cột cho bảng (chỉ hiển thị các trường yêu cầu)
    const columns = [
        {
            title: 'Mã Giao Dịch',
            dataIndex: 'transactionId',
            key: 'transactionId',
        },
        {
            title: 'Ngày Đặt Hàng',
            dataIndex: 'orderDate',
            key: 'orderDate',
            render: (value) => value ? new Date(value).toLocaleDateString() : '', // Định dạng ngày
        },
        {
            title: 'Trạng Thái Đơn Hàng',
            dataIndex: 'orderStatus',
            key: 'orderStatus',
        },
        {
            title: 'Tổng Giá (VND)',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (value) => value.toLocaleString(), // Định dạng số
        },
        {
            title: 'Trạng Thái Thanh Toán',
            dataIndex: 'statusPayment',
            key: 'statusPayment',
        },




    ];

    // Hiển thị loading khi dữ liệu đang tải
    if (loading) {
        return <p>Đang tải...</p>;
    }

    // Hiển thị thông báo nếu không có lịch sử đơn hàng
    if (orderHistory.length === 0) {
        return <p>Không có lịch sử đơn hàng.</p>;
    }

    // Hiển thị bảng với dữ liệu
    return (
        <div>
            <h1>Lịch sử đơn hàng</h1>
            <Table 
                dataSource={orderHistory} 
                columns={columns} 
                rowKey="id" 
                pagination={{ pageSize: 5 }} // Phân trang, mỗi trang 5 dòng
            />
        </div>
    );
};



export default OrderHistory;
