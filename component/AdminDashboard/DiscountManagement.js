import React, { useState, useEffect } from "react";
import { getAllDiscount, addDiscount, getAllDiscountIsDelete, deleteDiscountSoft, restoreDiscount } from '../../services/discountService'
import Pagination from "../Pagination/Pagination";
const DiscountManagement = () => {
  const [discounts, setDiscount] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [discountData, setDiscountData] = useState({
    discountValue: '',
    discountType: '',
    discountScope: '',
    minOrderAmount: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [discountsPerPage] = useState(8);
  const [deletedDiscounts, setDeletedDiscounts] = useState([]);
  const [showDeletedDiscounts, setShowDeletedDiscounts] = useState(false);


  const DISCOUNT_SCOPE_ENUM = {
    ORDER: 'ORDER',
    PRODUCT: 'PRODUCT'
  };

  const DISCOUNT_TYPE_ENUM = {
    PERCENTAGE: 'PERCENTAGE',
    FIXED: 'FIXED'
  };

  useEffect(() => {
    if (showDeletedDiscounts) {
      fetchDeletedDiscounts();
    } else {
      fetchAllDiscount();
    }
  }, [showDeletedDiscounts]);

  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
        setErrorMessage('');
      }, 3000); // Sau 3 giây tự động ẩn thông báo

      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);


  const fetchDeletedDiscounts = async () => {
    try {
      const response = await getAllDiscountIsDelete();
      setDeletedDiscounts(response);
      setShowDeletedDiscounts(true);
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      throw new Error(errorMessage);
    }
  };

  const handleDeleteDiscount = async (id) => {
    const confirmDelete = window.confirm("Bạn có muốn xóa mã giảm giá này không ?");
    if (confirmDelete) {
      try {
        await deleteDiscountSoft(id);
        fetchAllDiscount();
        setSuccessMessage("Xóa mã giảm giá thành công")
      } catch (error) {
        const errorMessage = error.response?.data?.message;
        throw new Error(errorMessage);
      }
    }
    else {
      console.log('Đã hủy thao tác xóa.');
    }
  };

  const handleRestoreDiscount = async (id) => {
    const confirmDelete = window.confirm("Bạn có muốn khôi phục mã giảm giá này không ?");
    if (confirmDelete) {
      try {
        await restoreDiscount(id);
        fetchAllDiscount();
        setDeletedDiscounts(prevDeletedDiscount =>
          prevDeletedDiscount.filter(discount => discount.id !== id)
        );
        setSuccessMessage("Khôi phục mã giảm giá thành công!");
      } catch (error) {
        console.error("Không thể khôi phục mã giảm giá:", error.message);
        setErrorMessage("Khôi phục thất bại.");
      }
    }
    else {
      console.log('Đã hủy thao tác xóa.');
    }
  };

  const fetchAllDiscount = async () => {
    try {
      const response = await getAllDiscount();
      setDiscount(Array.isArray(response) ? response : response.result || []);
      if (response.length === 0) {
        setErrorMessage('Không có mã giảm giá trong cơ sở dữ liệu');
      }
    } catch (error) {
      console.error("Lỗi khi gọi mã giảm giá:", error.message);
      setDiscount([]);
      setDeletedDiscounts([]);
    }
  };

  const createDiscount = async () => {
    if (![DISCOUNT_SCOPE_ENUM.ORDER, DISCOUNT_SCOPE_ENUM.PRODUCT].includes(discountData.discountScope)) {
      setErrorMessage('Phạm vi giảm giá không hợp lệ.');
      return;
    }
    if (![DISCOUNT_TYPE_ENUM.PERCENTAGE, DISCOUNT_TYPE_ENUM.FIXED].includes(discountData.discountType)) {
      setErrorMessage('Loại giảm giá không hợp lệ.');
      return;
    }

    try {
      await addDiscount(discountData);
      fetchAllDiscount();
      setSuccessMessage('Thêm mới mã giảm giá thành công');
      setShowPopup(false); // Đóng popup sau khi thêm thành công
    } catch (error) {
      console.error('Không thể thêm mới mã giảm giá:', error.response ? error.response.data : error.message);
      setErrorMessage('Không thể thêm mới được mã giảm giá');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDiscountData({ ...discountData, [name]: value });
  };

  // const handleDelete = async (id) => {
  //   try {
  //     // await deleteDiscount(id);
  //     fetchAllDiscount(); // Cập nhật lại danh sách sau khi xóa
  //     setSuccessMessage('Mã giảm giá đã được xóa');
  //   } catch (error) {
  //     setErrorMessage('Không thể xóa mã giảm giá');
  //   }
  // };

  const handleEdit = (discount) => {
    setDiscountData({
      discountValue: discount.discountValue,
      discountType: discount.discountType,
      discountScope: discount.discountScope,
      minOrderAmount: discount.minOrderAmount,
    });
    setShowPopup(true);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastDiscount = currentPage * discountsPerPage;
  const indexOfFirstDiscount = indexOfLastDiscount - discountsPerPage;
  const currentDiscounts = discounts.slice(indexOfFirstDiscount, indexOfLastDiscount);

  const totalPages = Math.ceil(discounts.length / discountsPerPage);

  return (
    <div className='container-fluid'>
      <h2 className='mb-5' style={styles.heading}>Quản Lý Mã Giảm Giá</h2>
      <div className='brand'>
        <div className='brand-btn d-flex justify-content-start mb-3' style={{ marginRight: '13rem' }}>
          <button className='mr-2' style={styles.editBtn} onClick={() => setShowPopup(true)}>Thêm mã giảm giá</button>
          {showDeletedDiscounts ? (
            <button style={styles.editBtn} onClick={() => setShowDeletedDiscounts(false)}>Quay lại danh sách mã giảm giá chính</button>
          ) : (
            <button style={styles.editBtn} onClick={fetchDeletedDiscounts}>Danh sách mã giảm giá đã xóa</button>
          )}
        </div>
        {errorMessage && <div className='alert alert-danger' role='alert'>{errorMessage}</div>}
        {successMessage && <div className="alert alert-success" role="alert">{successMessage}</div>}
        {showDeletedDiscounts ? (
          <table className="table">
            <thead>
              <tr>
                <th scope="col">STT</th>
                <th scope="col">Mã giảm giá</th>
                <th scope="col">Giá trị</th>
                <th scope="col">Ngày hết hạn</th>
                <th scope="col">Loại giảm giá</th>
                <th scope="col">Phạm vi giảm giá</th>
                <th scope="col">Số lần sử dụng</th>
                <th scope="col">Giảm theo số tiền</th>
                <th scope="col">Hành động</th>
              </tr>
            </thead>
            {deletedDiscounts.length === 0 ? (
              <p style={styles.emptyMessage}>Chưa có mã giảm giá nào.</p>
            ) : (
              <tbody>
                {deletedDiscounts.map((discount, index) => (
                  <tr key={discount.id}>
                    <th className='align-content-center' scope="row">{indexOfFirstDiscount + index + 1}</th>
                    <td className='align-content-center'>{discount.code}</td>
                    <td className='align-content-center'>{discount.discountValue}</td>
                    <td className='align-content-center'>{discount.expirationDate}</td>
                    <td className='align-content-center'>{discount.discountType}</td>
                    <td className='align-content-center'>{discount.discountScope}</td>
                    <td className='align-content-center'>{discount.maxUsagePerUser}</td>
                    <td className='align-content-center'>{discount.minOrderAmount}</td>
                    <td className='align-content-center'>
                      <td>
                        <button
                          style={styles.editBtn}
                          onClick={() => handleRestoreDiscount(discount.id)}
                        >
                          Khôi phục
                        </button>
                      </td>

                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th scope="col">STT</th>
                <th scope="col">Mã giảm giá</th>
                <th scope="col">Giá trị</th>
                <th scope="col">Ngày hết hạn</th>
                <th scope="col">Loại giảm giá</th>
                <th scope="col">Phạm vi giảm giá</th>
                <th scope="col">Số lần sử dụng</th>
                <th scope="col">Giảm theo số tiền</th>
                <th scope="col">Hành động</th>
              </tr>
            </thead>
            {currentDiscounts.length === 0 ? (
              <p style={styles.emptyMessage}>Chưa có mã giảm giá nào.</p>
            ) : (
              <tbody>
                {currentDiscounts.map((discount, index) => (
                  <tr key={discount.id}>
                    <th className='align-content-center' scope="row">{indexOfFirstDiscount + index + 1}</th>
                    <td className='align-content-center'>{discount.code}</td>
                    <td className='align-content-center'>{discount.discountValue}</td>
                    <td className='align-content-center'>{(discount.expirationDate).split(".")[0]}</td>
                    <td className='align-content-center'>{discount.discountType}</td>
                    <td className='align-content-center'>{discount.discountScope}</td>
                    <td className='align-content-center'>{discount.maxUsagePerUser}</td>
                    <td className='align-content-center'>{discount.minOrderAmount}</td>
                    <td className='align-content-center'>
                      <div>
                        <button className='mr-2' style={styles.editBtn} onClick={() => handleEdit(discount)}>Sửa</button>
                        <button style={styles.deleteButton} onClick={() => handleDeleteDiscount(discount.id)}>Xóa</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        )}
        {/* Sử dụng Pagination Component */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        {showPopup && (
          <div style={styles.popupOverlay}>
            <div style={styles.popup}>
              <h3 style={styles.popupHeading}>Thêm Mã Giảm Giá</h3>
              <div style={styles.formContainer}>
                <div style={styles.formGroup}>
                  <label htmlFor="discountValue" style={styles.label}>Giá trị giảm giá</label>
                  <input
                    type="text"
                    id="discountValue"
                    name="discountValue"
                    value={discountData.discountValue}
                    onChange={handleInputChange}
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="discountType" style={styles.label}>Loại Giảm Giá</label>
                  <select
                    id="discountType"
                    name="discountType"
                    value={discountData.discountType}
                    onChange={handleInputChange}
                    style={styles.input}
                  >
                    <option value="">Chọn Loại Giảm giá</option>
                    <option value={DISCOUNT_TYPE_ENUM.PERCENTAGE}>Giảm theo phần trăm</option>
                    <option value={DISCOUNT_TYPE_ENUM.FIXED}>Giảm theo số tiền cố định</option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="discountScope" style={styles.label}>Phạm Vi Giảm Giá</label>
                  <select
                    id="discountScope"
                    name="discountScope"
                    value={discountData.discountScope}
                    onChange={handleInputChange}
                    style={styles.input}
                  >
                    <option value="">Chọn Phạm vi Giảm giá</option>
                    <option value={DISCOUNT_SCOPE_ENUM.ORDER}>Đơn hàng</option>
                    <option value={DISCOUNT_SCOPE_ENUM.PRODUCT}>Sản phẩm</option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="minOrderAmount" style={styles.label}>Giá trị đơn hàng tối thiểu</label>
                  <input
                    type="number"
                    id="minOrderAmount"
                    name="minOrderAmount"
                    value={discountData.minOrderAmount}
                    onChange={handleInputChange}
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.popupButtons}>
                <button onClick={createDiscount} style={styles.button}>Xác nhận</button>
                <button onClick={() => setShowPopup(false)} style={styles.deleteButton}>Hủy</button>
              </div>
            </div>
          </div>
        )}


      </div>
    </div>
  );
};


const styles = {
  container: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    margin: '20px',
  },
  heading: {
    color: '#343a40',
    textAlign: 'center',
    marginBottom: '20px',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px', // Tăng khoảng cách giữa các trường
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '5px', // Thêm khoảng cách dưới label
  },
  input: {
    padding: '12px',
    border: '1px solid #0AD1C8',
    borderRadius: '5px',
    outline: 'none',
    fontSize: '16px',
    marginBottom: '10px',
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center',
    marginTop: '10px',
  },
  successMessage: {
    color: 'green',
    textAlign: 'center',
    marginTop: '10px',
  },
  button: {
    padding: '12px',
    backgroundColor: '#3d99f5',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    fontSize: '16px',
  },
  buttonHover: {
    backgroundColor: '#0a7e7a',
  },
  categoryList: {
    listStyleType: 'none',
    padding: '0',
    marginTop: '20px',
  },
  categoryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px',
    borderBottom: '1px solid #dee2e6',
    alignItems: 'center',
  },
  categoryName: {
    fontWeight: 'bold',
    color: '#343a40',
  },
  deleteButton: {
    backgroundColor: '#FF4C4C',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    padding: '8px 12px',
  },
  popupOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    width: '300px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
  popupHeading: {
    color: '#333',
    marginBottom: '15px',
    fontSize: '18px',
    textAlign: 'center',
  },
  popupButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '15px',
  },
  editBtn: {
    backgroundColor: '#3d99f5',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    padding: '8px 12px',
  },
  previewContainer: {
    marginTop: '20px',
    borderTop: '1px solid #ddd',
    paddingTop: '10px',
  },
  previewHeading: {
    color: '#0AD1C8',
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
  },
};


export default DiscountManagement;
