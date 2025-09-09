# Codex Setu Backend API

A Node.js/Express API server that bridges traditional Indian medicine terminology (NAMASTE codes) with global ICD-11 standards.

## Quick Start

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Set up environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB URI if needed
   ```

3. **Load sample data:**
   ```bash
   npm run load-data
   ```

4. **Start the server:**
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

The API will be available at `http://localhost:3000`

## API Endpoints

### GET /health
Health check endpoint
- **Response:** `{ "status": "OK", "message": "Codex Setu API is running" }`

### GET /search?q={searchText}
Search for NAMASTE medical terms
- **Parameters:** 
  - `q` (string): Search query (minimum 2 characters)
- **Response:** Array of matching terms with code, display, and description

### GET /translate?code={namasteCode}
Translate NAMASTE code to ICD-11
- **Parameters:**
  - `code` (string): NAMASTE code to translate
- **Response:** Object with `icd11Code` and `icd11Display`

## Sample Data

The system includes 12 pre-loaded NAMASTE terms covering:
- **Ayurveda:** Vataja Jwara, Pittaja Jwara, Kaphaja Jwara, Pratishyaya, Amavata, Shirashoola
- **Siddha:** Vali Azhal Noi, Pitha Azhal Noi, Peenisam  
- **Unani:** Humma-i-Safrawi, Nazla, Suda

## Architecture

- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Data Format:** Self-generating CSV loader
- **CORS:** Enabled for frontend integration
- **Error Handling:** Comprehensive error responses

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run load-data` - Generate CSV and populate database
- `npm run setup` - Complete setup (install + load data)