import React, { useState, useEffect } from 'react';
import {
  createProduct,
  updateProduct as updateProductService,
  getAllProducts,
  getDeletedProducts,
  restoreProduct,
  deleteSoftProduct as deleteSoftProductService,
  getCategories,
  getBrands,
} from '../../services/productService';
import ProductForm from './ProductForm';
import Pagination from '../Pagination/Pagination';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [deletedProducts, setDeletedProducts] = useState([]);
  const [showDeletedProducts, setShowDeletedProducts] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(5);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [productData, setProductData] = useState({
    id: null,
    name: '',
    description: '',
    categoryId: '',
    brandId: '',
    price: '',
    images: [],
    quantity: null,
    status: '',
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBrands();
  }, []);

  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
        setErrorMessage('');
      }, 3000); 

      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  useEffect(() => {
    if (showDeletedProducts) {
      fetchDeletedProducts();
    } else {
      fetchProducts();
    }
  }, [showDeletedProducts]);


  const fetchProducts = async () => {
    try {
      const response = await getAllProducts();
      setProducts(response);
    } catch (error) {
      console.error('Lỗi khi gọi dữ liệu sản phẩm:', error.message);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response);
    } catch (error) {
      console.error('Lỗi khi gọi dữ liệu thể loại:', error.message);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await getBrands();
      setBrands(response);
    } catch (error) {
      console.error('Lỗi khi gọi dữ liệu hãng:', error.message);
      
    }
  };

  const fetchDeletedProducts = async () => {
    try {
      const response = await getDeletedProducts();
      setDeletedProducts(response);
      setShowDeletedProducts(true);
    } catch (error) {
      setErrorMessage('Lấy sản phẩm thất bại.' ,error.message);
    }
  };

  const handleAddProduct = async (formData) => {
    try {
      await createProduct(formData);
      fetchProducts();
      setSuccessMessage('Sản phẩm đã được thêm thành công.');
      setShowModal(false);
    } catch (error) {
      setErrorMessage('Thêm sản phẩm thất bại.');
    }
  };

  const handleUpdateProduct = async (productId, formData) => {
    try {
      await updateProductService(productId, formData);
      fetchProducts();
      setSuccessMessage('Sản phẩm đã được cập nhật thành công.');
      setShowModal(false);
    } catch (error) {
      console.error('Error updating product:', error.message);
      setErrorMessage('Cập nhật sản phẩm thất bại.');
    }
  };

  const handleDeleteProduct = async (productId) => {
    const confirmDelete = window.confirm("Bạn có muốn xóa sản phẩm này không ?");
    if (confirmDelete) {
      try {
        await deleteSoftProductService(productId);  // Xóa mềm
        fetchProducts();
        setSuccessMessage('Sản phẩm đã bị xóa.');
      } catch (error) {
        console.error('Error deleting product:', error.message);
        setErrorMessage('Xóa sản phẩm thất bại.');
      }
    }
    else {
      console.error('Đã hủy thao tác xóa.');
    }
  };

  const restoreProductHandler = async (productId) => {
    const confirmDelete = window.confirm("Bạn có muốn khôi phục sản phẩm này không ?");
    if (confirmDelete) {
      try {
        await restoreProduct(productId);
        fetchDeletedProducts();
        setSuccessMessage('Sản phẩm đã được phục hồi.');
      } catch (error) {
        console.error('Error restoring product:', error.message);
        setErrorMessage('Phục hồi sản phẩm thất bại.');
      }
    }
    else {
      console.log('Đã hủy thao tác xóa.');
    }
  };

  const openModal = (product = {}) => {
    setProductData(product);
    setShowModal(true);
  };

  const closeModal = () => {
    setProductData({
      id: null,
      name: '',
      description: '',
      categoryId: '',
      brandId: '',
      price: '',
      images: [],
      quantity: null,
      status: '',
    });
    setShowModal(false);
  };

  const handlePageChange = (page) => setCurrentPage(page);

  const currentProducts = showDeletedProducts ? deletedProducts : products;
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const productsToShow = currentProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <div>
      <div className="container-fluid">
      <h2 className='mb-5'>Quản Lý Sản Phẩm</h2>
        <div className="product">
          <div className="btn-addproduct d-flex justify-content-start mb-3">
            <button className=" mr-3" style={styles.editBtn} onClick={() => openModal()}>Thêm Sản Phẩm</button>
            {showDeletedProducts ? (
              <button style={styles.editBtn} onClick={() => setShowDeletedProducts(false)}>Quay lại danh sách sản phẩm</button>
            ) : (
              <button style={styles.editBtn} onClick={fetchDeletedProducts}>Danh sách sản phẩm đã xóa</button>
            )}

          </div>
          {successMessage && (
            <div className='alert alert-success' style={styles.successMessage}>{successMessage}</div>
          )}
          {errorMessage && (
            <div className='alert alert-error' style={styles.errorMessage}>{errorMessage}</div>
          )}
          {!showDeletedProducts ? (
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">STT</th>
                  <th scope="col">Sản Phẩm</th>
                  <th scope="col">Hình ảnh</th>
                  <th scope="col">Thể Loại</th>
                  <th scope="col">Thương Hiệu</th>
                  <th scope="col">Mô Tả</th>
                  <th scope="col">Giá</th>
                  <th scope="col">Số lượng</th>
                  <th scope="col">Trạng thái</th>
                  <th scope="col">Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.length === 0 ? (
                  <p style={styles.emptyMessage}>Chưa có sản phẩm nào.</p>
                ) : (
                  currentProducts.map((product, index) => (
                    <tr key={product.id}>
                      <th scope="row">{index + 1 + (currentPage - 1) * productsPerPage}</th>
                      <td>{product.name}</td>
                      <td>
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                        />
                      </td>
                      <td>{product.categoryName}</td>
                      <td>{product.brandName}</td>
                      <td>{product.description}</td>
                      <td>{product.price}</td>
                      <td>{product.quantity}</td>
                      <td>{product.status}</td>
                      <td>
                        <button className='mr-2' style={styles.editBtn} onClick={() => openModal(product)}>
                          Sửa
                        </button>
                        <button style={styles.deleteButton} onClick={() => handleDeleteProduct(product.id)}>
                          Xóa
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
                  <th scope="col">Sản Phẩm</th>
                  <th scope="col">Thể Loại</th>
                  <th scope="col">Thương Hiệu</th>
                  <th scope="col">Giá</th>
                  <th scope="col">Thao Tác</th>
                  <th scope="col">Số lượng</th>
                  <th scope="col">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {deletedProducts.map((product, index) => (
                  <tr key={product.id}>
                    <th scope="row">{index + 1}</th>
                    <td>{product.name}</td>
                    <td>{product.categoryName}</td>
                    <td>{product.brandName}</td>
                    <td>{product.price}</td>
                    <td>{product.quantity}</td>
                    <td>{product.status}</td>
                    <td>
                      <button style={styles.editBtn} onClick={() => restoreProductHandler(product.id)}>
                        Khôi phục
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <Pagination currentPage={currentPage} totalPages={Math.ceil(currentProducts.length / productsPerPage)} onPageChange={handlePageChange} />
        </div>
      </div>
      {showModal && (
        <ProductForm
          productData={productData}
          onClose={closeModal}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          categories={categories}
          brands={brands}
        />
      )}
    </div>
  );
};

const styles = {
  editBtn: {
    backgroundColor: '#3d99f5',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    padding: '8px 12px',
  },
  deleteButton: {
    backgroundColor: '#FF4C4C',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    padding: '8px 12px',
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#999',
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center',
    marginTop: '10px',
    animation: 'fadeOut 3s forwards',
  },
  successMessage: {
    color: 'green',
    textAlign: 'center',
    marginTop: '10px',
    animation: 'fadeOut 3s forwards',
  },
};

export default ProductManagement;
