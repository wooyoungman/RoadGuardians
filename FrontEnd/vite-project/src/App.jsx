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
import ProtectedRoute from './ProtectedRoute';
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedAccessToken = sessionStorage.getItem('accessToken');
      const storedUserType = sessionStorage.getItem('userType');

      if (storedAccessToken && storedUserType) {
        setIsAuthenticated(true);
        setUserType(storedUserType);
        setLoading(false);
      } else {
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          setIsAuthenticated(true);
          await fetchUserType(newAccessToken);
        } else {
          setIsAuthenticated(false);
        }
        setLoading(false);
      }
    };

    const refreshAccessToken = async () => {
      try {
        const accessToken = sessionStorage.getItem('accessToken');
        if (accessToken) {
          return accessToken;
        }
        return null;
      } catch (error) {
        console.error('Failed to refresh access token', error);
        sessionStorage.removeItem('accessToken');
        return null;
      }
    };

    const fetchUserType = async (accessToken) => {
      try {
        const response = await axios.get('https://i11c104.p.ssafy.io/api/v1/auth/check-token', {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        if (response.status === 200) {
          const userType = response.data.userType;
          sessionStorage.setItem('userType', userType);  // userType을 sessionStorage에 저장
          setUserType(userType);
        }
      } catch (error) {
        console.error('Failed to fetch user type', error);
        setUserType(null);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = (newAccessToken, type) => {
    sessionStorage.setItem('accessToken', newAccessToken);
    sessionStorage.setItem('userType', type);  // 로그인 시 userType을 sessionStorage에 저장
    setIsAuthenticated(true);
    setUserType(type);
  };

  const handleLogout = async () => {
    await axios.post('https://i11c104.p.ssafy.io/api/v1/auth/logout'); // 로그아웃 요청
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('userType');
    setIsAuthenticated(false);
    setUserType(null);
  };

  if (loading) {
    return <div>Loading...</div>;  // 로딩 표시
  }

  return (
    <Router>
      {isAuthenticated && <Navbar userType={userType} handleLogout={handleLogout} />}
      <div style={{ paddingTop: isAuthenticated ? '80px' : '0' }}>
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <MainPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/stats"
            element={isAuthenticated ? <StatsPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/report"
            element={isAuthenticated ? <ReportPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/report/after"
            element={isAuthenticated ? <ReportAfterPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/link/*"
            element={isAuthenticated ? <LinkPage /> : <Navigate to="/login" />}
          >
            <Route path="" element={<Navigate to="before" replace />} />
            <Route path="before" element={<BeforeLink />} />
            <Route path="after" element={<AfterLink />} />
          </Route>
          <Route
            path="/repairlist"
            element={isAuthenticated ? <RepairList /> : <Navigate to="/login" />}
          />
          <Route
            path="/operation"
            element={isAuthenticated ? <OperationsManagement /> : <Navigate to="/login" />}
          />
          <Route
            path="/logout"
            element={isAuthenticated ? <LogoutPage onLogout={handleLogout} /> : <Navigate to="/login" />}
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
