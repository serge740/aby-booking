import React, { useState, useEffect } from 'react';
import reportService from '../../../services/reportService';

const ReportModal = ({ isOpen, onClose, report = null, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Initialize form when modal opens or report changes
  useEffect(() => {
    if (report) {
      setTitle(report.title || '');
      setFileName('');
      setFile(null);
    } else {
      setTitle('');
      setFileName('');
      setFile(null);
    }
    setError('');
  }, [report, isOpen]);

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      
      // If title is empty, set it to filename without extension
      if (!title.trim()) {
        const nameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, '');
        setTitle(nameWithoutExt);
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (!report && !file) {
      setError('Please upload a document file');
      return;
    }

    setIsSubmitting(true);

    try {
      const reportData = { title: title.trim() };

      if (report) {
        // Update existing report
        await reportService.updateReport(report.id, reportData, file);
      } else {
        // Create new report
        await reportService.createReport(reportData, file);
      }

      // Reset form and close modal
      setTitle('');
      setFile(null);
      setFileName('');
      
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle modal close
  const handleClose = () => {
    if (!isSubmitting) {
      setTitle('');
      setFile(null);
      setFileName('');
      setError('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {report ? 'Update Report' : 'Create Report'}
          </h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold disabled:opacity-50"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title Input */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter report title"
              disabled={isSubmitting}
            />
          </div>

          {/* File Upload */}
          <div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
              Document {!report && '*'}
            </label>
            <input
              type="file"
              id="file"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={isSubmitting}
              accept=".pdf,.doc,.docx,.txt,.xlsx,.xls"
            />
            {fileName && (
              <div className="mt-2 p-2 bg-primary-50 border border-primary-200 rounded-md">
                <p className="text-sm text-primary-800">
                  <span className="font-medium">Selected file:</span> {fileName}
                </p>
              </div>
            )}
            {report && !fileName && (
              <p className="mt-1 text-sm text-gray-500">
                Leave empty to keep existing document
              </p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : report ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;