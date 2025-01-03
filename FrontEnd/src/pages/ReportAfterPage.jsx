import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
  const [newDB, setNewDB] = useState(false); // websocket

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://i11c104.p.ssafy.io/api/v1/overload?confirm=true');
        const sortedData = response.data.sort((a, b) => (b.reportId) - (a.reportId));
        setList(sortedData);
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

  const openModal = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
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
    <div className='report_after_box'>
      {/* 갤러리 형식 목록 불러오기 */}
      <div className='flex flex-col justify-center'>
        {Object.keys(groupedItems).map((date) => (
          <div key={date} className='text-black'>
            {/* 날짜 Title */}
            <h2 className="text-3xl font-bold py-4 text-left">{date}</h2>
            {/* 갤러리 세션 */}
            <div className="grid grid-cols-4 gap-5">
              {groupedItems[date].map((item) => (
                <div
                  key={item.reportId}
                  className="p-2 max-w-[50vh] max-h-[50vh] bg-white border border-gray-200 rounded-md overflow-hidden shadow-md transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer"
                  onClick={() => openModal(item)}>
                  <img src={`https://firebasestorage.googleapis.com/v0/b/c104-10f5a.appspot.com/o/report%2F${item.reportId}.png?alt=media`}
                  alt={`Overload ${item.reportId}`}
                  className="flex justify-center w-full grayscale brightness-90 hover:brightness-100 hover:grayscale-0 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 모달 펼치기 */}
      {isModalOpen && selectedItem && (
        // Modal 백그라운드
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-30 z-30" onClick={closeModal}>
          {/* Modal 바디 */}
          <div
            className="flex flex-col bg-white text-black rounded-md shadow-lg p-4 w-3/5 max-h-[80vh] z-50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 헤더 */}
            <header className='flex justify-between items-center'>
              <div className='flex items-center'>
                <h2 className="text-xl font-semibold">신고서 상세 보기</h2>
                <div className='text-sm text-gray-300 pt-2 ps-2'>{selectedItem.reportId}</div>
              </div>
              <button onClick={closeModal} className="top-2 right-2 text-gray-600">
                X
              </button>
            </header>
            <hr className='mt-4 mb-4'/>

            {/* 신고서 보기 */}
            <div className="flex justify-center overflow-y-auto"> 
              <img src={`https://firebasestorage.googleapis.com/v0/b/c104-10f5a.appspot.com/o/report%2F${selectedItem.reportId}.png?alt=media`}
              alt={`Overload ${selectedItem.reportId}`}
              className='w-full h-3/5'
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportAfterPage;
