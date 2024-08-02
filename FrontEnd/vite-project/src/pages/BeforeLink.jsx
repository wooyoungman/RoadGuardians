import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Outlet, useNavigate } from 'react-router-dom';
import ModalContent from './ModalContent';
import './LinkPage.css';

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
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeButton, setActiveButton] = useState(localStorage.getItem('activeButton') || 'before');

  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://i11c104.p.ssafy.io:8080/api/v1/pothole?confirm=false')
      .then(response => {
        setList(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });

    if (window.location.pathname === '/link') {
      setActiveButton('before');
      navigate('/link/before');
    }
  }, [navigate]);

  useEffect(() => {
    if (activeButton) {
      navigate(`/link/${activeButton}`);
    }
  }, [activeButton, navigate]);

  const openModal = (item) => {
    setSelectedItem(item);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedItem(null);
  };

  const handleButtonClick = (button) => {
    setActiveButton(button);
    localStorage.setItem('activeButton', button);
  };

  const groupedItems = groupByDate(list);

  if (loading) {
    return <div>Loading ...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '120px', position: 'fixed', top: '10px', left: '10px', zIndex: 1000 }}>
        <div className="link-buttons">
          <button
            className={`bg-hover border border-borderHover text-white py-2 px-4 rounded-md ${activeButton === 'before' ? 'bg-primary borderPrimary' : ''}`} 
            onClick={() => handleButtonClick('before')}
          >
            연계 전
          </button>
          <button
            className={`bg-hover border border-borderHover text-white py-2 px-4 rounded-md ${activeButton === 'after' ? 'bg-primary borderPrimary' : ''}`} 
            onClick={() => handleButtonClick('after')}
          >
            연계 후
          </button>
        </div>
      </div>
      <Outlet />
      <div className="post-list">
        <div>
          {Object.keys(groupedItems).map((date) => (
            <div key={date}>
              <h2>{date}</h2>
              {groupedItems[date].map((item) => (
                <div key={item.potholeId} className="post-item" onClick={() => openModal(item)}>
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
        {selectedItem && (
          <ModalContent 
            item={selectedItem} 
            isOpen={modalIsOpen} 
            onRequestClose={closeModal} 
            closeButtonText="Close" 
          />
        )}
      </div>
    </div>
  );
};

export default BeforeLink;
