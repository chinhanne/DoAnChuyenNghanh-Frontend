import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setToken } from "../../services/localStorageService";
import {jwtDecode } from 'jwt-decode';

const Authenticate = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');

    useEffect(() => {
        const authCode = new URLSearchParams(window.location.search).get('code');
        if (!authCode) {
            navigate('/'); 
            return;
        }

        const fetchToken = async () => {
            try {
                const response = await fetch(`http://localhost:8080/auth/outbound/authentication?code=${authCode}`, {
                    method: "POST",
                });
        
                if (!response.ok) {
                    throw new Error("Xác thực không thành công. Vui lòng thử lại.");
                }
        
                const data = await response.json();
                const token = data.result?.token;
                const noInfo = data.result?.noPassword
        
                if (token) {
                    localStorage.setItem('accessToken', token); 
                    const decodedToken = jwtDecode(token);
                    localStorage.setItem('tokenExpiry', decodedToken.exp);

                    if (noInfo) {
                        navigate('/updateInfoUser');
                    } else {
                        navigate('/');
                    }
                } else {
                    throw new Error("Thiếu token.");
                }
            } catch (error) {
                setError(error.message || "Đã xảy ra lỗi không xác định.");
            }
        };

        fetchToken();
    }, [navigate]);
};

export default Authenticate;