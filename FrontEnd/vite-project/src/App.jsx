import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
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
import './App.css';

const App = () => {
  return (
    <Router>
      <Navbar />
      <div style={{ paddingTop: '80px' }}>
        <Routes>
        <Route path='/operation' element={<OperationsManagement/>} />
          <Route path="/" element={<MainPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/report/after" element={<ReportAfterPage />} />
          <Route path="/link/*" element={<LinkPage />}>
            <Route path="" element={<Navigate to="before" replace />} />
            <Route path="before" element={<BeforeLink />} />
            <Route path="after" element={<AfterLink />} />
          </Route>
          
          <Route path="/repairlist" element={<RepairList />} />
          <Route path="/logout" element={<LogoutPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
