import { useState, useEffect, useCallback } from 'react';
import SearchComponent from '../components/SearchComponent';
import ResultsListComponent from '../components/ResultsListComponent';
import FhirDisplayComponent from '../components/FhirDisplayComponent';
import { Navbar } from '../components/Navbar';
import { debounce } from '../utils/debounce';
import { searchAPI, translateAPI } from '../services/api';

interface SearchResult {
  code: string;
  display: string;
  description?: string;
}

interface TranslationResult {
  icd11Code: string;
  icd11Display: string;
}

interface SelectedTerm extends SearchResult {
  code: string;
  display: string;
}

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<SelectedTerm | null>(null);
  const [fhirOutput, setFhirOutput] = useState<object | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [translateError, setTranslateError] = useState<string | null>(null);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (query.length < 3) {
        setResults([]);
        return;
      }

      setIsSearching(true);
      setSearchError(null);
      
      try {
        const searchResults = await searchAPI(query);
        setResults(searchResults);
      } catch (error) {
        console.error('Search failed:', error);
        setSearchError('Failed to search. Please check if the API server is running on http://localhost:3000');
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300),
    []
  );

  // Effect to trigger search when searchTerm changes
  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  // Effect to handle translation when a term is selected
  useEffect(() => {
    if (!selectedTerm) return;

    const translateTerm = async () => {
      setIsTranslating(true);
      setTranslateError(null);
      
      try {
        const translationResult = await translateAPI(selectedTerm.code);
        
        // Construct FHIR JSON structure
        const fhirResource = {
          resourceType: "Condition",
          subject: { reference: "Patient/ABHA-123" },
          code: {
            text: `Dual-coded diagnosis for ${selectedTerm.display}`,
            coding: [
              {
                system: "http://ayush.gov.in/namaste",
                code: selectedTerm.code,
                display: selectedTerm.display
              },
              {
                system: "http://id.who.int/icd/entity",
                code: translationResult.icd11Code,
                display: translationResult.icd11Display
              }
            ]
          }
        };
        
        setFhirOutput(fhirResource);
      } catch (error) {
        console.error('Translation failed:', error);
        setTranslateError('Failed to translate the selected term. Please check if the API server is running.');
      } finally {
        setIsTranslating(false);
      }
    };

    translateTerm();
  }, [selectedTerm]);

  const handleTermSelection = (term: SearchResult) => {
    setSelectedTerm(term);
    setFhirOutput(null); // Clear previous output while translating
  };

  const handleSearchReset = () => {
    setSearchTerm('');
    setResults([]);
    setSelectedTerm(null);
    setFhirOutput(null);
    setSearchError(null);
    setTranslateError(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="medical-shadow bg-card border-b border-border">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-foreground mb-4">
              <span className="medical-gradient bg-clip-text text-transparent">
                AyuSetu
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Bridge traditional Indian medicine codes (NAMASTE) with global ICD-11 standards for seamless healthcare interoperability
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Search Section */}
          <div className="medical-card p-8">
            <SearchComponent
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onReset={handleSearchReset}
              isSearching={isSearching}
            />
            
            {searchError && (
              <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-destructive text-sm">{searchError}</p>
              </div>
            )}

            {/* Results Section */}
            {results.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  Search Results ({results.length})
                </h3>
                <ResultsListComponent
                  results={results}
                  onTermSelect={handleTermSelection}
                  selectedTerm={selectedTerm}
                />
              </div>
            )}

            {/* Empty State */}
            {searchTerm.length >= 3 && results.length === 0 && !isSearching && !searchError && (
              <div className="mt-8 text-center py-12">
                <div className="text-muted-foreground">
                  <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <h3 className="text-lg font-medium mb-2">No results found</h3>
                  <p className="text-sm">Try adjusting your search terms or check spelling</p>
                </div>
              </div>
            )}
          </div>

          {/* Translation Progress */}
          {selectedTerm && isTranslating && (
            <div className="medical-card p-8">
              <div className="flex items-center justify-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
                <p className="text-muted-foreground">Translating to ICD-11...</p>
              </div>
            </div>
          )}

          {/* Translation Error */}
          {translateError && (
            <div className="medical-card p-8">
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-destructive text-sm">{translateError}</p>
              </div>
            </div>
          )}

          {/* FHIR Output Section */}
          {fhirOutput && (
            <div className="medical-card p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-foreground">
                  Generated FHIR Resource
                </h3>
                <div className="flex items-center space-x-2 text-sm text-success">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Successfully Generated</span>
                </div>
              </div>
              <FhirDisplayComponent fhirData={fhirOutput} />
            </div>
          )}

          {/* Getting Started Guide */}
          {!searchTerm && (
            <div className="medical-card p-8">
              <h3 className="text-xl font-semibold text-foreground mb-4">Getting Started</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h4 className="font-medium text-foreground mb-2">Search</h4>
                  <p className="text-sm text-muted-foreground">Enter a medical term to search NAMASTE codes</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h4a1 1 0 011 1v2m-5 3v12a2 2 0 002 2h6a2 2 0 002-2V7H7zM9 9h6M9 13h6m-3 4h3" />
                    </svg>
                  </div>
                  <h4 className="font-medium text-foreground mb-2">Select</h4>
                  <p className="text-sm text-muted-foreground">Choose a result to translate to ICD-11</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h4 className="font-medium text-foreground mb-2">Generate</h4>
                  <p className="text-sm text-muted-foreground">View the dual-coded FHIR resource</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;