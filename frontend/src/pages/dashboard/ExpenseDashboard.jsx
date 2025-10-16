
import React, { useState, useEffect } from 'react';
import {
  Plus, Edit, Trash2, Search, ChevronDown, Eye, ChevronLeft, ChevronRight,
  AlertTriangle, CheckCircle, XCircle, X, AlertCircle, DollarSign, RefreshCw,
  Filter, Grid3X3, List, Settings, Minimize2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import expenseService from '../../services/expenseService';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../api/api';

const ExpenseDashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [allExpenses, setAllExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [operationStatus, setOperationStatus] = useState(null);
  const [operationLoading, setOperationLoading] = useState(false);
  const [viewMode, setViewMode] = useState('table');
  const [showFilters, setShowFilters] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    amount: 0,
    description: '',
  });
  const [formError, setFormError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    handleFilterAndSort();
  }, [searchTerm, sortBy, sortOrder, allExpenses]);

  const loadData = async () => {
    try {
      setLoading(true);
      const exps = await expenseService.getAllExpenses();
      setAllExpenses(Array.isArray(exps) ? exps : []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load expenses');
      setAllExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  const showOperationStatus = (type, message, duration = 3000) => {
    setOperationStatus({ type, message });
    setTimeout(() => setOperationStatus(null), duration);
  };

  const handleFilterAndSort = () => {
    let filtered = [...allExpenses];

    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (expense) =>
          expense?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          expense?.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (sortBy === 'createdAt') {
        const aDate = new Date(aValue);
        const bDate = new Date(bValue);
        return sortOrder === 'asc' ? aDate.getTime() - bDate.getTime() : bDate.getTime() - aDate.getTime();
      } else if (sortBy === 'amount') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }

      const aStr = aValue ? aValue.toString().toLowerCase() : '';
      const bStr = bValue ? bValue.toString().toLowerCase() : '';
      return sortOrder === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
    });

    setExpenses(filtered);
    setCurrentPage(1);
  };

  const totalExpenses = allExpenses.length;
  const totalAmount = allExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const averageAmount = totalExpenses ? (totalAmount / totalExpenses).toFixed(2) : 0;

  const handleAddExpense = () => {
    setFormData({
      title: '',
      amount: 0,
      description: '',
    });
    setFormError('');
    setShowAddModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.title) {
      setFormError('Title is required');
      return;
    }
    if (formData.amount <= 0) {
      setFormError('Amount must be greater than 0');
      return;
    }

    try {
      setOperationLoading(true);
      const newExpense = await expenseService.createExpense(formData);
      setShowAddModal(false);
      setFormData({
        title: '',
        amount: 0,
        description: '',
      });
      await loadData();
      showOperationStatus('success', `${newExpense.title} created successfully!`);
    } catch (err) {
      setFormError(err.message || 'Failed to create expense');
    } finally {
      setOperationLoading(false);
    }
  };

  const handleEditExpense = (expense) => {
    if (!expense?.id) return;
    setSelectedExpense(expense);
    setFormData({
      title: expense.title || '',
      amount: expense.amount || 0,
      description: expense.description || '',
    });
    setFormError('');
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.title) {
      setFormError('Title is required');
      return;
    }
    if (formData.amount <= 0) {
      setFormError('Amount must be greater than 0');
      return;
    }

    if (!selectedExpense?.id) {
      setFormError('Invalid expense ID');
      return;
    }

    try {
      setOperationLoading(true);
      await expenseService.updateExpense(selectedExpense.id, formData);
      setShowUpdateModal(false);
      setSelectedExpense(null);
      setFormData({
        title: '',
        amount: 0,
        description: '',
      });
      await loadData();
      showOperationStatus('success', `${formData.title} updated successfully!`);
    } catch (err) {
      setFormError(err.message || 'Failed to update expense');
    } finally {
      setOperationLoading(false);
    }
  };

  const handleViewExpense = (expense) => {
    if (!expense?.id) return;
    setSelectedExpense(expense);
    setShowViewModal(true);
  };

  const handleDeleteExpense = async (expense) => {
    if (!expense?.id) {
      showOperationStatus('error', 'Invalid expense ID');
      return;
    }
    try {
      setOperationLoading(true);
      await expenseService.deleteExpense(expense.id);
      setDeleteConfirm(null);
      await loadData();
      showOperationStatus('success', `${expense.title} deleted successfully!`);
    } catch (err) {
      showOperationStatus('error', err.message || 'Failed to delete expense');
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const totalPages = Math.ceil(expenses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentExpenses = expenses.slice(startIndex, endIndex);

  const renderTableView = () => (
    <div className="bg-white rounded-lg shadow border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th
                className="text-left py-3 px-4 text-gray-600 font-semibold cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  setSortBy('title');
                  setSortOrder(sortBy === 'title' ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'asc');
                }}
              >
                <div className="flex items-center space-x-1">
                  <span>Title</span>
                  <ChevronDown className={`w-4 h-4 ${sortBy === 'title' ? 'text-primary-600' : 'text-gray-400'}`} />
                </div>
              </th>
              <th
                className="text-left py-3 px-4 text-gray-600 font-semibold cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  setSortBy('amount');
                  setSortOrder(sortBy === 'amount' ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'asc');
                }}
              >
                <div className="flex items-center space-x-1">
                  <span>Amount</span>
                  <ChevronDown className={`w-4 h-4 ${sortBy === 'amount' ? 'text-primary-600' : 'text-gray-400'}`} />
                </div>
              </th>
              <th className="text-left py-3 px-4 text-gray-600 font-semibold hidden lg:table-cell">Description</th>
              <th
                className="text-left py-3 px-4 text-gray-600 font-semibold hidden md:table-cell"
                onClick={() => {
                  setSortBy('createdAt');
                  setSortOrder(sortBy === 'createdAt' ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'asc');
                }}
              >
                <div className="flex items-center space-x-1">
                  <span>Created Date</span>
                  <ChevronDown className={`w-4 h-4 ${sortBy === 'createdAt' ? 'text-primary-600' : 'text-gray-400'}`} />
                </div>
              </th>
              <th className="text-right py-3 px-4 text-gray-600 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentExpenses.map((expense, index) => (
              <motion.tr
                key={expense.id || index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="hover:bg-gray-50"
              >
                <td className="py-3 px-4 font-medium text-gray-900">{expense.title || 'N/A'}</td>
                <td className="py-3 px-4 text-gray-600">{formatCurrency(expense.amount)}</td>
                <td className="py-3 px-4 text-gray-600 hidden lg:table-cell">{expense.description || 'N/A'}</td>
                <td className="py-3 px-4 text-gray-600 hidden md:table-cell">{formatDate(expense.createdAt)}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      onClick={() => handleViewExpense(expense)}
                      className="text-gray-500 hover:text-primary-600 p-2 rounded-full hover:bg-primary-50 transition-colors"
                      title="View Expense"
                      aria-label={`View ${expense.title} expense`}
                    >
                      <Eye className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      onClick={() => handleEditExpense(expense)}
                      className="text-gray-500 hover:text-primary-600 p-2 rounded-full hover:bg-primary-50 transition-colors"
                      title="Edit Expense"
                      aria-label={`Edit ${expense.title} expense`}
                    >
                      <Edit className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      onClick={() => setDeleteConfirm(expense)}
                      className="text-gray-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                      title="Delete Expense"
                      aria-label={`Delete ${expense.title} expense`}
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
      {currentExpenses.map((expense) => (
        <motion.div
          key={expense.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow border border-gray-100 p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-900 text-sm truncate">{expense.title || 'N/A'}</div>
              <div className="text-gray-500 text-xs">{formatCurrency(expense.amount)}</div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => handleViewExpense(expense)}
                className="text-gray-500 hover:text-primary-600 p-2 rounded-full hover:bg-primary-50 transition-colors"
                title="View Expense"
                aria-label={`View ${expense.title} expense`}
              >
                <Eye className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => handleEditExpense(expense)}
                className="text-gray-500 hover:text-primary-600 p-2 rounded-full hover:bg-primary-50 transition-colors"
                title="Edit Expense"
                aria-label={`Edit ${expense.title} expense`}
              >
                <Edit className="w-4 h-4" />
              </motion.button>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => setDeleteConfirm(expense)}
              className="text-gray-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
              title="Delete Expense"
              aria-label={`Delete ${expense.title} expense`}
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
      {currentExpenses.map((expense) => (
        <motion.div
          key={expense.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="px-4 py-4 hover:bg-gray-50"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-primary-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 text-sm truncate">{expense.title || 'N/A'}</div>
                <div className="text-gray-500 text-xs">{formatCurrency(expense.amount)}</div>
              </div>
            </div>
            <div className="hidden md:grid grid-cols-3 gap-4 text-sm text-gray-600 flex-1 max-w-xl px-4">
              <span className="truncate">{expense.description || 'N/A'}</span>
              <span>{formatCurrency(expense.amount)}</span>
              <span>{formatDate(expense.createdAt)}</span>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => handleViewExpense(expense)}
                className="text-gray-500 hover:text-primary-600 p-2 rounded-full hover:bg-primary-50 transition-colors"
                title="View Expense"
                aria-label={`View ${expense.title} expense`}
              >
                <Eye className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => handleEditExpense(expense)}
                className="text-gray-500 hover:text-primary-600 p-2 rounded-full hover:bg-primary-50 transition-colors"
                title="Edit Expense"
                aria-label={`Edit ${expense.title} expense`}
              >
                <Edit className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => setDeleteConfirm(expense)}
                className="text-gray-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                title="Delete Expense"
                aria-label={`Delete ${expense.title} expense`}
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
          Showing {startIndex + 1}-{Math.min(endIndex, expenses.length)} of {expenses.length}
        </div>
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-200 rounded hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous page"
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
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 bg-white border border-gray-200 hover:bg-primary-50'
              }`}
              aria-label={`Go to page ${page}`}
            >
              {page}
            </motion.button>
          ))}
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-200 rounded hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next page"
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
        <div className="primary mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="text-gray-600 hover:text-primary-600 p-2 rounded-full hover:bg-primary-50"
                title="Toggle Sidebar"
                aria-label="Toggle sidebar"
              >
                <Minimize2 className="w-5 h-5" />
              </motion.button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Expense Management</h1>
                <p className="text-sm text-gray-500">Track and manage your expenses efficiently</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={loadData}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-primary-600 border border-gray-200 rounded hover:bg-primary-50 disabled:opacity-50"
                title="Refresh"
                aria-label="Refresh expenses"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="text-sm">Refresh</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={handleAddExpense}
                disabled={operationLoading}
                className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded font-medium transition-colors disabled:opacity-50 shadow-md"
                aria-label="Add new expense"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm">Add Expense</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="primary mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: 'Total Expenses', count: totalExpenses, color: 'primary-600', icon: DollarSign },
            { title: 'Total Amount', count: formatCurrency(totalAmount), color: 'green-600', icon: DollarSign },
            { title: 'Average Expense', count: formatCurrency(parseFloat(averageAmount)), color: 'primary-600', icon: DollarSign },
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow border border-gray-100 p-4"
            >
              <div className="flex items-center space-x-3">
                <div className={`p-3 bg-${stat.color.replace('600', '50')} rounded-full flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 text-${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-xl font-semibold text-gray-900">{stat.count}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-100 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search expenses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  aria-label="Search expenses"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-3 py-2 text-sm border rounded transition-colors ${
                  showFilters ? 'bg-primary-50 border-primary-200 text-primary-700' : 'border-gray-200 text-gray-600 hover:bg-primary-50'
                }`}
                aria-label="Toggle filters"
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
                className="text-sm border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Sort expenses"
              >
                <option value="title-asc">Title (A-Z)</option>
                <option value="title-desc">Title (Z-A)</option>
                <option value="amount-asc">Amount (Low to High)</option>
                <option value="amount-desc">Amount (High to Low)</option>
                <option value="createdAt-desc">Newest</option>
                <option value="createdAt-asc">Oldest</option>
              </select>
              <div className="flex items-center border border-gray-200 rounded">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setViewMode('table')}
                  className={`p-2 text-sm transition-colors ${
                    viewMode === 'table' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:text-primary-600'
                  }`}
                  title="Table View"
                  aria-label="Switch to table view"
                >
                  <List className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setViewMode('grid')}
                  className={`p-2 text-sm transition-colors ${
                    viewMode === 'grid' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:text-primary-600'
                  }`}
                  title="Grid View"
                  aria-label="Switch to grid view"
                >
                  <Grid3X3 className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setViewMode('list')}
                  className={`p-2 text-sm transition-colors ${
                    viewMode === 'list' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:text-primary-600'
                  }`}
                  title="List View"
                  aria-label="Switch to list view"
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
              <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">Loading expenses...</span>
            </div>
          </div>
        ) : expenses.length === 0 ? (
          <div className="bg-white rounded-lg shadow border border-gray-100 p-8 text-center">
            <p className="text-lg font-semibold text-gray-900">
              {searchTerm ? 'No Expenses Found' : 'No Expenses Available'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {searchTerm ? 'Try adjusting your search criteria.' : 'Add a new expense to get started.'}
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
                    : 'bg-primary-50 border border-primary-200 text-primary-800'
                }`}
              >
                {operationStatus.type === 'success' && <CheckCircle className="w-5 h-5 text-green-600" />}
                {operationStatus.type === 'error' && <XCircle className="w-5 h-5 text-red-600" />}
                {operationStatus.type === 'info' && <AlertCircle className="w-5 h-5 text-primary-600" />}
                <span className="font-medium">{operationStatus.message}</span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setOperationStatus(null)}
                  className="hover:opacity-70"
                  aria-label="Close notification"
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
                  <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
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
                    <h3 className="text-lg font-semibold text-gray-900">Delete Expense</h3>
                    <p className="text-sm text-gray-500">This action cannot be undone</p>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-700">
                    Are you sure you want to delete <span className="font-semibold">{deleteConfirm.title || 'N/A'}</span>?
                  </p>
                </div>
                <div className="flex items-center justify-end space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setDeleteConfirm(null)}
                    className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded hover:bg-gray-50"
                    aria-label="Cancel deletion"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => handleDeleteExpense(deleteConfirm)}
                    className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                    aria-label="Confirm deletion"
                  >
                    Delete
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showAddModal && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            >
              <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Expense</h3>
                {formError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm mb-4">
                    {formError}
                  </div>
                )}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter expense title"
                      aria-required="true"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter amount"
                      aria-required="true"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter description"
                      rows={4}
                    />
                  </div>
                  <div className="flex justify-end space-x-3 pt-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => {
                        setShowAddModal(false);
                        setFormData({
                          title: '',
                          amount: 0,
                          description: '',
                        });
                        setFormError('');
                      }}
                      className="px-4 py-2 text-sm border border-gray-200 rounded hover:bg-gray-50 text-gray-600"
                      aria-label="Cancel adding expense"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={handleSubmit}
                      disabled={operationLoading}
                      className="px-4 py-2 text-sm bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                      aria-label="Create expense"
                    >
                      {operationLoading ? 'Creating...' : 'Create Expense'}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showUpdateModal && selectedExpense && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            >
              <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Expense</h3>
                {formError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm mb-4">
                    {formError}
                  </div>
                )}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter expense title"
                      aria-required="true"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter amount"
                      aria-required="true"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter description"
                      rows={4}
                    />
                  </div>
                  <div className="flex justify-end space-x-3 pt-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => {
                        setShowUpdateModal(false);
                        setSelectedExpense(null);
                        setFormData({
                          title: '',
                          amount: 0,
                          description: '',
                        });
                        setFormError('');
                      }}
                      className="px-4 py-2 text-sm border border-gray-200 rounded hover:bg-gray-50 text-gray-600"
                      aria-label="Cancel updating expense"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={handleUpdateSubmit}
                      disabled={operationLoading}
                      className="px-4 py-2 text-sm bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                      aria-label="Update expense"
                    >
                      {operationLoading ? 'Updating...' : 'Update Expense'}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showViewModal && selectedExpense && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            >
              <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <p className="text-sm text-gray-900">{selectedExpense.title || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                    <p className="text-sm text-gray-900">{formatCurrency(selectedExpense.amount)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <p className="text-sm text-gray-900">{selectedExpense.description || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Created At</label>
                    <p className="text-sm text-gray-900">{formatDate(selectedExpense.createdAt)}</p>
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => {
                      setShowViewModal(false);
                      setSelectedExpense(null);
                    }}
                    className="px-4 py-2 text-sm border border-gray-200 rounded hover:bg-gray-50 text-gray-600"
                    aria-label="Close expense details"
                  >
                    Close
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

export default ExpenseDashboard;
