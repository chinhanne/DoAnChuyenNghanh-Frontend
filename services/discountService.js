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

export const getAllDiscount = async () => {
    try {
      const response = await apiClient.get('/discount');
      const discounts = (response.data.result).filter(discount => !discount.isDelete)
      return discounts || []; 
    } catch (error) {
        const errorMessage = error.response?.data?.message;
        throw new Error(errorMessage);
    }
}

export const addDiscount = async (discountdata)=>{
    try{
        const response=await apiClient.post('/discount',discountdata)
        return response.data
    }catch(error){
        console.error('Không thể thêm mới được mã giảm giá', error.message);
    }
}

export const getDiscountByCode = async (discountCode) => {
    try {
        const response = await apiClient.get(`/discount/${discountCode}`);
        return response.data.result;
    } catch (error) {
        const errorMessage = error.response?.message || `Không tìm thấy mã giảm: ${discountCode}`;
        throw new Error(errorMessage);
    }
};

export const deleteDiscountSoft = async (discountId) => {
    try {
        const response = await apiClient.delete(`/discount/soft-discount/${discountId}`);
        return response.data.result;
    } catch (error) {
        const errorMessage = error.response?.message || `Không tìm thấy mã giảm: ${discountId}`;
        throw new Error(errorMessage);
    }
};

export const getAllDiscountIsDelete = async () => {
    try {
        const response = await apiClient.get('/discount/list-discount-delete-soft');
        const discounts = (response.data.result).filter(discount => discount.isDelete)
        return discounts;
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Không thể lấy danh sách mã giảm giá đã xóa.';
        throw new Error(errorMessage);
    }
  };
  
  export const restoreDiscount = async (discountId) => {
    try {
        const response = await apiClient.put(`/discount/restore/${discountId}`);
        return response.data.result;
    } catch (error) {
        const errorMessage = error.response?.message || `Không thể khôi phục mã giảm giá có ID: ${discountId}`;
        throw new Error(errorMessage);
    }
  };