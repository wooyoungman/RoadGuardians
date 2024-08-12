import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LinkModal = ({ isOpen, isClose, selectedItem, deptName }) => {
  const [deptId, setDeptId] = useState('');
  const [potholeId, setPotholeId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedItem) {
      setPotholeId(selectedItem.potholeId || '');
    }
  }, [selectedItem]);

  useEffect(() => {
    const deptMapping = {
      '광산구': 2,
      '동구': 3,
      '서구': 4,
      '남구': 5,
      '북구': 6,
    };

    if (deptName) {
      setDeptId(deptMapping[deptName] || '');
    }
  }, [deptName]);

  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      isClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!deptId) {
      alert('부서 ID가 설정되지 않았습니다. 작업 지시를 할 수 없습니다.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('https://i11c104.p.ssafy.io/api/v1/pothole/repair', {
        method: 'POST',
        body: JSON.stringify({
          potholeId: parseInt(potholeId),
          deptId: parseInt(deptId)
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        isClose();
        navigate('/beforeLink'); // 라우터 이동
        alert('작업 지시가 완료되었습니다.');
      } else {
        alert('서버에 문제가 발생했습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('서버에 문제가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50 modal-overlay" onClick={handleBackgroundClick}>
      <div className="bg-white rounded-lg shadow-lg p-4 w-2/5 h-1/5 flex flex-col z-100" onClick={(e) => e.stopPropagation()}>
        <header className='flex justify-between items-center mb-4'>
          <h3 className="text-lg font-semibold">포트홀 작업지시</h3>
          <button onClick={isClose} className="top-2 right-2 text-gray-600">X</button>
        </header>
        <form className='flex-1 p-4' onSubmit={handleSubmit}>
          <div className='flex justify-between'>
            <div>
              해당 포트홀 작업지시 하시겠습니까?
            </div>
            <div className='mt-4'>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-primary text-white py-2 px-4 rounded-md hover:bg-hover"
              >
                {isSubmitting ? '제출 중...' : '네'}
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
