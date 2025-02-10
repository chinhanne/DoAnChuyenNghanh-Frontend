import React, { useState } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode"; 
import { getToken } from "../../services/localStorageService";

const API_URL = process.env.REACT_APP_API;

const CommentForm = ({ productId, onCommentAdded, parentCommentId = null }) => {
  const [content, setContent] = useState("");

  // Hàm lấy headers có chứa token
  const getAuthHeaders = () => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Xử lý sự kiện submit form bình luận
 const handleSubmit = async (e) => {
    e.preventDefault();

    const token = getToken();
    if (!token) {
      alert("Bạn cần đăng nhập để bình luận");
      return;
    }

    try {
      // Giải mã token để lấy userId
      const decodedToken = jwtDecode(token);      
      const userId = decodedToken?.id ? decodedToken.id.toString() : null;

      // Dữ liệu bình luận
      const commentData = {
        productId, // productId là kiểu Long
        userId,    // userId là kiểu String từ token
        content,   // Nội dung bình luận
        parentCommentId: parentCommentId || null, // ID của bình luận cha (nếu có)
      };

      // Gửi bình luận đến backend
      const response = await axios.post(`${API_URL}/comment`, commentData, {
        headers: getAuthHeaders(),
      });

      // Xử lý sau khi gửi bình luận thành công
      setContent(""); // Xóa nội dung sau khi bình luận
      onCommentAdded(); // Cập nhật danh sách bình luận
    } catch (error) {
      console.error("Không thể tạo bình luận", error);
      alert("Không thể tạo bình luận, vui lòng thử lại.");
    }
};

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Thêm bình luận..."
        required
        style={styles.textarea}
      />
      <button type="submit" style={styles.button}>Đăng bình luận</button>
    </form>
  );
};

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '10px',
    maxWidth: '600px',
  },
  textarea: {
    width: '100%',
    height: '80px',
    padding: '12px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    outline: 'none',
  },
  button: {
    alignSelf: 'flex-end',
    padding: '10px 20px',
    fontSize: '16px',
    fontWeight: 'bold',
    backgroundColor: '#c0392b', // Màu đỏ theo yêu cầu
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};

export default CommentForm;
