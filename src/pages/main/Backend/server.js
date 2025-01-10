const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');

app.use(cors());  // Enable CORS
app.use(express.json());  // Middleware to parse JSON request bodies

// In-memory storage to hold history data
let historyData = {
  totalWaterOutput: 0.0,  // Initial value
};

// Route to update history data with formattedTotalWaterOutput
app.post('/history-data', (req, res) => {
  const { formattedTotalWaterOutput } = req.body;

  if (formattedTotalWaterOutput !== undefined) {
    // Save the value into the in-memory object
    historyData.totalWaterOutput = parseFloat(formattedTotalWaterOutput);  // Convert to float
    res.json({ message: 'History data updated successfully!', totalWaterOutput: historyData.totalWaterOutput });
  } else {
    res.status(400).json({ message: 'Invalid request data' });
  }
});

// Route to get the history data
app.get('/history', (req, res) => {
  res.json({ totalWaterOutput: historyData.totalWaterOutput });
});

// Route to reset the history data
app.delete('/history', (req, res) => {
  historyData.totalWaterOutput = 0.0;
  res.json({ message: 'History data reset successfully!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
