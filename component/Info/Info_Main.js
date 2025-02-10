import React, { Component } from 'react';
import InfoLeft from './InfoLeft';
import InfoProfile from './InfoProfile';
import Header from '../Home/Header';
import Footer from '../Home/Footer';
import { getCurrentUser, updateMyInfo } from '../../services/userService';


export default class Info_Main extends Component {

  render() {
    return (
      <div style={layoutStyle}>
        <Header />
        <div className="container-fluid" style={containerStyle}>
          <div className="wrapper">
            <div style={rowStyle}>
              <div style={leftColumnStyle}>
                <InfoLeft/>
              </div>
              <div style={rightColumnStyle}>
                <InfoProfile/>
                
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

const layoutStyle = {
  backgroundColor: '#f7f9fc',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
};

const containerStyle = {
  marginTop: '100px',
  padding: '20px',
};

const rowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
};

const leftColumnStyle = {
  flex: '1',
  paddingRight: '20px',
};

const rightColumnStyle = {
  flex: '3',
  padding: '20px',
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
};
