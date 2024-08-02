import React, { useState, useEffect } from 'react';
import ModalContent from './ModalContent';

const groupByDate = (items) => {
  return items.reduce((acc, item) => {
    const date = item.date.split('T')[0];
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
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetch('http://i11c104.p.ssafy.io:8080/api/v1/pothole?confirm=true')
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
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
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
    <div className="post-list">
      <h1>연계 후</h1>
      <div>
        {Object.keys(groupedItems).map((date) => (
          <div key={date}>
            <h2>{date}</h2>
            {groupedItems[date].map((item) => (
              <div key={item.id} className="post-item" onClick={() => openModal(item)}>
                <img src={item.imageUrl} alt="포트홀 이미지" className="post-image" />
                <div className="post-content">
                  <p>ID: {item.id}</p>
                  <p>연계 일자: {item.date} {item.time}</p>
                  <p>연계 부서: {item.description}</p>
                  <p>위치: {item.location}</p>
                  <p>좌표: {item.coordinates}</p>
                  <p>시작: {item.startTime}</p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      {selectedItem && (
        <ModalContent 
          item={selectedItem} 
          isOpen={modalIsOpen} 
          onRequestClose={closeModal} 
          closeButtonText="닫기" 
          type="after"
        />
      )}
    </div>
  );
};

export default AfterLink;
