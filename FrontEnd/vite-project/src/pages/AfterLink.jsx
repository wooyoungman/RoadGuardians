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
    <div className="page-container">
      {showOffcanvas && <div className="backdrop show" onClick={closeOffcanvas}></div>}
      <h1>확인 후</h1>
      {list.length === 0 ? (
        <div>데이터가 없습니다.</div>
      ) : (
        <div className="post-list">
          <div>
            {Object.keys(groupedItems).map((date) => (
              <div key={date} className='text-black'>
                <h2>{date}</h2>
                {groupedItems[date].map((item) => (
                  <div key={item.repairId} className="post-item" onClick={() => openOffcanvas(item)}>
                    <img src={item.pothole.imageUrl} alt="Pothole Image" className="post-image" />
                    <div className="post-content">
                      <p>ID: {item.repairId}</p>
                      <p>Location: {item.pothole.location}</p>
                      <p>Status: {item.status}</p>
                      <p>Department: {item.department.deptName}</p>
                      <p>Confirmed: {item.pothole.confirm !== undefined ? item.pothole.confirm.toString() : 'Unknown'}</p>
                      <p>Repair At: {item.repairAt}</p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
      {selectedItem && (
        <div className={`offcanvas text-black ${showOffcanvas ? 'show' : ''}`}>
          <div className="offcanvas-header">
            <h5 className="offcanvas-title">포트홀 상세 정보</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={closeOffcanvas}></button>
          </div>
          <div className="offcanvas-body">
            {selectedItem && (
              <>
                <img src={selectedItem.pothole.imageUrl} alt="포트홀 이미지" className="modal-image" />
                <div className="modal-text">
                  <p>ID: {selectedItem.pothole.repairId}</p>
                  <p>위치: {selectedItem.pothole.location}</p>
                  <p>확인 여부: {selectedItem.pothole.confirm ? "확인됨" : "확인되지 않음"}</p>
                  <p>상태: {selectedItem.status}</p>
                  <p>연계 부서: {selectedItem.department.deptName}</p>
                  <p>수리 시간: {selectedItem.repairAt}</p>
                </div>
              </>
            )}
            <button onClick={closeOffcanvas} className="mt-4 bg-primary text-white py-2 px-4 rounded hover:bg-hover">닫기</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AfterLink;
