import axios from 'axios';
import { getToken } from '../services/localStorageService';

const API_URL = process.env.REACT_APP_API;

// Tạo instance Axios với cấu hình sẵn
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Thêm token vào headers cho tất cả yêu cầu nếu có token
apiClient.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);
export const getAllOrder = async () =>{
    try{
        const orderdata= await apiClient.get('/orders');
        return orderdata.data.result;
    }catch(error){
        const errorMessage = error.response?.data?.message;
        throw new Error(errorMessage);
    }
}
//Xóa đơn hàng theo id
export const deleteOrderById  = async (orderId)=>{
    try{
        const response = await apiClient.delete(`/orders/${orderId}`);
        return response.data;
    }catch(error){
        const errorMessage = error.response?.data?.message;
        throw new Error(errorMessage);
    }
}
//sửa đơn hàng theo id
export const editOrderById = async (orderId, updatedData) => {
    try {
        const response = await apiClient.put(`/orders/${orderId}`, updatedData);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message;
        throw new Error(errorMessage);
    }
}
// Lấy doanh thu theo tháng từ backend
export const getMonthlyRevenue = async (month, year) => {
    try {
        const response = await apiClient.post('/orders/monthly', {
            month: month,
            year: year
        });

        return response.data.result;  // Trả về dữ liệu doanh thu
    } catch (error) {
        const errorMessage = error.response?.data?.message;
        throw new Error(errorMessage);
    }
};

// Lấy lịch sử đơn hàng của người dùng hiện tại
export const getOrderHistoryByUser = async () => {
    try {
        const response = await apiClient.get('/orders/history/orders-user');
        return response.data.result; 
    } catch (error) {
        const errorMessage = error.response?.data?.message;
        throw new Error(errorMessage);
    }
};
