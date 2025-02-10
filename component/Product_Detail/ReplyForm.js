import React, { useState } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Cập nhật import
import { getToken } from '../../services/localStorageService';

const API_URL = 'http://localhost:8080';

const ReplyForm = ({ parentCommentId, productId, onReplyAdded }) => {
  const [content, setContent] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const getAuthHeaders = () => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      setErrorMessage("Vui lòng nhập nội dung trước khi gửi.");
      return;
    }

    const token = getToken();
    if (!token) {
      alert("Bạn cần đăng nhập để bình luận.");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id.toString();

      const commentData = {
        productId,
        userId,
        content,
        parentCommentId,      };

        const response = await axios.post(`${API_URL}/comment`, commentData, {
          headers: getAuthHeaders(),
        });
  
        setContent("");
        setErrorMessage(""); // Xóa thông báo lỗi sau khi gửi thành công
        onReplyAdded(response.data.result); // Cập nhật danh sách bình luận ngay lập tức
      } catch (error) {
        const errorMessage = error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại.";
        setErrorMessage(errorMessage);
      }
    };
  
    return (
      <form onSubmit={handleSubmit} style={styles.form}>
        <textarea
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            if (errorMessage) setErrorMessage(""); // Xóa lỗi khi người dùng nhập nội dung
          }}
          placeholder="Nhập bình luận..."
          style={styles.textarea}
        />
        {errorMessage && <p style={styles.error}>{errorMessage}</p>}
        <button type="submit" style={styles.button}>
          Gửi
        </button>
      </form>
    );
  };
  
  const styles = {
    form: {
      display: 'flex',
      flexDirection: 'column',
      marginTop: '10px',
    },
    textarea: {
      width: '100%',
      height: '60px',
      marginBottom: '10px',
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #ccc',
      resize: 'none',
    },
    button: {
      alignSelf: 'flex-end',
      padding: '8px 16px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },
    error: {
      color: 'red',
      fontSize: '14px',
      marginTop: '-5px',
      marginBottom: '10px',
    },
  };
  
  export default ReplyForm;
    