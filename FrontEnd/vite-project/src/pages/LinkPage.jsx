import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import '../styles/LinkPage.css';

const LinkPage = () => {
  const [activeButton, setActiveButton] = useState(localStorage.getItem('activeButton') || 'before');
  const navigate = useNavigate();

  useEffect(() => {
    if (activeButton === 'before' && window.location.pathname === '/link') {
      navigate('/link/before');
    } else {
      navigate(`/link/${activeButton}`);
    }
  }, [activeButton, navigate]);

  const handleButtonClick = (button) => {
    setActiveButton(button);
    localStorage.setItem('activeButton', button);
  };

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '120px', position: 'fixed', top: '10px', left: '10px', zIndex: 20 }}>
        <div className="link-buttons">
          <button
            className={`bg-hover border border-borderHover text-white py-2 px-4 rounded-md ${activeButton === 'before' ? 'bg-primary borderPrimary' : ''}`} 
            onClick={() => handleButtonClick('before')}
          >
            확인 전
          </button>
          <button
            className={`bg-hover border border-borderHover text-white py-2 px-4 rounded-md ${activeButton === 'after' ? 'bg-primary borderPrimary' : ''}`} 
            onClick={() => handleButtonClick('after')}
          >
            확인 후
          </button>
        </div>
      </div>
      <Outlet/>
    </div>
  );
};

export default LinkPage;
