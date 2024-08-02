const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 8080;

app.use(express.json());

app.get('/api/v1/pothole', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:8080/api/v1/pothole?confirm=true');
    const maintenanceData = response.data;
    res.json(maintenanceData);
  } catch (error) {
    console.error('Error fetching data from API:', error);
    res.status(500).json({ error: 'Failed to fetch data from API' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
