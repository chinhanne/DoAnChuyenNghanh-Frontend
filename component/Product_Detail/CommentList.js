import React, { useState, useEffect } from "react";
import {
  getCommentsByProduct,
  deleteComment,
  getParentCommentAndChildComment,
  updateCommentDisplay,
} from "../../services/commentService";
import { getUserRole } from "../../services/authenticationService";
import { getCurrentUserId, getCurrentUser, getImageByUserId } from "../../services/userService";
import ReplyForm from "./ReplyForm";

const CommentList = ({ productId, updateTrigger }) => {
  const [comments, setComments] = useState([]);
  const [replyForms, setReplyForms] = useState({});
  const [showAllComments, setShowAllComments] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const role = getUserRole() || null;
    setUserRole(role);
    if (productId) fetchComments();
  }, [productId, updateTrigger]);

  const fetchComments = async () => {
    try {
      const data = await getCommentsByProduct(productId);
      let user = null;
  
      // Kiểm tra xem người dùng đã đăng nhập chưa
      if (getCurrentUserId()) {
        user = await getCurrentUser();
        setCurrentUser(user);
      }
  
      const updatedComments = await Promise.all(
        data.map(async (comment) => {
          const userImageUrl = await getImageByUserId(comment.userId);
          return {
            ...comment,
            userImage: userImageUrl || "https://via.placeholder.com/40", // Default image
          };
        })
      );
      setComments(updatedComments);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Không thể tải bình luận. Vui lòng thử lại sau.");
    }
  };
  

  const loadChildCommentsForParent = async (parentCommentId) => {
    try {
      const childComments = await getParentCommentAndChildComment(parentCommentId);
      setComments(prevComments =>
        prevComments.map(comment =>
          comment.id === parentCommentId
            ? {
                ...comment,
                childComments: childComments && Array.isArray(childComments)
                  ? [...new Set([...comment.childComments || [], ...childComments])] // Tránh trùng lặp
                  : [],
              }
            : comment
        )
      );
    } catch (error) {
      console.error(`Lỗi khi tải phản hồi cho Bình luận ID: ${parentCommentId}`, error);
      setErrorMessage("Không thể tải phản hồi. Vui lòng thử lại sau.");
    }
  };

  const toggleReplyForm = (commentId) => {
    setReplyForms(prevForms => ({
      ...prevForms,
      [commentId]: !prevForms[commentId],
    }));
  };

  const handleReplyAdded = async (newComment) => {
    try {
      const userImageUrl = await getImageByUserId(newComment.userId);
      const updatedComment = {
        ...newComment,
        userImage: userImageUrl || "https://via.placeholder.com/40", // Default image
      };
      if (updatedComment.parentCommentId) {
        setComments(prevComments =>
          prevComments.map(comment =>
            comment.id === updatedComment.parentCommentId
              ? {
                  ...comment,
                  childComments: [...(comment.childComments || []), updatedComment],
                }
              : comment
          )
        );
      } else {
        setComments(prevComments => [updatedComment, ...prevComments]);
      }
    } catch (error) {
      console.error("Lỗi khi lấy avatar cho bình luận mới:", error);
    }
  };

  const handleDeleteComment = async (commentId, commentUserId) => {
    // Kiểm tra quyền xóa
    if (!checkUserPermissionToDelete(commentUserId)) {
      setErrorMessage("Bạn không có quyền xóa bình luận này.");
      return;
    }

    // Hiển thị xác nhận từ người dùng
    const confirmDelete = window.confirm("Bạn có chắc muốn xóa bình luận này?");
    if (!confirmDelete) return;
  
    try {
      // Gọi API xóa bình luận
      const response = await deleteComment(commentId);
      fetchComments();
      console.log(response);
      
      if (response.code === 1000) {
        // Cập nhật danh sách bình luận cục bộ
        setComments((prevComments) =>
          prevComments.filter((comment) => comment.id !== commentId)
        );
        setErrorMessage(""); // Xóa thông báo lỗi nếu thành công
      } else {
        throw new Error("Không thể xóa bình luận. Vui lòng thử lại.");
      }
    } catch (error) {
      // setErrorMessage(error.message || "Không thể xóa bình luận. Vui lòng thử lại.");
    }
  };
  

  const checkUserPermissionToDelete = (commentUserId) => {
    return userRole === "ADMIN" || commentUserId === getCurrentUserId().id;
  };

  const handleToggleDisplay = async (commentId, currentDisplay) => {
    const newDisplayValue = !currentDisplay;
    try {
      await updateCommentDisplay(commentId, newDisplayValue);
      setComments(prevComments =>
        prevComments.map(comment =>
          comment.id === commentId
            ? { ...comment, display: newDisplayValue }
            : comment
        )
      );
    } catch (error) {
      console.error("Lỗi khi cập nhật hiển thị:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.header}>Bình luận</h3>
      {errorMessage && <p style={styles.error}>{errorMessage}</p>}
      {comments.length > 0 ? (
        comments
          .slice(0, showAllComments ? comments.length : 5)
          .filter(comment => comment.display === true || userRole === "ADMIN")
          .map(comment => {
            if (comment.parentId === null) {
              return (
                <div key={comment.id} style={styles.commentCard}>
                  <div style={styles.commentHeader}>
                    <img
                      src={comment.userImage}
                      alt="Avatar của người dùng"
                      style={styles.avatar}
                    />
                    <div style={styles.userInfo}>
                      <p style={styles.userName}><strong>{comment.userName}</strong></p>
                      <p style={styles.commentDate}>{formatDate(comment.dateCreated)}</p>
                    </div>
                    {userRole && (
                      <div style={styles.actions}>
                        {userRole === "ADMIN" && (
                          <button
                            style={styles.displayToggleButton}
                            onClick={() => handleToggleDisplay(comment.id, comment.display)}
                          >
                            {comment.display ? "Ẩn" : "Hiển thị"}
                          </button>
                        )}
                        {(userRole === "ADMIN" || comment.userId=== currentUser.id )&& (
                          <button
                          style={styles.deleteButton}
                          onClick={() => handleDeleteComment(comment.id, comment.userId)}
                        >
                          Xóa
                        </button>
                        )}

                        <button
                          style={styles.replyButton}
                          onClick={() => {
                            if (!replyForms[comment.id] && (!comment.childComments || comment.childComments.length === 0)) {
                              loadChildCommentsForParent(comment.id);
                            }
                            toggleReplyForm(comment.id);
                          }}
                        >
                          {replyForms[comment.id] ? "Ẩn trả lời" : "Trả lời"}
                        </button>
                      </div>
                    )}
                    </div>
                    <p style={styles.content}>{comment.content}</p>
                    {replyForms[comment.id] && userRole && (
                      <ReplyForm
                        productId={productId}
                        parentCommentId={comment.id}
                        onReplyAdded={handleReplyAdded}
                      />
                    )}
                    {comments
                      .filter(childComment => childComment.parentId === comment.id)
                      .map(childComment => (
                        <div key={childComment.id} style={styles.childCommentCard}>
                          <div style={styles.commentHeader}>
                            <img
                              src={childComment.userImage || "https://via.placeholder.com/40"}
                              alt="Avatar của người dùng"
                              style={styles.avatar}
                            />
                            <div style={styles.userInfo}>
                              <p style={styles.userName}><strong>{childComment.userName}</strong></p>
                              <p style={styles.commentDate}>{formatDate(childComment.dateCreated)}</p>
                            </div>
                            {userRole && (
                        <div style={styles.actions}>
                          {userRole === "ADMIN" && (
                            <button
                              style={styles.displayToggleButton}
                              onClick={() => handleToggleDisplay(childComment.id, childComment.display)}
                            >
                              {comment.display ? "Ẩn" : "Hiển thị"}
                            </button>
                          )}
                          {(userRole === "ADMIN" || childComment.userId=== currentUser.id )&& (
                            <button
                            style={styles.deleteButton}
                            onClick={() => handleDeleteComment(childComment.id, childComment.userId)}
                          >
                            Xóa
                            </button>
                        )}
                      </div>
                    )}
                        </div>
                        <p style={styles.content}>{childComment.content}</p>
                      </div>
                    ))}
                </div>
              );
            }
            return null;
          })
      ) : (
        <p style={styles.noComments}>Chưa có bình luận nào.</p>
      )}
      <button style={styles.toggleAllButton} onClick={() => setShowAllComments(!showAllComments)}>
        {showAllComments ? "Thu gọn" : "Xem tất cả"}
      </button>
    </div>
  );
};

const styles = {
  container: { marginTop: "20px", padding: "20px" },
  header: { fontSize: "24px", fontWeight: "bold" },
  commentCard: { borderBottom: "1px solid #ccc", padding: "10px 0" },
  commentHeader: { display: "flex", alignItems: "center" },
  avatar: { width: "40px", height: "40px", borderRadius: "50%", marginRight: "10px" },
  userInfo: { flexGrow: 1 },
  userName: { fontWeight: "bold", marginBottom: "5px" },
  commentDate: { fontSize: "12px", color: "#555" },
  actions: { textAlign: "right" },
  displayToggleButton: { backgroundColor: "#ff6347", border: "none", padding: "5px 10px", cursor: "pointer", color: "white" },
  deleteButton: { backgroundColor: "#f44336", border: "none", padding: "5px 10px", cursor: "pointer", color: "white", marginLeft: "10px" },
  replyButton: { backgroundColor: "#4caf50", border: "none", padding: "5px 10px", cursor: "pointer", color: "white", marginLeft: "10px" },
  content: { fontSize: "16px", marginTop: "10px" },
  error: { color: "red", fontSize: "14px" },
  noComments: { color: "#555", fontSize: "16px" },
  toggleAllButton: { backgroundColor: "#007bff", color: "white", padding: "10px", border: "none", cursor: "pointer", marginTop: "10px" },
  childCommentCard: { borderLeft: "3px solid #ccc", marginLeft: "20px", padding: "10px 0" },
};

export default CommentList;


  