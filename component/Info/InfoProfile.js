import React, { Component } from 'react';
import { getCurrentUser, updateMyInfo } from '../../services/userService';
import '../../asserts/InfoProfile.css';

export default class InfoRight extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            gender: 'Khác',
            phone: '',
            dob: '',
            username: '',
            email: '',
            address: '',
            error: '',
            success: '',
            imageFile: null,
        };
        this.fileInputRef = React.createRef();
    }

    componentDidMount() {
        this.loadUserData();
    }

    loadUserData = async () => {
        try {
            const userData = await getCurrentUser();
            this.setState({
                user: userData,
                gender: this.getGenderValue(userData.gender),
                phone: userData.numberPhone || '',
                dob: userData.dob || '',
                username: userData.username || '',
                email: userData.email || '',
                address: userData.address || '',
                image: userData.image || '',
            });
        } catch (error) {
            this.setState({ error: 'Không thể lấy thông tin người dùng.' });
        }
    };

    getGenderValue = (gender) => {
        switch (gender) {
            case 0:
                return 'Nam'
            default:
                return 'Nữ';
        }
    };

    handleFileUpload = () => {
        this.fileInputRef.current.click();
    };

    handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && !['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
            this.setState({ error: 'Chỉ chấp nhận định dạng .jpg, .jpeg, .png' });
            return;
        }
        if (file && file.size > 1 * 1024 * 1024) {
            this.setState({ error: 'Dung lượng file tối đa 1MB' });
            return;
        }
        this.setState({ imageFile: file, error: '', success: '' });
    };

    handleChange = (field) => (event) => {
        this.setState({ [field]: event.target.value, error: '', success: '' });
    };

    validateInputs = () => {
        const { email, phone } = this.state;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phonePattern = /^[0-9]{10,15}$/;

        if (!emailPattern.test(email)) {
            return 'Email không hợp lệ.';
        }
        if (!phonePattern.test(phone)) {
            return 'Số điện thoại không hợp lệ.';
        }
        return '';
    };

    handleUpdate = async (event) => {
        event.preventDefault();
        const errorMsg = this.validateInputs();
        if (errorMsg) {
            this.setState({ error: errorMsg });
            return;
        }
    
        const { dob, gender, phone, email, address, imageFile } = this.state;
        const updatedUserData = {
            dob,
            gender: this.getGenderNumber(gender),
            numberPhone: phone,
            email,
            address,
        };
    
        try {
            const response = await updateMyInfo(updatedUserData, imageFile);
            if (response && response.code === 1000) {
                this.setState({
                    success: 'Cập nhật thông tin thành công!',
                    error: '',
                });
                // Refresh toàn bộ trang
                setTimeout(() => {
                    window.location.reload();
                }, 1000); // Thời gian chờ để hiển thị thông báo trước khi refresh
            } else {
                this.setState({ error: response.message || 'Cập nhật không thành công.' });
            }
        } catch (error) {
            this.setState({ error: 'Có lỗi xảy ra khi cập nhật thông tin.' });
        }
    };

    getGenderNumber = (gender) => {
        switch (gender) {
            case 'Nam':
                return 0;
            default:
                return 1;
        }
    };

    render() {
        const { user, gender, phone, dob, username, email, address, error, success, image } = this.state;

        if (!user) {
            return <div>Đang tải thông tin người dùng...</div>;
        }

        return (
            <div className="info-container">
                <div className="row">
                    <div className="col-8">
                        <div className="info-right">
                            <div className="right-top">
                                <h3>Hồ Sơ Của Tôi</h3>
                                <p>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
                            </div>

                            <div className="right-bottom">
                                <form onSubmit={this.handleUpdate}>
                                    <div className="info-table">
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td>Tên người dùng:</td>
                                                    <td>
                                                        <span>{username}</span>
                                                        <small style={{ color: 'gray' }}> Tên người dùng không thể thay đổi.</small>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Email:</td>
                                                    <td>
                                                        <input
                                                            type="email"
                                                            value={email}
                                                            placeholder="Nhập email"
                                                            onChange={this.handleChange('email')}
                                                            required
                                                        />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Số điện thoại:</td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            value={phone}
                                                            placeholder="Nhập số điện thoại"
                                                            onChange={this.handleChange('phone')}
                                                            required
                                                        />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Địa chỉ:</td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            value={address}
                                                            placeholder="Nhập địa chỉ"
                                                            onChange={this.handleChange('address')}
                                                            required
                                                        />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Giới Tính:</td>
                                                    <td>
                                                        <select
                                                            value={gender}
                                                            onChange={this.handleChange('gender')}
                                                            required
                                                        >
                                                            <option value="Nam">Nam</option>
                                                            <option value="Nữ">Nữ</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Ngày sinh:</td>
                                                    <td>
                                                        <input
                                                            type="date"
                                                            value={dob}
                                                            onChange={this.handleChange('dob')}
                                                            required
                                                        />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    {error && <p className="error">{error}</p>}
                                    {success && <p className="success">{success}</p>}
                                    <button type="submit" className="btn btn-danger mt-3">Lưu</button>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="col-3">
                        <div className="add-img text-center">
                            <img
                                src={image || require('../../asserts/ProductImg/icon/user2.png')}
                                alt="avatar"
                                className="rounded-circle mb-2"
                                style={{ width: 100, height: 100, border: '2px solid #efefef' }}
                            />
                            <input
                                type="file"
                                ref={this.fileInputRef}
                                style={{ display: 'none' }}
                                accept=".jpg,.jpeg,.png"
                                onChange={this.handleFileChange}
                            />
                            <button
                                className="btn btn-primary mt-2"
                                onClick={this.handleFileUpload}
                            >
                                Chọn tệp
                            </button>
                            <div className="mt-2 text-muted" style={{ fontSize: '.875rem' }}>
                                Chọn file có định dạng .jpg, .jpeg, .png. Dung lượng tối đa 1MB.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
