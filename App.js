import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Cart from './component/Cart/Cart';
import Pay from './component/Pay/Pay';
import Pay_failure from './component/Pay/Pay_failure';
import Info_Main from './component/Info/Info_Main';
import Info_MainAddress from './component/Info/Info_MainAddress';
import Info_MainEditPW from './component/Info/Info_MainEditPW';
import Pay_success from './component/Pay/Pay_success';
import DetailOfProduct from './component/Product_Detail/DetailOfProduct';
import LoginRegister from './component/LoginRegister/LoginRegister';
import AdminDashboard from './component/AdminDashboard/AdminDashboard';
import Authenticate from './component/LoginRegister/Authenticate';
import UpdateInfoUser from './component/LoginRegister/UpdateInfoUser';
import HeaderWithNavigation from './component/Home/HeaderWithNavigation';
import Product from './component/Home/Product';
import User from './component/User/User';
import InfoOrder from './component/Info/info_mainorder';
import { refreshToken } from './services/authenticationService';
import { getTokenExpiry } from './services/localStorageService';

const AppContent = () => {
  const location = useLocation();

  const noHeaderRoutes = ['/login', '/register', '/admin'];

  const shouldShowHeader = !noHeaderRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowHeader && <HeaderWithNavigation />}
      <Routes>
        <Route path="/" element={<User />} />
        <Route path="/login" element={<LoginRegister />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/pay" element={<Pay />} />
        <Route path="/myinfo" element={<Info_Main />} />
        <Route path="/address" element={<Info_MainAddress />} />
        <Route path="/pw" element={<Info_MainEditPW />} />
        <Route path="/success" element={<Pay_success />} />
        <Route path="/detail/:id" element={<DetailOfProduct />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/info" element={<Info_Main />} />
        <Route path="/updateInfoUser" element={<UpdateInfoUser />} />
        <Route path="/authenticate" element={<Authenticate />} />
        <Route path="/pay_success" element={<Pay_success />} />
        <Route path="/pay_failure" element={<Pay_failure />} />
        <Route path="/product" element={<Product />} />
        <Route path="/inorder" element={<InfoOrder />} />
      </Routes>
    </>
  );
};

const App = () => {
  useEffect(() => {
    const checkAndRefreshToken = async () => {
      const tokenExp = getTokenExpiry();
      const currentTime = Math.floor(Date.now() / 1000);

      if (tokenExp && tokenExp - currentTime < 120) {
        try {
          await refreshToken();
        } catch (error) {
          console.error('Lỗi khi làm mới token:', error);
        }
      }
    };

    const interval = setInterval(checkAndRefreshToken, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
