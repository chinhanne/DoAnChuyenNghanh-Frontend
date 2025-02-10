import React, { Component } from 'react'

export default class InfoAddress extends Component {
  render() {
    return (
      <div>
        <div className='info-address'>
          <div className='address-top'>
            <div className='address-title'>
              <h3>Địa Chỉ Của Tôi</h3>
            </div>
          </div>
          <div className='address-bottom d-flex justify-content-between'>
            <div className='address'>
              <div className='d-flex'>
              <p>Đỗ Chí Nhân</p>
              <span className='ml-1 mr-2'>|</span>
              <p>(+84)786352398</p>
              </div>
            <div>
            <p>Trần Văn Trà, ấp Thị Cầu, Nhơn Trạch, Đồng Nai</p>
            </div>
            </div>
            <div className='edit align-items-center d-flex'>
              <a href='#'>Thay đổi</a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
