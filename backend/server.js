const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const NamasteTerm = require('./models/namasteTerm');

const app = express();
const PORT = process.env.PORT || 3000;

// Hardcoded ICD mapping as specified
const ICD_MAP = {
  "ASU-D-1.1.1": { "code": "PL21.0", "display": "Vata pattern fever" },
  "ASU-D-1.1.2": { "code": "PL21.1", "display": "Pitta pattern fever" },
  "ASU-D-1.1.3": { "code": "PL21.2", "display": "Kapha pattern fever" },
  "ASU-D-2.1.1": { "code": "PL22.0", "display": "Vata pattern common cold" },
  "ASU-D-8.3.1": { "code": "PL28.2", "display": "Amavata pattern" },
  "ASU-D-10.1.1": { "code": "PL2A.0", "display": "Vata pattern headache" },
  "ASU-S-1.1": { "code": "PL21.0", "display": "Vata pattern fever" },
  "ASU-S-1.2": { "code": "PL21.1", "display": "Pitta pattern fever" },
  "ASU-S-2.1": { "code": "PL22.3", "display": "Peenisam pattern" },
  "ASU-U-1.1": { "code": "PL21.1", "display": "Pitta pattern fever" },
  "ASU-U-2.1": { "code": "PL22.1", "display": "Nazla pattern" },
  "ASU-U-10.1": { "code": "PL2A.3", "display": "Suda pattern headache" }
};

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/codex-setu', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('MongoDB connection error:', error));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Codex Setu API is running' });
});

// Search endpoint
app.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.json([]);
    }
    
    const searchRegex = new RegExp(q.trim(), 'i');
    const results = await NamasteTerm.find({
      $or: [
        { term: { $regex: searchRegex } },
        { code: { $regex: searchRegex } }
      ]
    }).limit(20);
    
    const formattedResults = results.map(item => ({
      code: item.code,
      display: item.term,
      description: `${item.system} terminology`
    }));
    
    res.json(formattedResults);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Translate endpoint
app.get('/translate', async (req, res) => {
  try {
    const { code } = req.query;
    
    if (!code) {
      return res.status(400).json({ error: 'Code parameter is required' });
    }
    
    const icdMapping = ICD_MAP[code];
    
    if (!icdMapping) {
      return res.status(404).json({ error: 'Translation not found for this code' });
    }
    
    res.json({
      icd11Code: icdMapping.code,
      icd11Display: icdMapping.display
    });
  } catch (error) {
    console.error('Translate error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Codex Setu API server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});