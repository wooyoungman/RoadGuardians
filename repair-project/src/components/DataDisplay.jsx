import React from 'react';

const DataDisplay = ({ data }) => {
  return (
    <div>
      {data.map(item => (
        <div key={item.repairId} className="data-item">
          <h2>Repair ID: {item.repairId}</h2>
          <p>Status: {item.status}</p>
          <p>Repair At: {new Date(item.repairAt).toLocaleString()}</p>
          <h3>Pothole Details:</h3>
          <p>Pothole ID: {item.pothole.potholeId}</p>
          <p>Location: {item.pothole.location}</p>
          <p>Detect At: {new Date(item.pothole.detectAt).toLocaleString()}</p>
          <img src={`http://localhost:8080${item.pothole.imageUrl}`} alt="Pothole" />
          <h3>Department:</h3>
          <p>Department ID: {item.department.deptId}</p>
          <p>Department Name: {item.department.deptName}</p>
        </div>
      ))}
    </div>
  );
};

export default DataDisplay;
