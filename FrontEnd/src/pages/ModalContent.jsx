import React from 'react';
import Modal from 'react-modal';

const ModalContent = ({ item, isOpen, onRequestClose, onConnect, closeButtonText, type }) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="포트홀 상세 정보">
      <div className="modal-content">
        <img src={`https://localhost${item.imageUrl}`} alt="포트홀 이미지" className="modal-image" />
        <div className="modal-text">
          {type === 'before' ? (
            <>
              <p>ID: {item.potholeId}</p>
              <p>발견 시간: {new Date(item.detectAt).toLocaleString()}</p>
              <p>위치: {item.location}</p>
              <p>확인 여부: {item.confirm ? "확인됨" : "확인되지 않음"}</p>
            </>
          ) : (
            <>
              <p>ID: {item.id}</p>
              <p>연계 일자: {item.date} {item.time}</p>
              <p>연계 부서: {item.description}</p>
              <p>위치: {item.location}</p>
              <p>좌표: {item.coordinates}</p>
              <p>시작 시간: {item.startTime}</p>
            </>
          )}
        </div>
        {type === 'before' && onConnect ? (
          <button onClick={() => onConnect(item)} className="connect-button">작업 지시하기</button>
        ) : (
          <button onClick={onRequestClose} className="connect-button">{closeButtonText}</button>
        )}
      </div>
    </Modal>
  );
};

export default ModalContent;
