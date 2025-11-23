import React from 'react';
import { FileText, Download, Eye, AlertCircle } from 'lucide-react';
import { API_URL } from '../../../../api/api';
import { useEmployeeAuth } from '../../../../context/EmployeeAuthContext';

const EmployeeDocuments = () => {
  const { user: employee } = useEmployeeAuth();

  const documents = [
    { label: 'CV / Resume', file: employee?.cv, icon: FileText },
    { label: 'Application Letter', file: employee?.application_letter, icon: FileText },
    { label: 'Employment Contract', file: null, icon: FileText },
    { label: 'National ID', file: null, icon: FileText },
  ];

  const getFileUrl = (path?: string | null) => path ? `${API_URL}${path}` : null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc, i) => {
          const url = getFileUrl(doc.file);
          return (
            <div
              key={i}
              className={`border rounded-lg p-4 transition-all ${
                url ? 'bg-white hover:shadow-sm' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${url ? 'bg-primary-100' : 'bg-gray-200'}`}>
                    <doc.icon className={`w-5 h-5 ${url ? 'text-primary-600' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{doc.label}</p>
                    <p className="text-xs text-gray-500">
                      {url ? 'Uploaded' : 'Not uploaded'}
                    </p>
                  </div>
                </div>
                {url ? (
                  <div className="flex space-x-1">
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </a>
                    <a
                      href={url}
                      download
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                ) : (
                  <div className="p-2 text-gray-400">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start space-x-2">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800">
          To update your documents, please contact your HR department.
        </p>
      </div>
    </div>
  );
};

export default EmployeeDocuments;