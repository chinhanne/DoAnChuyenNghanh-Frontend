import axios from 'axios';
import {  getToken } from '../services/localStorageService';

const API_URL = process.env.REACT_APP_API;

// Tạo instance Axios với cấu hình sẵn
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor thêm token vào headers cho các request nếu có token
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

// Tạo thương hiệu
export const createBrand = async (brandData) => {
    try {
        const response = await apiClient.post('/brand', brandData);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Không thể tạo thương hiệu mới.';
        throw new Error(errorMessage);
    }
};

// Cập nhật thương hiệu
export const updateBrand = async (brandId, updatedData) => {
    try {
        const response = await apiClient.put(`/brand/${brandId}`, updatedData);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || `Không thể cập nhật thương hiệu có ID: ${brandId}`;
        throw new Error(errorMessage);
    }
};

// Lấy tất cả thương hiệu
export const getAllBrands = async () => {
    try {
        const response = await apiClient.get('/brand');
        const brands = (response.data.result).filter(brand => !brand.isDelete);
        return brands;
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Không thể lấy danh sách thương hiệu.';
        throw new Error(errorMessage);
    }
};

export const deleteBrand = async (brandId) => {
    try {
        const response = await apiClient.delete(`/brand/${brandId}`);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || `Không thể xóa thương hiệu có ID: ${brandId}`;
        throw new Error(errorMessage);
    }
};

// Xóa mềm thương hiệu
export const deleteSoftBrand = async (brandId) => {
    try {
        const response = await apiClient.delete(`/brand/delete-soft-brand/${brandId}`);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || `Không thể xóa thương hiệu có ID: ${brandId}`;
        throw new Error(errorMessage);
    }
};

// Lấy tất cả thương hiệu đã xóa
export const getAllBrandIsDelete = async () => {
    try {
        const response = await apiClient.get('/brand/list-brand-delete-soft');
        const brands = (response.data.result).filter(brand => brand.isDelete);
        return brands;
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Không thể lấy danh sách hãng đã xóa.';
        throw new Error(errorMessage);
    }
};

// Khôi phục thương hiệu
export const restoreBrand = async (brandId) => {
    try {
        const response = await apiClient.put(`/brand/restore/${brandId}`);
        return response.data.result;
    } catch (error) {
        const errorMessage = error.response?.message || `Không thể khôi phục hãng có ID: ${brandId}`;
        throw new Error(errorMessage);
    }
};
