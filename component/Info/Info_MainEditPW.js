import React, { Component } from 'react';
import Header from '../Home/Header';
import InfoLeft from '../Info/InfoLeft';
import Footer from '../Home/Footer';
import InfoEditPW from './InfoEditPW';

// CSS-in-JS styles cho Main Layout
const layoutStyle = {
  backgroundColor: '#f7f9fc', // Màu nền nhẹ nhàng
  minHeight: '100vh', // Giữ chiều cao đầy đủ
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between', // Đẩy Footer xuống dưới cùng
};

const containerStyle = {
  marginTop: '100px', // Đưa phần nội dung chính xuống dưới header
  padding: '20px', // Thêm padding để tạo khoảng trắng giữa nội dung
};

const rowStyle = {
  display: 'flex',
  justifyContent: 'space-between', // Tạo khoảng cách giữa các cột
};

const leftColumnStyle = {
  flex: '1', // Chiếm 25% không gian màn hình
  paddingRight: '20px', // Thêm khoảng cách giữa cột trái và phải
};

const rightColumnStyle = {
  flex: '3', // Chiếm 75% không gian màn hình
  padding: '20px',
  backgroundColor: '#ffffff', // Tạo card màu trắng cho phần nội dung chính
  borderRadius: '12px', // Bo góc cho card
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', // Đổ bóng nhẹ cho card
};

export default class Info_MainEditPW extends Component {
  render() {
    return (
      <div style={layoutStyle}>
        <Header />
        <div className="container-fluid" style={containerStyle}>
          <div className="wrapper">
            <div className="row" style={rowStyle}>
              <div style={leftColumnStyle}>
                <InfoLeft />
              </div>
              <div style={rightColumnStyle}>
                <InfoEditPW />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
