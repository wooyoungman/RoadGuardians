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
    case 'doing':
      return 'doing';
    case 'done':
      return 'done transparent';
    default:
      return '';
  }
};

const ReportList = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isReported, setIsReported] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [beforeResponse, duringResponse, doneResponse] = await Promise.all([
          axios.get('http://i11c104.p.ssafy.io/api/v1/repair?status=before'),
          axios.get('http://i11c104.p.ssafy.io/api/v1/repair?status=doing'),
          axios.get('http://i11c104.p.ssafy.io/api/v1/repair?status=done'),
        ]);

        const allData = [
          ...beforeResponse.data,
          ...duringResponse.data,
          ...doneResponse.data,
        ];

        const uniqueData = allData.filter((item, index, self) => 
          index === self.findIndex((t) => t.overloadId === item.overloadId)
        );

        setList(uniqueData);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const openModal = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
    setIsReported(false);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
  };

  const handleReportClick = () => {
    setIsReported(true);
  };

  const handleStartClick = async () => {
    if (selectedItem) {
      try {
        await axios.post('http://i11c104.p.ssafy.io/api/v1/repair/start', {
          repairId: [selectedItem.repairId],
        });
        // POST 요청이 성공하면 필요한 후속 작업
        closeModal();
      } catch (error) {
        console.error('Failed to start repair:', error);
      }
    }
  };

  const handleCompleteClick = async () => {
    if (selectedItem) {
      try {
        await axios.post('http://i11c104.p.ssafy.io/api/v1/repair/end', {
          repairId: [selectedItem.repairId],
        });
        // POST 요청이 성공하면 필요한 후속 작업
        closeModal();
      } catch (error) {
        console.error('Failed to complete repair:', error);
      }
    }
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
              <button onClick={handleStartClick} className="report-button">
                시작하기
              </button>
              {isReported ? (
                <button onClick={handleCompleteClick} className="complete-button">
                  보수완료
                </button>
              ) : (
                <button onClick={handleReportClick} className="report-button">
                  신고하기
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
