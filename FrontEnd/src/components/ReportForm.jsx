import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import axios from 'axios';

const ReportForm = ({ isOpen, isClose, selectedItem, onFormSubmitted }) => {
  const [authorName, setAuthorName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationName, setLocationName] = useState('');
  const [deptName, setDeptName] = useState('');
  const [isAuthorValid, setIsAuthorValid] = useState(null);
  const navigate = useNavigate();

  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

  const formatDate = (dateString) => {
    if (!dateString) return '';
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
    if (selectedItem && selectedItem.location) {
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
  const handleChange = (e) => {
    setAuthorName(e.target.value)

    if (e.target.name === 'authorName') {
      setIsAuthorValid(null);
    }
  };
  
  const handleAuthorCheck = async () => {
    if (authorName !== window.localStorage.getItem('name')) {
      alert('담당자 이름이 일치하지 않습니다!');
      setIsAuthorValid(false);
    } else {
      alert('담당자 확인에 성공하였습니다.');
      setIsAuthorValid(true); 
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isAuthorValid !== true) {
      alert('담당자를 확인해 주세요.');
      return;
    }

    if (!authorName.trim()) {
      alert('담당자 정보가 없습니다!')
      return;
    }

    setIsSubmitting(true);

    const pngFileHTML = document.getElementById('ReportForm');

    try {
      const canvas = await html2canvas(pngFileHTML, {
        allowTaint: true,
        backgroundColor: '#ffffff',
        useCORS: true,
      });
      const dataURL = canvas.toDataURL('image/png')
      const blob = await (await fetch(dataURL)).blob();
      const data = {
        overloadId: selectedItem?.overloadId,
        id: window.localStorage.getItem('id'),

      };
      
      const formData = new FormData();
      formData.append('image', blob, `${selectedItem?.overloadId}.png`);
      // JSON 문자열로 변환하여 FormData에 추가
      formData.append('data', JSON.stringify(data));
      console.log(formData)

      // 콘솔에서 FormData 내용 확인
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }
      
      const response = await fetch('https://i11c104.p.ssafy.io/api/v1/overload/report', { // 엔드 포인트에 맞게
        method: 'POST',
        mode: "cors",
        body: formData,
      });

      if (response.ok) {
        isClose();
        await onFormSubmitted(); // 폼 제출 후 데이터 갱신 함수 호출
        alert('신고가 접수되었습니다.');
        navigate('/report/before')
      } else {
        console.log()
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
        className="bg-white rounded-lg shadow-lg p-4 flex flex-col"
        id="ReportFormDiv"
        onClick={(e) => e.stopPropagation()}
      >
        <header className='flex justify-between mt-4 mx-2'>
          <div className='flex items-center'>
            <h3 className="text-lg font-semibold">적재 불량 차량 신고서 작성</h3>
            <div className='text-sm text-gray-400 ps-2 pt-4'>{selectedItem.overloadId}</div>
          </div>
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
          {/* html2canvas Form */}
          <div
            className='border-2 border-zinc-700 text-sm text-black text-center'
            id='ReportForm'
          >
            {/* 리포트 상위 라인 */}
            <h1 className='p-4 border-2 border-zinc-700 text-left'>운행제한 위반 통지서</h1>
            <div className='grid grid-cols-7 items-center content-center'>
              <label className='h-full content-center border-s-2 border-r-2 border-zinc-700'>관할구청</label>
              <div className='h-full content-center border-r-2 border-zinc-700'>광주광역시</div>
              <div className='col-span-2 h-full content-center border-r-2 border-zinc-700'>{deptName}</div>
              <div className="col-span-3 grid grid-cols-6 gap-0 h-full border-r-2 border-zinc-700">
                <label htmlFor="authorName" className="col-span-2 p-2 box-border border-r-2 border-zinc-700">작성자</label>
                <div className='col-span-3 flex items-center'>
                  <input
                    id="authorName"
                    name="authorName"
                    type="text"
                    placeholder='이름을 입력해주세요.'
                    value={authorName}
                    onChange={handleChange}
                    className="text-center bg-transparent focus:outline-none"
                  />
                </div>
                <button
                className={`col-span-1 text-red-600 rounded-full hover:border-none hover:bg-red-500 hover:text-white ${isAuthorValid ? 'border-2 border-red-600' : ''}`}
                type="button" onClick={handleAuthorCheck}>인</button>
              </div>
              <div className='border-2 border-zinc-700 h-full content-center'>
                위반내용
              </div>
              <div className='col-span-6 border-solid border-t-2 border-zinc-700'>
                <div className='grid grid-cols-6 border-solid border-b-2 border-zinc-700'>
                  <div className='p-2 content-center border-solid border-e-2 border-zinc-700'>차량 번호</div>
                  <div className='p-2 content-center col-span-2 border-solid border-e-2 border-zinc-700'>{selectedItem?.carNumber || 'DB 받아서 넣기'}</div>
                  <div className='p-2 content-center border-solid border-e-2 border-zinc-700'>적발 일자</div>
                  <div className='p-2 content-center col-span-2 border-solid border-e-2 border-zinc-700'>{formatDate(selectedItem?.detectAt)}</div>
                </div>
                <div className='grid grid-cols-6 border-solid border-b-2 border-zinc-700'>
                  <div className='p-2 border-solid border-e-2 border-zinc-700'>단속 유형</div>
                  <select className='p-2 content-center col-span-2 text-center border-solid border-e-2 border-zinc-700 bg-white'>
                    <option value="v1">길이 위반</option>
                    <option value="v2">너비 위반</option>
                    <option value="v3">높이 위반</option>
                  </select>
                  <div className='p-2 border-solid border-e-2 border-zinc-700'>적발 시간</div>
                  <div className='p-2 content-center col-span-2 border-e-2 border-zinc-700'>{selectedItem?.detectAt ? new Date(selectedItem.detectAt).toLocaleTimeString() : 'DB 받아서 넣기'}</div>
                </div>
                <div className='grid grid-cols-6 border-solid border-b-2 border-zinc-700'>
                  <div className='p-2 content-center border-solid border-e-2 border-zinc-700'>적발 지역</div>
                  <div className='p-2 col-span-5 content-center border-e-2 border-zinc-700'>
                    {locationName}
                  </div>
                </div>
                <div className='grid grid-cols-6 border-solid border-b-2 border-zinc-700'>
                  <div className='flex justify-center items-center p-2 border-solid border-e-2 border-zinc-700'>위반 사진</div>
                  <div className='p-2 col-span-5 content-center border-e-2 border-zinc-700'>
                    <img src={selectedItem?.imageUrl} id='ReportImg' alt="해당 적발 내용에 대한 위반 사진입니다." />
                  </div>
                </div>
              </div>

              <div className='col-span-7 border-l-2 border-r-2 border-b-2 border-zinc-700'>
                <div className='p-4'>
                  ※ 해당 내용은 프로젝트를 위한 내용으로 작성되었으며, 이는 공문서 위조를 목적을 작성하지 않음을 밝힙니다.
                </div>
                <div className='px-4'>
                  「대기관리권역의 대기환경개선에 관한 특별법 제 *조」 ** 및 「광주광역시 공해 차량제한지역 지정 및 운행제한에 관한 조례 제 *조」 * 의거 광주광역시 공해차량제한지역에서 운행하다가 단속되었기에 「운행제한 위반 통지서」를 발부합니다.
                </div>
                <div className='px-4'>
                  ※ 처음 1회 위반시에는 저공해조치 기간 등을 고려하여 **일 동안 행정지도하나 그 이후 위반시에는 매 위반시마다 **만원의 과태료가 부과됨을 알려드립니다.
                </div>
                <div className='px-4'>
                  ※ 이 통지에 이의가 있으시면 관련 증빙자료를 첨부하여 **년 *월 *일까지 광주광역시 차량공해저감과로 제출 또는 (FAX 062-****-****) 바랍니다.
                </div>
                <div className='ps-4 pt-4 text-left'>
                  ☏ 문의전화 : 광주광역시 차량공해저감과 (062-****-****)
                </div>
                <div className='text-xl p-8 content-center '>
                  2024년 08월 16일
                </div>
                <div className='text-2xl pb-8'>
                  광 주 광 역 시 장
                </div>
              </div>

              <div className='col-span-7 p-2 border-l-2 border-r-2 border-b-2 border-zinc-700 text-left'>
                ※ 첨부 : 위반사실 근거자료
              </div>
            </div>
          </div>

          {/* 확인 버튼 section */}
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
