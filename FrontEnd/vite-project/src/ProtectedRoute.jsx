import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { checkTokenValidity } from './axios';  // 토큰 검사 함수 import

const ProtectedRoute = ({ element }) => {
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    const validateToken = async () => {
      const valid = await checkTokenValidity();
      setIsValid(valid);
    };
    validateToken();
  }, []);

  if (isValid === null) {
    return <div>Loading...</div>;  // 로딩 표시
  }
  return isValid ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;