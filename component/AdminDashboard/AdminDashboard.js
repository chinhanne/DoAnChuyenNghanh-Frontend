import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Điều hướng trong React Router
import CategoryManagement from './CategoryManagement';
import ProductManagement from './ProductManagement';
import BrandManagement from './BrandManagement';
import UserManagement from './UserManagement';
import { logout, getUserRole } from '../../services/authenticationService';
import OrderManagement from './OrderManagement';
import DiscountManagement from './DiscountManagement';
import  StatisticalManagement from './StatisticalManagement';
import FlashSaleManagement from './FlashSaleManagement';
  const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('category');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); 
    const navigate = useNavigate();
  
    useEffect(() => {
      const role = getUserRole();
      if (!role || !role.includes('ADMIN')) {
        navigate('/'); // Điều hướng nếu không phải USER ADMIN
      }
    }, [navigate]);
  
    const handleLogout = () => {
      logout();
      window.location.href = '/login';
    };
    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen); // Thay đổi trạng thái của sidebar khi nhấn vào nút
    };
    return (
      <div style={styles.dashboardContainer}>
        <div style={{ 
        ...styles.sidebar, 
        width: isSidebarOpen ? '20%' : '5%', 
        border: '1px solid #ccc',
        backgroundColor: isSidebarOpen ? 'rgb(42 48 61)' : 'rgb(42 48 61)' // Thay đổi màu nền khi sidebar mở và đóng
      }}>
        <button onClick={toggleSidebar} style={styles.toggleBtn}>
          {isSidebarOpen ? 
            <i className="fa-solid fa-chevron-left" style={styles.icon}></i> : 
            <i className="fa-solid fa-bars" style={styles.icon}></i>
          }
        </button>
        {isSidebarOpen && (
  <>
    <h2 style={styles.sidebarTitle}>Quản Lý</h2>
    <ul style={styles.menuList}>
      <li 
        onClick={() => setActiveTab('category')} 
        style={{...styles.menuItem, ...(activeTab === 'category' ? styles.active : {})}}
      >
        Quản lý thể loại
      </li>
      <li 
        onClick={() => setActiveTab('product')} 
        style={{...styles.menuItem, ...(activeTab === 'product' ? styles.active : {})}}
      >
        Quản lý sản phẩm
      </li>
      <li 
        onClick={() => setActiveTab('brand')} 
        style={{...styles.menuItem, ...(activeTab === 'brand' ? styles.active : {})}}
      >
        Quản lý thương hiệu
      </li>
      <li 
        onClick={() => setActiveTab('user')} 
        style={{...styles.menuItem, ...(activeTab === 'user' ? styles.active : {})}}
      >
        Quản lý người dùng
      </li>
      <li 
        onClick={() => setActiveTab('order')} 
        style={{...styles.menuItem, ...(activeTab === 'order' ? styles.active : {})}}
      >
        Quản lý đơn hàng
      </li>
      <li 
        onClick={() => setActiveTab('discount')} 
        style={{...styles.menuItem, ...(activeTab === 'discount' ? styles.active : {})}}
      >
        Quản lý giảm giá
      </li>
      <li 
        onClick={() => setActiveTab('statistical')} 
        style={{...styles.menuItem, ...(activeTab === 'statistical' ? styles.active : {})}}
      >
        Thống kê thu nhập
      </li>
      <li 
        onClick={() => setActiveTab('flashsale')} 
        style={{...styles.menuItem, ...(activeTab === 'flashsale' ? styles.active : {})}}
      >
        Quản lý chương trình giảm giá
      </li>
    </ul>
    <button 
      style={styles.homeBtn} 
      onClick={() => navigate('/')}
    >
      Trở về trang chủ
    </button>
    <button style={styles.logoutBtn} onClick={handleLogout}>
      Đăng xuất
    </button>
  </>
)}

        </div>
        <div style={styles.content}>
          {activeTab === 'category' && <CategoryManagement />}
          {activeTab === 'product' && <ProductManagement />}
          {activeTab === 'brand' && <BrandManagement />}
          {activeTab === 'user' && <UserManagement />}
          {activeTab === 'order' && <OrderManagement />}
          {activeTab === 'discount' && <DiscountManagement />}
          {activeTab === 'flashsale' && <FlashSaleManagement/>}
          {activeTab === 'statistical' && <StatisticalManagement />}

        </div>
      </div>
    );
  };
  

const styles = {
  dashboardContainer: {
    display: 'flex',
    height: '100vh',
    backgroundColor: '#f9f9f9',
  },
  sidebar: {
    width: '25%',
    backgroundColor: '#dbdfe6',
    padding: '20px',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    transition: 'width 0.3s ease, background-color 0.3s ease', 
  },
  sidebarTitle: {
    textAlign: 'center',
    marginBottom: '20px',
    color:'#fff'
  },
  menuList: {
    listStyleType: 'none',
    padding: 0,
    margin: '20px 0',
  },
  menuItem: {
    padding: '10px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    borderRadius: '5px',
    marginBottom: '10px',
  },
  active: {
    backgroundColor: '#72a8dade',
  },
  logoutBtn: {
    backgroundColor: '#FF4C4C',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '10px',
    cursor: 'pointer',
    position: 'absolute',
    bottom: '20px',
    left: '20px',
    width: '90%',
    textAlign: 'center',

  },
  homeBtn: {
  backgroundColor: '#4CAF50',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  padding: '10px',
  cursor: 'pointer',
  position: 'absolute',
  bottom: '80px', // Cách nút đăng xuất một khoảng
  left: '20px',
  width: '90%',
  textAlign: 'center',
},

  icon: {
    fontSize: '24px', 
    color: '#fff', 
    outline: 'none',
  },
  toggleBtn: {
    position: 'absolute',
    top: '20px',
    right: '-20px', 
    backgroundColor: '#323a49', 
    border: 'none',
    borderRadius: '50%',
    padding: '10px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    outLine:'none'
  },
  content: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto',
  },
};

export default AdminDashboard;
