import React, { Component } from 'react'
import Header from '../Home/Header'
import InfoLeft from '../Info/InfoLeft'
import InfoAddress from './InfoAddress'
import Footer from '../Home/Footer'
export default class Info_MainAddress extends Component {
  render() {
    return (
<div>
        <Header/>
        <div className='container-fluid mt-3'>
            <div className='wrapper'style={{marginTop:140}}>
            <div className='row'>
                <div className='col-1'></div>
                <div className='col-10 d-flex'>
                    <div className='col-3'>
                      
                        <InfoLeft/>
                    </div>
                    <div className='col-7'>
                        {/* <InfoRight/> */}
                        {/* <InfoEditPW/> */}
                        <InfoAddress/>
                    </div>
                </div>
                <div className='col-1'></div>
            </div>
            </div>

        </div>
        <Footer/>
      </div>
    )
  }
}
