import { useState } from 'react';

interface SearchComponentProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onReset: () => void;
  isSearching: boolean;
}

const SearchComponent = ({ searchTerm, onSearchChange, onReset, isSearching }: SearchComponentProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  const handleClear = () => {
    onReset();
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Medical Term Search
        </h2>
        <p className="text-muted-foreground">
          Search for medical diagnoses to generate dual-coded FHIR resources
        </p>
      </div>

      <div className="relative max-w-2xl mx-auto">
        <div className={`relative transition-all duration-200 ${
          isFocused ? 'scale-[1.02] medical-shadow' : ''
        }`}>
          {/* Search Icon */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            {isSearching ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent" />
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            )}
          </div>

          {/* Input Field */}
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Enter medical diagnosis (e.g., diabetes, hypertension, fever)..."
            className="w-full pl-12 pr-12 py-4 text-lg bg-card border border-border rounded-xl 
                     text-foreground placeholder:text-muted-foreground
                     focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                     transition-all duration-200"
            autoComplete="off"
            spellCheck="false"
          />

          {/* Clear Button */}
          {searchTerm && (
            <button
              onClick={handleClear}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 
                       text-muted-foreground hover:text-foreground
                       transition-colors duration-200 p-1 rounded-md hover:bg-muted"
              aria-label="Clear search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Search Hint */}
        <div className="mt-3 text-center">
          <p className="text-sm text-muted-foreground">
            {searchTerm.length < 3 ? (
              <>Type at least 3 characters to search</>
            ) : isSearching ? (
              <>Searching NAMASTE database...</>
            ) : (
              <>Press Enter or wait for results</>
            )}
          </p>
        </div>
      </div>

      {/* Search Tips */}
      {!searchTerm && (
        <div className="mt-8 max-w-xl mx-auto">
          <h4 className="text-sm font-medium text-foreground mb-3 text-center">Search Tips</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <svg className="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Use common medical terms</span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <svg className="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Try both English and Hindi</span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <svg className="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Include symptoms or conditions</span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <svg className="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Check spelling for best results</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchComponent;