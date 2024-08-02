import React, { useEffect, useState } from 'react';
import DataDisplay from './components/DataDisplay';

const App = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/api/v1/pothole?confirm=true')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      <h1>Maintenance Team Data</h1>
      <DataDisplay data={data} />
    </div>
  );
};

export default App;
