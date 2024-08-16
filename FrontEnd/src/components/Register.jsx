import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    id: '',
    password: '',
    passwordConfirm: '',
    name: '',
    email: '',
    phone: '',
    dept_name: '소속 부서'
  });
  const [isIdValid, setIsIdValid] = useState(null); // ID 유효성 상태
  const [idMessage, setIdMessage] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    const idRegExp = /^[a-zA-z0-9]{4,12}$/;

    // ID가 변경되면 중복 확인 상태를 초기화
    

    if (name === 'id') {
      setIsIdValid(null);

      if (!idRegExp.test(value)) {
        setIdMessage(false);
        setIsIdValid(null);
      } else {
        setIdMessage(true);
      }
    }

  };

  const handleDeptChange = (e) => {
    setFormData({ ...formData, dept_name: e.target.value });
  };

  const handleIdCheck = async () => {


    try {
      const response = await axios.get('https://i11c104.p.ssafy.io/api/v1/auth/check-id', {
        params: {
          id: formData.id,
        }
      });

      if (idMessage === false) {
        alert('4-12사이 영어 또는 숫자만 입력해 주세요.');
      } else if (response.data.result) {
          alert('사용 가능한 id입니다');
          setIsIdValid(true);
      } else {
        alert('중복되는 id가 존재합니다');
        setIsIdValid(false);
      }
    } catch (error) {
      console.error('ID check error', error);
      alert('ID 확인 중 오류가 발생했습니다.');
    }

  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 비밀번호 확인 로직 추가
    if (formData.password !== formData.passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다');
      return; // 비밀번호가 일치하지 않으면 더 이상 진행하지 않음
    }

    // ID 중복 확인 로직 추가
    if (idMessage === false) {
      alert('ID는 4-12사이 영어 또는 숫자만 가능합니다.');
      return;
    }
    if (isIdValid !== true) {
      alert('ID 중복 확인을 해주세요.');
      return;
    } 
    alert('회원 가입은 8월 17일부터 가능합니다.');
    // try {
    //   const response = await axios.post('https://i11c104.p.ssafy.io/api/v1/auth/signUp', {
    //     id: formData.id,
    //     email: formData.email,
    //     password: formData.password,
    //     confirmPassword: formData.passwordConfirm,
    //     name: formData.name,
    //     phoneNumber: formData.phone,
    //     userType: formData.dept_name === "1" ? 1 : 2,
    //     deptId: parseInt(formData.dept_name),
    //   });

    //   if (response.data.result) {
    //     alert('회원가입이 완료되었습니다.');
    //     navigate('/login'); // 회원가입 완료 후 로그인 페이지로 이동 
    //   } else {
    //     alert(`회원가입 실패: ${response.data.message}`);
    //   }
    // } catch (error) {
    //   if (isNaN(formData.dept_name)){
    //     alert('소속 부서를 선택해주세요.');
    //   } else {
    //   console.error('Registration error', error);
    //   alert('회원가입 중 오류가 발생했습니다.');
    //   }
    // }
  };

  const handleBack = () => {
    navigate('/login');
  };

  return (
    <div className="login-background">
      <div className="register-container">
        <h2>회원가입</h2>
        <form onSubmit={handleSubmit}>
          <div className="id-check-container">
            <input 
              type="text" 
              id="id" 
              name="id" 
              value={formData.id} 
              onChange={handleChange} 
              placeholder="아이디" 
            />
            <button type="button" onClick={handleIdCheck}>중복 확인</button>
          </div>
          <p className={`${idMessage || formData.id.length < 1 ? 'hidden' : ''}`} >4-12사이 영어 또는 숫자만 입력해 주세요.</p>





          <input 
            type="password" 
            id="password" 
            name="password" 
            value={formData.password} 
            onChange={handleChange} 
            placeholder="비밀번호" 
          />

          <input 
            type="password" 
            id="passwordConfirm" 
            name="passwordConfirm" 
            value={formData.passwordConfirm} 
            onChange={handleChange} 
            placeholder="비밀번호 확인" 
          />

          <input 
            type="text" 
            id="name" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            placeholder="이름" 
          />

          <input 
            type="email" 
            id="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            placeholder="이메일" 
          />

          <input 
            type="text" 
            id="phone" 
            name="phone" 
            value={formData.phone} 
            onChange={handleChange} 
            placeholder="전화번호" 
          />

          <select 
            id="dept_name" 
            name="dept_name" 
            value={formData.dept_name} 
            onChange={handleDeptChange}
          >
            <option value="-1">소속 부서를 선택해주세요.</option>
            <option value="1">운영관리팀</option>
            <option value="2">광산구 유지보수팀</option>
            <option value="3">동구 유지보수팀</option>
            <option value="4">서구 유지보수팀</option>
            <option value="5">남구 유지보수팀</option>
            <option value="6">북구 유지보수팀</option>
          </select>

          <button type="submit" className="submit-button">회원가입</button>

        </form>
      </div>
    </div>
  );
}

export default Register;
