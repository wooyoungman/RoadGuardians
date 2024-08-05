import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LinkPage.css';

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
      return 'ongoing';
    case 'complete':
      return 'complete transparent';
    default:
      return '';
  }
};

const AfterLink = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://i11c104.p.ssafy.io/api/v1/pothole?confirm=true');
        const uniqueData = response.data.filter((item, index, self) => 
          index === self.findIndex((t) => t.repairId === item.repairId)
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

  const openOffcanvas = (item) => {
    setSelectedItem(item);
    setShowOffcanvas(true);
  };

  const closeOffcanvas = () => {
    setShowOffcanvas(false);
    setSelectedItem(null);
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
      {showOffcanvas && <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={closeOffcanvas}></div>}
      <h1 className="text-2xl font-bold mb-4">확인 후</h1>
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
                  className={`bg-white p-4 shadow-md rounded-lg mb-4 ${getStatusClass(item.status)} flex items-center`}
                  onClick={() => openOffcanvas(item)}
                >
                  <img src={item.pothole.imageUrl} alt="Pothole" className="w-1/3 h-40 object-cover rounded-lg mb-4" />
                  <div className="w-2/3 ml-4">
                    <div className="text-gray-800 mb-4">
                      <p>ID: {item.repairId}</p>
                      <p>Location: {item.pothole.location}</p>
                      <p>Status: {item.status}</p>
                      <p>Department: {item.department.deptName}</p>
                      <p>Confirmed: {item.pothole.confirm !== undefined ? item.pothole.confirm.toString() : 'Unknown'}</p>
                      <p>Repair At: {item.repairAt}</p>
                    </div>
                    <div className="flex items-center mt-8">
                      <div className="relative flex-1 h-4 bg-gray-300 rounded-full">
                        <div
                          className="absolute h-full bg-violet-500 rounded-full"
                          style={{
                            width: item.status === 'before' ? '13%' : item.status === 'ongoing' ? '55%' : '100%',
                          }}
                        ></div>
                        <div
                          className="absolute w-10 h-10 bg-cover bg-center car-icon"
                          style={{
                            backgroundImage: `url('/path/to/car-icon.png')`,
                            left: item.status === 'before' ? '0%' : item.status === 'ongoing' ? '50%' : '100%',
                            transform: item.status === 'ongoing' ? 'translateX(-50%)' : item.status === 'complete' ? 'translateX(-100%)' : '',
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex justify-between mt-6 text-sm text-gray-600">
                      <span>공사 전</span>
                      <span>공사 중</span>
                      <span>공사 완료</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
      {selectedItem && (
        <div className={`offcanvas ${showOffcanvas ? 'show' : ''}`}>
          <div className="offcanvas-body">
            <div className="flex justify-between items-center mb-4">
              <h5 className="text-xl font-semibold">포트홀 상세 정보</h5>
              <button type="button" className="text-gray-500 hover:text-gray-700" onClick={closeOffcanvas}>
                &times;
              </button>
            </div>
            <img src={selectedItem.pothole.imageUrl} alt="포트홀 이미지" className="modal-image mb-4" />
            <div className="modal-text text-gray-800">
              <p>ID: {selectedItem.repairId}</p>
              <p>위치: {selectedItem.pothole.location}</p>
              <p>확인 여부: {selectedItem.pothole.confirm ? '확인됨' : '확인되지 않음'}</p>
              <p>상태: {selectedItem.status}</p>
              <p>연계 부서: {selectedItem.department.deptName}</p>
              <p>수리 시간: {selectedItem.repairAt}</p>
            </div>
            <button onClick={closeOffcanvas} className="m-4 bg-primary border border-borderPrimary text-white py-2 px-4 rounded-md hover:bg-hover hover:border-borderHover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AfterLink;
