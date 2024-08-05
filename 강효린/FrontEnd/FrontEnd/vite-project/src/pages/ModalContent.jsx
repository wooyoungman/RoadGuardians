import React from 'react';
import Modal from 'react-modal';

const ModalContent = ({ item, isOpen, onRequestClose, onConnect, closeButtonText }) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="포트홀 상세 정보">
      <div className="modal-content">
        <img src={item.imageUrl} alt="포트홀 이미지" className="modal-image" />
        <div className="modal-text">
          <p>ID: {item.id}</p>
          <p>연계 일자: {item.date} {item.time}</p>
          <p>연계 부서: {item.description}</p>
          <p>위치: {item.location}</p>
          <p>좌표: {item.coordinates}</p>
          <p>시작: {item.startTime}</p>
        </div>
        {onConnect ? (
          <button onClick={() => onConnect(item)} className="connect-button">유지보수과 연계하기</button>
        ) : (
          <button onClick={onRequestClose} className="connect-button">{closeButtonText}</button>
        )}
      </div>
    </Modal>
  );
};

export default ModalContent;
