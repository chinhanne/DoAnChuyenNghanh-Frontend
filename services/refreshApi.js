import axios from 'axios';
import { getToken, isTokenExpired, refreshToken, setToken } from '../services/localStorageService'; // Đảm bảo đường dẫn chính xác
import { logout } from './authenticationService';

const API_URL = process.env.REACT_APP_API;

const api = axios.create({
    baseURL: API_URL
});

api.interceptors.request.use(async (config) => {
    let token = getToken();

    if (isTokenExpired()) {
        try {
            const refreshedToken = await refreshToken(); // Gọi hàm làm mới token
            token = refreshedToken.token; // Lưu token mới vào biến
            setToken(token); // Lưu token mới vào localStorage
        } catch (error) {
            console.error("Lỗi khi làm mới token:", error);
            logout();
        }
    }

    // Thêm token vào header
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});


export default api;