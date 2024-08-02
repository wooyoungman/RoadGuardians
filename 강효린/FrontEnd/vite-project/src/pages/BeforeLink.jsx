import React, { useState } from 'react';
import ModalContent from './ModalContent';

const groupByDate = (items) => {
  return items.reduce((acc, item) => {
    const date = item.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {});
};

const BeforeLink = ({ list, handleConnect }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const openModal = (item) => {
    setSelectedItem(item);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedItem(null);
  };

  const groupedItems = groupByDate(list);

  return (
    <div className="post-list">
      <h1>연계 전</h1>
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
          onConnect={(item) => { handleConnect(item); closeModal(); }} 
        />
      )}
    </div>
  );
};

export default BeforeLink;
