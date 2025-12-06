import React, { useState } from 'react';
import { createManyStocks } from '../../services/stockService';
import { bulkStore } from '../../stores/stock';


const BulkStockImportButton: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    successful: number;
    failed: number;
    errors: string[];
  } | null>(null);

  const handleBulkImport = async () => {
    setLoading(true);
    setResult(null);

    try {
      const importResult = await createManyStocks(bulkStore);
      
      setResult({
        successful: importResult.summary.succeeded,
        failed: importResult.summary.failed,
        errors: importResult.failed.map(f => `${f.item.name}: ${f.error}`),
      });
    } catch (error: any) {
      setResult({
        successful: 0,
        failed: bulkStore.length,
        errors: [error.message || 'Import failed'],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={handleBulkImport}
        disabled={loading}
        className={`
          px-6 py-3 rounded-lg font-semibold text-white
          transition-all duration-200
          ${loading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
          }
        `}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
                fill="none"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Importing {bulkStore.length} items...
          </span>
        ) : (
          `Import ${bulkStore.length} Stock Items`
        )}
      </button>

      {result && (
        <div className="mt-4 p-4 rounded-lg border">
          <h3 className="font-bold text-lg mb-2">Import Results</h3>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-green-600 font-semibold">✓ Successful:</span>
              <span>{result.successful}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-red-600 font-semibold">✗ Failed:</span>
              <span>{result.failed}</span>
            </div>
          </div>

          {result.errors.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold text-red-600 mb-2">Errors:</h4>
              <div className="bg-red-50 p-3 rounded max-h-48 overflow-y-auto">
                {result.errors.map((error, idx) => (
                  <div key={idx} className="text-sm text-red-700 mb-1">
                    • {error}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BulkStockImportButton;