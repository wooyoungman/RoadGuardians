import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import '../styles/LinkPage.css';
import Complete_work from '../assets/Complete_work.png';
import Before_work from '../assets/Before_work.png';
import Ongoing_work from '../assets/Ongoing_work.png';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";


const getStatusClass = (status) => {
  switch (status) {
    case 'before':
      return 'before';
    case 'ongoing':
      return 'ongoing';
    case 'complete':
      return 'complete transparent';
    default:
      return '';
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'before':
      return '작업 전';
    case 'ongoing':
      return '작업 중';
    case 'complete':
      return '작업 완료';
    default:
      return '';
  }
};

const AfterLink = () => {
  const [beforeList, setBeforeList] = useState([]);
  const [ongoingList, setOngoingList] = useState([]);
  const [completeList, setCompleteList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [locationNames, setLocationNames] = useState({});
  const [newDB, setNewDB] = useState(false); 

  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

  const reverseGeocode = useCallback(async (lat, lon, id) => {
    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}&language=ko`);
      const { results } = response.data;
      if (results && results.length > 0) {
        const { formatted_address } = results[0];
        setLocationNames(prev => ({ ...prev, [id]: formatted_address }));
      } else {
        setLocationNames(prev => ({ ...prev, [id]: '위치 정보를 찾을 수 없습니다.' }));
      }
    } catch (error) {
      console.error('역지오코딩 오류:', error);
      setLocationNames(prev => ({ ...prev, [id]: '역지오코딩 오류' }));
    }
  }, [apiKey]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetching data for 'before', 'ongoing', and 'complete'
        const [beforeResponse, ongoingResponse, completeResponse] = await Promise.all([
          axios.get('https://i11c104.p.ssafy.io/api/v1/repair?status=before'),
          axios.get('https://i11c104.p.ssafy.io/api/v1/repair?status=ongoing'),
          axios.get('https://i11c104.p.ssafy.io/api/v1/repair?status=complete')
        ]);

        setBeforeList(beforeResponse.data);
        setOngoingList(ongoingResponse.data);
        setCompleteList(completeResponse.data);

        // Fetch location names for all items
        [...beforeResponse.data, ...ongoingResponse.data, ...completeResponse.data].forEach(item => {
          const coordinates = item.pothole.location.match(/POINT \(([^ ]+) ([^ ]+)\)/);
          if (coordinates) {
            const lon = coordinates[1];
            const lat = coordinates[2];
            reverseGeocode(lat, lon, item.repairId);
          }
        });
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [reverseGeocode, newDB]);

  useEffect(() => {
    const socket = new WebSocket('wss://i11c104.p.ssafy.io/ws'); // 보안 WebSocket wws
    
    console.log("WebSocket 연결 시도");

    socket.onopen = () => {
      console.log("WebSocket 연결 성공");
    };

    socket.onclose = (event) => {
      console.log("WebSocket 연결이 닫혔습니다:", event);
    };

    socket.onerror = (event) => {
      console.error("WebSocket 오류 발생:", event);
    };

    socket.onmessage = (event) => {
      console.log(event);
      if (event.data === 'newDB') {
        setNewDB(sync => !sync);
      }
    };

    return () => {
      socket.close();
    };
  }, []);


  const openOffcanvas = (item) => {
    setSelectedItem(item);
    setShowOffcanvas(true);
  };

  const closeOffcanvas = () => {
    setShowOffcanvas(false);
    setSelectedItem(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const renderSection = (imageSrc, list, sectionClass, slidesToShow = 3) => {
    const settings = {
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: slidesToShow,  // 한 슬라이드에 보여줄 아이템 수
      slidesToScroll: slidesToShow // 한 번에 넘길 슬라이드 수
    };

    const sortedList = [...list].sort((a, b) => b.repairId - a.repairId);
    
    return (
      <div className={`section-container ${sectionClass}`}>
        <img src={imageSrc} alt="Section" className="section-image mb-4" />
        {list.length === 0 ? (
          <div>데이터가 없습니다.</div>
        ) : (
          <Slider {...settings}>
            {sortedList.map((item) => (
              <div key={item.repairId} 
              className={`bg-white p-4 shadow-md rounded-lg mb-4 ${getStatusClass(item.status)} flex items-center`} onClick={() => openOffcanvas(item)}>
                {sectionClass !== 'complete-section' && (
                <img src={item.pothole.imageUrl} alt="Pothole" className="w-full h-40 object-cover rounded-lg mb-4" />
              )}
                <div className="w-full flex flex-col items-center">
                  <div className="after_link_information">

                    <p>위치: {locationNames[item.repairId] || 'Loading...'}</p>
                    <p>상태: {getStatusText(item.status)}</p>
                    <p>연계 부서: {item.department.deptName}</p>
                    <p>수리 시간: {item.repairAt}</p>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        )}
      </div>
    );
  };
  

  return (
    <div className="after_container_box">
      {showOffcanvas && <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={closeOffcanvas}></div>}
      <h1 className="text-2xl font-bold mb-4 text-black">연계 내역</h1>
      {renderSection(Before_work, beforeList, "before-section")}
      {renderSection(Ongoing_work, ongoingList, "ongoing-section")}
      {renderSection(Complete_work, completeList, "complete-section", 5)}
      {selectedItem && (
        <div className={`offcanvas ${showOffcanvas ? 'show' : ''}`}>
          <div className="offcanvas-body">
            <div className="flex justify-between items-center mb-4">
              <div className='afterlink_title'>
              <h3 className="offcanvas-title text-3xl font-bold">포트홀 상세 정보</h3>
              <p>{selectedItem.repairId}</p>
              </div>
              
              <button type="button" className="text-gray-500 hover:text-gray-700" onClick={closeOffcanvas}>
                &times;
              </button>
            </div>
            <img src={selectedItem.pothole.imageUrl} alt="포트홀 이미지" className="beforelink_image"  />
            <div className="modal-text text-gray-800">
              <p className="py-2 text-lg font-bold"><p className='beforelink_address'>주소</p> {locationNames[selectedItem.repairId] || 'Loading...'}</p>
              <p className="py-2 text-lg font-bold"><p className='beforelink_time'>연계 부서</p> {selectedItem.department.deptName}</p>
              <p className="py-2 text-lg font-bold"><p className='beforelink_time'>수리 시간</p> {selectedItem.repairAt}</p>
              <p className="py-2 text-lg font-bold"><p className='beforelink_state'>연계 상태</p> {selectedItem.status ? "✅" : "❌"}</p>
            </div>
            <button onClick={closeOffcanvas} className="afterlink_button">
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AfterLink;

