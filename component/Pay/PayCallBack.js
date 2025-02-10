import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PayCallBack = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkPaymentStatus = async () => {
            try {
                const orderId = localStorage.getItem('orderId');
                const response = await axios.get(`http://localhost:8080/vn-pay-callback?orderId=${orderId}`);
                
                if (response.data.message === 'Thanh toán thành công') {
                    navigate('/pay_success');
                    localStorage.removeItem('cartItems');
                } else {
                    navigate('/pay_failure');
                }
            } catch (error) {
                console.error('Lỗi khi kiểm tra trạng thái thanh toán:', error);
                navigate('/Pay_failure');
            }
        };

        checkPaymentStatus();
    }, [navigate]);

    return <div>Đang kiểm tra trạng thái thanh toán...</div>;
};

export default PayCallBack;
