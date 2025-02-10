import React, { Component } from 'react'
import '../../asserts/Slide.css'
export default class Slide extends Component {
    render() {
        return (

            <div style={{marginTop:108}}>
                <div id="demo" className="carousel slide mt-2" data-ride="carousel" >
                    {/* Indicators */}
                    <ul className="carousel-indicators">
                        <li data-target="#demo" data-slide-to={0} className="active" />
                        <li data-target="#demo" data-slide-to={1} />
                        <li data-target="#demo" data-slide-to={2} />
                    </ul>
                    {/* The slideshow */}
                    <div className="carousel-inner" style={{height:700}}>
                        <div className="carousel-item active">
                            <img src={require('../../asserts/ProductImg/banner1.jpg')} alt="Los Angeles"/>
                        </div>
                        <div className="carousel-item">
                            <img src={require('../../asserts/ProductImg/banner2.jpg')} alt='kasnksa'/>
                        </div>
                        <div className="carousel-item">
                            <img src={require('../../asserts/ProductImg/banner3.jpg')} alt='banner'/>
                        </div>
                    </div>
                    {/* Left and right controls */}
                    <a className="carousel-control-prev" href="#demo" data-slide="prev">
                        <span className="carousel-control-prev-icon" />
                    </a>
                    <a className="carousel-control-next" href="#demo" data-slide="next">
                        <span className="carousel-control-next-icon" />
                    </a>
                </div>


            </div>
        )
    }
}
