import React, { useState, useEffect } from 'react';

const ProductForm = ({ onClose, onAddProduct, onUpdateProduct, categories, brands, productData }) => {
  const [name, setName] = useState(productData?.name || '');
  const [price, setPrice] = useState(productData?.price || '');
  const [description, setDescription] = useState(productData?.description || '');
  const [categoryId, setCategoryId] = useState(productData?.categoryId || '');
  const [brandId, setBrandId] = useState(productData?.brandId || '');
  const [images, setImages] = useState(productData?.images || []);
  const [chip, setChip] = useState(productData?.chip || '');
  const [ram, setRam] = useState(productData?.ram || '');
  const [screen, setScreen] = useState(productData?.screen || '');
  const [card, setCard] = useState(productData?.card || '');
  const [quantityProduct, setQuantityProduct] = useState(productData?.quantity || null);

  useEffect(() => {
    if (productData && productData.id) {
      setName(productData.name || '');
      setPrice(productData.price || '');
      setDescription(productData.description || '');
      setCategoryId(productData.categoryId || '');
      setBrandId(productData.brandId || '');
      setChip(productData.chip || '');
      setRam(productData.ram || '');
      setScreen(productData.screen || '');
      setCard(productData.card || '');
      setQuantityProduct(productData.quantity || 0);
      setImages(productData.images || []);
    }
  }, [productData]);

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || parseFloat(price) <= 0) {
      alert("Vui lòng nhập đầy đủ thông tin sản phẩm và giá phải lớn hơn 0");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", parseFloat(price));
    formData.append("description", description);
    formData.append("categoryId", categoryId);
    formData.append("brandId", brandId);
    formData.append("chip", chip);
    formData.append("ram", ram);
    formData.append("screen", screen);
    formData.append("card", card);

    images.forEach((image) => {
      formData.append("images", image);
    });
    formData.append("quantity", parseFloat(quantityProduct));

    if (productData?.id) {
      const productId = productData.id;
      onUpdateProduct(productId, formData);
    } else {
      onAddProduct(formData);
    }

    onClose();
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <h2 style={styles.heading}>{productData ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.row}>
            <div style={styles.col}>
              <input
                style={styles.input}
                type="text"
                placeholder="Tên sản phẩm"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div style={styles.col}>
              <input
                style={styles.input}
                type="number"
                placeholder="Giá"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
          </div>

          <textarea
            style={styles.textarea}
            placeholder="Mô tả"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div style={styles.row}>
            <div style={styles.col}>
              <select
                style={styles.select}
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
              >
                <option value="">Chọn thể loại</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div style={styles.col}>
              <select
                style={styles.select}
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
                required
              >
                <option value="">Chọn thương hiệu</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.col}>
              <input
                style={styles.input}
                type="text"
                placeholder="Chip"
                value={chip}
                onChange={(e) => setChip(e.target.value)}
              />
            </div>
            <div style={styles.col}>
              <input
                style={styles.input}
                type="text"
                placeholder="RAM"
                value={ram}
                onChange={(e) => setRam(e.target.value)}
              />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.col}>
              <input
                style={styles.input}
                type="text"
                placeholder="Màn hình"
                value={screen}
                onChange={(e) => setScreen(e.target.value)}
              />
            </div>
            <div style={styles.col}>
              <input
                style={styles.input}
                type="text"
                placeholder="Card đồ họa"
                value={card}
                onChange={(e) => setCard(e.target.value)}
              />
            </div>
          </div>

          <div style={styles.field}>
            <input
              style={styles.input}
              type="number"
              placeholder="Số lượng"
              value={quantityProduct}
              onChange={(e) => setQuantityProduct(e.target.value)}
            />
          </div>

          <div style={styles.field}>
            <input
              type="file"
              style={styles.input}
              multiple
              onChange={handleImageChange}
            />
          </div>

          <div style={styles.buttonGroup}>
            <button style={styles.button} type="submit">
              {productData ? "Lưu" : "Thêm sản phẩm"}
            </button>
            <button style={styles.cancelButton} type="button" onClick={onClose}>
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    width: '600px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    textAlign: 'center',
    color: '#14919B',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '15px',
  },
  col: {
    width: '48%',
  },
  field: {
    marginBottom: '15px',
  },
  input: {
    padding: '10px',
    border: '1px solid #0AD1C8',
    borderRadius: '5px',
    width: '100%',
  },
  textarea: {
    padding: '10px',
    border: '1px solid #0AD1C8',
    borderRadius: '5px',
    width: '100%',
    minHeight: '80px',
    marginBottom:10,
  },
  select: {
    padding: '10px',
    border: '1px solid #0AD1C8',
    borderRadius: '5px',
    width: '100%',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#0AD1C8',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: '#FF4C4C',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};

export default ProductForm;
