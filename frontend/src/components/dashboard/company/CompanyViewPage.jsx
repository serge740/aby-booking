import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import companyService from '../../../services/companyService';
import { API_URL } from '../../../api/api';

const CompanyViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCompanyDetails();
  }, [id]);

  const fetchCompanyDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await companyService.getCompanyById(id);
      setCompany(data);
    } catch (err) {
      setError(err.message || 'Failed to load company details');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/admin/dashboard/company/edit/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      try {
        await companyService.deleteCompany(id);
        navigate('/admin/dashboard/company');
      } catch (err) {
        alert(err.message || 'Failed to delete company');
      }
    }
  };

  const handleBack = () => {
    navigate('/admin/dashboard/company');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 text-lg">Loading company details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Error</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleBack}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Back to Companies
          </button>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-gray-400 text-5xl mb-4">🏢</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Company Not Found</h3>
          <p className="text-gray-600 mb-6">The requested company could not be found.</p>
          <button
            onClick={handleBack}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Back to Companies
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className=" mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
          >
            <span>←</span> Back
          </button>
          <div className="flex gap-3">
            <button
              onClick={handleEdit}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Edit Company
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Company Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Company Header with Gradient */}
          <div className="bg-gradient-to-r from-gray-600 to-gray-800 p-6 md:p-10">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Logo */}
              <div className="flex-shrink-0">
                {company.logo ? (
                  <img
                    src={`${API_URL}${company.logo}`}
                    alt={`${company.name} logo`}
                    className="w-28 h-28 md:w-32 md:h-32 object-cover rounded-xl border-4 border-white/30 bg-white shadow-lg"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/150?text=No+Logo';
                    }}
                  />
                ) : (
                  <div className="w-28 h-28 md:w-32 md:h-32 rounded-xl bg-white/20 border-4 border-white/30 flex items-center justify-center">
                    <span className="text-5xl md:text-6xl font-bold text-white">
                      {company.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Title Section */}
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {company.name}
                </h1>
                <div className="flex flex-wrap gap-3">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide ${
                      company.isActive
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-500 text-white'
                    }`}
                  >
                    {company.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <span className="px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide bg-white/25 text-white border border-white/40">
                    {company.type}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Company Details */}
          <div className="p-6 md:p-10">
            {/* Contact Information Section */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 pb-3 border-b-2 border-gray-200">
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Email
                  </label>
                  <p className="text-gray-800 text-base break-words">
                    {company.email || 'Not provided'}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Phone
                  </label>
                  <p className="text-gray-800 text-base">
                    {company.phone || 'Not provided'}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Address
                  </label>
                  <p className="text-gray-800 text-base">
                    {company.address || 'Not provided'}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    City
                  </label>
                  <p className="text-gray-800 text-base">
                    {company.city || 'Not provided'}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Country
                  </label>
                  <p className="text-gray-800 text-base">
                    {company.country || 'Not provided'}
                  </p>
                </div>
              </div>
            </div>

            {/* Description Section */}
            {company.description && (
              <div className="mb-10  pre-container">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 pb-3 border-b-2 border-gray-200">
                  Description
                </h2>
                <div
                  className="ql-editor bg-gray-50 border border-gray-200 rounded-lg p-6 min-h-[100px] text-gray-700 "
                  dangerouslySetInnerHTML={{ __html: company.description }}
                />
              </div>
            )}

            {/* Additional Information Section */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 pb-3 border-b-2 border-gray-200">
                Additional Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Company Type
                  </label>
                  <p className="text-gray-800 text-base">{company.type}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Status
                  </label>
                  <p className="text-gray-800 text-base">
                    {company.isActive ? 'Active' : 'Inactive'}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Created At
                  </label>
                  <p className="text-gray-800 text-base">
                    {new Date(company.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Last Updated
                  </label>
                  <p className="text-gray-800 text-base">
                    {new Date(company.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyViewPage;