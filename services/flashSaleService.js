import axios from 'axios';
import {  getToken } from '../services/localStorageService';

const API_URL = process.env.REACT_APP_API;

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
export const createSale = async (dataSale) => {
    try {
        const response = await apiClient.post('/flashSale', dataSale);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message;
        throw new Error(errorMessage);
    }
}
export const getAllSale = async () => {
    try {
        const response = await apiClient.get('/flashSale');
        return response.data.result;
    } catch (error){
        const errorMessage = error.response?.data?.message;
        throw new Error(errorMessage);
    }
}
export const deleteSale = async (id) => {
    try {
        const response = await apiClient.delete(`/flashSale/${id}`);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || `Không thể xóa thương hiệu có ID: ${id}`;
        throw new Error(errorMessage);
    }
};
export const editSale = async (id, data)=>{
    try{
        const response =await apiClient.put(`flashSale/${id}`,data);
        return response.data.result;
    }catch(error){
        const errorMessage = error.response?.data?.message;
        throw new Error(errorMessage);
    }
}