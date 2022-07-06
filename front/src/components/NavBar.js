import React from "react";
import '../assets/css/base.css'
import '../assets/css/main.css'
import '../assets/font/fontawesome-free-6.1.1-web/css/all.min.css'
import '../assets/css/font.css'
import logoheader from '../assets/img/hust.png'
import { Link } from "react-router-dom";
  
const Navbar = () => {
  return (
            <header className="header">
                <div className="grid">
                    <nav className="header__navhome">
                        <div className="header__navbar-pic">
                            <img src={logoheader} alt="hust" className="header__navhome-img"/> 
                        </div>       
                        <a href="http://localhost:3000/" className="header__navhome-link"> HỆ THỐNG QUẢN LÝ</a></nav>
                    <nav className="header__navbar">
                        <ul className="header_navbar-item-top">
                            <li className="header__navbar-item">
                                <Link to="/" className="header__navbar-item-link"> 
                                    <i className="fa-solid fa-house"></i> TRANG CHỦ
                                </Link> 
                            </li>
                            <li className="header__navbar-item" >
                                <Link to="/guide" className="header__navbar-item-link">
                                    <i className="fa-solid fa-book" ></i> HƯỚNG DẪN SỬ DỤNG 
                                </Link>
                            </li>
                            <li className="header__navbar-item" >
                                <Link to="/contact" className="header__navbar-item-link">
                                    <i className="fa-solid fa-address-book"></i> LIÊN HỆ 
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div> 
            </header> 
  );
};
  
export default Navbar;