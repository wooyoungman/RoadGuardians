import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import MainPage from './pages/MainPage';
import StatsPage from './pages/StatsPage';
import ReportPage from './pages/ReportPage';
import ReportAfterPage from './pages/ReportAfterPage';
import BeforeLink from './pages/BeforeLink';
import AfterLink from './pages/AfterLink';
import LinkPage from './pages/LinkPage';
import LogoutPage from './pages/LogoutPage';
import RepairList from './pages/RepairList';
import OperationsManagement from './pages/OperationsManagement';
import ProtectedRoute from './ProtectedRoute';  // 경로 보호 컴포넌트 import
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);  // 로딩 상태 추가

  const checkAuthentication = async () => {
    const accessToken = sessionStorage.getItem('accessToken');
    const storedUserType = sessionStorage.getItem('userType');
    
    if (!accessToken || !storedUserType) {
      setIsAuthenticated(false);
      setLoading(false);  // 로딩 완료
      return;
    }

    try {
      const response = await axios.get('https://i11c104.p.ssafy.io/api/v1/auth/check-token', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });

      if (response.status === 200) {
        setIsAuthenticated(true);
        setUserType(storedUserType);
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    }
    setLoading(false);  // 로딩 완료
  };

  useEffect(() => {
    checkAuthentication(); // 앱이 처음 로드될 때 사용자 상태를 확인
  }, []);

  const handleLogin = (type, accessToken) => {
    sessionStorage.setItem('accessToken', accessToken);
    sessionStorage.setItem('userType', type);
    setIsAuthenticated(true);
    setUserType(type);
  };

  const handleLogout = async () => {
    await axios.post('https://i11c104.p.ssafy.io/api/v1/auth/logout');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('userType');
    setIsAuthenticated(false);
    setUserType(null);
  };

  if (loading) {
    return <div>Loading...</div>;  // 로딩 중일 때는 로딩 화면을 표시
  }

  return (
    <Router>
      {isAuthenticated && <Navbar userType={userType} onLogout={handleLogout} />}
      <div style={{ paddingTop: isAuthenticated ? '80px' : '0' }}>
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <ProtectedRoute element={<MainPage />} /> : <Navigate to="/login" />}
          />
          <Route
            path="/stats"
            element={isAuthenticated ? <ProtectedRoute element={<StatsPage />} /> : <Navigate to="/login" />}
          />
          <Route
            path="/report"
            element={isAuthenticated ? <ProtectedRoute element={<ReportPage />} /> : <Navigate to="/login" />}
          />
          <Route
            path="/report/after"
            element={isAuthenticated ? <ProtectedRoute element={<ReportAfterPage />} /> : <Navigate to="/login" />}
          />
          <Route
            path="/link/*"
            element={isAuthenticated ? <ProtectedRoute element={<LinkPage />} /> : <Navigate to="/login" />}
          >
            <Route path="" element={<Navigate to="before" replace />} />
            <Route path="before" element={<BeforeLink />} />
            <Route path="after" element={<AfterLink />} />
          </Route>
          <Route
            path="/repairlist"
            element={isAuthenticated ? <ProtectedRoute element={<RepairList />} /> : <Navigate to="/login" />}
          />
          <Route
            path="/operation"
            element={isAuthenticated ? <ProtectedRoute element={<OperationsManagement />} /> : <Navigate to="/login" />}
          />
          <Route
            path="/logout"
            element={isAuthenticated ? <ProtectedRoute element={<LogoutPage onLogout={handleLogout} />} /> : <Navigate to="/login" />}
          />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Register />} />
          <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
