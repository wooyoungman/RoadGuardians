import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const LogoutPage = ({ onLogout }) => {
  useEffect(() => {
    onLogout();
  }, [onLogout]);

  return <Navigate to="/" replace />;
};

export default LogoutPage;
