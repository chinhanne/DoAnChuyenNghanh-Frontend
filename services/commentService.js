// src/services/commentService.js
import axios from 'axios';
import { getToken } from './localStorageService'; // Đảm bảo đường dẫn đúng

const API_URL = process.env.REACT_APP_API;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm token vào header mỗi khi thực hiện request
api.interceptors.request.use((config) => {
  const token = getToken();  // Lấy token từ localStorage
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Lấy bình luận theo productId
export const getCommentsByProduct = async (productId) => {
  try {
    const response = await api.get(`/comment/product/${productId}`);
    if (response && response.data && Array.isArray(response.data.result)) {
      return response.data.result.map((comment, index) => ({
        ...comment,
        id: comment.id,
        isChildComment: comment.parentCommentId != null, // Kiểm tra xem đây là bình luận con không
      }));
    } else {
      return [];
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message;
    throw new Error(errorMessage);
  }
};

// Lấy bình luận theo id
export const getCommentById = async (commentId) => {
  try {
    const response = await api.get(`/comment/${commentId}`);
    return response.data.result;
  } catch (error) {
    const errorMessage = error.response?.data?.message;
    throw new Error(errorMessage);
  }
};

// Thêm bình luận (bao gồm bình luận gốc và bình luận trả lời)
export const addComment = async (productId, userId, content, parentCommentId = null) => {
  try {
    const response = await api.post('/comment/', {
      productId,
      userId,
      content,
      parentCommentId,  // Truyền parentCommentId nếu là bình luận con
    });
    return response.data.result;
  } catch (error) {
    const errorMessage = error.response?.data?.message;
    throw new Error(errorMessage);
  }
};

// Cập nhật bình luận
export const updateComment = async (commentId, content) => {
  try {
    const response = await api.put(`/comment/${commentId}`, {
      content,
    });
    return response.data.result;
  } catch (error) {
    const errorMessage = error.response?.data?.message;
    throw new Error(errorMessage);
  }
};

// Cập nhật hiển thị bình luận (admin)
export const updateCommentDisplay = async (commentId, displayValue) => {
  try {
    const response = await api.put(`/comment/display/${commentId}`, { display: displayValue });
    return response.data.result;
  } catch (error) {
    console.error("Error updating comment display:", error);
    throw error;
  }
};

// Xóa bình luận
export const deleteComment = async (commentId) => {
  try {
    const response = await api.delete(`/comment/${commentId}`);    
    return response.data.result;
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};

// Lấy bình luận cha và các bình luận con
export const getParentCommentAndChildComment = async (commentId) => {
  try {
    const response = await api.get(`/comment/with-child/${commentId}`);
    return response.data.result;
  } catch (error) {
    console.error("Error fetching parent and child comments:", error);
    throw error;
  }
};
