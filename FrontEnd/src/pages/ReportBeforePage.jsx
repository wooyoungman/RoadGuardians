import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReportForm from '../components/ReportForm';
import ReportDeleteModal from '../components/ReportDeleteModal';
import binIcon from '../assets/bin.png';
import './Report.css';

const groupByDate = (items) => {
  return items.reduce((acc, item) => {
    const date = item.detectAt ? item.detectAt.split('T')[0] : 'Unknown';
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {});
};

const ReportBeforePage = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [locationNames, setLocationNames] = useState({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [newDB, setNewDB] = useState(false); // websocket

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 1; 

  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

  const reverseGeocode = async (lat, lon, overloadId) => {
    console.log('역지오코딩 요청:', lat, lon);  // 좌표를 확인하는 로그
    try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}&language=ko`);
        console.log('역지오코딩 응답:', response.data);  // 응답을 확인하는 로그
        const { results } = response.data;
        if (results && results.length > 0) {
            const { formatted_address } = results[0];
            setLocationNames(prev => ({ ...prev, [overloadId]: formatted_address }));
        } else {
            setLocationNames(prev => ({ ...prev, [overloadId]: '주소를 찾을 수 없습니다.' }));
        }
    } catch (error) {
        console.error('역지오코딩 오류:', error);
        setLocationNames(prev => ({ ...prev, [overloadId]: '역지오코딩 오류' }));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://i11c104.p.ssafy.io/api/v1/overload?confirm=false');
        const uniqueData = response.data.filter((item, index, self) => 
          index === self.findIndex((t) => t.overloadId === item.overloadId)
        );
        const sortedData = uniqueData.sort((a, b) => new Date(b.detectAt) - new Date(a.detectAt));
        setList(sortedData);

        // Geocoding for each item
        sortedData.forEach(item => {
          const coordinates = item.location.match(/POINT \(([^ ]+) ([^ ]+)\)/);
          if (coordinates) {
            const lon = coordinates[1];
            const lat = coordinates[2];
            reverseGeocode(lat, lon, item.overloadId);
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

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  const formOpenClick = (item) => {
    setSelectedItem(item);
    setIsFormOpen(true);
  };

  const formCloseClick = () => {
    setIsFormOpen(false);
    setSelectedItem(null);
  };
  
  const deleteModalOpenClick = (item, event) => {
    event.stopPropagation();
    setSelectedItem(item);
    setDeleteModalOpen(true);
  };

  const deleteModalCloseClick = () => {
    setDeleteModalOpen(false);
    setSelectedItem(null);
  };

  const handleFormSubmitted = () => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://i11c104.p.ssafy.io/api/v1/overload?confirm=false');
        const uniqueData = response.data.filter((item, index, self) => 
          index === self.findIndex((t) => t.overloadId === item.overloadId)
        );
        setList(uniqueData);
      } catch (error) {
        setError(error);
      }
    };

    fetchData();
    setIsFormOpen(false);
    setSelectedItem(null);
  };

  const groupedItems = groupByDate(list);
  const totalPages = Math.ceil(Object.keys(groupedItems).length / itemsPerPage);
  const paginatedDates = Object.keys(groupedItems).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="report_before_box">
      <div className='post-list flex flex-col justify-center'>
        {paginatedDates.map((date) => (
          <div key={date}>
            <h2 className='text-3xl font-bold w-full py-8'>{date}</h2>
            <div className='grid grid-cols-2 gap-5'>
              {groupedItems[date].map((item) => (
                <div key={item.overloadId} onClick={() => formOpenClick(item)}
                  className='flex flex-col grid-span-1 border bg-white shadow-xl rounded-xl p-5 w-100 cursor-pointer'>
                  <div className='flex items-center'>
                    <img src={item.imageUrl} alt="ReportImg" className='me-5 w-56 h-full object-fit'/>
                    <div className='flex-1'>
                      <div className='text-right'>
                        <button
                          onClick={(event) => deleteModalOpenClick(item, event)}
                          className="hover:border-transparent"
                        >
                          <img src={binIcon} alt="" className='w-8 h-auto'/>
                        </button>
                      </div>
                      <div>
                        <div>
                          <p className='before_report'>발견 시각 </p>
                          <p className='m-1'>
                            {item.detectAt ? new Date(item.detectAt).toLocaleString() : 'Unknown'}
                          </p>
                        </div>
                        <div>
                          <p className='before_report'>위치 </p>
                          <p className='m-1'>
                            {locationNames[item.overloadId] || '위치 정보를 불러오는 중...'}
                          </p>
                        </div>
                        <div>
                          <p className='before_report'>차량 번호 </p>
                          <p className='m-1'>
                            {item.carNumber}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

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

      <ReportDeleteModal
        isOpen={isDeleteModalOpen}
        isClose={deleteModalCloseClick}
        selectedItem={selectedItem}
      />
      <ReportForm 
        isOpen={isFormOpen && !isDeleteModalOpen}
        isClose={formCloseClick} 
        selectedItem={selectedItem} 
        onFormSubmitted={handleFormSubmitted}
      />
    </div>
  );
};


export default ReportBeforePage;
