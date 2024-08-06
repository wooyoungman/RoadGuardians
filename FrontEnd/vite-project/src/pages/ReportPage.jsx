import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Outlet, useNavigate } from 'react-router-dom';
import ReportForm from '../components/ReportForm';
import '../styles/LinkPage.css';

const groupByDate = (items) => {
  return items.reduce((acc, item) => {
    const date = item.detectAt ? item.detectAt.split('T')[0] : 'Unknown';
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {});
};

const ReportPage = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://i11c104.p.ssafy.io/api/v1/overload?confirm=false');
        const uniqueData = response.data.filter((item, index, self) => 
          index === self.findIndex((t) => t.overloadId === item.overloadId)
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

  const formOpenClick = (item) => {
    setSelectedItem(item);
    setIsFormOpen(true);
  };

  const formCloseClick = () => {
    setIsFormOpen(false);
    setSelectedItem(null);
  };

  const handleButtonClick = (path) => {
    setIsFormOpen(false);
    navigate(path);
  };

  const handleFormSubmitted = () => {
    // 신고서 제출 후 목록 갱신
    const fetchData = async () => {
      try {
        const response = await axios.get('https://i11c104.p.ssafy.io/api/v1/overload?confirm=false');
        const uniqueData = response.data.filter((item, index, self) => 
          index === self.findIndex((t) => t.overloadId === item.overloadId)
        );
        setList(uniqueData);
      } catch (error) {
        setError(error);
      }
    };

    fetchData();
    setIsFormOpen(false);
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
    <div className="p-6">
      {/* 상위 버튼 */}
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '120px', position: 'fixed', top: '10px', left: '10px', zIndex: 10 }}>
        <div>
          <button
            className={`bg-hover border border-borderHover text-white py-2 px-4 rounded-md ${window.location.pathname === '/report' ? 'bg-primary borderPrimary' : ''}`} 
            onClick={() => handleButtonClick('/report')}
          >
            신고 전
          </button>
          <button
            className={`bg-hover border border-borderHover text-white py-2 px-4 ms-4 rounded-md ${window.location.pathname === '/report/after' ? 'bg-primary borderPrimary' : ''}`} 
            onClick={() => handleButtonClick('/report/after')}
          >
            신고 후
          </button>
        </div>
      </div>
      <h2>신고 페이지</h2>

      {/* 내용 */}
      <div className="post-list">
        {Object.keys(groupedItems).map((date) => (
          <div key={date}>
            <h2>{date}</h2>
            {/* 요일 별 */}
            {groupedItems[date].map((item) => (
              <div key={item.overloadId} className="post-item" onClick={() => formOpenClick(item)}>
                <img src={item.imageUrl} alt="Report Image" className="post-image" />
                <div className="post-content">
                  <p>ID: {item.overloadId}</p>
                  <p>Detected At: {item.detectAt ? new Date(item.detectAt).toLocaleString() : 'Unknown'}</p>
                  <p>Location: {item.location}</p>
                  <p>Car Number: {item.carNumber}</p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <ReportForm 
        isOpen={isFormOpen} 
        isClose={formCloseClick} 
        selectedItem={selectedItem} 
        onFormSubmitted={handleFormSubmitted}
      />
      <Outlet />
    </div>
  );
};

export default ReportPage;
