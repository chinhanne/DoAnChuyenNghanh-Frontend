import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header'; // Import Header class component

const HeaderWithNavigation = (props) => {
  const navigate = useNavigate(); // Lấy hook navigate
  return <Header {...props} navigate={navigate} />;
};

export default HeaderWithNavigation;
