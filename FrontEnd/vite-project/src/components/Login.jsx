import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axios';  // 커스텀 axios 인스턴스를 import
import Cookies from 'js-cookie';
import './Login.css';

function Login({ onLogin }) {
  const [userType, setUserType] = useState('1');
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleTeamChange = (newTeam) => {
    setUserType(newTeam);
  };

  const handleLogin = async () => {
    const loginData = {
      id: id,
      password: password,
      userType: userType
    };
    console.log('Login Data:', loginData); // 콘솔에 로그인 데이터 출력

    try {
      const response = await axios.post('https://i11c104.p.ssafy.io/api/v1/auth/login', loginData);
      console.log(response)

      if (response.data.result) {
        Cookies.set('accessToken', response.data.accessToken, { path: '/' });
        Cookies.set('refreshToken', response.data.refreshToken, { path: '/' });
        onLogin();
        if (userType === '1') {
          navigate('/map');
        } else if (userType === '2') {
          navigate('/report');
        } 
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Login error', error);
      alert('로그인 중 오류가 발생했습니다');
    }
  };

  const handleRegister = () => {
    navigate('/signup');
  };

  return (
    <div className="login-container">
      <div className="logo">
        <img src="/path/to/logo.png" alt="로드가디언즈" />
      </div>
      <div className="team-selector">
        <button
          className={userType === '1' ? 'active' : ''}
          onClick={() => handleTeamChange('1')}
        >
          운영관리팀
        </button>
        <button
          className={userType === '2' ? 'active' : ''}
          onClick={() => handleTeamChange('2')}
        >
          유지보수팀
        </button>
      </div>
      <div className="login-form">
        <div className="idbox">ID</div>
        <input 
          type="text" 
          placeholder="ID" 
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <div className="psbox">Password</div>
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>로그인</button>
        <div className="register-link">
          <span onClick={handleRegister}>회원가입</span>
        </div>
      </div>
    </div>
  );
}

export default Login;
