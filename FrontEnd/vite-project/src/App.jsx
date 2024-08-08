import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import api from './axios';  // axios import

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          setIsAuthenticated(true);
          console.log('Authentication success:', isAuthenticated);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error during auth check:', error);
        setIsAuthenticated(false);
      }
    };

    const refreshAccessToken = async () => {
      try {
        const response = await api.post('/api/v1/auth/refresh-token');
        console.log(response);
        localStorage.setItem('accessToken', response.data.data.accessToken);
        return response.data.data.accessToken;
      } catch (error) {
        console.error('Failed to refresh access token', error);
        localStorage.removeItem('accessToken');
        return null;
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    console.log('Authentication status changed:', isAuthenticated);
  }, [isAuthenticated]);

  const handleLogin = (newAccessToken) => {
    localStorage.setItem('accessToken', newAccessToken);
    setAccessToken(newAccessToken);
    console.log("good")
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setAccessToken(null);
    setIsAuthenticated(false);
  };

  return (
    <Router>
      {isAuthenticated && <Navbar onLogout={handleLogout} />}
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