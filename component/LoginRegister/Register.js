import React, { useState } from 'react';
import { register } from '../../services/authenticationService'; // Nếu authenticationService nằm ở src/services

const Register = () => {
  const [userData, setUserData] = useState({
    username: '',
    password: '',
    email: '',
    dob: '',
    gender: '0',
    address: '',
    numberPhone: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const resetForm = () => {
    setUserData({
      username: '',
      password: '',
      email: '',
      dob: '',
      gender: '0',
      address: '',
      numberPhone: ''
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await register(userData, userData.imageFile); // Thêm imageFile vào
      setSuccess('Đăng ký thành công!');
      setError('');
      resetForm();
    } catch (error) {
      
      setError(error.message);
      setSuccess('');
      
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserData({
      ...userData,
      [name]: name === 'gender' ? parseInt(value) : value, // Chuyển gender thành số
    });
  };


  return (
    <div style={styles.container}>
      <div style={styles.formContent}>
        {error && <p style={styles.errorMessage}>{error}</p>}
        {success && <p style={styles.successMessage}>{success}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.row}>
            <div style={styles.col}>
              <span style={styles.label}>Tên đăng nhập</span>
              <input
                type="text"
                name="username"
                onChange={handleChange}
                placeholder="Tên đăng nhập"
                required
                style={styles.input}
              />
            </div>
            <div style={styles.col}>
              <span style={styles.label}>Mật khẩu</span>
              <input
                type="password"
                name="password"
                onChange={handleChange}
                placeholder="Mật khẩu"
                required
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.col}>
              <span style={styles.label}>Email</span>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                placeholder="Email"
                required
                style={styles.input}
              />
            </div>
            <div style={styles.col}>
              <span style={styles.label}>Ngày sinh</span>
              <input
                type="date"
                name="dob"
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.col}>
              <span style={styles.label}>Giới tính</span>
              <select
                name="gender"
                onChange={handleChange}
                required
                style={styles.select}
              >
                <option value="0">Nam</option>
                <option value="1">Nữ</option>
              </select>
            </div>
            <div style={styles.col}>
              <span style={styles.label}>Số điện thoại</span>
              <input
                type="text"
                name="numberPhone"
                onChange={handleChange}
                placeholder="Số điện thoại"
                required
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.field}>
            <span style={styles.label}>Địa chỉ</span>
            <input
              type="text"
              name="address"
              onChange={handleChange}
              placeholder="Địa chỉ"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <span style={styles.label}>Ảnh đại diện</span>
            <input
              type="file"
              name="imageFile"
              onChange={(e) => setUserData({ ...userData, imageFile: e.target.files[0] })}
              required
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.button}>Đăng ký</button>

        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    backgroundColor: '#f0f4f8',
    padding: '20px',
  },
  formContent: {
    backgroundColor: '#ffffff',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '600px', // Đặt chiều rộng tối đa nhỏ hơn
  },
  heading: {
    color: '#14919B',
    textAlign: 'center',
    marginBottom: '20px',
  },
  errorMessage: {
    color: '#FF4C4C',
    textAlign: 'center',
  },
  successMessage: {
    color: '#0AD1C8',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  col: {
    width: '48%', // Hai cột, mỗi cột chiếm 48%
  },
  input: {
    padding: '10px',
    marginBottom: '10px',
    border: '1px solid #0AD1C8',
    borderRadius: '5px',
    outline: 'none',
    transition: 'border-color 0.3s',
    width: '100%', // Đảm bảo độ rộng mỗi cột
  },
  select: {
    padding: '10px',
    marginBottom: '10px',
    border: '1px solid #0AD1C8',
    borderRadius: '5px',
    outline: 'none',
    transition: 'border-color 0.3s',
    width: '100%',
  },
  button: {
    padding: '12px',
    backgroundColor: '#0AD1C8',
    color: '#ffffff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    marginTop: '10px',
  },
  label: {
    marginBottom: '5px',
    display: 'block',
    fontSize: '14px',
    color: '#333',
    textAlign: 'left',
  },
};

export default Register;
