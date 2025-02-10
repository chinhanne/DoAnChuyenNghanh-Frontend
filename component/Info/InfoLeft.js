import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUser } from '../../services/userService'; // Gọi API lấy thông tin người dùng
import '../../asserts/InfoLeft.css';

export default class Info extends Component {
  state = {
    user: null,
    loading: true,
    error: null,
  };

  componentDidMount() {
    this.loadUserData();
  }

  loadUserData = async () => {
    try {
      const userData = await getCurrentUser(); // Gọi API
      console.log('Dữ liệu người dùng:', userData);
      this.setState({ user: userData, loading: false });
    } catch (error) {
      console.error('Lỗi khi lấy thông tin người dùng:', error);
      this.setState({
        loading: false,
        error: 'Không thể tải thông tin người dùng.',
      });
    }
  };

  render() {
    const { user, loading, error } = this.state;
    

    if (loading) {
      return <p>Đang tải thông tin người dùng...</p>; // Hiển thị khi đang tải
    }

    if (error) {
      return <p>{error}</p>; // Hiển thị lỗi
    }

    return (
      <div className="info-left">
        {/* Thông tin người dùng */}
        <div className="info-top d-flex align-items-center">
          <div className="user-left mr-3">
            <img
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                border: '2px solid #ccc',
              }}
              src={user.image || require('../../asserts/ProductImg/icon/user2.png')}
              alt="Avatar"
            />
          </div>
          <div className="user-right">
            <p className="mb-0 font-weight-bold" style={{ fontSize: '1.2rem' }}>
              {user.username || 'Người dùng'}
            </p>
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>
              {user.email || 'Email chưa cập nhật'}
            </p>
          </div>
        </div>

        {/* Các chức năng */}
        <div className="info-bottom mt-4">
          <div className="user-table">
            <div className="info">
              <ul className="info-list list-unstyled">
                <li className="d-flex align-items-center font-weight-bold" style={{ fontSize: '1.1rem', color: '#333' }}>
                  <div className="icon-user mr-3">
                    <i className="fa-solid fa-user"></i>
                  </div>
                  Tài Khoản Của Tôi
                </li>
                <Link to="/myinfo" className="info-link a-none">
                  <li className="info-item">Hồ Sơ</li>
                </Link>
                <Link to="/pw" className="info-link a-none">
                  <li className="info-item">Đổi Mật Khẩu</li>
                </Link>
                <Link to="/inorder" className="info-link a-none">
                  <li className="info-item">Lịch sử mua hàng</li>
                </Link>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}