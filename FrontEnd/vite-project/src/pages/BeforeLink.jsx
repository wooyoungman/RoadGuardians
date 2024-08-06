import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LinkModal from '../components/LinkModal';
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
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://i11c104.p.ssafy.io/api/v1/pothole?confirm=false');
        const uniqueData = response.data.filter((item, index, self) => 
          index === self.findIndex((t) => t.potholeId === item.potholeId)
        );
        const sortedData = uniqueData.sort((a, b) => new Date(b.detectAt) - new Date(a.detectAt));
        setList(sortedData);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  const groupedItems = groupByDate(list);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="page-container text-black">
      {showOffcanvas && <div className="fixed inset-0 bg-black bg-opacity-50 z-20" onClick={closeOffcanvas}></div>}
      <div className="post-list relative">
        <div>
          {Object.keys(groupedItems).map((date) => (
            <div key={date}>
              <h2>{date}</h2>
              {groupedItems[date].map((item) => (
                <div key={item.potholeId} className="post-item" onClick={() => openOffcanvas(item)}>
                  <img src={item.imageUrl} alt="Pothole Image" className="post-image" />
                  <div className="post-content">
                    <p>ID: {item.potholeId}</p>
                    <p>Detect At: {new Date(item.detectAt).toLocaleString()}</p>
                    <p>Location: {item.location}</p>
                    <p>Confirmed: {item.confirm.toString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className={`fixed top-0 right-0 h-full bg-white shadow-lg z-30 transform ${showOffcanvas ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300`}>
          <div className="offcanvas-header p-4 border-b">
            <h5 className="offcanvas-title">포트홀 상세 정보</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={closeOffcanvas}>X</button>
          </div>
          <div className="offcanvas-body p-4">
            {selectedItem && (
              <>
                <img src={selectedItem.imageUrl} alt="포트홀 이미지" className="modal-image mb-4" />
                <div>
                  <p className="my-4">ID: {selectedItem.potholeId}</p>
                  <p className="my-4">발견 시간: {new Date(selectedItem.detectAt).toLocaleString()}</p>
                  <p className="my-4">위치: {selectedItem.location}</p>
                  <p className="my-4">확인 여부: {selectedItem.confirm ? "확인됨" : "확인되지 않음"}</p>
                </div>
              </>
            )}
            <button onClick={modalOpenClick} className="mt-4 bg-primary text-white py-2 px-4 rounded hover:bg-hover">유지연계과 연계하기</button>
          </div>
        </div>

        <LinkModal isOpen={isModalOpen} isClose={modalCloseClick} selectedItem={selectedItem} />
      </div>
    </div>
  );
};

export default BeforeLink;
