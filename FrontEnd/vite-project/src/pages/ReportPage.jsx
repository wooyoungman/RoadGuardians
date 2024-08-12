import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const ReportPage = () => {
  const [ReportPageActive, setActiveButton] = useState(sessionStorage.getItem('ReportPageActive') || 'before');
  const navigate = useNavigate();

  useEffect(() => {
    if (ReportPageActive === 'before' && window.location.pathname === '/report') {
      navigate('/report/before');
    } else {
      navigate(`/report/${ReportPageActive}`);
    }
  }, [ReportPageActive, navigate]);

  const handleButtonClick = (button) => {
    setActiveButton(button);
    sessionStorage.setItem('ReportPageActive', button)
    setIsFormOpen(false);
  };

  return (
    <div className="relavtive p-5">
      <div
      className='flex flex-start mt-28 fixed left-2.5 top-2.5 z-10'
      >
        <div
        className='flex gap-2.5 mb-5'>
          <button
            className={`bg-hover border border-borderHover text-white py-2 px-4 rounded-md ${ReportPageActive === 'before' ? 'bg-primary borderPrimary' : ''}`} 
            onClick={() => handleButtonClick('before')}
          >
            신고 전
          </button>
          <button
            className={`bg-hover border border-borderHover text-white py-2 px-4 rounded-md ${ReportPageActive === 'after' ? 'bg-primary borderPrimary' : ''}`} 
            onClick={() => handleButtonClick('after')}
          >
            신고 후
          </button>
        </div>
      </div>
      <Outlet/>
    </div>
  );
};

export default ReportPage;
