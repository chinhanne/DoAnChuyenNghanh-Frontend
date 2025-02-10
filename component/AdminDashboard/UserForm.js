import React, { useState, useEffect } from 'react';
import { updateUser } from '../../services/userService';

const UserForm = ({ onClose, onAddUser, onEditUser, editingUser,fetchUsers }) => {
  const [formData, setFormData] = useState({
    username: '',
    imageUser: null,
    email: '',
    password: '',
    gender: 0,
    address: '',
    numberPhone: '',
    role: 'USER',
  });

  useEffect(() => {
    if (editingUser) {
      setFormData({
        username: editingUser.username,
        email: editingUser.email,
        password: '',
        gender: editingUser.gender,
        address: editingUser.address || '',
        role: editingUser.role || 'USER',
        numberPhone: editingUser.numberPhone || '',
        imageUser: editingUser.imageUser || null, // Giữ ảnh cũ nếu có
        id: editingUser.id,
      });
    } else {
      setFormData({
        username: '',
        imageUser: null,
        email: '',
        password: '',
        gender: 0,
        address: '',
        role: 'USER',
        numberPhone: '',
      });
    }
  }, [editingUser]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imageUser' && files.length > 0) {
      setFormData({ ...formData, imageUser: files[0] }); // Cập nhật ảnh người dùng
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Gọi hàm updateUser nếu đang chỉnh sửa người dùng
    if (editingUser) {
        try {
            const updatedData = {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                gender: formData.gender,
                address: formData.address,
                role: formData.role,
                numberPhone: formData.numberPhone,
            };

            // Gửi thông tin người dùng và ảnh (nếu có)
            await updateUser(editingUser.id, updatedData, formData.imageUser);

            // Sau khi thành công, đóng modal
            fetchUsers();
            onClose();
        } catch (error) {
            console.error('Cập nhật người dùng thất bại:', error);
        }
    } else {
        onAddUser(formData);
    }
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <h2 style={styles.heading}>{editingUser ? 'Chỉnh Sửa Người Dùng' : 'Thêm Người Dùng'}</h2>
        <form onSubmit={handleSubmit} style={styles.formContainer}>
          <input
            style={styles.input}
            type="text"
            name="username"
            placeholder="Tên Đăng Nhập"
            value={formData.username}
            onChange={handleChange}
            required
          />
          {editingUser && formData.imageUser && (
            <div style={styles.imagePreviewContainer}>
              <img
                src={URL.createObjectURL(formData.imageUser) || editingUser.imageUser}
                alt="Preview"
                style={{ width: 50, height: 50 }}
              />
            </div>
          )}
          <input
            type="file"
            name="imageUser"
            onChange={handleChange}
            style={styles.input}
            accept="image/*"
          />
          <input
            style={styles.input}
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            style={styles.input}
            type="password"
            name="password"
            placeholder="Mật Khẩu"
            value={formData.password}
            onChange={handleChange}
            required={!editingUser} 
          />
          <select
            style={styles.select}
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value={0}>Nam</option>
            <option value={1}>Nữ</option>
          </select>
          <input
            style={styles.input}
            type="text"
            name="address"
            placeholder="Địa Chỉ"
            value={formData.address}
            onChange={handleChange}
          />
          <input
            style={styles.input}
            type="text"
            name="numberPhone"
            placeholder="Số Điện Thoại"
            value={formData.numberPhone}
            onChange={handleChange}
          />
          

          <div style={styles.buttonContainer}>
            <button style={styles.button} type="submit">
              {editingUser ? 'Cập Nhật' : 'Thêm'}
            </button>
            <button style={styles.exitButton} type="button" onClick={onClose}>
              Đóng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    background: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '400px',
  },
  heading: {
    color: '#0AD1C8',
    textAlign: 'center',
    marginBottom: '20px',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  imagePreviewContainer: {
    marginBottom: '10px',
    textAlign: 'center',
  },
  input: {
    marginBottom: '10px',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  select: {
    marginBottom: '10px',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#3d99f5',
    color: 'white',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  exitButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default UserForm;
