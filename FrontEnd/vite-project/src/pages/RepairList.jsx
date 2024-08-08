import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/LinkPage.css';

const groupByDate = (items) => {
  return items.reduce((acc, item) => {
    const date = item.repairAt ? item.repairAt.split('T')[0] : 'Unknown';
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {});
};

const getStatusClass = (status) => {
  switch (status) {
    case 'before':
      return 'before';
    case 'ongoing':
    case 'during':
      return 'ongoing';
    case 'complete':
    case 'done':
      return 'complete transparent';
    default:
      return '';
  }
};

const fetchData = async () => {
  const [beforeResponse, ongoingResponse, completeResponse] = await Promise.all([
    axios.get('https://i11c104.p.ssafy.io/api/v1/repair?status=before'),
    axios.get('https://i11c104.p.ssafy.io/api/v1/repair?status=ongoing'),
    axios.get('https://i11c104.p.ssafy.io/api/v1/repair?status=complete'),
  ]);

  const allData = [
    ...beforeResponse.data,
    ...ongoingResponse.data,
    ...completeResponse.data,
  ];

  const uniqueData = allData.filter((item, index, self) => 
    index === self.findIndex((t) => t.repairId === item.repairId)
  );

  return uniqueData;
};

const ReportList = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isRepairStarted, setIsRepairStarted] = useState(false);
  const [showResetButton, setShowResetButton] = useState(false);

  useEffect(() => {
    const fetchDataEffect = async () => {
      try {
        const uniqueData = await fetchData();
        setList(uniqueData);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataEffect();

    const handleKeyPress = (event) => {
      if (event.key === 'R' || event.key === 'r') {
        setShowResetButton(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
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
        setList(uniqueData);
        setSelectedItem((prevItem) => ({ ...prevItem, status: 'complete' }));
        setIsRepairStarted(false);
        closeModal();
      } catch (error) {
        console.error('Failed to complete repair:', error);
      }
    }
  };

  const handleResetClick = () => {
    setSelectedItem(null);
    setModalOpen(false);
    setIsRepairStarted(false);
    setShowResetButton(false);
  };

  const groupedItems = groupByDate(list);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">작업 페이지</h1>
      {showResetButton && (
        <button onClick={handleResetClick} className="reset-button mb-4">
          상태 리셋
        </button>
      )}
      {list.length === 0 ? (
        <div>데이터가 없습니다.</div>
      ) : (
        <div>
          {Object.keys(groupedItems).map((date) => (
            <div key={date} className="mb-8">
              <h2 className="text-xl font-semibold mb-2">{date}</h2>
              {groupedItems[date].map((item) => (
                <div
                  key={item.repairId}
                  className={`bg-white p-4 shadow-md rounded-lg mb-4 ${getStatusClass(item.status)} flex items-center cursor-pointer`}
                  onClick={() => openModal(item)}
                >
                  <img src={item.pothole.imageUrl} alt="Pothole" className="w-1/3 h-40 object-cover rounded-lg mb-4" />
                  <div className="w-2/3 ml-4">
                    <div className="text-gray-800 mb-4">
                      <p>ID: {item.repairId}</p>
                      <p>Location: {item.pothole.location}</p>
                      <p>Status: {item.status}</p>
                      <p>Department: {item.department.deptName}</p>
                      <p>Repaired At: {item.repairAt ? new Date(item.repairAt).toLocaleString() : 'Unknown'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
      {isModalOpen && selectedItem && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <header className="modal-header">
              <h2 className="text-xl font-semibold">상세 정보</h2>
              <button onClick={closeModal} className="text-gray-600">
                &times;
              </button>
            </header>
            <img src={selectedItem.pothole.imageUrl} alt="이미지" className="modal-image mb-4" />
            <div className="modal-text">
              <p>ID: {selectedItem.repairId}</p>
              <p>위치: {selectedItem.pothole.location}</p>
              <p>상태: {selectedItem.status}</p>
              <p>부서: {selectedItem.department.deptName}</p>
              <p>수리 시간: {selectedItem.repairAt ? new Date(selectedItem.repairAt).toLocaleString() : 'Unknown'}</p>
            </div>
            <div className="modal-footer">
              {selectedItem.status === 'before' && !isRepairStarted && (
                <button onClick={handleStartClick} className="report-button">
                  시작하기
                </button>
              )}
              {((selectedItem.status === 'before' && isRepairStarted) || selectedItem.status === 'ongoing' || selectedItem.status === 'during') && (
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
