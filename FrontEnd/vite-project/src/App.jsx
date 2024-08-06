// src/App.jsx
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
import Cookies from 'js-cookie';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const accessToken = Cookies.get('accessToken');
    if (accessToken) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
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
