import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const pageContainerStyle = {
  left: '200px',
  bottom: '30px',
}

const ReportPage = () => {
  const [ReportPageActive, setActiveButton] = useState(sessionStorage.getItem('ReportPageActive') || 'before');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // 버튼 가시성 상태
  const navigate = useNavigate();

  useEffect(() => {
    if (ReportPageActive === 'before' && window.location.pathname === '/report') {
      navigate('/report/before');
    } else {
      navigate(`/report/${ReportPageActive}`);
    }
  }, [ReportPageActive, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 1) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleButtonClick = (button) => {
    setActiveButton(button);
    sessionStorage.setItem('ReportPageActive', button);
    setIsFormOpen(false);
  };

  return (
    <div className="relative p-5" style={pageContainerStyle}>
      {isVisible && (
        <div className='flex flex-start mt-28 fixed left-2.5 top-2.5 z-10'>
          <div className='report_button'>
            <button
              className={ReportPageActive === 'before' ? 'before1_button selected' : 'before1_button'}
              onClick={() => handleButtonClick('before')}
            >
              신고 전
            </button>
            <button
              className={ReportPageActive === 'after' ? 'after1_button selected' : 'after1_button'}
              onClick={() => handleButtonClick('after')}
            >
              신고 후
            </button>
          </div>
        </div>
      )}
      <Outlet/>
    </div>
  );
};

export default ReportPage;
