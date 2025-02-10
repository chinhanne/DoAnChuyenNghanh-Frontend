import { jwtDecode } from 'jwt-decode';

export const KEY_TOKEN = "accessToken";
export const KEY_REFRESH_TOKEN = "refreshToken";

// Đặt token vào localStorage
export const setToken = (token) => {
    if (token) {
        localStorage.setItem(KEY_TOKEN, token);
        // Cập nhật thời gian hết hạn nếu cần
        const decoded = jwtDecode(token);
        const expiryTime = decoded.exp * 1000; // Thời gian hết hạn tính bằng ms
        setTokenExpiry(expiryTime);
    }
};

// Xóa token khỏi localStorage
export const removeToken = () => {
    localStorage.removeItem(KEY_TOKEN);
    removeTokenExpiry(); // Xóa thời gian hết hạn
};

// Lấy token từ localStorage
export const getToken = () => {
    return localStorage.getItem(KEY_TOKEN);
};

// Kiểm tra xem token có tồn tại trong localStorage hay không
export const isTokenAvailable = () => {
    return !!getToken();
};

// Quản lý refresh token
export const setRefreshToken = (token) => {
    if (token) {
        localStorage.setItem(KEY_REFRESH_TOKEN, token);
    }
};

export const removeRefreshToken = () => {
    localStorage.removeItem(KEY_REFRESH_TOKEN);
};

export const getRefreshToken = () => {
    return localStorage.getItem(KEY_REFRESH_TOKEN);
};

// Quản lý thời gian hết hạn
export const getTokenExpiry = () => {
    return localStorage.getItem('tokenExpiry');
};

export const setTokenExpiry = (expiryTime) => {
    localStorage.setItem('tokenExpiry', expiryTime);
};

export const removeTokenExpiry = () => {
    localStorage.removeItem('tokenExpiry');
};

// Kiểm tra thời gian hết hạn của token
const REFRESH_BEFORE_EXPIRY = 300; // 5 phút trước khi hết hạn
export const isTokenExpired = () => {
    const token = getToken();
    if (!token) return true; // Nếu không có token thì coi như hết hạn

    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Thời gian hiện tại (giây)
        return (decoded.exp - currentTime) < REFRESH_BEFORE_EXPIRY; // Kiểm tra thời gian hết hạn
    } catch (error) {
        console.error('Token không hợp lệ:', error);
        return true; // Nếu token không hợp lệ, coi như đã hết hạn
    }
};
