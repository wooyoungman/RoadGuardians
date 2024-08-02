import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import ReportForm from '../components/ReportForm';

const ReportPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const formOpenClick = () => {
    setIsFormOpen(true);
  };
  
  const formCloseClick = () => {
    setIsFormOpen(false);
  };
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">신고 접수 페이지</h1>
      <p className="mb-4">여기에 신고 접수 전 페이지 내용이 들어갑니다.</p>
      <br />
      <div className='flex justify-between'>
        <button onClick={formOpenClick} className="bg-primary border border-borderPrimary text-white py-2 px-4 rounded-md hover:bg-hover hover:border-borderHover focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          (임시)클릭 시, 신고서 작성 버튼
        </button>
        <NavLink to="/report/after">
          <button className='ms-16 bg-primary border border-borderPrimary text-white py-2 px-4 rounded-md hover:bg-hover hover:border-borderHover focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'>
              신고 후 페이지
          </button>
        </NavLink>
      </div>

      <ReportForm isOpen={isFormOpen} isClose={formCloseClick} />
    </div>
  );
};

export default ReportPage;
