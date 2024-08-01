import React, { useState } from 'react';

const ReportForm = ({ isOpen, isClose }) => {
  const [authorName, setAuthorName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 모달처럼 보이게 백그라운드 클릭시 창이 꺼지게
  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      isClose();
    }
  };

  // axios POST 요청과 함께, render 변경
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/report', { // 서버의 엔드포인트에 맞게 수정
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ authorName }),
      });

      if (response.ok) {
        alert('신고가 접수되었습니다.');
        isClose();
      } else {
        alert('서버에 문제가 발생했습니다.');
      }
    }
  catch (error) {
      console.error('Error:', error);
      alert('서버에 문제가 발생했습니다.');
    }
  finally {
      setIsSubmitting(false);
    }
  };

  // 켜지지 않았을 경우, null값으로 가지고 있는다.
  if (!isOpen) return null;
  
  return (
    // 모달 백그라운드
    <div 
      className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50" 
      onClick={handleBackgroundClick}
    >
      {/* 모달 바디 */}
      <div 
        className="bg-white rounded-lg shadow-lg p-4 w-2/5 h-3/5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <header className='flex justify-between mb-4'>
          <h3 className="text-lg font-semibold">적재 불량 차량 신고서 작성</h3>
          <button
            onClick={isClose} 
            className="top-2 right-2 text-gray-600 hover:text-gray-900"
          >
            X
          </button>
        </header>


          <form>
            {/* 신고서 바디 */}
            <div className='border-solid border-2 border-zinc-700'>
              <h1 className='border-solid border-2 border-b-zinc-700'>운행제한 위반 통지서</h1>

              {/* 첫 Column */}
              <div className='flex'>
                <label className='block text'>관할구청</label>
                <div>광주광역시</div>
                <div>광산구청</div>

                <div className="mb-4 flex">
                  <label htmlFor="authorName" className="inline text-sm font-medium text-gray-700 text-left">작성자</label>
                  <textarea 
                    id="authorName"
                    name="authorName"
                    type="text" 
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="mt-1 inline w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                  />
                </div>
              </div>


              {/* 담당자 입력 그룹 */}
              <div>
                위반내용
                <div>

                </div>
              </div>



            </div>
            {/* 버튼 그룹 */}
            <div className='flex justify-end'>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="m-2 bg-primary border border-borderPrimary text-white py-2 px-4 rounded-md hover:bg-hover hover:border-borderHover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                {isSubmitting ? '제출 중...' : '네'}
              </button>
              <button 
                onClick={isClose} 
                className="ms-2 my-2 bg-hover border border-borderHover text-white py-2 px-4 rounded-md hover:bg-primary hover:border-borderPrimary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                아니요
              </button>
            </div>
          </form>



      </div>

    </div>
  );
};

export default ReportForm;
