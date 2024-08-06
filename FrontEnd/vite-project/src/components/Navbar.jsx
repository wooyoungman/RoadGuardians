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
      <li>
          <NavLink to="/operation" className={({ isActive }) => (isActive ? 'active-link' : '')}>
            관리자 페이지
          </NavLink>
        </li>
        <li>
          <NavLink to="/" className={({ isActive }) => (isActive ? 'active-link' : '')}>
            포트홀 지도
          </NavLink>
        </li>
        <li>
          <NavLink to="/stats" className={({ isActive }) => (isActive ? 'active-link' : '')}>
            통계
          </NavLink>
        </li>
        <li>
          <NavLink to="/link/before" className={({ isActive }) => (isActive || location.pathname === '/link/after' ? 'active-link' : '')}>
            연계 내역
          </NavLink>
        </li>
        <li>
          <NavLink to="/report" className={({ isActive }) => (isActive || location.pathname === '/reportAfterPage' ? 'active-link' : '')}>
            신고 내역
          </NavLink>
        </li>
        <li>
          <NavLink to="/repairlist" className={({ isActive }) => (isActive || location.pathname === '/repairlist' ? 'active-link' : '')}>
            유지 보수 팀
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
