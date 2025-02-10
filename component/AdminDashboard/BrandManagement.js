import React, { useState, useEffect } from 'react';
import { createBrand, getAllBrands, updateBrand, deleteSoftBrand as deleteSoftBrandService, getAllBrandIsDelete, deleteSoftBrand, restoreBrand } from '../../services/brandService'; // Import các dịch vụ

const BrandManagement = () => {
  const [brands, setBrands] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // Biến lưu trữ thông báo lỗi
  const [successMessage, setSuccessMessage] = useState(''); // Biến lưu trữ thông báo thành công
  const [editBrand, setEditBrand] = useState(null);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false); // State cho popup thêm
  const [deletedBrands, setDeletedBrands] = useState([]);
  const [showDeletedBrands, setShowDeletedBrands] = useState(false);


  useEffect(() => {
    if (showDeletedBrands) {
      fetchDeletedBrands();
    } else {
      fetchBrands();
    }
  }, [showDeletedBrands]);

  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
        setErrorMessage('');
      }, 3000); // Sau 3 giây tự động ẩn thông báo

      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  const fetchDeletedBrands = async () => {
    try {
      const response = await getAllBrandIsDelete();
      setDeletedBrands(response);
      setShowDeletedBrands(true);
    } catch (error) {
      console.error('Lỗi khi gọi hãng:', error.message);
    }
  };

  const handleDeleteBrand = async (id) => {
    const confirmDelete = window.confirm("Bạn có muốn xóa hãng này không ?");
    if (confirmDelete) {
      try {
        await deleteSoftBrand(id);
        fetchBrands();
        setSuccessMessage("Xóa hãng thành công")
      } catch (error) {
        console.error('Không xóa được hãng:', error.message);
      }
    }
    else {
      console.log('Đã hủy thao tác xóa.');
    }
  };

  const handleRestoreBrand = async (id) => {
    const confirmDelete = window.confirm("Bạn có muốn khôi phục hãng này không ?");
    if (confirmDelete) {
      try {
        await restoreBrand(id);
        fetchBrands();
        setDeletedBrands(prevDeletedBrand =>
          prevDeletedBrand.filter(brand => brand.id !== id)
        );
        setSuccessMessage("Khôi phục hãng thành công!");
      } catch (error) {
        console.error("Không thể khôi phục hãng:", error.message);
        setErrorMessage("Khôi phục thất bại.");
      }
    }
    else {
      console.log('Đã hủy thao tác xóa.');
    }
  };

  const fetchBrands = async () => {
    try {
      const data = await getAllBrands();
      setBrands(Array.isArray(data) ? data : data.result || []);
    } catch (error) {
      console.error('Error fetching categories:', error.message);
      setBrands([]);
    }
  };
  const addBrand = async () => {
    if (!name || !description) {
      setErrorMessage('Vui lòng nhập đầy đủ tên và mô tả thương hiệu.');
      return;
    }
    try {
      await createBrand({ name, description });
      setSuccessMessage('Thương hiệu đã được thêm thành công!');
      fetchBrands();
      setName('');
      setDescription('');
      setErrorMessage('');
      setIsAddPopupOpen(false);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };
  const deleteBrand = async (id) => {
    try {
      await deleteSoftBrandService(id);
      setSuccessMessage('Thương hiệu đã được xóa thành công!');
      fetchBrands();
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.message);
    }
  };
  const handleEditBrand = (brand) => {
    setEditBrand({ ...brand }); // Đảm bảo rằng bạn đang sao chép đối tượng thương hiệu
    setIsEditPopupOpen(true); // Mở popup chỉnh sửa
  };

  const handleSaveEdit = async () => {
    try {
      const brandId = editBrand.id; // Lấy giá trị id từ editBrand

      if (brandId === undefined || brandId === null) {
        throw new Error('ID không hợp lệ'); // Thông báo nếu không có ID
      }

      const parsedBrandId = Number(brandId); // Chuyển đổi ID thành số
      console.log('Giá trị brandId:', parsedBrandId); // Log giá trị brandId

      // Kiểm tra giá trị brandId
      if (isNaN(parsedBrandId) || parsedBrandId <= 0) {
        throw new Error('ID không hợp lệ');
      }

      if (!editBrand.name || !editBrand.description) {
        throw new Error('Vui lòng nhập đầy đủ tên và mô tả thương hiệu.');
      }

      await updateBrand(parsedBrandId, { name: editBrand.name, description: editBrand.description });
      setIsEditPopupOpen(false);
      setSuccessMessage('Thương hiệu đã sửa thành công!'); // Hiển thị thông báo thành công
      fetchBrands();
    } catch (error) {
      console.error('Error updating brand:', error.message);
      setErrorMessage(error.message); // Hiển thị thông báo lỗi nếu có
      setSuccessMessage('');
    }
  };
  const openAddPopup = () => {
    setIsAddPopupOpen(true); // Mở popup thêm sản phẩm
  };
  const closeAddPopup = () => {
    setIsAddPopupOpen(false); // Đóng popup
    setName('');
    setDescription('');
    setSuccessMessage('');
    setErrorMessage('');
  };

  return (
    <div>
      <div className='container-fluid'>
      <h2 className='mb-5'>Quản Lý Hãng</h2>
        <div className='management-brand'>
          <div className='brand-btn d-flex justify-content-start mb-3' style={{ marginRight: '7rem' }}>
            <button className='mr-2' style={styles.editBtn} onClick={openAddPopup}>Thêm Thương Hiệu</button>
            {showDeletedBrands ? (
              <button style={styles.editBtn} onClick={() => setShowDeletedBrands(false)}>Quay lại danh sách hãng chính</button>
            ) : (
              <button style={styles.editBtn} onClick={fetchDeletedBrands}>Danh sách hãng đã xóa</button>
            )}
          </div>
          {successMessage && <p style={styles.successMessage}>{successMessage}</p>} {/* Thông báo thành công */}
          {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>} {/* Thông báo lỗi */}
          {showDeletedBrands ? (
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">STT</th>
                  <th scope="col">Hãng</th>
                  <th scope="col">Thời gian tạo</th>
                  <th scope="col">Thời gian cập nhật</th>
                  <th scope='col'>Mô tả</th>
                  <th scope="col">Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {deletedBrands.length === 0 ? (
                  <p style={styles.emptyMessage}>Không có hãng đã xóa.</p>
                ) : (
                  deletedBrands.map((brand, index) => (
                    <tr key={brand.id}>
                      <th scope="row">{index + 1}</th>
                      <td>{brand.name}</td>
                      <td>{(brand.dateCreated).split(".")[0]}</td>
                      <td>{(brand.dateCreated).split(".")[0]}</td>
                      <td>{brand.description}</td>
                      <td>
                        <button
                          style={styles.editBtn}
                          onClick={() => handleRestoreBrand(brand.id)}
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
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">STT</th>
                  <th scope="col">Thể Loại</th>
                  <th scope="col">Thời gian tạo</th>
                  <th scope="col">Thời gian cập nhật</th>
                  <th scope='col'>Mô tả</th>
                  <th scope="col">Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {brands.length === 0 ? (
                  <p style={styles.emptyMessage}>Chưa có hãng nào.</p>
                ) : (
                  brands.map((brand, index) => (
                    <tr key={brand.id}>
                      <th scope="row">{index + 1}</th>
                      <td>{brand.name}</td>
                      <td>{(brand.dateCreated).split(".")[0]}</td>
                      <td>{(brand.dateCreated).split(".")[0]}</td>
                      <td>{brand.description}</td>
                      <td>
                        <button
                          className="mr-2"
                          style={styles.editBtn}
                          onClick={() => handleEditBrand(brand)}
                        >
                          Sửa
                        </button>
                        <button
                          style={styles.deleteButton}
                          onClick={() => handleDeleteBrand(brand.id)}
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
                <h4 style={styles.popupHeading}>Chỉnh sửa Thương Hiệu</h4>
                <div>
                  <label style={styles.label} htmlFor="editBrandName">Tên thương hiệu:</label>
                  <input
                    id="editBrandName"
                    style={styles.input}
                    type="text"
                    placeholder="Tên thương hiệu"
                    value={editBrand.name}
                    onChange={(e) => setEditBrand({ ...editBrand, name: e.target.value })}
                  />
                </div>
                <div>
                  <label style={styles.label} htmlFor="editBrandDescription">Mô tả:</label>
                  <input
                    id="editBrandDescription"
                    style={styles.input}
                    type="text"
                    placeholder="Mô tả"
                    value={editBrand.description}
                    onChange={(e) => setEditBrand({ ...editBrand, description: e.target.value })}
                  />
                </div>
                <div style={styles.popupButtons}>
                  <button style={styles.editBtn} onClick={handleSaveEdit}>Lưu</button>
                  <button style={styles.closeButton} onClick={() => setIsEditPopupOpen(false)}>Hủy</button>
                </div>
              </div>
            </div>
          )}

          {isAddPopupOpen && (
            <div style={styles.popupOverlay}>
              <div style={styles.popup}>
                <h3 style={styles.popupHeading}>Thêm Thương Hiệu</h3>
                <div>
                  <label style={styles.label} htmlFor="brandName">Tên thương hiệu:</label>
                  <input
                    id="brandName"
                    style={styles.input}
                    type="text"
                    placeholder="Tên thương hiệu"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label style={styles.label} htmlFor="brandDescription">Mô tả:</label>
                  <input
                    id="brandDescription"
                    style={styles.input}
                    type="text"
                    placeholder="Mô tả"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div style={styles.popupButtons}>
                  <button style={styles.editBtn} onClick={addBrand}>Lưu</button>
                  <button style={styles.closeButton} onClick={closeAddPopup}>Hủy</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    margin: '20px 0',
  },
  heading: {
    color: '#14919B',
    textAlign: 'center',
    marginBottom: '20px',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  input: {
    padding: '12px', // Tăng padding để tạo không gian
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '16px',
    width: '100%',
    boxSizing: 'border-box', // Đảm bảo không bị tràn khi có padding
    marginBottom: '10px', // Cách biệt giữa các trường
  },
  addButton: {
    padding: '12px 18px', // Cải thiện padding của nút
    backgroundColor: '#3d99f5',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
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
  brandList: {
    listStyleType: 'none',
    padding: 0,
  },
  brandItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    borderBottom: '1px solid #ddd',
  },
  deleteButton: {
    backgroundColor: '#FF4C4C',
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
  },
  editBtn: {
    backgroundColor: '#3d99f5',
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
    zIndex: 1000,
  },
  popup: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    width: '400px', // Tăng chiều rộng modal
    maxWidth: '80%', // Giới hạn chiều rộng modal
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    boxSizing: 'border-box',
  },
  popupHeading: {
    color: '#333',
    marginBottom: '15px',
    fontSize: '18px', // Thêm size cho tiêu đề
  },
  popupButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '15px',
  },
  closeButton: {
    padding: '10px 15px',
    backgroundColor: '#FF4C4C',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  saveButton: {
    padding: '10px 15px',
    backgroundColor: '#0AD1C8',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  label: {
    fontSize: '14px',
    color: '#333',
    display: 'block', // Đảm bảo label chiếm hết chiều rộng và đứng sát trái
    marginBottom: '5px', // Khoảng cách giữa label và input
    textAlign: 'left', // Đảm bảo căn trái cho label
  },
};



export default BrandManagement;
