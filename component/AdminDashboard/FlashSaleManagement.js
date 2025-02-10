import React, { useState, useEffect } from 'react';
import Pagination from '../Pagination/Pagination'; // Import Pagination
import { createSale, getAllSale, deleteSale, editSale } from '../../services/flashSaleService';
import { getAllProducts } from '../../services/productService';

const FlashSaleManagement = () => {
    const [selectedFlashSale, setSelectedFlashSale] = useState({ flashSaleProducts: [] });
    const [isDetailPopupOpen, setIsDetailPopupOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [flashSaleProducts, setFlashSaleProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [discountValue, setDiscountValue] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(5);
    const [loading] = useState(false);
    const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
    const [editingSale, setEditingSale] = useState(null);

    useEffect(() => {
        fetchProducts();
        fetchAllSale();
    }, []);
    const fetchAllSale = async () => {
        try {
            const response = await getAllSale();
            const processedSales = response.map((sale) => ({
                ...sale,
                flashSaleProducts: Array.isArray(sale.flashSaleProducts) ? sale.flashSaleProducts : [],
                status: calculateSaleStatus(sale.startTimeSale, sale.endTimeSale),
            }));
            setFlashSaleProducts(processedSales);
        } catch (error) {
            console.error("Không thể lấy thông tin giảm giá:", error.message);
        }
    };
    const calculateSaleStatus = (startTime, endTime) => {
        const now = new Date();
        const start = new Date(startTime);
        const end = new Date(endTime);

        if (now < start) return 'Chưa bắt đầu';
        if (now > end) return 'Đã kết thúc';
        return 'Đang diễn ra';
    };
    const fetchProducts = async () => {
        try {
            const response = await getAllProducts();
            setProducts(response);
        } catch (error) {
            console.error('Failed to fetch products:', error.message);
        }
    };
    const saveEditFlashSale = async () => {
        if (!startTime || !endTime || !discountValue) {
            alert("Vui lòng điền đầy đủ thông tin!");
            return;
        }
        if (new Date(startTime) >= new Date(endTime)) {
            alert("Ngày bắt đầu phải nhỏ hơn ngày kết thúc!");
            return;
        }
        try {
            const flashSaleData = {
                startTimeSale: startTime,
                endTimeSale: endTime,
                discountPercentage: parseFloat(discountValue),
                flashSaleProducts: selectedProducts.map((product) => ({
                    productId: product.id,
                })),
            };

            if (editingSale) {
                await editSale(editingSale.id, flashSaleData);
                alert('Chương trình giảm giá đã được cập nhật thành công!');
            } else {
                await createSale(flashSaleData);
                alert('Chương trình giảm giá mới đã được lưu!');
            }

            fetchAllSale();
            closeAddPopup();
        } catch (error) {
            console.error('Lỗi khi lưu chương trình giảm giá:', error.message);
            alert('Đã xảy ra lỗi khi lưu chương trình giảm giá!');
        }
    };
    const openAddPopup = () => {
        setIsAddPopupOpen(true);
    };

    const closeAddPopup = () => {
        setIsAddPopupOpen(false);
    };

    const handleProductSelection = (product) => {
        setSelectedProducts((prevSelected) => {
            const isSelected = prevSelected.some((p) => p.id === product.id);
            if (isSelected) {
                // Nếu sản phẩm đã được chọn, xóa nó khỏi danh sách
                return prevSelected.filter((p) => p.id !== product.id);
            } else {
                // Nếu sản phẩm chưa được chọn, thêm vào danh sách
                return [...prevSelected, product];
            }
        });
    };

    const handleRemoveSelectedProduct = (productId) => {
        setSelectedProducts((prevSelected) =>
            prevSelected.filter((product) => product.id !== productId)
        );
    };
    const handleDelete = async (id) => {
        const confirm = window.confirm('Bạn có muốn xóa chương trình giảm giá này không');
        try {
            if (confirm) {
                await deleteSale(id);
                fetchAllSale();
            }
            else {
                closeAddPopup();
            }
        } catch (error) {
            console.error('Không thể xóa sản phẩm giảm giá');
        }
    }
    const openEditPopup = (sale) => {
        setEditingSale(sale);
        setStartTime(sale.startTimeSale);
        setEndTime(sale.endTimeSale);
        setDiscountValue(sale.discountPercentage);
        setSelectedProducts(sale.flashSaleProducts || []);
        setIsAddPopupOpen(true);

    };

    const openDetailPopup = (sale) => {
        try {
            if (!sale || !Array.isArray(sale.flashSaleProducts)) {
                console.error("Dữ liệu sale không hợp lệ hoặc thiếu flashSaleProducts");
                alert("Không thể tải thông tin sản phẩm do dữ liệu không hợp lệ.");
                return;
            }

            setSelectedFlashSale({
                ...sale,
                flashSaleProducts: sale.flashSaleProducts || [], // Dự phòng nếu không có sản phẩm
            });
            setIsDetailPopupOpen(true); // Open the details popup
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết sản phẩm:', error.message);
            alert('Không thể tải thông tin sản phẩm.');
        }
    };

    const closeDetailPopup = () => {
        setIsDetailPopupOpen(false);
        setSelectedFlashSale(null);
    };
    const totalPages = Math.ceil(products.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const currentProducts = products.slice(startIndex, startIndex + productsPerPage);

    return (
        <div>
            <h2 className='mb-5' style={styles.heading}>Quản Lý Chương Trình Giảm Giá</h2>
            {loading ? (
                <p>Đang tải sản phẩm...</p>
            ) : (
                <div>
                    <div>
                        <button style={styles.editBtn} onClick={openAddPopup}>
                            Thêm chương trình giảm giá
                        </button>
                    </div>
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">STT</th>
                                <th scope="col">Ngày bắt đầu</th>
                                <th scope="col">Ngày kết thúc</th>
                                <th scope="col">Trạng thái</th>
                                <th scope="col">Giá giảm</th>
                                <th scope="col">Thao tác</th>
                                <th scope="col">Xem Thêm</th>
                            </tr>
                        </thead>
                        <tbody>
                            {flashSaleProducts.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{index + 1}</td>
                                    <td>{item.startTimeSale}</td>
                                    <td>{item.endTimeSale}</td>
                                    <td>
                                        <span
                                            // style={{
                                            //     color:
                                            //         item.status === 'Đang diễn ra' ? 'green' :
                                            //             item.status === 'Chưa bắt đầu' ? 'blue' :
                                            //                 'red',
                                            //     fontWeight: 'bold',
                                            // }}
                                        >
                                            {item.status}
                                        </span>
                                    </td>
                                    <td>{item.discountPercentage}%</td>
                                    <td>
                                        <button className='mr-2' style={styles.editBtn} onClick={() => openEditPopup(item)}>Sửa</button>
                                        <button style={styles.deleteButton} onClick={() => handleDelete(item.id)}>Xóa</button>
                                    </td>
                                    <td>
                                        <button style={styles.editBtn} onClick={() => openDetailPopup(item)}>Xem Thêm</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
            )}
            {isAddPopupOpen && (
                <div style={styles.popupOverlay}>
                    <div style={{ ...styles.popup, ...styles.scrollableForm }}>
                        <h3 style={styles.popupHeading}>Thêm sản phẩm</h3>
                        <div>
                            <label style={styles.label}>Ngày bắt đầu:</label>
                            <input
                                style={styles.input}
                                type="datetime-local"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                            />
                        </div>
                        <div>
                            <label style={styles.label}>Ngày kết thúc:</label>
                            <input
                                style={styles.input}
                                type="datetime-local"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                            />
                        </div>
                        <div>
                            <label style={styles.label}>Giá giảm:</label>
                            <input
                                style={styles.input}
                                type="number"
                                value={discountValue}
                                onChange={(e) => setDiscountValue(e.target.value)}
                            />
                        </div>
                        <div>
                            <label style={styles.label}>Danh sách sản phẩm</label>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Chọn</th>
                                        <th>Tên sản phẩm</th>
                                        <th>Giá</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentProducts.map((product) => (
                                        <tr key={product.id}>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedProducts.some((p) => p.id === product.id)}
                                                    onChange={() => handleProductSelection(product)}
                                                />
                                            </td>
                                            <td>{product.name}</td>
                                            <td>{product.price}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                        <div>
                            <h5>Sản phẩm được chọn</h5>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Tên sản phẩm</th>
                                        <th>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedProducts.length > 0 ? (
                                        selectedProducts.map((product) => (
                                            <tr key={product.id}>
                                                <td>{product.name}</td>
                                                <td>
                                                    <button
                                                        style={styles.deleteButton}
                                                        onClick={() => handleRemoveSelectedProduct(product.id)}
                                                    >
                                                        Xóa
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="2" style={{ textAlign: 'center', color: 'gray' }}>
                                                Không có sản phẩm nào được chọn.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div style={styles.popupButtons}>
                            <button style={styles.editBtn} onClick={saveEditFlashSale}>
                                {editingSale ? 'Cập nhật' : 'Lưu'}
                            </button>
                            <button style={styles.deleteButton} onClick={closeAddPopup}>
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isDetailPopupOpen && selectedFlashSale && (
                <div style={styles.popupOverlay}>
                    <div style={styles.popup}>
                        <h3>Chi tiết chương trình giảm giá</h3>
                        <p><strong>Ngày bắt đầu:</strong> {selectedFlashSale.startTimeSale}</p>
                        <p><strong>Ngày kết thúc:</strong> {selectedFlashSale.endTimeSale}</p>
                        <p>
                            <strong>Trạng thái:</strong>
                            <span
                                style={{
                                    color:
                                        selectedFlashSale.status === 'Đang diễn ra' ? 'green' :
                                            selectedFlashSale.status === 'Chưa bắt đầu' ? 'blue' :
                                                'red',
                                    fontWeight: 'bold',
                                }}
                            >
                                {selectedFlashSale.status}
                            </span>
                        </p>
                        <h4>Danh sách sản phẩm</h4>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tên sản phẩm</th>
                                    <th>Giá giảm</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedFlashSale.flashSaleProductResponse.map((product, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{product.productName}</td>
                                        <td>{product.priceSale}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button style={styles.deleteButton} onClick={closeDetailPopup}>Đóng</button>
                    </div>
                </div>
            )}

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
        textAlign: 'left',
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
        width: '1000px',
        maxWidth: '90%',
        maxHeight: '80vh',
        overflowY: 'auto',
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
    scrollableForm: {
        overflowY: 'auto',
        maxHeight: '80vh',
        paddingRight: '10px',
    },
    formWide: {
        width: '600px',
        maxWidth: '90%',
    },
};

export default FlashSaleManagement;
