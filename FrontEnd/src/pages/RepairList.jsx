import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Slider from "react-slick";
import '../styles/RepairList.css';

const fetchData = async () => {
  const deptId = localStorage.getItem('deptId'); // 저장된 deptId 가져오기
  const [beforeResponse, ongoingResponse] = await Promise.all([
    axios.get('https://i11c104.p.ssafy.io/api/v1/repair?status=before'),
    axios.get('https://i11c104.p.ssafy.io/api/v1/repair?status=ongoing'),
  ]);

  let departmentNameFilter = '';
  switch (parseInt(deptId, 10)) {
    case 2:
      departmentNameFilter = '광산구';
      break;
    case 3:
      departmentNameFilter = '동구';
      break;
    case 4:
      departmentNameFilter = '서구';
      break;
    case 5:
      departmentNameFilter = '남구';
      break;
    case 6:
      departmentNameFilter = '북구';
      break;
    default:
      departmentNameFilter = ''; // 필터링 없이 전체 데이터를 가져옴
  }

  const allData = [
    ...beforeResponse.data,
    ...ongoingResponse.data,
  ];

  const filteredData = allData.filter(item => 
    item.department.deptName.includes(departmentNameFilter)
  );

  const uniqueData = filteredData.filter((item, index, self) =>
    index === self.findIndex((t) => t.repairId === item.repairId)
  );

  return uniqueData;
};

const geocodeLocation = async (lat, lon) => {
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY; // 환경 변수에서 API 키 가져오기
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}&language=ko`
    );
    const { results } = response.data;
    if (results && results.length > 0) {
      return results[0].formatted_address; // 주소 반환
    } else {
      return '위치 정보를 찾을 수 없습니다.';
    }
  } catch (error) {
    console.error('지오코딩 오류:', error);
    return '지오코딩 오류';
  }
};

const ReportList = () => {
  const [beforeList, setBeforeList] = useState([]); 
  const [ongoingList, setOngoingList] = useState([]);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isRepairStarted, setIsRepairStarted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [newDB, setNewDB] = useState(false); // websocket
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchDataEffect = async () => {
      try {
        const uniqueData = await fetchData();

        const beforeListWithAddress = await Promise.all(
          uniqueData.filter(item => item.status === 'before').map(async (item) => {
            const coordinates = item.pothole.location.match(/POINT \(([^ ]+) ([^ ]+)\)/);
            if (coordinates) {
              const lon = coordinates[1];
              const lat = coordinates[2];
              const address = await geocodeLocation(lat, lon);
              return { ...item, pothole: { ...item.pothole, address } };
            }
            return item;
          })
        );

        const ongoingListWithAddress = await Promise.all(
          uniqueData.filter(item => item.status === 'ongoing').map(async (item) => {
            const coordinates = item.pothole.location.match(/POINT \(([^ ]+) ([^ ]+)\)/);
            if (coordinates) {
              const lon = coordinates[1];
              const lat = coordinates[2];
              const address = await geocodeLocation(lat, lon);
              return { ...item, pothole: { ...item.pothole, address } };
            }
            return item;
          })
        );

        const sortedBeforeList = beforeListWithAddress.sort((a, b) => b.repairId - a.repairId);
        const sortedOngoingList = ongoingListWithAddress.sort((a, b) => b.repairId - a.repairId);

        setBeforeList(beforeListWithAddress);
        setOngoingList(ongoingListWithAddress);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDataEffect();
  }, [newDB]);
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


  const openModal = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
    setIsRepairStarted(false);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
  };

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3
  };

  const handleStartClick = async () => {
    if (selectedItem) {
      try {
        await axios.post('https://i11c104.p.ssafy.io/api/v1/repair/start', {
          repairId: [selectedItem.repairId],
        });
        const uniqueData = await fetchData();
        setList(uniqueData);
        setIsRepairStarted(true);
        setSelectedItem((prevItem) => ({ ...prevItem, status: 'ongoing' }));
      } catch (error) {
        console.error('Failed to start repair:', error);
      }
    }
  };

  const handleCompleteClick = async () => {
    if (selectedItem) {
      try {
        await axios.post('https://i11c104.p.ssafy.io/api/v1/repair/end', {
          repairId: [selectedItem.repairId],
        });
        const uniqueData = await fetchData();
        setList(uniqueData.filter(item => item.status !== 'complete'));
        setSelectedItem((prevItem) => ({ ...prevItem, status: 'complete' }));
        setIsRepairStarted(false);
        closeModal();
      } catch (error) {
        console.error('Failed to complete repair:', error);
      }
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = list.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(list.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="repair_list_box">
      <h1 className="work_page_title">작업 페이지⛑</h1>

      <div className='before_work_box'>
        <h2 className="before_title"> 작업 전</h2>
        {beforeList.length === 0 ? (
          <h1>데이터가 없습니다🤔</h1>
        ) : (
          <Slider {...sliderSettings}>
            {beforeList.map((item) => (
              <div
                key={item.repairId}
                className={`before_work_information_box`}
                onClick={() => openModal(item)}
              >
                <div>
                <img src={item.pothole.imageUrl} alt="Pothole" className="w-full h-40 object-cover rounded-lg mb-4" />
                <div className="w-full">
                  <div className="before_work_information">
                    <p>위치: {item.pothole.address || item.pothole.location}</p> {/* 지오코딩된 주소 또는 기본 위치 표시 */}
                    <p>상태: 작업 전</p>
                    <p>연계 승인 시각: {item.repairAt ? new Date(item.repairAt).toLocaleString() : 'Unknown'}</p>
                  </div>
                </div>
                </div>
              </div>
            ))}
          </Slider>
        )}
      </div>

      <h2 className="ongoing_title">작업 중</h2>
      {ongoingList.length === 0 ? (
        <div>데이터가 없습니다🤔</div>
      ) : (
        <Slider {...sliderSettings}>
          {ongoingList.map((item) => (
            <div
              key={item.repairId}
              className="ongoing_work_information_box"
              onClick={() => openModal(item)}
            >
              <img src={item.pothole.imageUrl} alt="Pothole" className="w-full h-40 object-cover rounded-lg mb-4" />
              <div className="w-full">
                <div className="ongoing_work_information">
                  <p>위치: {item.pothole.address || item.pothole.location}</p> {/* 지오코딩된 주소 또는 기본 위치 표시 */}
                  <p>상태: 작업 중</p>
                  <p>연계 승인 시각: {item.repairAt ? new Date(item.repairAt).toLocaleString() : 'Unknown'}</p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      )}

      {isModalOpen && selectedItem && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <header className="modal-header">
              <h2 className="text-3xl font-semibold">상세 정보</h2>
              <p>{selectedItem.repairId}</p>
              <button onClick={closeModal} className="text-gray-1000">
                &times;
              </button>
            </header>
            <img
              src={selectedItem.pothole.imageUrl}
              alt="이미지"
              className="modal-image mb-4"
            />
            
            <div className="modal-text">
              <p>위치: {selectedItem.pothole.address || selectedItem.pothole.location}</p> {/* 지오코딩된 주소 또는 기본 위치 표시 */}
              <p>상태: {selectedItem.status === 'before' ? '작업 전' : selectedItem.status === 'ongoing' ? '작업 중' : selectedItem.status}</p>
              <p>
                연계 승인 시각:{' '}
                {selectedItem.repairAt
                  ? new Date(selectedItem.repairAt).toLocaleString()
                  : 'Unknown'}
              </p>
            </div>
            <div className="modal-footer">
              {selectedItem.status === 'before' && !isRepairStarted && (
                <button onClick={handleStartClick} className="report-button">
                  시작하기
                </button>
              )}
              {((selectedItem.status === 'before' && isRepairStarted) ||
                selectedItem.status === 'ongoing' ||
                selectedItem.status === 'during') && (
                <button onClick={handleCompleteClick} className="complete-button">
                  보수완료
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportList;

