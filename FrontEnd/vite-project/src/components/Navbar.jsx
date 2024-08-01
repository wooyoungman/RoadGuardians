import React from 'react';
import { NavLink } from 'react-router-dom';


const Navbar = () => {
  return (
    <nav>
      <div className="logo-container">
        <NavLink to="/">
          <img src="/path/to/logo.png" alt="Logo" className="logo" />
        </NavLink>
      </div>
      <ul className="nav-links">
        <li><NavLink to="/">포트홀 지도</NavLink></li>
        <li><NavLink to="/stats">통계</NavLink></li>
        <li><NavLink to="/link">연계 내역</NavLink></li>
        <li><NavLink to="/report">신고 내역</NavLink></li>
      </ul>
    </nav>
  );
};

export default Navbar;
