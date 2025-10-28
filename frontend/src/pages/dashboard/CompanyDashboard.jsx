import React, { useState, useEffect } from 'react';
import {
  Plus, Edit, Trash2, Search, ChevronDown, Eye, ChevronLeft, ChevronRight,
  AlertTriangle, CheckCircle, XCircle, X, AlertCircle, Building2, RefreshCw,
  Filter, Grid3X3, List, Settings, Minimize2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import companyService from '../../services/companyService';
import { API_URL } from '../../api/api';

const CompanyDashboard = () => {
  const [companies, setCompanies] = useState([]);
  const [allCompanies, setAllCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [operationStatus, setOperationStatus] = useState(null);
  const [operationLoading, setOperationLoading] = useState(false);
  const [viewMode, setViewMode] = useState('table');
  const [showFilters, setShowFilters] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    handleFilterAndSort();
  }, [searchTerm, sortBy, sortOrder, allCompanies]);

  const loadData = async () => {
    try {
      setLoading(true);
      const comps = await companyService.getAllCompanies();
      setAllCompanies(Array.isArray(comps) ? comps : []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load companies');
      setAllCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  const showOperationStatus = (type, message, duration = 3000) => {
    setOperationStatus({ type, message });
    setTimeout(() => setOperationStatus(null), duration);
  };

  const handleFilterAndSort = () => {
    let filtered = [...allCompanies];

    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (company) =>
          company?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          company?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          company?.phone?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
        const aDate = new Date(aValue);
        const bDate = new Date(bValue);
        return sortOrder === 'asc' ? aDate.getTime() - bDate.getTime() : bDate.getTime() - aDate.getTime();
      }

      const aStr = aValue ? aValue.toString().toLowerCase() : '';
      const bStr = bValue ? bValue.toString().toLowerCase() : '';
      return sortOrder === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
    });

    setCompanies(filtered);
    setCurrentPage(1);
  };

  const totalCompanies = allCompanies.length;

  const handleViewCompany = (company) => {
    if (!company?.id) return;
    navigate(`/admin/dashboard/company/${company.id}`);
  };

  const handleEditCompany = (company) => {
    if (!company?.id) return;
    navigate(`/admin/dashboard/company/edit/${company.id}`);
  };

  const handleDeleteCompany = async (company) => {
    if (!company?.id) {
      showOperationStatus('error', 'Invalid company ID');
      return;
    }
    try {
      setOperationLoading(true);
      await companyService.deleteCompany(company.id);
      setDeleteConfirm(null);
      await loadData();
      showOperationStatus('success', `${company.name} deleted successfully!`);
    } catch (err) {
      showOperationStatus('error', err.message || 'Failed to delete company');
    } finally {
      setOperationLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return new Date().toLocaleDateString('en-GB');
    const parsedDate = new Date(date);
    return isNaN(parsedDate.getTime())
      ? new Date().toLocaleDateString('en-GB')
      : parsedDate.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
  };

  const totalPages = Math.ceil(companies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCompanies = companies.slice(startIndex, endIndex);

  const renderTableView = () => (
    <div className="bg-white rounded-lg shadow border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-3 px-4 text-gray-600 font-semibold">Logo</th>
              <th
                className="text-left py-3 px-4 text-gray-600 font-semibold cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  setSortBy('name');
                  setSortOrder(sortBy === 'name' ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'asc');
                }}
              >
                <div className="flex items-center space-x-1">
                  <span>Company Name</span>
                  <ChevronDown className={`w-4 h-4 ${sortBy === 'name' ? 'text-blue-600' : 'text-gray-400'}`} />
                </div>
              </th>
              <th className="text-left py-3 px-4 text-gray-600 font-semibold hidden lg:table-cell">Email</th>
              <th className="text-left py-3 px-4 text-gray-600 font-semibold hidden md:table-cell">Phone</th>
              <th className="text-left py-3 px-4 text-gray-600 font-semibold hidden xl:table-cell">City</th>
              <th className="text-right py-3 px-4 text-gray-600 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentCompanies.map((company, index) => (
              <motion.tr
                key={company.id || index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="hover:bg-gray-50"
              >
                <td className="py-3 px-4">
                  {company.logo ? (
                    <img
                      src={`${API_URL}${company.logo}`}
                      alt={`${company.name} logo`}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-blue-600" />
                    </div>
                  )}
                </td>
                <td className="py-3 px-4 font-medium text-gray-900">{company.name || 'N/A'}</td>
                <td className="py-3 px-4 text-gray-600 hidden lg:table-cell">{company.email || 'N/A'}</td>
                <td className="py-3 px-4 text-gray-600 hidden md:table-cell">{company.phone || 'N/A'}</td>
                <td className="py-3 px-4 text-gray-600 hidden xl:table-cell">{company.city || 'N/A'}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      onClick={() => handleViewCompany(company)}
                      className="text-gray-500 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-colors"
                      title="View Company"
                    >
                      <Eye className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      onClick={() => handleEditCompany(company)}
                      className="text-gray-500 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-colors"
                      title="Edit Company"
                    >
                      <Edit className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      onClick={() => setDeleteConfirm(company)}
                      className="text-gray-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                      title="Delete Company"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderGridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {currentCompanies.map((company) => (
        <motion.div
          key={company.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow border border-gray-100 p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col items-center space-y-3 mb-3">
            {company.logo ? (
              <img
                src={`${API_URL}${company.logo}`}
                alt={`${company.name} logo`}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
            )}
            <div className="text-center w-full">
              <div className="font-semibold text-gray-900 text-sm truncate">{company.name || 'N/A'}</div>
              <div className="text-gray-500 text-xs truncate">{company.email || 'N/A'}</div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => handleViewCompany(company)}
                className="text-gray-500 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-colors"
                title="View Company"
              >
                <Eye className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => handleEditCompany(company)}
                className="text-gray-500 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-colors"
                title="Edit Company"
              >
                <Edit className="w-4 h-4" />
              </motion.button>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => setDeleteConfirm(company)}
              className="text-gray-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
              title="Delete Company"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="bg-white rounded-lg shadow border border-gray-100 divide-y divide-gray-100">
      {currentCompanies.map((company) => (
        <motion.div
          key={company.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="px-4 py-4 hover:bg-gray-50"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              {company.logo ? (
                <img
                  src={`${API_URL}${company.logo}`}
                  alt={`${company.name} logo`}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-blue-600" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 text-sm truncate">{company.name || 'N/A'}</div>
                <div className="text-gray-500 text-xs truncate">{company.email || 'N/A'}</div>
              </div>
            </div>
            <div className="hidden md:grid grid-cols-2 gap-4 text-sm text-gray-600 flex-1 max-w-md px-4">
              <span className="truncate">{company.phone || 'N/A'}</span>
              <span className="truncate">{company.city || 'N/A'}</span>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => handleViewCompany(company)}
                className="text-gray-500 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-colors"
                title="View Company"
              >
                <Eye className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => handleEditCompany(company)}
                className="text-gray-500 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-colors"
                title="Edit Company"
              >
                <Edit className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => setDeleteConfirm(company)}
                className="text-gray-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                title="Delete Company"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-between bg-white px-4 py-3 border-t border-gray-100 rounded-b-lg shadow">
        <div className="text-sm text-gray-600">
          Showing {startIndex + 1}-{Math.min(endIndex, companies.length)} of {companies.length}
        </div>
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-200 rounded hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </motion.button>
          {pages.map((page) => (
            <motion.button
              key={page}
              whileHover={{ scale: 1.05 }}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1.5 text-sm rounded ${
                currentPage === page
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 bg-white border border-gray-200 hover:bg-blue-50'
              }`}
            >
              {page}
            </motion.button>
          ))}
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-200 rounded hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <div className="sticky top-0 bg-white shadow-md z-10">
        <div className=" mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="text-gray-600 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50"
                title="Toggle Sidebar"
              >
                <Minimize2 className="w-5 h-5" />
              </motion.button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Company Management</h1>
                <p className="text-sm text-gray-500">Manage your company information and details</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={loadData}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-blue-600 border border-gray-200 rounded hover:bg-blue-50 disabled:opacity-50"
                title="Refresh"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="text-sm">Refresh</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate('/admin/dashboard/company/create')}
                disabled={operationLoading}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition-colors disabled:opacity-50 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm">Add Company</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className=" mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow border border-gray-100 p-4"
          >
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-50 rounded-full flex items-center justify-center">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Companies</p>
                <p className="text-xl font-semibold text-gray-900">{totalCompanies}</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-100 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-3 py-2 text-sm border rounded transition-colors ${
                  showFilters ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-gray-200 text-gray-600 hover:bg-blue-50'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </motion.button>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field);
                  setSortOrder(order);
                }}
                className="text-sm border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="createdAt-desc">Newest</option>
                <option value="createdAt-asc">Oldest</option>
              </select>
              <div className="flex items-center border border-gray-200 rounded">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setViewMode('table')}
                  className={`p-2 text-sm transition-colors ${
                    viewMode === 'table' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-blue-600'
                  }`}
                  title="Table View"
                >
                  <List className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setViewMode('grid')}
                  className={`p-2 text-sm transition-colors ${
                    viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-blue-600'
                  }`}
                  title="Grid View"
                >
                  <Grid3X3 className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setViewMode('list')}
                  className={`p-2 text-sm transition-colors ${
                    viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-blue-600'
                  }`}
                  title="List View"
                >
                  <Settings className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm"
          >
            {error}
          </motion.div>
        )}

        {loading ? (
          <div className="bg-white rounded-lg shadow border border-gray-100 p-8 text-center text-gray-600">
            <div className="inline-flex items-center space-x-2">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">Loading companies...</span>
            </div>
          </div>
        ) : companies.length === 0 ? (
          <div className="bg-white rounded-lg shadow border border-gray-100 p-8 text-center">
            <p className="text-lg font-semibold text-gray-900">
              {searchTerm ? 'No Companies Found' : 'No Companies Available'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {searchTerm ? 'Try adjusting your search criteria.' : 'Add a new company to get started.'}
            </p>
          </div>
        ) : (
          <div>
            {viewMode === 'table' && renderTableView()}
            {viewMode === 'grid' && renderGridView()}
            {viewMode === 'list' && renderListView()}
            {renderPagination()}
          </div>
        )}

        <AnimatePresence>
          {operationStatus && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-4 right-4 z-50"
            >
              <div
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg shadow-lg text-sm ${
                  operationStatus.type === 'success'
                    ? 'bg-green-50 border border-green-200 text-green-800'
                    : operationStatus.type === 'error'
                    ? 'bg-red-50 border border-red-200 text-red-800'
                    : 'bg-blue-50 border border-blue-200 text-blue-800'
                }`}
              >
                {operationStatus.type === 'success' && <CheckCircle className="w-5 h-5 text-green-600" />}
                {operationStatus.type === 'error' && <XCircle className="w-5 h-5 text-red-600" />}
                {operationStatus.type === 'info' && <AlertCircle className="w-5 h-5 text-blue-600" />}
                <span className="font-medium">{operationStatus.message}</span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setOperationStatus(null)}
                  className="hover:opacity-70"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {operationLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40"
            >
              <div className="bg-white rounded-lg p-4 shadow-xl">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-gray-700 text-sm font-medium">Processing...</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {deleteConfirm && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            >
              <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Delete Company</h3>
                    <p className="text-sm text-gray-500">This action cannot be undone</p>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-700">
                    Are you sure you want to delete <span className="font-semibold">{deleteConfirm.name || 'N/A'}</span>?
                  </p>
                </div>
                <div className="flex items-center justify-end space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setDeleteConfirm(null)}
                    className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded hover:bg-gray-50"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => handleDeleteCompany(deleteConfirm)}
                    className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CompanyDashboard;