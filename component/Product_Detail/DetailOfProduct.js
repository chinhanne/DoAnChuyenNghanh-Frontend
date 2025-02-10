import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../Home/Header';
import { Link } from 'react-router-dom';
import CommentList from '../Product_Detail/CommentList';
import Comments from '../Product_Detail/Comments';
const DetailOfProduct = () => {
  const location = useLocation();
  const [product] = useState(location.state?.product || null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(product?.images[0] || '');
  const [commentUpdateTrigger, setCommentUpdateTrigger] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    if (!product) {
      console.error('Product not found in state');
    }
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [product]);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };
  const checkUser = () => {
    const user = localStorage.getItem("accessToken");
    try {
      return user ? true : false;
    } catch (error) {
      console.error("Lỗi khi parse user từ localStorage:", error);
      return null;
    }
  };

  const handleSellNow = () => {
    if (!checkUser()) {
      alert("Vui lòng đăng nhập để tiếp tục!");
      return;
    }

    if (!product) {
      alert("Sản phẩm không hợp lệ!");
      return;
    }

    // Dữ liệu sản phẩm được truyền vào trang thanh toán
    const orderProduct = { ...product, quantity };
    navigate('/pay', { state: { orderProduct, isDirectBuy: true } });
  };


  const handleAddToCart = () => {
    if (!checkUser()) {
      alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
    } else {
      const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      const existingItemIndex = cartItems.findIndex(item => item.id === product.id);

      if (existingItemIndex >= 0) {
        cartItems[existingItemIndex].quantity += quantity;
      } else {
        const cartItem = { ...product, quantity };
        cartItems.push(cartItem);
      }

      localStorage.setItem("cartItems", JSON.stringify(cartItems));

      const event = new CustomEvent('cartUpdated');
      window.dispatchEvent(event);

      alert("Sản phẩm đã được thêm vào giỏ hàng!");
    }
  };


  if (!product) {
    return <p>Loading...</p>;
  }
  const formatPrice = (price) => {
    return price.toLocaleString();
  };
  const handleIncrease = () => setQuantity(prevQuantity => prevQuantity + 1);
  const handleDecrease = () => setQuantity(prevQuantity => Math.max(1, prevQuantity - 1));
  const handleCommentAdded = () => setCommentUpdateTrigger(prev => !prev); // Toggle to reload comments

  return (
    <div>
      <Header />
      <div className="container-fluid p-1" style={{ backgroundColor: '#f8f9fa' }}>
        <div className='container'>
          <div style={{ marginTop: 120 }} >
            <div className='return d-flex'>
              <Link to="/" className='a-none'>
                <p style={{ fontSize: 18, marginBottom: 10 }}>Trở Lại</p>
              </Link>
            </div>
            <div className="row mt-2">
              {/* Main Product Image */}
              <div className="col-md-7">
                <div className="row">
                  <div className="col-12">
                    <img
                      src={selectedImage}
                      alt="Main product"
                      style={{ width: '100%', height: 500, borderRadius: '8px', objectFit: 'cover' }}
                    />
                  </div>
                </div>
                {/* Thumbnail Images */}
                <div className='row mt-2'>
                  <div className="ml-3 d-flex">
                    {product.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        onClick={() => handleImageClick(image)}
                        style={{
                          width: 100,
                          height: 80,
                          cursor: 'pointer',
                          borderRadius: '8px',
                          border: selectedImage === image ? '2px solid #dc3545' : '1px solid #ddd',
                          margin: '5px'
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="col-md-5">
                <h4 style={{ color: '#212529', textAlign: 'start' }}>{product.name}</h4>
                <div className='d-flex product-info'>
                  <div className='pro-brand'>
                    <span>Thương Hiệu: {product.brandName}</span>
                  </div>
                  <span className='line-info ml-3 mr-3'>|</span>
                  <div className='pro-type'>
                    <span>Loại: {product.categoryName}</span>
                  </div>
                </div>
                <div className=" mb-3">
                  {product.priceSale === 0 ? (
                    <h4 style={{ color: '#dc3545', fontWeight: 'bold' }}>Giá gốc: {formatPrice(product.price)}đ</h4>
                  ) : (
                    <div>
                      <div className='d-flex'>
                        <span>Giá gốc:</span>
                        <del>
                          <h5 className='ml-3'>{formatPrice(product.price)}đ</h5>
                        </del>
                      </div>
                      <div className='d-flex'>
                        <span>Giá giảm:</span>
                        <h5 style={{ color: '#dc3545', fontWeight: 'bold', marginLeft: 5 }}> {formatPrice(product.priceSale)}đ</h5>
                      </div>

                    </div>
                  )}

                </div>
                <div className='col-xs-12 selector-actions d-flex align-items-center mb-5'>
                  <div className='quantity-area d-flex align-items-center'>
                    <button onClick={handleDecrease} style={{ width: 40, height: 40, border: '1px solid #ccc', backgroundColor: '#fff' }}>
                      <strong>-</strong>
                    </button>
                    <div className="input-quantity d-flex">
                      <input
                        style={{ border: '1px solid #ccc', textAlign: 'center', width: 40, height: 40 }}
                        type="text"
                        value={quantity}
                        readOnly
                      />
                    </div>
                    <button onClick={handleIncrease} style={{ width: 40, height: 40, border: '1px solid #ccc', backgroundColor: '#fff' }}>
                      <strong>+</strong>
                    </button>
                  </div>
                </div>
                <div className="mb-3">
                  <button className="btn btn-primary btn-lg w-100"
                    style={{ backgroundColor: '#dc3545', borderColor: '#dc3545' }}
                    onClick={handleSellNow}
                  >Mua Ngay</button>
                  <button className="btn btn-outline-danger btn-lg w-100 mt-2" onClick={() => { handleAddToCart() }}>Thêm vào giỏ hàng</button>
                </div>
              </div>
            </div>
            {/* Additional Details */}
            <div className="row mt-5">
              <div className="col-8">
                <div className='contents'>
                  <div className='title-head-tab'><h4>Mô Tả Sản Phẩm</h4></div>
                  <div className='product-description-tab'>
                    <p>{product.description}</p>
                  </div>
                </div>
              </div>
              <div className='col-4'>
                <div className='table-content'>
                  <div className='table-title'><h4>Thông Số Kỹ Thuật</h4></div>
                  <table className='table table-bordered'>
                    <tbody>
                      <tr><th>Chip</th><td>{product.chip}</td></tr>
                      <tr><th>Đồ Hoạ</th><td>{product.card}</td></tr>
                      <tr><th>Ram</th><td>{product.ram}</td></tr>
                      <tr><th>Màn hình</th><td>{product.screen}</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <Comments productId={product?.id} onCommentAdded={handleCommentAdded} />
            <CommentList productId={product?.id} updateTrigger={commentUpdateTrigger} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailOfProduct;
