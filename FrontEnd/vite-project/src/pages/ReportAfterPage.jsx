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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://i11c104.p.ssafy.io/api/v1/overload?confirm=true');
        setList(response.data);
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
    <div className='relative p-5'>
      {/* 갤러리 형식 목록 불러오기 */}
      <div className='post-list'>
        {Object.keys(groupedItems).map((date) => (
          <div key={date} className='text-black'>
            {/* 날짜 별로 정렬 */}
            <h2 className="text-xl font-semibold mb-4 text-left">{date}</h2>
            <div className="grid grid-cols-4 gap-4">
              {groupedItems[date].map((item) => (
                <div
                  key={item.reportId}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md transition-transform transform hover:scale-110 cursor-pointer"
                  onClick={() => openModal(item)}
                >
                  <img src={`https://firebasestorage.googleapis.com/v0/b/c104-10f5a.appspot.com/o/report%2F${item.reportId}.png?alt=media`} alt={`Overload ${item.reportId}`} className="w-full h-40 object-cover" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 모달 펼치기 */}
      {isModalOpen && selectedItem && (
        // Modal 백그라운드
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-30 z-50" onClick={closeModal}>
          {/* Modal 바디 */}
          <div
            className="bg-white text-black rounded-lg shadow-lg p-4 w-3/5 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 헤더 */}
            <header className='flex justify-between items-center mb-4'>
              <h2 className="text-xl font-semibold">신고 번호 {selectedItem.reportId}번 상세보기</h2>
              <button onClick={closeModal} className="top-2 right-2 text-gray-600">
                X
              </button>
            </header>
            {/* 신고서 보기 */}
            <div className="flex justify-center w-3/5 h-2/5 overflow-y-auto">
              <img src={`https://firebasestorage.googleapis.com/v0/b/c104-10f5a.appspot.com/o/report%2F${selectedItem.reportId}.png?alt=media`} alt={`Overload ${selectedItem.reportId}`}
              />
            </div>
          </div>
        </div>
      )};

    </div>
  );
};

export default ReportAfterPage;
