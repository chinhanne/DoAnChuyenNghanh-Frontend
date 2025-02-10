import axios from 'axios';
import { setToken, removeToken, getToken, getTokenExpiry } from '../services/localStorageService';
import { jwtDecode } from 'jwt-decode';
import { OAuthConfig } from "../configurations/configuration";
const API_URL = process.env.REACT_APP_API;


export const register = async (userData, imageFile) => {
    try {
        const formData = new FormData();
        // Append the fields from userData
        for (const key in userData) {
            formData.append(key, userData[key]);
        }
        // Append the image file
        formData.append('imageFile', imageFile);
        const response = await axios.post(`${API_URL}/users`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Đăng ký thất bại.';
        throw new Error(errorMessage);
    }
};
export const LoginGoogle = () => {
    const callbackUrl = OAuthConfig.redirectUri;
    const authUrl = OAuthConfig.authUri;
    const googleClientId = OAuthConfig.clientId;
    const targetUrl = `${authUrl}?redirect_uri=${encodeURIComponent(
        callbackUrl
    )}&response_type=code&client_id=${googleClientId}&scope=openid%20email%20profile`;

    // Chuyển hướng người dùng đến Google để đăng nhập
    window.location.href = targetUrl;
};

// Api update info user login with google
export const updateInfoUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/users/create/userInfoLoginGoogle`, userData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
            },
        });

        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Cập nhật thông tin thất bại.';
        throw new Error(errorMessage);
    }
};

export const login = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/auth/token`, credentials, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });

        if (response.data?.result?.token) {
            const token = response.data.result.token;
            const decodedToken = jwtDecode(token);
            const exp = decodedToken.exp;
            setToken(token); // Lưu token vào localStorage
            // Lưu tên người dùng vào localStorage
            const username = credentials.username;
            localStorage.setItem('user', JSON.stringify({ username }));
            localStorage.setItem('tokenExpiry', exp);
            return response.data.result;
        } else {
            throw new Error('Đăng nhập không thành công');
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Đăng nhập thất bại.';
        throw new Error(errorMessage);
    }
};

export const logout = async () => {
    try {
        const token = getToken(); // Lấy token từ localStorage

        if (!token) {
            throw new Error('Không tìm thấy token. Vui lòng đăng nhập lại.');
        }

        const response = await axios.post(`${API_URL}/auth/logout`, { token }, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });

        removeToken(); // Xóa token khỏi localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('tokenExpiry');
        localStorage.removeItem('cartItems');
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Đăng xuất thất bại.';
        throw new Error(errorMessage);

    }
};

// Hàm kiểm tra tính hợp lệ của token (introspect token)
export const introspectToken = async (token) => {
    try {
        const response = await axios.post(`${API_URL}/auth/introspect`, { token }); // API introspect token
        return response.data; // Trả về phản hồi
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Kiểm tra token thất bại.';
        throw new Error(errorMessage);
    }
};

// Hàm làm mới token
export const refreshToken = async () => {
    const accessToken = getToken(); // Lấy access token từ localStorage

    if (!accessToken) {
        throw new Error('Access token không tồn tại');
    }

    try {
        const response = await axios.post(`${API_URL}/auth/refresh`, { token: accessToken });
        if (response.data?.result?.token) {
            const newToken = response.data.result.token; // Nhận token mới
            setToken(newToken); // Lưu token mới vào localStorage
            const decodedToken = jwtDecode(newToken);
            localStorage.setItem('tokenExpiry', decodedToken.exp); // Cập nhật thời gian hết hạn
            return newToken;
        } else {
            throw new Error('Tạo mới token thất bại');
        }
    } catch (error) {
        // Xóa token cũ và đăng xuất người dùng
        localStorage.removeItem('tokenExpiry');
        const errorMessage = error.response?.data?.message;
        throw new Error(errorMessage);
    }
};

export const checkAndRefreshToken = async () => {
    const tokenExp = getTokenExpiry(); // Giả sử bạn có hàm này để lấy thời gian hết hạn
    const currentTime = Math.floor(Date.now() / 1000); // Thời gian hiện tại tính bằng giâyif (tokenExp && (tokenExp - currentTime < 300)) { 
    try {
        await refreshToken(); // Gọi hàm làm mới token
    } catch (error) {
        const errorMessage = error.response?.data?.message;
        throw new Error(errorMessage);
    }
};

export const getUserRole = () => {
    const token = getToken();
    if (!token) return null;
    try {
        const decodedToken = jwtDecode(token);
        return decodedToken.scope; // Trả về scope
    } catch (error) {
        const errorMessage = error.response?.data?.message;
        throw new Error(errorMessage);
    }
};