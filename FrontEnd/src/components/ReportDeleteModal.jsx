import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LinkModal = ({ isOpen, isClose, selectedItem }) => {
  const [overloadId, setOverloadId] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedItem) {
      setOverloadId(selectedItem.overloadId || '');
    }
  }, [selectedItem]);

  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      isClose();
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    setIsDeleting(true);

    try {
      const response = await fetch(`https://i11c104.p.ssafy.io/api/v1/overload/delete/${overloadId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        isClose();
        navigate('/report/before'); // 라우터 이동
        alert('해당 과적차량을 삭제했습니다.');
      } else {
        alert('서버에 문제가 발생했습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('서버에 문제가 발생했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50 modal-overlay" onClick={handleBackgroundClick}>
      <div className="bg-white rounded-lg shadow-lg p-4 w-2/5 h-1/5 flex flex-col z-100" onClick={(e) => e.stopPropagation()}>
        <header className='flex justify-between items-center mb-2 mx-2'>
          <div className='flex items-center'>
            <h3 className="text-lg font-bold">과적 차량 삭제</h3>
            <div className='text-sm text-gray-400 ps-2 pt-4'>
              {selectedItem.overloadId}
            </div>
          </div>
          <button onClick={isClose} className="top-2 right-2 text-gray-600">X</button>
        </header>
        <form className='p-4' onSubmit={handleDelete}>
          <div className='flex justify-between'>
            <div>
              과적 차량을 정말 삭제하시겠습니까?
            </div>
            <div className='mt-4'>
              <button 
                type="submit" 
                disabled={isDeleting}
                className="bg-primary text-white py-2 px-4 rounded-md hover:bg-hover"
              >
                {isDeleting ? '제출 중...' : '네'}
              </button>
              <button 
                onClick={isClose} 
                className="ms-4 bg-primary text-white py-2 px-4 rounded-md hover:bg-hover"
              >
                아니요
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LinkModal;
