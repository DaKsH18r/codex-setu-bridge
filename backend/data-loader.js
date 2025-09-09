const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const csv = require('csv-parser');
require('dotenv').config();

const NamasteTerm = require('./models/namasteTerm');

// Sample data as specified
const NAMASTE_DATA = `NAMASTE_CODE,NAMASTE_TERM,SYSTEM
ASU-D-1.1.1,Vataja Jwara,Ayurveda
ASU-D-1.1.2,Pittaja Jwara,Ayurveda
ASU-D-1.1.3,Kaphaja Jwara,Ayurveda
ASU-D-2.1.1,Pratishyaya,Ayurveda
ASU-D-8.3.1,Amavata,Ayurveda
ASU-D-10.1.1,Shirashoola,Ayurveda
ASU-S-1.1,Vali Azhal Noi,Siddha
ASU-S-1.2,Pitha Azhal Noi,Siddha
ASU-S-2.1,Peenisam,Siddha
ASU-U-1.1,Humma-i-Safrawi,Unani
ASU-U-2.1,Nazla,Unani
ASU-U-10.1,Suda,Unani`;

// Function to generate CSV file
function generateCSV() {
  const csvPath = path.join(__dirname, 'NAMASTE.csv');
  
  console.log('Generating NAMASTE.csv file...');
  fs.writeFileSync(csvPath, NAMASTE_DATA);
  console.log(`✓ NAMASTE.csv created at: ${csvPath}`);
  
  return csvPath;
}

// Function to load data from CSV to MongoDB
async function loadData() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/codex-setu', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✓ Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await NamasteTerm.deleteMany({});
    console.log('✓ Existing data cleared');

    // Generate CSV file
    const csvPath = generateCSV();

    // Load data from CSV
    console.log('Loading data from CSV...');
    const terms = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (row) => {
          terms.push({
            code: row.NAMASTE_CODE,
            term: row.NAMASTE_TERM,
            system: row.SYSTEM
          });
        })
        .on('end', async () => {
          try {
            // Insert data into MongoDB
            await NamasteTerm.insertMany(terms);
            console.log(`✓ Successfully loaded ${terms.length} NAMASTE terms`);
            
            // Verify data
            const count = await NamasteTerm.countDocuments();
            console.log(`✓ Total documents in database: ${count}`);
            
            resolve();
          } catch (error) {
            reject(error);
          }
        })
        .on('error', reject);
    });

  } catch (error) {
    console.error('Error loading data:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('✓ Disconnected from MongoDB');
  }
}

// Run data loader if called directly
if (require.main === module) {
  loadData()
    .then(() => {
      console.log('\n🎉 Data loading completed successfully!');
      console.log('You can now start the server with: npm start');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Data loading failed:', error);
      process.exit(1);
    });
}

module.exports = { loadData, generateCSV };