import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReportForm from '../components/ReportForm';

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
    <div className="relative p-5 text-black">
      {/* 내용 */}
      <div className='relative m-5'>
        {Object.keys(groupedItems).map((date) => (
          <div key={date}>
            <h2 className='text-xl font-bold w-full'>{date}</h2>
            <hr className='mb-5'/>
            {/* 요일 별 */}
            {groupedItems[date].map((item) => (
              <div key={item.overloadId} onClick={() => formOpenClick(item)}
              className='flex items-center border rounded-xl my-2.5 p-5 w-100 cursor-pointer'>
                <img src={item.imageUrl} alt="Report Image"
                className='me-5 w-52 h-52 object-fit'/>
                <div className='flex-1'>
                  <p className='mx-1.5'>ID: {item.overloadId}</p>
                  <p className='mx-1.5'>Detected At: {item.detectAt ? new Date(item.detectAt).toLocaleString() : 'Unknown'}</p>
                  <p className='mx-1.5'>Location: {item.location}</p>
                  <p className='mx-1.5'>Car Number: {item.carNumber}</p>
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
    </div>
  );
};

export default ReportPage;
