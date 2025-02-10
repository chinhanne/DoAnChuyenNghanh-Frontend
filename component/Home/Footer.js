import React, { Component } from 'react';

export default class Footer extends Component {
  render() {
    return (
      <div style={footerStyle}>
        <div style={containerStyle}>
          <h3 style={headerStyle}>LIÊN HỆ VỚI CHÚNG TÔI</h3>
          <p style={textStyle}>HUTECH University, 475A Điện Biên Phủ, Phường 25, Bình Thạnh, TP.HCM, Vietnam</p>
          <p style={textStyle}>Phone: +84 28 5445 2222</p>
          <p style={textStyle}>Email: info@hutech.edu.vn</p>
        </div>
        
        <div style={mapContainerStyle}>
          <h3 style={headerStyle}>VỊ TRÍ</h3>
          <iframe 
            title="HUTECH University Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.661314245923!2d106.6999395147636!3d10.830034492306334!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752e12d1975d3b%3A0xd10c5163f78274c2!2sHUTECH%20University!5e0!3m2!1sen!2s!4v1631588849685!5m2!1sen!2s"
            width="100%"
            height="300"
            style={mapStyle}
            allowFullScreen
            loading="lazy"
          />
        </div>
      </div>
    );
  }
}

// CSS-in-JS styles for the footer
const footerStyle = {
  backgroundColor: '#f8f9fa',
  padding: '20px',
  textAlign: 'center',
  marginTop: '30px',
  borderTop: '2px solid #000', // Optional top border for separation
};

const containerStyle = {
  marginBottom: '20px',
};

const headerStyle = {
  color: '#dc3545', // Red color for headings
  marginBottom: '10px',
};

const textStyle = {
  color: '#333',
  margin: '5px 0',
};

const mapContainerStyle = {
  marginTop: '20px',
};

const mapStyle = {
  border: '0',
  borderRadius: '8px',
};
