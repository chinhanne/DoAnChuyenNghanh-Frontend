import React, { Component } from 'react';
import Login from './Login';
import Register from './Register';

// CSS-in-JS styles cho Main Layout
const mainLayoutStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh', // Giữ chiều cao đầy đủ
  backgroundColor: '#f0f4f8', // Màu nền nhẹ nhàng, dễ chịu
};

const cardContainerStyle = {
  width: '1000px', // Tăng chiều rộng card (có thể điều chỉnh theo nhu cầu)
  display: 'flex',
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
  borderRadius: '12px',
  overflow: 'hidden',
  backgroundColor: '#ffffff', // Màu trắng cho card
};

const toggleContainerStyle = {
  width: '300px', // Tăng chiều rộng của phần chuyển đổi
  backgroundColor: '#14919B', // Màu chính
  color: '#ffffff',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '40px', // Giữ padding
  transition: 'width 0.3s',
};

const toggleButtonStyle = (active) => ({
  padding: '12px 15px', // Kích thước nút
  margin: '5px 0',
  border: 'none',
  borderRadius: '5px',
  backgroundColor: active ? '#0AD1C8' : '#14919B', // Nút màu sáng khi hoạt động
  color: active ? '#14919B' : '#ffffff', // Nút chữ màu xanh khi hoạt động
  cursor: 'pointer',
  width: '100%',
  transition: 'background-color 0.3s, color 0.3s',
  fontWeight: active ? 'bold' : 'normal',
});

const formContainerStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  overflow: 'auto', // Thêm thuộc tính overflow để cuộn
};

const titleStyle = {
  textAlign: 'center',
  marginBottom: '10px',
  color: '#14919B', // Màu tiêu đề xanh
};

export default class Main_Layout_Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: true, // true: Hiển thị Login, false: Hiển thị Register
    };
  }

  // Hàm để chuyển đổi giữa Login và Register
  toggleForm = (isLogin) => {
    this.setState({ isLogin });
  };

  render() {
    const { isLogin } = this.state;

    return (
      <div style={mainLayoutStyle}>
        <div style={cardContainerStyle}>
          {/* Phần chuyển đổi giữa Login và Register */}
          <div style={toggleContainerStyle}>
            <h3 style={titleStyle}>{isLogin ? 'Welcome Back!' : 'Join Us!'}</h3>
            <p style={{ textAlign: 'center' }}>{isLogin ? 'Chào bạn đến web 21B4' : 'Tạo tài khoản mới.'}</p>
            <button
              style={toggleButtonStyle(isLogin)}
              onClick={() => this.toggleForm(true)}
            >
              Đăng Nhập
            </button>
            <button
              style={toggleButtonStyle(!isLogin)}
              onClick={() => this.toggleForm(false)}
            >
              Đăng Ký
            </button>
          </div>

          {/* Phần hiển thị Login hoặc Register */}
          <div style={formContainerStyle}>
            {isLogin ? <Login /> : <Register />}
          </div>
        </div>
      </div>
    );
  }
}
