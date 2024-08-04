import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const groupByDate = (items) => {
  return items.reduce((acc, item) => {
    const date = item.reportAt.split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {});
};

function ReportAfterPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://i11c104.p.ssafy.io/api/v1/overload?confirm=true')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setList(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []);

  const openModal = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
  };

  const handleButtonClick = (path) => {
    navigate(path);
  };

  const groupedItems = groupByDate(list);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className='p-6'>
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '120px', position: 'fixed', top: '10px', left: '10px', zIndex: 1050 }}>
        <div>
          <button
            className={`bg-hover border border-borderHover text-white py-2 px-4 rounded-md`} 
            onClick={() => handleButtonClick('/report')}
          >
            신고 전
          </button>
          <button
            className={`bg-hover border border-borderHover text-white py-2 px-4 rounded-md`} 
            onClick={() => handleButtonClick('/report/after')}
          >
            신고 후
          </button>
        </div>
      </div>
      <h1 className="text-2xl font-bold mb-4">신고 후 페이지</h1>
        {Object.keys(groupedItems).map((date) => (
          <div key={date} className='text-black'>
            <h2 className="text-xl font-semibold mb-4 text-left">{date}</h2>
            <div className="grid grid-cols-4 gap-4">
              {groupedItems[date].map((item) => (
                <div
                  key={item.id}
                  className="relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md transition-transform transform hover:scale-110 cursor-pointer"
                  onClick={() => openModal(item)}
                >
                  <img src={item.overload.imageUrl} alt={`Pothole ${item.id}`} className="w-full h-40 object-cover" />
                  <div className="p-4">
                    <p>ID: {item.reportId}</p>
                    <p>Detected at: {new Date(item.reportAt).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      {isModalOpen && selectedItem && (
        // Modal 백그라운드
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-30" onClick={closeModal}>
          {/* Modal 바디 */}
          <div
            className="bg-white text-black rounded-lg shadow-lg p-4 w-3/5 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 헤더 */}
            <header className='flex justify-between items-center mb-4'>
              <h2 className="text-xl font-semibold">신고 상세보기</h2>
              <button onClick={closeModal} className="top-2 right-2 text-gray-600">
                X
              </button>
            </header>
            <img src={selectedItem.overload.imageUrl} alt={`과적 차량 ${selectedItem.reportId}`} className="flex w-3/5 mb-4" />
            <p>신고 ID : {selectedItem.reportId}</p>
            <p>신고 시각 : {new Date(selectedItem.reportAt).toLocaleString()}</p>
            <p>포인트 벡터 : {selectedItem.overload.location}</p>
            <p>신고 상태 : {selectedItem.overload.confirm ? '신고 완료' : '신고 전'}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportAfterPage;