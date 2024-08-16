import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = ({ handleLogout }) => {
  const navigate = useNavigate();
  const onLogoutClick = async () => {
    await handleLogout();
    navigate('/login');
  };

  const userType = localStorage.getItem('userType'); 
  const logoLink = userType === '1' ? '/' : '/operation';
  const logoSrc = userType === '1' ? '/path/to/operation.png' : '/path/to/repair.png';

  return (
    <nav className="sidebar">
      <div className="logo-container">
        <NavLink to={logoLink}>
          <img src={logoSrc} alt="Logo" className="logo" />
        </NavLink>
        <span className="logo-text">{userType === '1' ? '운영 관리과' : '유지 보수팀'}</span>
        <button onClick={onLogoutClick} className="logout-button">
          로그아웃
      </button>
      </div>
      <ul className="nav-links">
        {userType === '1' && (
          <>
            <li>
              <NavLink to="/" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                <img src="/path/to/Map.png" alt="포트홀 지도" className="nav-icon" />
                <span>포트홀 지도</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/stats" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                <img src="/path/to/통계.png" alt="통계" className="nav-icon" />
                <span>통계</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/link/before" className={({ isActive }) => (isActive || location.pathname === '/link/after' ? 'active-link' : '')}>
                <img src="/path/to/연계내역.png" alt="연계내역" className="nav-icon" />
                <span>연계 내역</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/report" className={({ isActive }) => (isActive || location.pathname === '/reportAfterPage' ? 'active-link' : '')}>
                <img src="/path/to/신고내역.png" alt="신고내역" className="nav-icon" />
                <span>신고 내역</span>
              </NavLink>
            </li>
          </>
        )}
        {userType === '2' && (
          <>
            <li>
              <NavLink to="/operation" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                <img src="/path/to/Map.png" alt="작업 지도" className="nav-icon" />
                <span>작업 지도</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/repairlist" className={({ isActive }) => (isActive ? 'active-link' : '')}>
              <img src="/path/to/연계내역.png" alt="작업 정보" className="nav-icon" />
              <span>작업 정보</span>
              </NavLink>
            </li>
          </>
        )}
      </ul>

    </nav>
  );
};

export default Navbar;
