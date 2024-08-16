import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LinkModal from '../components/LinkModal';
import LinkDeleteModal from '../components/LinkDeleteModal';
import binIcon from '../assets/bin.png';
import '../styles/LinkPage.css';

const groupByDate = (items) => {
  return items.reduce((acc, item) => {
    const date = item.detectAt.split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {});
};

const BeforeLink = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [geocodedAddresses, setGeocodedAddresses] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [deptName, setDeptName] = useState('');  // 부서 이름 상태 추가
  const [newDB, setNewDB] = useState(false); // websocket

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // 페이지네이션 관련 변수
  const totalItems = list.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedList = list.slice(startIndex, startIndex + itemsPerPage);

  // 페이지 변경 함수
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

  const reverseGeocode = async (lat, lon, potholeId) => {
    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}&language=ko`);
      const { results } = response.data;
      if (results && results.length > 0) {
        const { formatted_address, address_components } = results[0];
        setGeocodedAddresses(prev => ({ ...prev, [potholeId]: formatted_address }));

        // 부서 이름 추출 및 설정
        const district = address_components.find(component => component.types.includes('sublocality_level_1') || component.types.includes('locality'));
        if (district) {
          setDeptName(district.long_name);
        } else {
          setDeptName('정보 없음');
        }
      } else {
        setGeocodedAddresses(prev => ({ ...prev, [potholeId]: '주소를 찾을 수 없습니다.' }));
        setDeptName('정보 없음');
      }
    } catch (error) {
      console.error('역지오코딩 오류:', error);
      setGeocodedAddresses(prev => ({ ...prev, [potholeId]: '역지오코딩 오류' }));
      setDeptName('역지오코딩 오류');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://i11c104.p.ssafy.io/api/v1/pothole?confirm=false');
        const uniqueData = response.data.filter((item, index, self) => 
          index === self.findIndex((t) => t.potholeId === item.potholeId)
        );
        const sortedData = uniqueData.sort((a, b) => new Date(b.detectAt) - new Date(a.detectAt));
        setList(sortedData);

        // 각 항목에 대해 역지오코딩 수행
        sortedData.forEach(item => {
          const coordinates = item.location.match(/POINT \(([^ ]+) ([^ ]+)\)/);
          if (coordinates) {
            const lon = coordinates[1];
            const lat = coordinates[2];
            reverseGeocode(lat, lon, item.potholeId);
          }
        });

      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  useEffect(() => {
    if (showOffcanvas || isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [showOffcanvas, isModalOpen]);

  const openOffcanvas = (item) => {
    setSelectedItem(item);
    setShowOffcanvas(true);
  };

  const closeOffcanvas = () => {
    setShowOffcanvas(false);
    setSelectedItem(null);
  };

  const modalOpenClick = () => {
    setModalOpen(true);
  };

  const modalCloseClick = () => {
    setModalOpen(false);
  };

  const deleteModalOpenClick = () => {
    setDeleteModalOpen(true);
  };
  
  const deleteModalCloseClick = () => {
    setDeleteModalOpen(false);
  };
  
  const groupedItems = groupByDate(paginatedList);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="before_container_box">
      {showOffcanvas && <div className="fixed inset-0 bg-black bg-opacity-50 z-20" onClick={closeOffcanvas}></div>}
      <div className="post-list flex justify-center">
        <div>
          {Object.keys(groupedItems).map((date) => (
            <div key={date} >
              <h2 className="text-3xl font-bold py-8 text-black">{date}</h2>
              <div className='grid grid-cols-2 gap-5'>
                {groupedItems[date].map((item) => (
                  <div key={item.potholeId} className="post-item p-5 grid-span-1 my-1" onClick={() => openOffcanvas(item)}>
                    <img src={item.imageUrl} alt="Pothole Image" className="post-image" />
                    <div className="before_link_information">
                      <div>
                        <div className='before_link_time'>발견 시각 </div>
                        <div className='before_link_information1'>
                          {new Date(item.detectAt).toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className='before_link_where'>위치 </div>
                        <div className='before_link_information2'>
                          {geocodedAddresses[item.potholeId] || '위치 정보를 불러오는 중...'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* 페이지네이션 */}
          <div className="link-pagination-container">
            <div className="link-pagination">
              <button
                className={`link-pagination-arrow prev ${currentPage === 1 ? 'disabled' : ''}`}
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >

              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  className={`link-pagination-number ${currentPage === index + 1 ? 'active' : ''}`}
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
              <button
                className={`link-pagination-arrow next ${currentPage === totalPages ? 'disabled' : ''}`}
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >

              </button>
            </div>
          </div>
        </div>

        {/* 오프캔버스 */}
        <div className={`fixed flex flex-col justify-between top-0 right-0 h-full bg-white text-black shadow-lg z-30 transform ${showOffcanvas ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300`}>
          <div>
            {/* 헤더 */}
            <div className="offcanvas-header flex justify-between items-center p-4 border-b">
              {selectedItem && (
                <div className='flex items-center'>
                  <h5 className="offcanvas-title text-3xl font-bold">포트홀 상세 정보</h5>
                  <p className="text-lg text-gray-400 ps-2 pt-4">{selectedItem.potholeId}</p>
                </div>
              )}
              <div>
                <button onClick={deleteModalOpenClick} className="bg-transparent">
                  <img src={binIcon} alt="" className='w-8 h-auto me-4'/>
                </button>
                <button type="button" className="btn-close top-2 right-2 text-gray-600" aria-label="Close" onClick={closeOffcanvas}>X</button>
              </div>
            </div>
            
            {/* 바디 파트 */}
            <div className="offcanvas-body flex flex-col p-4">
              {selectedItem && (
                <div>
                  <img src={selectedItem.imageUrl} alt="해당 포트홀의 이미지" className="beforelink_image" />
                  <div className='before_link_offcanvas'>
                    <p className="py-2 text-lg font-bold"><p className='beforelink_time'>발견 시각</p>{new Date(selectedItem.detectAt).toLocaleString()}</p>
                    <p className="py-2 text-lg font-bold"><p className='beforelink_address'>주소</p> {geocodedAddresses[selectedItem.potholeId] || '위치 정보를 불러오는 중...'}</p>
                    <p className="py-2 text-lg font-bold"><p className='beforelink_where'>위치</p>{`위도 : (${selectedItem.location ? selectedItem.location.split(' ')[2] : ''}, 경도 : ${selectedItem.location ? selectedItem.location.split(' ')[1] : ''})`}</p>
                    <p className="py-2 text-lg font-bold"><p className='beforelink_state'>연계 상태</p>{selectedItem.confirm ? "✅" : "❌"}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* 연계 버튼 */}
          <button onClick={modalOpenClick} className="beforelink_button">작업 지시하기</button>
        </div>

        <LinkDeleteModal isOpen={isDeleteModalOpen} isClose={deleteModalCloseClick} selectedItem={selectedItem} />
        <LinkModal isOpen={isModalOpen} isClose={modalCloseClick} selectedItem={selectedItem} deptName={deptName} />
      </div>
    </div>
  );
};

export default BeforeLink;

