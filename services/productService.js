import axios from 'axios';
import { getToken } from '../services/localStorageService';

const API_URL = process.env.REACT_APP_API;

// Create Axios instance with default settings
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to headers for all requests if available
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

// Create product
export const createProduct = async (productData) => {
    try {
        const response = await apiClient.post('/product/create', productData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.result;
    } catch (error) {
        const errorMessage = error.response?.message || 'Không thể tạo sản phẩm mới.';
        throw new Error(errorMessage);
    }
};


// Update product
export const updateProduct = async (productId, updatedData) => {
    try {
        const response = await apiClient.put(`/product/${productId}`, updatedData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Đảm bảo sử dụng 'multipart/form-data' khi gửi dữ liệu bao gồm tệp tin
            },
        });
        return response.data.result;
    } catch (error) {
        const errorMessage = error.response?.data?.message || `Không thể cập nhật sản phẩm có ID: ${productId}`;
        throw new Error(errorMessage);
    }
};


// Get all products
export const getAllProducts = async () => {
    try {
        const response = await apiClient.get('/product');
        const products = response?.data?.result || [];
        
        // Lọc sản phẩm theo điều kiện
        return products.filter(product => 
            !product.isDelete && 
            product.isCategoryVisible && 
            product.isBrandVisible
        );
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Không thể lấy danh sách sản phẩm.';
        throw new Error(errorMessage);
    }
};


// Get product by ID
export const getProductById = async (productId) => {
    try {
        const response = await apiClient.get(`/product/${productId}`);
        const products = (response.data.result).filter(product => !product.isDelete && product.isCategoryVisible && product.isBrandVisible)
        return products ;
    } catch (error) {
        const errorMessage = error.response?.message || `Không tìm thấy sản phẩm có ID: ${productId}`;
        throw new Error(errorMessage);
    }
};

// Delete product
export const deleteProduct = async (productId) => {
    try {
        const response = await apiClient.delete(`/product/${productId}`);
        return response.data.result;
    } catch (error) {
        const errorMessage = error.response?.message || `Không thể xóa sản phẩm có ID: ${productId}`;
        throw new Error(errorMessage);
    }
};

// Delete soft product
export const deleteSoftProduct = async (productId) => {
    try {
        const response = await apiClient.delete(`/product/soft-product/${productId}`);
        return response.data.result;
    } catch (error) {
        const errorMessage = error.response?.message || `Không thể xóa sản phẩm có ID: ${productId}`;
        throw new Error(errorMessage);
    }
};

// Get all categories
export const getCategories = async () => {
    try {
        const response = await apiClient.get('/category'); // Update with your API endpoint
        const products = (response.data.result).filter(cate => !cate.isDelete)
        return products ;

    } catch (error) {
        const errorMessage = error.response?.message || 'Không thể lấy danh sách thể loại.';
        throw new Error(errorMessage);
    }
};

// Get all brands
export const getBrands = async () => {
    try {
        const response = await apiClient.get('/brand'); 
        const products = (response.data.result).filter(brand => !brand.isDelete)
        return products ;
    } catch (error) {
        const errorMessage = error.response?.message || 'Không thể lấy danh sách thương hiệu.';
        throw new Error(errorMessage);
    }
};

export const getDeletedProducts = async () => {
    try {
        const response = await apiClient.get('/product/list-product-delete-soft'); 
        const products = (response.data.result).filter(product => product.isDelete)
        return products ;
    } catch (error) {
        const errorMessage = error.response?.message || 'Không thể lấy danh sách sản phẩm đã xóa mềm.';
        throw new Error(errorMessage);
    }
};

export const restoreProduct = async (productId) => {
    try {
        const response = await apiClient.put(`/product/restore/${productId}`);
        return response.data.result;
    } catch (error) {
        const errorMessage = error.response?.message || `Không thể khôi phục sản phẩm có ID: ${productId}`;
        throw new Error(errorMessage);
    }
};