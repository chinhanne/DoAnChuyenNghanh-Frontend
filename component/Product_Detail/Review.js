import React, { Component } from 'react'

export default class Review extends Component {
    render() {
        return (
            <div>
                <div className='review-form d-flex flex-column mt-5 border rounded-sm p-3'>
                    <h4 className='d-flex'>Viết Đánh Giá</h4>
                    <form>
                        <div className='rv-info mt-3 ml-4'>
                            <div className=''>
                                <input type='text' placeholder='Tên của bạn' style={{height: 40,width:'24%'}} className='mr-3 mb-3 ml-2'/>
                                <input type='text' placeholder='email'  style={{height: 40,width:'24%'}} className='mr-3'/>
                            </div>
                            <div className=''>
                            <input type='text' placeholder='Số điện thoại'  style={{height: 40,width:'24%'}} className='mr-3 mb-3'/>
                            <select className='p-2 border rounded-10 ' style={{height: 40,width:'24%'}}>
                                <option value={1}>Đã mua hàng tại shop</option>
                                <option value={2}>Đang dùng sản phẩm</option>
                                <option value={3}>Đang quan tâm</option>
                            </select>
                            </div>
                        </div>
                        <div className='rv-area'>
                            <textarea required rows={5} minLength={3} maxLength={1000} placeholder='Viết nội dung đánh giá ở đây (>3 ký tự và < 1000 ký tự' 
                            className='p-2 border rounded-10' style={{outline: 'none',width:'60%'}} />
                        </div>
                        <div className='dvimg'>
                            <input name='filedata' id='uploadfile' type='file' className='p-2 border rounded-10' style={{ width: '25%' }} />
                        </div>
                        <div className='btn-send '>
                            <button type='submit' className='btn-danger'>Gửi</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}
