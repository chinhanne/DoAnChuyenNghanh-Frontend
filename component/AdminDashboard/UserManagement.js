import React, { useState, useEffect } from 'react';
import { createUser, deleteUser as deleteUserService, getAllUsers, updateUser } from '../../services/userService';
import UserForm from './UserForm';

const UserManagement = () => {
  const [users, setUsers] = useState([]); 
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { result } = await getAllUsers();
      setUsers(Array.isArray(result) ? result : []);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Không thể tải người dùng: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const addUser = async (userData) => {
    setLoading(true);
    try {
      await createUser(userData);
      await fetchUsers();
      setShowModal(false);
    } catch (error) {
      setErrorMessage('Thêm người dùng thất bại: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const editUser = async (userData) => {
    setLoading(true);
    try {
      await updateUser(userData.id, userData);
      await fetchUsers();
      setShowModal(false);
      setEditingUser(null);

    } catch (error) {
      setErrorMessage('Cập nhật người dùng thất bại: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const deleteUser = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
        setLoading(true);
        setErrorMessage('');
        try {
            await deleteUserService(id);
            setUsers(users.filter((user) => user.id !== id));
        } catch (error) {
            setErrorMessage('Không thể xóa người dùng: ' + error.message);
        } finally {
            setLoading(false);
        }
    }
};

  const handleEditClick = (user) => {
    setEditingUser(user);
    setShowModal(true);
  };
  return (
    <div >
      {errorMessage && <div style={styles.error}>{errorMessage}</div>}
      {loading && <div style={styles.loading}>Đang tải...</div>}
      <div style={styles.buttonContainer}>
        <button style={styles.editBtn} onClick={() => { setEditingUser(null); setShowModal(true); }}>
          Thêm Người Dùng
        </button>
      </div>
      <div >
        <table className='table'>
          <thead>
            <tr>
              <th scope='col'>STT</th>
              <th scope='col'>Tên tài khoản</th>
              <th scope='col'>Hình</th>
              <th scope='col'>Email</th>
              <th scope='col'>Giới Tính</th>
              <th scope='col'>Địa Chỉ</th>
              <th scope='col'>Số Điện Thoại</th>
              <th scope='col'>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="6" style={styles.emptyMessage}>Chưa có người dùng nào.</td>
              </tr>
            ) : (
              users.map((user,index) => (
                <tr key={index}>
                  <td>{index+1}</td>
                  <td>{user.username}</td>
                  <td>
                    <img style={{width:50, height:50}} src={user.image} alt={user.username}/>
                  </td>
                  <td>{user.email}</td>
                  <td>{user.gender === 0 ? 'Nam' : 'Nữ'}</td>
                  <td>{user.address}</td>
                  <td>{user.numberPhone}</td>
                  <td className=''>
                    <button onClick={() => handleEditClick(user)} style={styles.editBtn}>
                      Sửa
                    </button>
                    <button className='ml-3'onClick={() => deleteUser(user.id)} style={styles.deleteButton}>
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {showModal && (
        <UserForm
          onClose={() => setShowModal(false)}
          onAddUser={addUser}
          onEditUser={editingUser ? editUser : null}
          editingUser={editingUser}
          fetchUsers={fetchUsers} // Pass fetchUsers to UserForm
        />
      )}
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    color: '#0AD1C8',
    textAlign: 'center',
    marginBottom: '20px',
  },
  buttonContainer: {
    textAlign: 'left',
    marginBottom: '20px',
  },
  addButton: {
    backgroundColor: '#3d99f5',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  tableContainer: {
    marginTop: '20px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
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
  error: {
    color: 'red',
    textAlign: 'center',
  },
  loading: {
    color: '#0AD1C8',
    textAlign: 'center',
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#888',
  },
};
export default UserManagement;
