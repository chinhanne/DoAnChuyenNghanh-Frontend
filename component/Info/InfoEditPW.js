import React, { Component } from 'react';
import { updatePasswordMyInfo } from '../../services/userService';

export default class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
            error: '',
            success: '',
        };
    }

    handleChange = (field) => (event) => {
        this.setState({ [field]: event.target.value, error: '', success: '' });
    };

    validateInputs = () => {
        const { currentPassword, newPassword, confirmPassword } = this.state;
        if (!currentPassword) {
            return 'Mật khẩu hiện tại không được để trống.';
        }
        if (newPassword.length < 8) {
            return 'Mật khẩu mới phải có ít nhất 8 ký tự.';
        }
        if (newPassword !== confirmPassword) {
            return 'Mật khẩu xác nhận không khớp.';
        }
        return '';
    };

    handlePasswordUpdate = async (event) => {
        event.preventDefault();
        const errorMsg = this.validateInputs();
        if (errorMsg) {
            this.setState({ error: errorMsg });
            return;
        }

        const { currentPassword, newPassword } = this.state;

        try {
            await updatePasswordMyInfo(currentPassword, newPassword, this.state.confirmPassword);
            this.setState({
                success: 'Cập nhật mật khẩu thành công!',
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
                error: '',
            });
        } catch (error) {
            this.setState({ error: error.message || 'Có lỗi xảy ra khi cập nhật mật khẩu.' });
        }
    };

    render() {
        const { currentPassword, newPassword, confirmPassword, error, success } = this.state;

        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '20px',
                maxWidth: '400px',
                margin: '0 auto',
                backgroundColor: '#f5f5f5',
                borderRadius: '8px',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
            }}>
                <h3 style={{ fontSize: '24px', color: '#333', marginBottom: '20px' }}>Đổi Mật Khẩu</h3>
                <form onSubmit={this.handlePasswordUpdate} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ fontWeight: 'bold', marginBottom: '5px', color: '#555' }}>Mật khẩu hiện tại:</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={this.handleChange('currentPassword')}
                            required
                            style={{
                                padding: '8px',
                                fontSize: '16px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                transition: 'border-color 0.3s ease'
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ fontWeight: 'bold', marginBottom: '5px', color: '#555' }}>Mật khẩu mới:</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={this.handleChange('newPassword')}
                            required
                            style={{
                                padding: '8px',
                                fontSize: '16px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                transition: 'border-color 0.3s ease'
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ fontWeight: 'bold', marginBottom: '5px', color: '#555' }}>Xác nhận mật khẩu mới:</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={this.handleChange('confirmPassword')}
                            required
                            style={{
                                padding: '8px',
                                fontSize: '16px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                transition: 'border-color 0.3s ease'
                            }}
                        />
                    </div>
                    {error && <p style={{ textAlign: 'center', fontSize: '14px', color: '#d9534f', marginTop: '10px' }}>{error}</p>}
                    {success && <p style={{ textAlign: 'center', fontSize: '14px', color: '#5cb85c', marginTop: '10px' }}>{success}</p>}
                    <button type="submit" style={{
                        width: '100%',
                        padding: '10px',
                        fontSize: '16px',
                        backgroundColor: '#d9534f',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s ease'
                    }} onMouseEnter={(e) => e.target.style.backgroundColor = '#c9302c'}
                       onMouseLeave={(e) => e.target.style.backgroundColor = '#d9534f'}>
                        Cập nhật mật khẩu
                    </button>
                </form>
            </div>
        );
    }
}
