import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, LoginGoogle, getUserRole } from '../../services/authenticationService';

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
  
    try {
      await login(credentials);
      setSuccess('Đăng nhập thành công!');

      const role = getUserRole();

      navigate(role === 'ADMIN' ? '/admin' : '/'); // Điều hướng đến trang chủ nếu không phải Admin
    } catch (error) {
      setError(error.message);
    }
  };
  
  const handleGoogleLogin = async () => {
    try {
      LoginGoogle();
      setSuccess('Đăng nhập bằng Google thành công!');
      setError('');
      navigate('/');
    } catch (error) {
      setError(error.message || 'Đăng nhập với Google thất bại.');
      setSuccess('');
    }
  };



  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContent}>
        <h2 style={styles.heading}>Đăng nhập</h2>
        {error && <p style={styles.errorMessage}>{error}</p>}
        {success && <p style={styles.successMessage}>{success}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="username"
            onChange={handleChange}
            placeholder="Tên đăng nhập"
            style={styles.input}
            required
          />
          <input
            type="password"
            name="password"
            onChange={handleChange}
            placeholder="Mật khẩu"
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>Đăng nhập</button>
          <button type="button" onClick={handleGoogleLogin} style={styles.googleButton}>
            Đăng nhập với Google
          </button>
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
    height: '100vh',
    backgroundColor: '#f0f4f8',
    padding: '20px',
    width: '100%',
  },
  formContent: {
    backgroundColor: '#ffffff',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
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
  input: {
    padding: '12px',
    marginBottom: '10px',
    border: '1px solid #0AD1C8',
    borderRadius: '5px',
    outline: 'none',
    transition: 'border-color 0.3s',
  },
  button: {
    padding: '12px',
    backgroundColor: '#0AD1C8',
    color: '#ffffff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  googleButton: {
    backgroundColor: '#4285F4',
    color: '#ffffff',
    padding: '10px 15px',
    marginTop: '10px',
    borderRadius: '5px',
    cursor: 'pointer',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
  },
};

export default Login;
