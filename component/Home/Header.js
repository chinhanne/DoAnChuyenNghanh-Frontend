import React, { Component } from 'react';
import '../../asserts/Header.css';
import { logout, login } from '../../services/authenticationService';
import { Link } from 'react-router-dom';
import { getAllBrands } from '../../services/brandService';
import { getAllCategories } from '../../services/categoryService';

export default class Header extends Component {

    constructor(props) {
      super(props);
      this.state = {
        user: null,
        password: "",
        dob: "",
        gender: "",
        address: "",
        numberPhone: "",
        categories: [],
        brands: [],
        keyword: '',
        cartCount: 0,
      };
    }
  
    componentDidMount() {
      const accessToken = localStorage.getItem('accessToken');
    
      if (accessToken) {
        this.getUserDetails(accessToken);
      }
    
      this.fetchCategories();
      this.fetchBrands();
      this.updateCartCount();
    
      window.addEventListener('cartUpdated', this.updateCartCount); 
    }
    
    componentWillUnmount() {
      window.removeEventListener('cartUpdated', this.updateCartCount);
    }
  
    updateCartCount = () => {
      const cartCount = this.getCartItemCount();
      this.setState({ cartCount });
    };
  
    getCartItemCount = () => {
      const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      return cartItems.reduce((total, item) => total + item.quantity, 0); // Tính tổng số lượng sản phẩm
    };
  
    navigate = (path) => {
      const { navigate } = this.props;
      if (navigate) {
        navigate(path);
      } else {
        window.location.href = path;
      }
    };
  
    handleLogout = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const requestData = { token };
        await logout(requestData);
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        this.setState({ user: null });
        this.navigate('/');
      } catch (error) {
        console.error('Đăng xuất thất bại:', error.message);
      }
    };
  
    handleLogin = async (credentials) => {
      try {
        const userData = await login(credentials);
        this.setState({ user: userData.user || { username: credentials.username } });
  
        if (userData.noPassword) {
          this.navigate('/updateInfoUser');
        } else {
          this.navigate('/');
        }
      } catch (error) {
        console.error('Lỗi đăng nhập:', error.message);
      }
    };
  
    getUserDetails = async (accessToken) => {
      if (!accessToken) {
        this.setState({ error: "Bạn phải đăng nhập để lấy thông tin." });
        return;
      }
      try {
        const response = await fetch("http://localhost:8080/users/myInfo", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
  
        if (!response.ok) {
          throw new Error("Không thể lấy thông tin người dùng");
        }
  
        const data = await response.json();
  
        if (data && data.result) {
          this.setState({ user: data.result });
  
          if (data.result.noPassword !== undefined && data.result.noPassword) {
            this.navigate('/updateInfoUser');
          }
        } else {
          this.setState({ user: null });
        }
      } catch (error) {
        this.setState({ error: error.message });
      }
    };
  
    fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        if (Array.isArray(response)) {
          this.setState({ categories: response });
        } else {
          this.setState({ categories: [] });
          console.error('Dữ liệu không phải là mảng:', response);
        }
      } catch (error) {
        console.error('Error fetching categories:', error.message);
        this.setState({ categories: [] });
      }
    };
  
    fetchBrands = async () => {
      try {
        const response = await getAllBrands();
        if (Array.isArray(response)) {
          this.setState({ brands: response });
        } else {
          this.setState({ brands: [] });
          console.error("Không thể lấy thông tin thương hiệu", response);
        }
      } catch (error) {
        console.error("Không thể lấy thông tin thương hiệu", error.message);
        this.setState({ brands: [] });
      }
    };
  
    handleBrandClick = (brand) => {
      if (typeof this.props.onBrandSelect === 'function') {
        this.props.onBrandSelect(brand);
      } else {
        console.error("onBrandSelect không phải hàm");
      }
    };
  
    handleCategoryClick = (category) => {
      this.props.onCategorySelect(category);
    };
  
    handleInputChange = (event) => {
      this.setState({ keyword: event.target.value });
    };
  
    handleSearch = async () => {
      const { keyword } = this.state;
      if (!keyword.trim()) return;
      this.navigate(`/product?search=${keyword}`);
    };
  render() {
    const { user, categories, brands, keyword, cartCount } = this.state;
    return (
      <div>
        <header className='header' >
          <div className='header-background' style={{ height: 108 }}>
            <div className='container-fluid'>
              <div className='row'>
                <div className='col-2'>
                  <Link to="/">
                  <div className='logo'>
                      <div className='logo-img d-flex justify-content-center' style={{padding:12}}>
                        <img src={require('../../asserts/ProductImg/logo3.png')} style={{ width: '55%', marginTop: 18 }} alt='logo' />
                      </div>
                    </div>
                  </Link>
                </div>
                <div className='col-3 d-flex justify-content-around'>
                  <div className='category d-flex justify-content-center'>
                    <div className='category-icon align-items-center d-flex'>
                      <span className='title-cate ml-2' style={{ color: 'aliceblue' }}>Danh Mục</span>
                    </div>
                    <nav className='nav-group'>
                      <div style={{ position: 'relative' }}>
                        {Array.isArray(categories) && categories.length > 0 ? (
                          <ul className='navigation list-menu-nav scroll p-0' style={{ justifyContent: 'space-evenly' }}>
                            {categories.map((category, index) => (
                              <li className='nav-item'
                                key={index}
                                onClick={() => this.handleCategoryClick(category)}
                              >
                                <span className='align-items-center'>{category.name}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p>Không có thể loại</p>
                        )}
                      </div>
                    </nav>
                  </div>
                  <div className='brand-dropdown align-items-center justify-content-center d-flex'>
                    <div className='brand-title'>
                      <span className='title-cate' style={{ color: 'aliceblue' }}>Thương Hiệu</span>
                    </div>
                    <nav className='nav-brand-group'>
                      <div style={{ position: 'relative' }}>
                        {Array.isArray(brands) && brands.length > 0 ? (
                          <ul className='navigation list-menu-nav scroll p-0' style={{ justifyContent: 'space-evenly' }}>
                            {brands.map((brand) => (
                              <li
                                className='nav-item'
                                key={brand.id || brand.name}
                                onClick={() => this.handleBrandClick(brand)} // Xử lý sự kiện khi chọn thương hiệu
                              >
                                <span className='align-items-center'>{brand.name || 'Không có tên thương hiệu'}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p>Không có thương hiệu</p>
                        )}
                      </div>
                    </nav>
                  </div>
                </div>
                <div className='col-4'>
                  <div className='search'>
                    <form onSubmit={(e) => e.preventDefault()}> {/* Ngăn chặn reload trang */}
                      <div className='search-inner'>
                        <input
                          className='search-input'
                          type='search'
                          placeholder='Bạn Muốn Tìm Gì?'
                          value={keyword}
                          onChange={this.handleInputChange}
                        />
                        <button
                          type="button"
                          className="btn-search"
                          onClick={this.handleSearch}
                        >
                          <i className="fa fa-search" style={{ color: 'white' }}></i>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
                <div className='col-3'>
                  <div className='row'>
                    <div className='col-2'>
                      <div className='cart'>
                        <div className='cart-btn'>
                          <Link to="/cart">
                            <button className='btn-cart d-flex d-flex-center'>
                              <span className='box-icon'>
                                <img style={{ width: 35, height: 35, marginTop: 5 }} src='//theme.hstatic.net/200000837185/1001221874/14/shopping-cart.svg?v=2440' alt='Giỏ hàng' />
                              </span>
                              <span className='box-text visible-lg' style={{ marginTop: 5, marginLeft: 3 }}></span>
                              {cartCount > 0 && (
                                <span className="cart-count">{cartCount}</span>
                              )}
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className='col-10 d-flex justify-content-center ' style={{ width: '100%', height: 108 }}>
                      <div className='Login d-flex align-items-center'>
                        {user ? (
                          <div className='d-flex user-logged-in pt-3'>
                            <Link to='/info' className='a-none'>
                              <span className='box-text visible-lg d-flex'>
                                <p className='title-login username' style={{ fontFamily: 'Merriweather,serif', fontSize: '1rem' }}>
                                  Chào, {user.username}
                                </p>
                              </span>
                            </Link>
                            <button onClick={this.handleLogout} className='btn-login d-flex d-flex-center' type='submit'>
                              <span className='box-text visible-lg' style={{ color: 'red' }}>
                                Đăng Xuất
                              </span>
                            </button>
                          </div>
                        ) : (
                          <Link to="/login" className='a-none'>
                            <div>
                              <button className='btn-login d-flex d-flex-center' type='submit' style={{ paddingTop: 6 }}>
                                <span className='box-icon'>
                                  <img style={{ width: 24, height: 24, marginTop: 5 }} src='https://theme.hstatic.net/200000837185/1001221874/14/user-account.svg?v=2440' alt='Ảnh đại diện' />
                                </span>
                                <span className='box-text visible-lg'>
                                  <p className='title-login mt-1'>Đăng Nhập</p>
                                </span>
                              </button>
                            </div>
                          </Link>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
      </div>
    );
  }
}
