import React, { Component } from 'react'
import Header from '../Home/Header'
import Footer from '../Home/Footer'
import { Link } from 'react-router-dom'

export default class Pay_success extends Component {
    render() {
        return (
            <div>
                <Header />
                <div className='container-fluid'>
                    <div className='wrapper'style={{marginTop:190}}>
                        <div className='success-form'style={{textAlign:'center'}}>
                            <h2>Đặt hàng thành công</h2>
                            <p className="fs-3"></p>
                        </div>
                        <div className='btn-b d-flex justify-content-center'>
                            <Link to="/" className='a-none'>
                            <button className='btn btn-primary'>Trở lại trang chủ</button>
                            </Link>
                        </div>
                    </div>

                </div>
                <Footer />
            </div>
        )
    }
}
