import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import axios from 'axios';

const ReportForm = ({ isOpen, isClose, selectedItem }) => {
  const [authorName, setAuthorName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationName, setLocationName] = useState('DB 받아서 넣기');
  const [deptName, setDeptName] = useState('DB 받아서 넣기');
  const navigate = useNavigate();

  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

  const formatDate = (dateString) => {
    if (!dateString) return 'DB 받아서 넣기';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    }).replace(/\./g, '.').replace(/\s/g, ' ');
  };

  const reverseGeocode = async (lat, lon) => {
    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}&language=ko`);
      const { results } = response.data;
      console.log(response)
      if (results && results.length > 0) {
        const { formatted_address, address_components } = results[0];
        setLocationName(formatted_address);

        const district = address_components.find(component => component.types.includes('sublocality_level_1') || component.types.includes('locality'));
        if (district) {
          setDeptName(district.long_name);
        } else {
          setDeptName('정보 없음');
        }
      } else {
        setLocationName('위치 정보를 찾을 수 없습니다.');
        setDeptName('정보 없음');
      }
    } catch (error) {
      console.error('역지오코딩 오류:', error);
      setLocationName('역지오코딩 오류');
      setDeptName('역지오코딩 오류');
    }
  };

  useEffect(() => {
    if (selectedItem) {
      const coordinates = selectedItem.location.match(/POINT \(([^ ]+) ([^ ]+)\)/);
      if (coordinates) {
        const lon = coordinates[1];
        const lat = coordinates[2];
        reverseGeocode(lat, lon);
      }
    }
  }, [selectedItem]);

  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsSubmitting(false);
      isClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const pngFileHTML = document.getElementById('ReportForm');

    try {
      const canvas = await html2canvas(pngFileHTML);
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));

      const formData = new FormData();
      formData.append('image', blob, `${selectedItem?.overloadId}.png`);
      const data = {
        overloadId: selectedItem?.overloadId,
        username: authorName,
      };
      
      // JSON 문자열로 변환하여 FormData에 추가
      formData.append('data', JSON.stringify(data));      

      const response = await fetch('https://i11c104.p.ssafy.io/api/v1/overload/report', { // 엔드 포인트에 맞게
        method: 'POST',
        mode: "cors",
        body: formData,
      });
      
      console.log(formData);

      if (response.ok) {
        isClose();
        alert('신고가 접수되었습니다.');
        navigate('/report')
      } else {
        console.log(formData);
        alert('서버에 문제가 발생했습니다.');
      }
    } catch (error) {
      alert('서버에 문제가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-30 z-50"
      onClick={handleBackgroundClick}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-4 w-3/5 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
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
          <div
            className='flex-1 border-solid border-2 border-zinc-700 text-sm text-black'
            id='ReportForm'
          >
            <h1 className='p-4 border-solid border-b-2 border-zinc-700 text-left'>운행제한 위반 통지서</h1>
            <div className='grid grid-cols-7 items-center content-center'>
              <label className='h-full content-center border-solid border-r-2 border-zinc-700'>관할구청</label>
              <div className='h-full content-center border-solid border-r-2 border-zinc-700'>광주광역시</div>
              <div className='col-span-2 h-full content-center border-solid border-r-2 border-zinc-700'>{deptName}</div>
              <div className="grid col-span-3 grid grid-cols-3 h-full">
                <label htmlFor="authorName" className="p-2 border-r-2 border-zinc-700">작성자</label>
                <input
                  id="authorName"
                  name="authorName"
                  type="text"
                  placeholder='이름을 입력해주세요.'
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="col-span-2 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-center bg-white"
                />
              </div>
              <div className='border-solid border-t-2 border-e-2 border-zinc-700 h-full content-center'>
                위반내용
              </div>
              <div className='col-span-6 border-solid border-t-2 border-zinc-700'>
                <div className='grid grid-cols-6 border-solid border-b-2 border-zinc-700'>
                  <div className='p-2 content-center border-solid border-e-2 border-zinc-700'>차량 번호</div>
                  <div className='p-2 content-center col-span-2 border-solid border-e-2 border-zinc-700'>{selectedItem?.carNumber || 'DB 받아서 넣기'}</div>
                  <div className='p-2 content-center border-solid border-e-2 border-zinc-700'>적발 일자</div>
                  <div className='p-2 content-center col-span-2'>{formatDate(selectedItem?.detectAt)}</div>
                </div>
                <div className='grid grid-cols-6 border-solid border-b-2 border-zinc-700'>
                  <div className='p-2 border-solid border-e-2 border-zinc-700'>단속 유형</div>
                  <select className='p-2 col-span-2 text-center border-solid border-e-2 border-zinc-700 bg-white'>
                    <option value="v1">길이 위반</option>
                    <option value="v2">너비 위반</option>
                    <option value="v3">높이 위반</option>
                  </select>
                  <div className='p-2 border-solid border-e-2 border-zinc-700'>적발 시간</div>
                  <div className='p-2 content-center col-span-2'>{selectedItem?.detectAt ? new Date(selectedItem.detectAt).toLocaleTimeString() : 'DB 받아서 넣기'}</div>
                </div>
                <div className='grid grid-cols-6 border-solid border-b-2 border-zinc-700'>
                  <div className='p-2 content-center border-solid border-e-2 border-zinc-700'>적발 지역</div>
                  <div className='p-2 col-span-5 content-center'>
                    <div>
                      {locationName}
                    </div>
                  </div>
                </div>
                <div className='grid grid-cols-6'>
                  <div className='p-2 border-solid border-e-2 border-zinc-700'>위반 사진</div>
                  <div className='p-2 col-span-5 content-center'>
                    <img src={selectedItem?.imageUrl} alt="위반 사진" />
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
            <div className='text-xl p-8 content-center '>
              2024년 08월 17일
            </div>
            <div className='text-xl pb-8'>
              광 주 광 역 시 장
            </div>
            <div className='p-2 border-solid border-t-2 border-zinc-700 text-left'>
              ※ 첨부 : 위반사실 근거자료
            </div>
          </div>
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
                className="my-4 bg-primary border border-borderPrimary text-white py-2 px-4 rounded-md hover:bg-hover hover:border-borderHover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
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