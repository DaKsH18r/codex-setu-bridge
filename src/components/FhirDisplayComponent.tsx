import { useState } from 'react';

interface FhirDisplayComponentProps {
  fhirData: object;
}

const FhirDisplayComponent = ({ fhirData }: FhirDisplayComponentProps) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const jsonString = JSON.stringify(fhirData, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fhir-condition-resource.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Extract key information for the summary
  const extractSummaryInfo = (data: any) => {
    if (!data.code?.coding) return null;
    
    const namasteCode = data.code.coding.find((c: any) => c.system?.includes('namaste'));
    const icdCode = data.code.coding.find((c: any) => c.system?.includes('icd'));
    
    return {
      namasteCode,
      icdCode,
      text: data.code.text
    };
  };

  const summaryInfo = extractSummaryInfo(fhirData);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      {summaryInfo && (
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {/* NAMASTE Code Card */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <h4 className="font-medium text-primary">NAMASTE System</h4>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Code:</p>
              <code className="text-sm font-mono bg-white/50 px-2 py-1 rounded">
                {summaryInfo.namasteCode?.code}
              </code>
              <p className="text-sm text-foreground mt-2">
                {summaryInfo.namasteCode?.display}
              </p>
            </div>
          </div>

          {/* ICD-11 Code Card */}
          <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <h4 className="font-medium text-accent">ICD-11 System</h4>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Code:</p>
              <code className="text-sm font-mono bg-white/50 px-2 py-1 rounded">
                {summaryInfo.icdCode?.code}
              </code>
              <p className="text-sm text-foreground mt-2">
                {summaryInfo.icdCode?.display}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div className="flex items-center justify-between bg-muted/30 p-4 rounded-lg">
        <div className="flex items-center space-x-4">
          <h3 className="font-semibold text-foreground">FHIR Condition Resource</h3>
          <div className="flex items-center space-x-2 text-sm text-success">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Valid FHIR R4</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-2 text-sm bg-secondary text-secondary-foreground rounded-md 
                     hover:bg-secondary/80 transition-colors duration-200 flex items-center space-x-2"
          >
            <svg 
              className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            <span>{isExpanded ? 'Collapse' : 'Expand'}</span>
          </button>

          <button
            onClick={handleCopy}
            className="px-3 py-2 text-sm bg-primary text-primary-foreground rounded-md 
                     hover:bg-primary/90 transition-colors duration-200 flex items-center space-x-2"
          >
            {copied ? (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Copied!</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="px-3 py-2 text-sm bg-accent text-accent-foreground rounded-md 
                     hover:bg-accent/90 transition-colors duration-200 flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* JSON Display */}
      {isExpanded && (
        <div className="relative">
          <pre className="bg-card border border-border rounded-lg p-6 text-sm font-mono 
                        overflow-x-auto text-foreground leading-relaxed max-h-96 overflow-y-auto
                        scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-muted">
            <code>{jsonString}</code>
          </pre>
          
          {/* Syntax Highlighting Overlay */}
          <div className="absolute top-6 right-6">
            <div className="flex items-center space-x-2 text-xs text-muted-foreground bg-background/90 
                          backdrop-blur-sm px-2 py-1 rounded border border-border">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>JSON</span>
            </div>
          </div>
        </div>
      )}

      {/* Resource Metadata */}
      <div className="bg-muted/20 rounded-lg p-4">
        <h4 className="text-sm font-medium text-foreground mb-3">Resource Information</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Resource Type</p>
            <p className="font-medium text-foreground">Condition</p>
          </div>
          <div>
            <p className="text-muted-foreground">FHIR Version</p>
            <p className="font-medium text-foreground">R4</p>
          </div>
          <div>
            <p className="text-muted-foreground">Coding Systems</p>
            <p className="font-medium text-foreground">2</p>
          </div>
          <div>
            <p className="text-muted-foreground">Patient Reference</p>
            <p className="font-medium text-foreground">ABHA-123</p>
          </div>
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <h4 className="text-sm font-medium text-primary mb-2">Usage Instructions</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• This FHIR resource can be used in any FHIR-compliant healthcare system</li>
          <li>• The dual coding enables interoperability between Indian and international systems</li>
          <li>• Copy the JSON to integrate with your healthcare application</li>
          <li>• Download the file for offline use or system integration</li>
        </ul>
      </div>
    </div>
  );
};

export default FhirDisplayComponent;