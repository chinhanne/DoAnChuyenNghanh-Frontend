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
export const getAll= async()=>{
    try{
        const  response = apiClient.post('/orders/monthly');
        return response.result;
    }catch(error){ 
        const errorMessage = error.response?.data?.message;
        throw new Error(errorMessage);
    }
}