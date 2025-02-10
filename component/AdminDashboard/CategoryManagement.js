import React, { useState, useEffect } from 'react';
import { createCategory, getAllCategories, deleteSoftCategory, updateCategory, getAllCategoriesIsDelete, restoreCategory, } from '../../services/categoryService';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [errorMessage, setErrorMessage] = useState(''); // Biến lưu trữ thông báo lỗi
  const [successMessage, setSuccessMessage] = useState(''); // Biến lưu trữ thông báo thành công
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false); // State cho popup thêm
  const [deletedCategories, setDeletedCategories] = useState([]); // Danh sách các thể loại đã xóa mềm
  const [showDeletedCategories, setShowDeletedCategories] = useState(false);


  useEffect(() => {
    if (showDeletedCategories) {
      fetchDeletedCategory();
    } else {
      fetchCategories();
    }
  }, [showDeletedCategories]);

  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
        setErrorMessage('');
      }, 3000); // Sau 3 giây tự động ẩn thông báo

      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);


  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(Array.isArray(data) ? data : data.result || []);
      if (data.length === 0) {
        setErrorMessage('Không có thể loại trong cơ sở dữ liệu');
      }
    } catch (error) {
      console.error("Lỗi khi gọi thể loại:", error.message);
      setCategories([]);
      setDeletedCategories([]);
    }
  };

  const fetchDeletedCategory = async () => {

    try {
      const response = await getAllCategoriesIsDelete();
      setDeletedCategories(response);
      setShowDeletedCategories(true);
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      throw new Error(errorMessage);
    }
  };

  const addCategory = async () => {
    if (!name) {
      setErrorMessage("Tên thể loại không được để trống!");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);

    try {
      await createCategory(formData);
      fetchCategories();
      setIsAddPopupOpen(false);
      setSuccessMessage("Thể loại đã được thêm thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm thể loại:", error.message);
      setErrorMessage("Thêm thể loại thất bại.");
    }
  };


  const handleDeleteCategory = async (id) => {
    const confirmDelete = window.confirm("Bạn có muốn xóa thể loại này không ?");
    if (confirmDelete) {
      try {
        await deleteSoftCategory(id);
        fetchCategories();
        setSuccessMessage("Xóa thể loại thành công")
      } catch (error) {
        console.error('Không xóa được thể loại:', error.message);
      }
    }
    else {
      console.log('Đã hủy thao tác xóa.');
    }
  };

  const handleEditCategory = (category) => {
    setEditCategory(category);
    setIsEditPopupOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editCategory || !editCategory.id) {
      setErrorMessage('Không thể tìm thấy ID thể loại để cập nhật.');
      return;
    }

    const formData = new FormData();
    formData.append("name", editCategory.name); // Thêm tên thể loại

    try {
      await updateCategory(editCategory.id, formData); // Truyền đúng ID thể loại
      setIsEditPopupOpen(false);
      fetchCategories();
      setSuccessMessage('Sửa thể loại thành công!');
    } catch (error) {
      console.error('Sửa thất bại:', error.message);
      setErrorMessage('Sửa thể loại thất bại');
    }
  };

  const handleRestoreCategory = async (id) => {
    const confirmDelete = window.confirm("Bạn có muốn khôi phục thể loại này không ?");
    if (confirmDelete) {
      try {
        await restoreCategory(id);
        fetchCategories();
        setDeletedCategories(prevDeletedCategories =>
          prevDeletedCategories.filter(category => category.id !== id)
        );
        setSuccessMessage("Khôi phục thể loại thành công!");
      } catch (error) {
        console.error("Không thể khôi phục thể loại:", error.message);
        setErrorMessage("Khôi phục thất bại.");
      }
    }
    else {
      console.log('Đã hủy thao tác xóa.');
    }
  };

  const openAddPopup = () => {
    setIsAddPopupOpen(true); // Mở popup thêm sản phẩm
  };

  const closeAddPopup = () => {
    setIsAddPopupOpen(false); // Đóng popup
    setName(''); // Reset input fields
    setSuccessMessage(''); // Reset thông báo thành công
    setErrorMessage(''); // Reset thông báo lỗi
  };

  return (
    <div className='container-fluid'>
      <h2 className='mb-5'>Quản Lý Thể Loại</h2>
      <div className='brand'>
        <div className='brand-btn d-flex justify-content-start mb-3' style={{ marginRight: '13rem' }}>
          <button className='mr-2' style={styles.editBtn} onClick={openAddPopup}>Thêm Thể Loại</button>
          {showDeletedCategories ? (
            <button style={styles.editBtn} onClick={() => setShowDeletedCategories(false)}>Quay lại danh sách thể loại chính</button>
          ) : (
            <button style={styles.editBtn} onClick={fetchDeletedCategory}>Danh sách thể loại đã xóa</button>
          )}
        </div>
        {errorMessage && <div className='alert alert-error' role='alert'>{errorMessage}</div>}
        {successMessage && <div className="alert alert-success" role="alert">{successMessage}</div>}
        {showDeletedCategories ? (
          <table className="table">
            <thead>
              <tr>
                <th scope="col">STT</th>
                <th scope="col">Thể Loại</th>
                <th scope="col">Thời gian tạo</th>
                <th scope="col">Thời gian cập nhật</th>
                <th scope="col">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {deletedCategories.length === 0 ? (
                <p style={styles.emptyMessage}>Không có thể loại đã xóa.</p>
              ) : (
                deletedCategories.map((category, index) => (
                  <tr key={category.id}>
                    <th scope="row">{index + 1}</th>
                    <td>{category.name}</td>
                    <td>
                      {(category.dateCreated).split(".")[0]}
                    </td>
                    <td>
                      {(category.dateCreated).split(".")[0]}
                    </td>
                    <td>
                      <button
                        style={styles.editBtn}
                        onClick={() => handleRestoreCategory(category.id)}
                      >
                        Khôi phục
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : (
          // Phần hiển thị danh sách chính
          <table className="table">
            <thead>
              <tr>
                <th scope="col">STT</th>
                <th scope="col">Thể Loại</th>
                <th scope='col'>Thời gian tạo</th>
                <th scope='col'>Thời gian cập nhật</th>
                <th scope="col">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <p style={styles.emptyMessage}>Chưa có thể loại nào.</p>
              ) : (
                categories.map((category, index) => (
                  <tr key={category.id}>
                    <th scope="row">{index + 1}</th>
                    <td>{category.name}</td>
                    <td>
                      {(category.dateCreated).split(".")[0]}
                    </td>
                    <td>
                      {(category.dateCreated).split(".")[0]}
                    </td>
                    <td>
                      <button
                        className="mr-2"
                        style={styles.editBtn}
                        onClick={() => handleEditCategory(category)}
                      >
                        Sửa
                      </button>
                      <button
                        style={styles.deleteButton}
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {isEditPopupOpen && (
          <div style={styles.popupOverlay}>
            <div style={styles.popup}>
              <h4 style={styles.popupHeading}>Chỉnh sửa Thể loại</h4>
              <div>
                <label style={styles.label} htmlFor="editCategoryName">Tên thể loại:</label>
                <input
                  id="editCategoryName"
                  style={styles.input}
                  type="text"
                  placeholder="Tên thể loại"
                  value={editCategory.name}
                  onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
                />
              </div>
              <div style={styles.popupButtons}>
                <button style={styles.editBtn} onClick={handleSaveEdit}>Lưu</button>
                <button style={styles.deleteButton} onClick={() => setIsEditPopupOpen(false)}>Hủy</button>
              </div>
            </div>
          </div>
        )}

        {isAddPopupOpen && (
          <div style={styles.popupOverlay}>
            <div style={styles.popup}>
              <h3 style={styles.popupHeading}>Thêm Thể Loại</h3>
              <div>
                <label style={styles.label} htmlFor="categoryName">Tên thể loại:</label>
                <input
                  id="categoryName"
                  style={styles.input}
                  type="text"
                  placeholder="Tên thể loại"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div style={styles.popupButtons}>
                <button style={styles.editBtn} onClick={addCategory}>Lưu</button>
                <button style={styles.deleteButton} onClick={closeAddPopup}>Hủy</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div >

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
    gap: '10px',
  },
  input: {
    padding: '12px',
    border: '1px solid #0AD1C8',
    borderRadius: '5px',
    outline: 'none',
    fontSize: '16px',
    width: '100%',
    boxSizing: 'border-box',
  },
  label: {
    fontSize: '14px',
    color: '#333',
    display: 'block',
    marginBottom: '5px',
    textAlign: 'left', // Đảm bảo căn trái cho label
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
    width: '400px', // Cập nhật chiều rộng popup
    maxWidth: '80%', // Giới hạn chiều rộng popup
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    boxSizing: 'border-box',
  },
  popupHeading: {
    color: '#333',
    marginBottom: '15px',
    fontSize: '18px',
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

export default CategoryManagement;
