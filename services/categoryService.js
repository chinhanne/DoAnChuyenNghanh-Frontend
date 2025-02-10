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

// Tạo danh mục
export const createCategory = async (formData) => {
    return await apiClient.post('/category/add', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

// Cập nhật danh mục
export const updateCategory = async (categoryId, updatedData) => {
    try {
        const response = await apiClient.put(`/category/${categoryId}`, updatedData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || `Không thể cập nhật danh mục có ID: ${categoryId}`;
        throw new Error(errorMessage);
    }
};

// Lấy tất cả danh mục chưa bị xóa mềm
export const getAllCategories = async () => {
    try {
        const response = await apiClient.get('/category');
        const categories = response.data.result.filter((cate) => !cate.isDelete);
        return categories;
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Không thể lấy danh sách danh mục.';
        throw new Error(errorMessage);
    }
};

// Lấy tất cả danh mục đã xóa mềm
export const getAllCategoriesIsDelete = async () => {
    try {
        const response = await apiClient.get('/category/list-category-delete-soft');
        const categories = response.data.result.filter((cate) => cate.isDelete);
        return categories;
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Không thể lấy danh sách danh mục đã xóa.';
        throw new Error(errorMessage);
    }
};

// Khôi phục danh mục
export const restoreCategory = async (categoryId) => {
    try {
        const response = await apiClient.put(`/category/restore/${categoryId}`);
        return response.data.result;
    } catch (error) {
        const errorMessage = error.response?.data?.message || `Không thể khôi phục danh mục có ID: ${categoryId}`;
        throw new Error(errorMessage);
    }
};

// Xóa danh mục vĩnh viễn
export const deleteCategory = async (categoryId) => {
    try {
        const response = await apiClient.delete(`/category/${categoryId}`);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || `Không thể xóa danh mục có ID: ${categoryId}`;
        throw new Error(errorMessage);
    }
};

// Xóa mềm danh mục
export const deleteSoftCategory = async (categoryId) => {
    try {
        const response = await apiClient.delete(`/category/delete-soft-category/${categoryId}`);
        return response.data.result;
    } catch (error) {
        const errorMessage = error.response?.data?.message || `Không thể xóa mềm danh mục có ID: ${categoryId}`;
        throw new Error(errorMessage);
    }
};
