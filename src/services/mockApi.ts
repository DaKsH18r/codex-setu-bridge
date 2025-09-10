// Mock data matching the backend specification
const NAMASTE_TERMS = [
  { code: "ASU-D-1.1.1", term: "Vataja Jwara", system: "Ayurveda" },
  { code: "ASU-D-1.1.2", term: "Pittaja Jwara", system: "Ayurveda" },
  { code: "ASU-D-1.1.3", term: "Kaphaja Jwara", system: "Ayurveda" },
  { code: "ASU-D-2.1.1", term: "Pratishyaya", system: "Ayurveda" },
  { code: "ASU-D-8.3.1", term: "Amavata", system: "Ayurveda" },
  { code: "ASU-D-10.1.1", term: "Shirashoola", system: "Ayurveda" },
  { code: "ASU-S-1.1", term: "Vali Azhal Noi", system: "Siddha" },
  { code: "ASU-S-1.2", term: "Pitha Azhal Noi", system: "Siddha" },
  { code: "ASU-S-2.1", term: "Peenisam", system: "Siddha" },
  { code: "ASU-U-1.1", term: "Humma-i-Safrawi", system: "Unani" },
  { code: "ASU-U-2.1", term: "Nazla", system: "Unani" },
  { code: "ASU-U-10.1", term: "Suda", system: "Unani" },
  // Add some common English terms for easier searching
  { code: "ASU-D-1.2.1", term: "Fever", system: "Ayurveda" },
  { code: "ASU-D-2.2.1", term: "Cold", system: "Ayurveda" },
  { code: "ASU-D-3.1.1", term: "Headache", system: "Ayurveda" },
  { code: "ASU-D-4.1.1", term: "Cough", system: "Ayurveda" },
  { code: "ASU-D-5.1.1", term: "Joint Pain", system: "Ayurveda" },
  { code: "ASU-D-6.1.1", term: "Diabetes", system: "Ayurveda" },
  { code: "ASU-D-7.1.1", term: "Hypertension", system: "Ayurveda" },
  { code: "ASU-S-3.1", term: "Stomach Pain", system: "Siddha" },
  { code: "ASU-U-3.1", term: "Respiratory Issues", system: "Unani" }
];

const ICD_MAP = {
  "ASU-D-1.1.1": { code: "PL21.0", display: "Vata pattern fever" },
  "ASU-D-1.1.2": { code: "PL21.1", display: "Pitta pattern fever" },
  "ASU-D-1.1.3": { code: "PL21.2", display: "Kapha pattern fever" },
  "ASU-D-2.1.1": { code: "PL22.0", display: "Vata pattern common cold" },
  "ASU-D-8.3.1": { code: "PL28.2", display: "Amavata pattern" },
  "ASU-D-10.1.1": { code: "PL2A.0", display: "Vata pattern headache" },
  "ASU-S-1.1": { code: "PL21.0", display: "Vata pattern fever" },
  "ASU-S-1.2": { code: "PL21.1", display: "Pitta pattern fever" },
  "ASU-S-2.1": { code: "PL22.3", display: "Peenisam pattern" },
  "ASU-U-1.1": { code: "PL21.1", display: "Pitta pattern fever" },
  "ASU-U-2.1": { code: "PL22.1", display: "Nazla pattern" },
  "ASU-U-10.1": { code: "PL2A.3", display: "Suda pattern headache" },
  // Add mappings for the new common terms
  "ASU-D-1.2.1": { code: "PL21.Z", display: "Fever, unspecified" },
  "ASU-D-2.2.1": { code: "PL22.Z", display: "Common cold" },
  "ASU-D-3.1.1": { code: "PL2A.Z", display: "Headache, unspecified" },
  "ASU-D-4.1.1": { code: "PL23.0", display: "Cough" },
  "ASU-D-5.1.1": { code: "PL28.1", display: "Joint pain" },
  "ASU-D-6.1.1": { code: "5A11", display: "Type 2 diabetes mellitus" },
  "ASU-D-7.1.1": { code: "BA00", display: "Essential hypertension" },
  "ASU-S-3.1": { code: "PL25.0", display: "Abdominal pain" },
  "ASU-U-3.1": { code: "PL24.0", display: "Respiratory symptoms" }
};

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockSearchAPI = async (query: string) => {
  await delay(300); // Simulate network delay
  
  if (!query || query.trim().length < 2) {
    return [];
  }
  
  const searchRegex = new RegExp(query.trim(), 'i');
  const results = NAMASTE_TERMS.filter(item => 
    searchRegex.test(item.term) || searchRegex.test(item.code)
  ).slice(0, 20);
  
  return results.map(item => ({
    code: item.code,
    display: item.term,
    description: `${item.system} terminology`
  }));
};

export const mockTranslateAPI = async (namasteCode: string) => {
  await delay(200); // Simulate network delay
  
  const icdMapping = ICD_MAP[namasteCode as keyof typeof ICD_MAP];
  
  if (!icdMapping) {
    throw new Error('Translation not found for this code');
  }
  
  return {
    icd11Code: icdMapping.code,
    icd11Display: icdMapping.display
  };
};