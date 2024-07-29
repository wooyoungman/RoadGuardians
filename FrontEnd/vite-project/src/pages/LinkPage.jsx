import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import './LinkPage.css';
import BeforeLink from './BeforeLink';
import AfterLink from './AfterLink';

const LinkPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Load state from localStorage
  const loadFromLocalStorage = (key, defaultValue) => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  };

  const [beforeList, setBeforeList] = useState(() => loadFromLocalStorage('beforeList', [
    {
      id: '123123',
      date: '2024.07.14',
      time: '16:48:12',
      location: '광주광역시 광산구 장덕동 산2-38',
      coordinates: '35.202492, 126.810523',
      description: '유지보수 1팀',
      startTime: '13:21:33',
      imageUrl: 'https://via.placeholder.com/150',
    },
    {
      id: '123122',
      date: '2024.07.14',
      time: '13:48:12',
      location: '광주광역시 광산구 장덕동 산2-42',
      coordinates: '35.404292, 126.4510523',
      description: '유지보수 1팀',
      startTime: '18:21:46',
      imageUrl: 'https://via.placeholder.com/150',
    },
  ]));

  const [afterList, setAfterList] = useState(() => loadFromLocalStorage('afterList', [
    {
      id: '223123',
      date: '2024.07.15',
      time: '10:30:00',
      location: '서울특별시 강남구 역삼동 123-45',
      coordinates: '37.497942, 127.027621',
      description: '유지보수 2팀',
      startTime: '09:00:00',
      imageUrl: 'https://via.placeholder.com/150',
    },
    {
      id: '223122',
      date: '2024.07.15',
      time: '11:15:00',
      location: '서울특별시 강남구 삼성동 678-90',
      coordinates: '37.514576, 127.056535',
      description: '유지보수 2팀',
      startTime: '10:00:00',
      imageUrl: 'https://via.placeholder.com/150',
    },
  ]));

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('beforeList', JSON.stringify(beforeList));
  }, [beforeList]);

  useEffect(() => {
    localStorage.setItem('afterList', JSON.stringify(afterList));
  }, [afterList]);

  useEffect(() => {
    if (location.pathname === '/link') {
      navigate('/link/before');
    }
  }, [location.pathname, navigate]);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleConnect = (item) => {
    setBeforeList(beforeList.filter((i) => i.id !== item.id));
    setAfterList([item, ...afterList]); // Prepend the item to the afterList
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '120px', position: 'fixed', top: '10px', left: '10px', zIndex: 1000 }}>
        <button
          className={`custom-button ${isActive('/link/before') ? 'selected' : ''}`}
          onClick={() => navigate('/link/before')}
          style={{
            marginRight: '10px',
            padding: '10px 20px',
            backgroundColor: isActive('/link/before') ? '#007bff' : '#ccc',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
          }}
        >
          연계 전
        </button>
        <button
          className={`custom-button ${isActive('/link/after') ? 'selected' : ''}`}
          onClick={() => navigate('/link/after')}
          style={{
            padding: '10px 20px',
            backgroundColor: isActive('/link/after') ? '#007bff' : '#ccc',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
          }}
        >
          연계 후
        </button>
      </div>
      <div style={{ paddingTop: '160px' }}>
        <Routes>
          <Route path="before" element={<BeforeLink list={beforeList} handleConnect={handleConnect} />} />
          <Route path="after" element={<AfterLink list={afterList} />} />
        </Routes>
      </div>
    </div>
  );
};

export default LinkPage;
