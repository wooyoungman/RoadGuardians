import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = ({ userType, onLogout }) => {
  const navigate = useNavigate();

  const onLogoutClick = async () => {
    await onLogout();
    navigate('/login');
  };

  return (
    <nav>
      <div className="logo-container">
        <NavLink to="/">
          <img src="/path/to/logo.png" alt="Logo" className="logo" />
        </NavLink>
      </div>
      <ul className="nav-links">
        {userType === '1' && (
          <>
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
          </>
        )}
        {userType === '2' && (
          <>
            <li>
              <NavLink to="/operation" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                작업 지도
              </NavLink>
            </li>
            <li>
              <NavLink to="/repairlist" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                작업 정보
              </NavLink>
            </li>
          </>
        )}
        <li>
          <button onClick={onLogoutClick} className="logout-button">
            로그아웃
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
