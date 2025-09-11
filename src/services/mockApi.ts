// Mock API data and functions for development
export interface SearchResult {
  code: string;
  display: string;
  description: string;
}

export interface TranslateResult {
  icd11Code: string;
  icd11Display: string;
}

// Mock search data - common medical terms
const mockSearchData: SearchResult[] = [
  {
    code: "NAM001",
    display: "Fever",
    description: "Elevated body temperature"
  },
  {
    code: "NAM002", 
    display: "Headache",
    description: "Pain in the head or upper neck"
  },
  {
    code: "NAM003",
    display: "Diabetes",
    description: "Group of metabolic disorders characterized by high blood sugar"
  },
  {
    code: "NAM004",
    display: "Hypertension", 
    description: "High blood pressure"
  },
  {
    code: "NAM005",
    display: "Cough",
    description: "Sudden expulsion of air from the lungs"
  },
  {
    code: "NAM006",
    display: "Chest Pain",
    description: "Pain or discomfort in the chest area"
  },
  {
    code: "NAM007",
    display: "Nausea",
    description: "Feeling of sickness with an inclination to vomit"
  },
  {
    code: "NAM008",
    display: "Fatigue",
    description: "Extreme tiredness or exhaustion"
  },
  {
    code: "NAM009",
    display: "Dizziness",
    description: "Feeling of unsteadiness or lightheadedness"
  },
  {
    code: "NAM010",
    display: "Back Pain",
    description: "Pain in the back area"
  }
];

// Mock translation mappings
const mockTranslateData: Record<string, TranslateResult> = {
  "NAM001": {
    icd11Code: "MG30.0",
    icd11Display: "Fever, unspecified"
  },
  "NAM002": {
    icd11Code: "MB40.0", 
    icd11Display: "Headache"
  },
  "NAM003": {
    icd11Code: "5A11",
    icd11Display: "Diabetes mellitus"
  },
  "NAM004": {
    icd11Code: "BA00",
    icd11Display: "Essential hypertension"
  },
  "NAM005": {
    icd11Code: "MD12",
    icd11Display: "Cough"
  },
  "NAM006": {
    icd11Code: "MD30",
    icd11Display: "Chest pain"
  },
  "NAM007": {
    icd11Code: "MD90.0",
    icd11Display: "Nausea"
  },
  "NAM008": {
    icd11Code: "MG22",
    icd11Display: "Fatigue"
  },
  "NAM009": {
    icd11Code: "MB48.1",
    icd11Display: "Dizziness"
  },
  "NAM010": {
    icd11Code: "ME84.2",
    icd11Display: "Low back pain"
  }
};

// Mock search function
export const mockSearchAPI = async (query: string): Promise<SearchResult[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (!query || query.length < 3) {
    return [];
  }
  
  const results = mockSearchData.filter(item => 
    item.display.toLowerCase().includes(query.toLowerCase()) ||
    item.description.toLowerCase().includes(query.toLowerCase()) ||
    item.code.toLowerCase().includes(query.toLowerCase())
  );
  
  console.log(`Mock Search: Found ${results.length} results for "${query}"`);
  return results;
};

// Mock translate function
export const mockTranslateAPI = async (namasteCode: string): Promise<TranslateResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const result = mockTranslateData[namasteCode];
  
  if (!result) {
    throw new Error(`No translation found for code: ${namasteCode}`);
  }
  
  console.log(`Mock Translate: ${namasteCode} -> ${result.icd11Code}`);
  return result;
};

// Mock health check
export const mockHealthCheck = async () => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return { status: 'OK', message: 'Mock API is running' };
};