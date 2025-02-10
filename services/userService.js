import axios from 'axios';
import { getToken } from '../services/localStorageService';
import { jwtDecode } from 'jwt-decode';

const API_URL = process.env.REACT_APP_API;

// Hàm để lấy header xác thực
export const getAuthHeaders = () => {
    const token = getToken();
    return {
        Authorization: token ? `Bearer ${token}` : undefined,
    };
};

// Hàm tạo người dùng
export const createUser = async (userData) => {
    try {
      const formData = new FormData();
      if (userData.imageUser) {
        formData.append('imageFile', userData.imageUser);
      }
      Object.entries(userData).forEach(([key, value]) => {
        if (key !== 'imageUser') formData.append(key, value);
      });
  
      const response = await axios.post(`${API_URL}/users`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...getAuthHeaders(),
        },
      });
  
      return response.data;
    } catch (error) {
      console.error('Lỗi khi thêm người dùng:', error);
      throw new Error(error.message || 'Không thể thêm người dùng');
    }
  };

// Hàm lấy tất cả người dùng
export const getAllUsers = async () => {
    try {
        const response = await axios.get(`${API_URL}/users`, {
            headers: getAuthHeaders(),
        });

        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách người dùng:', error);
        throw new Error(error.message || 'Không thể lấy danh sách người dùng.');
    }
};

// Hàm lấy người dùng theo ID

  

// Hàm lấy thông tin người dùng hiện tại
export const getCurrentUser = async () => {
    try {
        const response = await axios.get(`${API_URL}/users/myInfo`, {
            headers: getAuthHeaders(),
        });

        if (!response.data || !response.data.result) {
            throw new Error('Dữ liệu trả về không hợp lệ');
        }

        return response.data.result;
    } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng hiện tại:', error);
        throw new Error(error.message || 'Không thể lấy thông tin người dùng hiện tại.');
    }
};

// Hàm cập nhật thông tin người dùng hiện tại
export const updateMyInfo = async (updatedUserData, imageFile) => {
    try {
        const formData = new FormData();
        if (imageFile) {
            formData.append('imageFile', imageFile);
        } 

        Object.entries(updatedUserData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                formData.append(key, value);
            }
        });
        console.log('Selected image file:', imageFile);

        const response = await axios.put(`${API_URL}/users/myInfo`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                ...getAuthHeaders(),
            },
        });

        return response.data;
    } catch (error) {
        console.error('Lỗi khi cập nhật thông tin người dùng:', error);
        throw new Error(error.message || 'Không thể cập nhật thông tin người dùng.');
    }
};

// Hàm cập nhật thông tin người dùng theo ID
export const updateUser = async (userId, updatedData, imageFile) => {
    try {
        const formData = new FormData();

        // Nếu có ảnh, thêm vào formData
        if (imageFile) {
            formData.append('imageFile', imageFile);
        }

        // Thêm các thông tin còn lại vào formData
        Object.entries(updatedData).forEach(([key, value]) => {
            formData.append(key, value);
        });

        const response = await axios.put(`${API_URL}/users/${userId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                ...getAuthHeaders(),
            },
        });

        console.log(`Cập nhật người dùng với ID ${userId} thành công:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`Lỗi khi cập nhật người dùng với ID: ${userId}`, error);
        throw new Error(error.message || `Không thể cập nhật người dùng với ID: ${userId}`);
    }
};

// Hàm xóa một người dùng theo ID
export const deleteUser = async (userId) => {
    try {
        const response = await axios.delete(`${API_URL}/users/${userId}`, {
            headers: getAuthHeaders(),
        });

        return response.data;
    } catch (error) {
        console.error(`Lỗi khi xóa người dùng với ID: ${userId}`, error);
        throw new Error(error.message || `Không thể xóa người dùng với ID: ${userId}`);
    }
};

// Hàm cập nhật mật khẩu của người dùng hiện tại
export const updatePasswordMyInfo = async (currentPassword, newPassword, confirmPassword) => {
    if (!currentPassword || !newPassword || !confirmPassword) {
        throw new Error('Cần nhập mật khẩu hiện tại, mật khẩu mới và xác nhận mật khẩu.');
    }

    const updatedPasswordData = {
        currentPassword,
        password: newPassword,
        confirmPassword,
    };

    try {
        const response = await axios.put(`${API_URL}/users/password-myInfo`, updatedPasswordData, {
            headers: getAuthHeaders(),
        });

        return response.data.result;
    } catch (error) {
        console.error('Lỗi khi cập nhật mật khẩu:', error);
        throw new Error(error.response?.data?.message || error.message || 'Không thể cập nhật mật khẩu.');
    }
};

// Hàm lấy ID người dùng hiện tại từ token
export const getCurrentUserId = () => {
    const token = getToken();
    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            return { id: decodedToken.id };
        } catch (error) {
            console.error('Lỗi khi giải mã token:', error);
            return null;
        }
    } else {
        console.warn('Không có token.');
        return null;
    }
};
// Hàm lấy URL hình ảnh người dùng theo ID
export const getImageByUserId = async (userId) => {
    try {
        // Gọi API để lấy thông tin người dùng
        const userData = await getUserById(userId);
        
        // Kiểm tra và trả về URL hình ảnh
        if (userData?.result?.image) {
            // Kiểm tra URL hợp lệ (bạn có thể thêm logic kiểm tra đường dẫn ở đây)
            return userData?.result?.image;
        } else {
            // Trả về một hình ảnh mặc định nếu không có URL
            return 'https://via.placeholder.com/150';
        }
    } catch (error) {
        console.error(`Lỗi khi lấy URL hình ảnh cho userId ${userId}:`, error);
        // Trả về hình ảnh mặc định nếu có lỗi xảy ra
        return 'https://via.placeholder.com/150';
    }
};

export const getUserById = async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/users/${userId}`, {
        headers: getAuthHeaders(),
      });
  
      console.log("Dữ liệu người dùng:", response.data); // Kiểm tra dữ liệu trả về
  
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi lấy người dùng với ID: ${userId}`, error);
  
      // Trả về lỗi chi tiết hơn
      throw new Error(
        error.response?.data?.message ||
        `Không tìm thấy người dùng với ID: ${userId}`
      );
    }
  };