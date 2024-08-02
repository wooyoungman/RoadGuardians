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
        className="bg-white rounded-lg shadow-lg p-4 w-3/5 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <header className='flex justify-between items-center mb-4'>
          <h3 className="text-lg font-semibold">적재 불량 차량 신고서 작성</h3>
          <button
            onClick={isClose} 
            className="top-2 right-2 text-gray-600"
          >
            X
          </button>
        </header>


          <form
            className='flex-1 overflow-auto p-4'
            onSubmit={handleSubmit}
          >
            {/* 신고서 바디 */}
            <div
            className='border-solid border-2 border-zinc-700 text-sm'
            id='ReportForm'>
              <h1 className='p-4 border-solid border-b-2 border-zinc-700 text-left'>운행제한 위반 통지서</h1>

              {/* 그리드 시스템 7로 분할 */}
              <div className='grid grid-cols-7 items-center'>
                <label className='h-full w-15 content-center border-solid border-r-2 border-zinc-700'>관할구청</label>
                <div className='h-full w-25 content-center border-solid border-r-2 border-zinc-700'>광주광역시</div>
                {/* 관할구역 받기 */}
                <div className='col-span-2 h-full w-25 content-center border-solid border-r-2 border-zinc-700'>DB 받아서 넣기</div>

                <div className="grid col-span-3 grid grid-cols-3 h-full">
                  <label htmlFor="authorName" className="p-2 border-r-2 border-zinc-700">작성자</label>
                  {/* 담당자 입력 그룹 */}
                  <input
                    id="authorName"
                    name="authorName"
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="col-span-2 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-center" 
                  />
                </div>

                <div className='border-solid border-t-2 border-e-2 border-zinc-700 h-full content-center'>
                  위반내용
                </div>
                {/* 1:6 */}
                <div className='col-span-6 border-solid border-t-2 border-zinc-700'>
                {/* 차량 번호, 적발 일자 */}
                  <div className='grid grid-cols-6 border-solid border-b-2 border-zinc-700'>
                    <div className='p-2 content-center border-solid border-e-2 border-zinc-700'>차량 번호</div>
                    <div className='p-2 content-center col-span-2 border-solid border-e-2 border-zinc-700'>DB 받아서 넣기</div>
                    <div className='p-2 content-center border-solid border-e-2 border-zinc-700'>적발 일자</div>
                    <div className='p-2 content-center col-span-2'>DB 받아서 넣기</div>
                  </div>
                  <div className='grid grid-cols-6 border-solid border-b-2 border-zinc-700'>
                    <div className='p-2 border-solid border-e-2 border-zinc-700'>단속 유형</div>
                    {/* 선택 가능한 select */}
                    <select className='p-2 col-span-2 text-center border-solid border-e-2 border-zinc-700'>
                      <option value="v1">길이 위반</option>
                      <option value="v2">너비 위반</option>
                      <option value="v3">높이 위반</option>
                    </select>
                    <div className='p-2 border-solid border-e-2 border-zinc-700'>적발 시간</div>
                    <div className='p-2 content-center col-span-2'>DB 받아서 넣기</div>
                  </div>
                  <div className='grid grid-cols-6 border-solid border-b-2 border-zinc-700'>
                    <div className='p-2 border-solid border-e-2 border-zinc-700'>적발 지역</div>
                    <div className='p-2 col-span-5 content-center'>
                      <div>
                        DB 받아서 넣기
                        37.898989, 36.213123
                      </div>
                      <div>
                        광주광역시 광산구 하남대로 1234
                        DB 받아서 넣기
                      </div>
                    </div>
                  </div>
                  <div className='grid grid-cols-6'>
                    <div className='p-2 border-solid border-e-2 border-zinc-700'>위반 사진</div>
                    <div className='p-2 col-span-5 content-center'>
                      DB 받아서 넣기
                    </div>
                  </div>
                </div>
              </div>
              <div className='p-4 border-solid border-t-2 border-zinc-700'>
                「대기관리권역의 대기환경개선에 관한 특별법 제 조」 29 및 「광주광역시 공해 차량제한지역 지정 및 운행제한에 관한 조례 제 조」 4 의거 서울시 공해차량제한지역에서 운행하다가 단속되었기에 「운행제한 위반 통지서」를 발부합니다.
              </div>
              <div className='px-4'>
                ※ 처음 1회 위반시에는 저공해조치 기간 등을 고려하여 30일 동안 행정지도하나 그 이후 위반시에는 매 위반시마다 20만원의 과태료가 부과됨을 알려드립니다.
              </div>
              <div className='px-4'>
                ※ 이 통지에 이의가 있으시면 관련 증빙자료를 첨부하여 00년 0월 0일까지 광주광역시 차량공해저감과로 제출 또는 (FAX 062-xxxx-xxxx) 바랍니다.
              </div>

              <div className='ps-4 pt-4 text-left'>
                ☏ 문의전화 : 광주광역시 차량공해저감과 (062-xxxx-xxxx)
              </div>

              {/* 날짜 */}
              <div className='text-xl p-8 content-center '>
                2024년 08월 17일
              </div>
              {/* 시청 */}
              <div className='text-xl pb-8'>
                광 주 광 역 시 장
              </div>

              <div className='p-2 border-solid border-t-2 border-zinc-700 text-left'>
                ※ 첨부 : 위반사실 근거자료
              </div>
            </div>
            {/* 버튼 그룹 */}
            <div className='flex justify-between'>
              <div className='ps-8 content-center'>
                정말 제출하시겠습니까?
              </div>
              <div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="m-4 bg-primary border border-borderPrimary text-white py-2 px-4 rounded-md hover:bg-hover hover:border-borderHover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  {isSubmitting ? '제출 중...' : '네'}
                </button>
                <button 
                  onClick={isClose} 
                  className="my-4 bg-hover border border-borderHover text-white py-2 px-4 rounded-md hover:bg-primary hover:border-borderPrimary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
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

export default ReportForm;
