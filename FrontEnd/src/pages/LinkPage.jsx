import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import '../styles/LinkPage.css';

const LinkPage = () => {
  const [activeButton, setActiveButton] = useState(sessionStorage.getItem('activeButton') || 'before');
  const [showButtons, setShowButtons] = useState(true);
  const navigate = useNavigate();

  const handleScroll = () => {
    if (window.scrollY > 5) {
      setShowButtons(false);
    } else {
      setShowButtons(true);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (activeButton === 'before' && window.location.pathname === '/link') {
      navigate('/link/before');
    } else {
      navigate(`/link/${activeButton}`);
    }
  }, [activeButton, navigate]);

  const handleButtonClick = (button) => {
    setActiveButton(button);
    sessionStorage.setItem('activeButton', button);
  };

  return (
    <div className="page-container">
      {showButtons && (
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '120px', position: 'fixed', top: '10px', left: '10px', zIndex: 10 }}>
          <div className="link-buttons">
            <button
              className={activeButton === 'before' ? 'before_button selected' : 'before_button'}
              onClick={() => handleButtonClick('before')}
            >
              연계 전
            </button>
            <button 
              className={activeButton === 'after' ? 'after_button selected' : 'after_button'}
              onClick={() => handleButtonClick('after')}
            >
              연계 후
            </button>
          </div>
        </div>
      )}
      <Outlet/>
    </div>
  );
};

export default LinkPage;
