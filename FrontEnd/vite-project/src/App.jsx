import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import MainPage from './pages/MainPage';
import StatsPage from './pages/StatsPage';
import ReportPage from './pages/ReportPage';
import LinkPage, { BeforeLink, AfterLink } from './pages/LinkPage';
import LogoutPage from './pages/LogoutPage';
import './App.css';

const App = () => {
  return (
    <Router>
      <Navbar />
      <div style={{ paddingTop: '80px' }}>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/link" element={<LinkPage />}>
            <Route path="before" element={<BeforeLink />} />
            <Route path="after" element={<AfterLink />} />
          </Route>
          <Route path="/logout" element={<LogoutPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
