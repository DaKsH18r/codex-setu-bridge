interface SearchResult {
  code: string;
  display: string;
  description?: string;
}

interface ResultsListComponentProps {
  results: SearchResult[];
  onTermSelect: (term: SearchResult) => void;
  selectedTerm: SearchResult | null;
}

const ResultsListComponent = ({ results, onTermSelect, selectedTerm }: ResultsListComponentProps) => {
  const handleTermClick = (term: SearchResult) => {
    onTermSelect(term);
  };

  return (
    <div className="space-y-3">
      {results.map((result, index) => (
        <div
          key={`${result.code}-${index}`}
          onClick={() => handleTermClick(result)}
          className={`
            p-6 rounded-xl border cursor-pointer transition-all duration-200
            hover:medical-shadow hover:scale-[1.01] hover:border-primary/50
            ${selectedTerm?.code === result.code 
              ? 'border-primary bg-primary/5 medical-shadow' 
              : 'border-border bg-card hover:bg-card/80'}
          `}
        >
          <div className="flex items-start justify-between">
            <div className="flex-grow">
              <div className="flex items-center space-x-3 mb-2">
                <h4 className="text-lg font-semibold text-foreground">
                  {result.display}
                </h4>
                {selectedTerm?.code === result.code && (
                  <div className="flex items-center space-x-1 text-primary text-sm">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Selected</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span className="font-medium">NAMASTE Code:</span>
                  <code className="px-2 py-1 bg-muted rounded text-xs font-mono">
                    {result.code}
                  </code>
                </div>
              </div>

              {result.description && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {result.description}
                </p>
              )}
            </div>

            <div className="ml-4 flex-shrink-0">
              <div className={`
                w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200
                ${selectedTerm?.code === result.code 
                  ? 'border-primary bg-primary text-white' 
                  : 'border-muted-foreground/30 text-muted-foreground hover:border-primary hover:text-primary'}
              `}>
                {selectedTerm?.code === result.code ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </div>
            </div>
          </div>

          {/* Hover Instruction */}
          <div className={`
            mt-4 text-xs text-muted-foreground transition-opacity duration-200
            ${selectedTerm?.code === result.code ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
          `}>
            {selectedTerm?.code === result.code 
              ? 'This term will be translated to ICD-11' 
              : 'Click to select and translate to ICD-11'
            }
          </div>
        </div>
      ))}

      {/* Results Summary */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {results.length} result{results.length !== 1 ? 's' : ''} from NAMASTE database
          </span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span>API Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsListComponent;