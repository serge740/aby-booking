import React, { useState } from 'react';
import menuItemService from '../../services/menuItemService';
import { menu } from '../../stores/menu';


// Menu data from the document
const menuData = menu

interface MenuItemInput {
  name: string;
  sellingPrice: number;
  purpose: 'EATING' | 'DRINKING';
}

interface ImportResult {
  successful: any[];
  failed: Array<{
    item: MenuItemInput;
    error: string;
  }>;
  summary: {
    total: number;
    succeeded: number;
    failed: number;
  };
}

async function createManyMenuItems(items: MenuItemInput[]): Promise<ImportResult> {
  const successful: any[] = [];
  const failed: Array<{ item: MenuItemInput; error: string }> = [];

  for (const item of items) {
    try {
      // For EATING items, add minimal required fields
     
      const result = await menuItemService.createMenuItem(item, null, []);
      successful.push(result);
      
      console.log(`✓ Created: ${item.name}`);
    } catch (error: any) {
      failed.push({
        item,
        error: error.message || 'Unknown error',
      });
      
      console.error(`✗ Failed: ${item.name} - ${error.message}`);
    }
  }

  return {
    successful,
    failed,
    summary: {
      total: items.length,
      succeeded: successful.length,
      failed: failed.length,
    },
  };
}

const BulkMenuImportButton: React.FC = () => {
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
      const importResult = await createManyMenuItems(menuData);
      
      setResult({
        successful: importResult.summary.succeeded,
        failed: importResult.summary.failed,
        errors: importResult.failed.map(f => `${f.item.name}: ${f.error}`),
      });
    } catch (error: any) {
      setResult({
        successful: 0,
        failed: menuData.length,
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
            : 'bg-green-600 hover:bg-green-700 active:scale-95'
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
            Importing {menuData.length} menu items...
          </span>
        ) : (
          `Import ${menuData.length} Menu Items`
        )}
      </button>

      {result && (
        <div className="mt-4 p-4 rounded-lg border border-gray-200 bg-white shadow-sm">
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
            <span>📋</span>
            Import Results
          </h3>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
              <span className="text-green-600 font-semibold">✓ Successful:</span>
              <span className="font-bold text-green-700">{result.successful}</span>
            </div>
            
            <div className="flex items-center gap-2 p-2 bg-red-50 rounded">
              <span className="text-red-600 font-semibold">✗ Failed:</span>
              <span className="font-bold text-red-700">{result.failed}</span>
            </div>
          </div>

          {result.errors.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold text-red-600 mb-2">Errors:</h4>
              <div className="bg-red-50 p-3 rounded max-h-48 overflow-y-auto border border-red-200">
                {result.errors.map((error, idx) => (
                  <div key={idx} className="text-sm text-red-700 mb-1">
                    • {error}
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.successful > 0 && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm text-blue-700">
                ℹ️ Menu items created with default recipe "To be updated". 
                You can edit them later to add detailed recipes and ingredients.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BulkMenuImportButton;