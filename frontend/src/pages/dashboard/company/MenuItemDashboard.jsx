// src/pages/MenuItemDashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  Plus, Edit, Trash2, Search, ChevronDown, Eye, ChevronLeft, ChevronRight,
  AlertTriangle, CheckCircle, XCircle, X, RefreshCw, Grid3X3, List, Menu,
  MenuSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import menuItemService from '../../../services/menuItemService';
import menuCategoryService from '../../../services/menuCategoryService';
import { useCompanyAuth } from '../../../context/CompanyAuthContext';

const MenuItemDashboard = () => {
  const {company}  = useCompanyAuth()
  const [items, setItems] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
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

  const navigate = useNavigate();

  // Load data
  useEffect(() => {
    loadItems();
    loadCategories();
  }, []);

  useEffect(() => {
    handleFilterAndSort();
  }, [searchTerm, sortBy, sortOrder, allItems]);

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await menuItemService.getMenuItems();
      setAllItems(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load menu items');
      setAllItems([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const cats = await menuCategoryService.getCategories();
      setCategories(Array.isArray(cats) ? cats : []);
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoadingCategories(false);
    }
  };

  const showOperationStatus = (type, message, duration = 3000) => {
    setOperationStatus({ type, message });
    setTimeout(() => setOperationStatus(null), duration);
  };

  const handleFilterAndSort = () => {
    let filtered = [...allItems];
    if (searchTerm.trim()) {
      filtered = filtered.filter(item =>
        item?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item?.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    filtered.sort((a, b) => {
      let aValue = a[sortBy] ?? '';
      let bValue = b[sortBy] ?? '';
      if (sortBy === 'sellingPrice') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      } else {
        aValue = aValue.toString().toLowerCase();
        bValue = bValue.toString().toLowerCase();
      }
      return sortOrder === 'asc'
        ? aValue > bValue ? 1 : -1
        : aValue < bValue ? 1 : -1;
    });
    setItems(filtered);
    setCurrentPage(1);
  };

  const handleCreateItem = () => {
    navigate('/company/dashboard/menu-item/create');
  };

  const handleEditItem = (item) => {
    if (!item?.id) return;
    navigate(`/company/dashboard/menu-item/update/${item.id}`);
  };

  const handleViewItem = (item) => {
    if (!item?.id) return;
    navigate(`/company/dashboard/menu-item/${item.id}`);
  };

  const handleDeleteItem = async (item) => {
    if (!item?.id) return;
    try {
      setOperationLoading(true);
      await menuItemService.deleteMenuItem(item.id);
      setDeleteConfirm(null);
      await loadItems();
      showOperationStatus('success', `${item.name} deleted successfully!`);
    } catch (err) {
      showOperationStatus('error', err.message || 'Failed to delete item');
    } finally {
      setOperationLoading(false);
    }
  };

  const totalItems = allItems.length;
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  const renderImage = (url, size = 'w-10 h-10') => {
    if (!url) {
      return (
        <div className={`${size} bg-gray-100 rounded-full flex items-center justify-center`}>
          <Menu className="w-5 h-5 text-gray-400" />
        </div>
      );
    }
    return <img src={url} alt="" className={`${size} rounded-full object-cover border border-gray-200`} />;
  };

  // === Render Views ===
  const renderTableView = () => (
    <div className="bg-white rounded-lg shadow border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-3 px-4 text-gray-600 font-semibold">Image</th>
              <th
                className="text-left py-3 px-4 text-gray-600 font-semibold cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  setSortBy('name');
                  setSortOrder(sortBy === 'name' ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'asc');
                }}
              >
                <div className="flex items-center space-x-1">
                  <span>Name</span>
                  <ChevronDown className={`w-4 h-4 ${sortBy === 'name' ? 'text-blue-600' : 'text-gray-400'}`} />
                </div>
              </th>
              <th className="text-left py-3 px-4 text-gray-600 font-semibold hidden lg:table-cell">Category</th>
              <th
                className="text-left py-3 px-4 text-gray-600 font-semibold cursor-pointer hover:bg-gray-100 hidden md:table-cell"
                onClick={() => {
                  setSortBy('sellingPrice');
                  setSortOrder(sortBy === 'sellingPrice' ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'asc');
                }}
              >
                <div className="flex items-center space-x-1">
                  <span>Price</span>
                  <ChevronDown className={`w-4 h-4 ${sortBy === 'sellingPrice' ? 'text-blue-600' : 'text-gray-400'}`} />
                </div>
              </th>
              <th className="text-left py-3 px-4 text-gray-600 font-semibold hidden sm:table-cell">Status</th>
              <th className="text-right py-3 px-4 text-gray-600 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentItems.map((item) => (
              <motion.tr key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-gray-50">
                <td className="py-3 px-4">{renderImage(item.mainImage)}</td>
                <td className="py-3 px-4 font-medium text-gray-900 max-w-xs truncate">{item.name}</td>
                <td className="py-3 px-4 text-gray-600 hidden lg:table-cell">
                  {item.category?.name || 'Uncategorized'}
                </td>
                <td className="py-3 px-4 text-gray-600 hidden md:table-cell">
                  ${parseFloat(item.sellingPrice).toFixed(2)}
                </td>
                <td className="py-3 px-4 hidden sm:table-cell">
                  <span className={`px-2 py-1 text-xs rounded-full ${item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {item.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end space-x-2">
                    <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleViewItem(item)} title="View" className="text-gray-500 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50">
                      <Eye className="w-4 h-4" />
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleEditItem(item)} title="Edit" className="text-gray-500 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50">
                      <Edit className="w-4 h-4" />
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.1 }} onClick={() => setDeleteConfirm(item)} title="Delete" className="text-gray-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50">
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
      {currentItems.map((item) => (
        <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg shadow border border-gray-100 p-4 hover:shadow-md transition-shadow">
          <div className="flex flex-col items-center space-y-3">
            {renderImage(item.mainImage, 'w-20 h-20')}
            <div className="text-center w-full">
              <h3 className="font-semibold text-gray-900 text-sm truncate">{item.name}</h3>
              <p className="text-lg font-bold text-blue-600">${parseFloat(item.sellingPrice).toFixed(2)}</p>
              <p className="text-xs text-gray-500">{item.category?.name || 'Uncategorized'}</p>
            </div>
            <div className="flex space-x-1 text-xs">
              <span className={`px-2 py-1 rounded-full ${item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {item.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex space-x-2">
              <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleViewItem(item)} title="View" className="text-gray-500 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50">
                <Eye className="w-4 h-4" />
              </motion.button>
              <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleEditItem(item)} title="Edit" className="text-gray-500 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50">
                <Edit className="w-4 h-4" />
              </motion.button>
            </div>
            <motion.button whileHover={{ scale: 1.1 }} onClick={() => setDeleteConfirm(item)} title="Delete" className="text-gray-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50">
              <Trash2 className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="bg-white rounded-lg shadow border border-gray-100 divide-y divide-gray-100">
      {currentItems.map((item) => (
        <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="px-4 py-4 hover:bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              {renderImage(item.mainImage)}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 text-sm truncate">{item.name}</div>
                <div className="text-xs text-gray-500 truncate">{item.category?.name || 'Uncategorized'} • ${parseFloat(item.sellingPrice).toFixed(2)}</div>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4 text-sm text-gray-600">
              <span className={`px-2 py-1 rounded-full text-xs ${item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {item.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleViewItem(item)} title="View" className="text-gray-500 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50">
                <Eye className="w-4 h-4" />
              </motion.button>
              <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleEditItem(item)} title="Edit" className="text-gray-500 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50">
                <Edit className="w-4 h-4" />
              </motion.button>
              <motion.button whileHover={{ scale: 1.1 }} onClick={() => setDeleteConfirm(item)} title="Delete" className="text-gray-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50">
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
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return (
      <div className="flex items-center justify-between bg-white px-4 py-3 border-t border-gray-100 rounded-b-lg shadow">
        <div className="text-sm text-gray-600">
          Showing {startIndex + 1}-{Math.min(endIndex, items.length)} of {items.length}
        </div>
        <div className="flex items-center space-x-2">
          <motion.button whileHover={{ scale: 1.05 }} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
            className="p-2 text-gray-600 bg-white border border-gray-200 rounded hover:bg-blue-50 disabled:opacity-50">
            <ChevronLeft className="w-4 h-4" />
          </motion.button>
          {pages.map(p => (
            <motion.button key={p} whileHover={{ scale: 1.05 }} onClick={() => setCurrentPage(p)}
              className={`px-3 py-1.5 text-sm rounded ${currentPage === p ? 'bg-blue-600 text-white' : 'text-gray-600 bg-white border border-gray-200 hover:bg-blue-50'}`}>
              {p}
            </motion.button>
          ))}
          <motion.button whileHover={{ scale: 1.05 }} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
            className="p-2 text-gray-600 bg-white border border-gray-200 rounded hover:bg-blue-50 disabled:opacity-50">
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Header */}
      <div className="sticky top-0 bg-white shadow-md z-10">
        <div className="mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Menu Item Management</h1>
              <p className="text-sm text-gray-500">Manage all your menu items</p>
            </div>
            <div className="flex items-center space-x-3">
              <motion.button whileHover={{ scale: 1.05 }} onClick={()=> navigate(`/partners/menu/${company?.id}`)} 
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-blue-600 border border-gray-200 rounded hover:bg-blue-50 disabled:opacity-50">
                <MenuSquare className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="text-sm">See Whole Menu</span>
              </motion.button>
              <motion.button whileHover={{ scale: 1.05 }} onClick={loadItems} disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-blue-600 border border-gray-200 rounded hover:bg-blue-50 disabled:opacity-50">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="text-sm">Refresh</span>
              </motion.button>
              <motion.button whileHover={{ scale: 1.05 }} onClick={handleCreateItem}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium shadow-md">
                <Plus className="w-4 h-4" />
                <span className="text-sm">Add Item</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg shadow border border-gray-100 p-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-50 rounded-full"><Menu className="w-5 h-5 text-blue-600" /></div>
              <div>
                <p className="text-sm text-gray-600">Total Items</p>
                <p className="text-xl font-semibold text-gray-900">{totalItems}</p>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg shadow border border-gray-100 p-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-50 rounded-full"><CheckCircle className="w-5 h-5 text-green-600" /></div>
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-xl font-semibold text-gray-900">{allItems.filter(i => i.isActive).length}</p>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg shadow border border-gray-100 p-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-50 rounded-full"><Menu className="w-5 h-5 text-purple-600" /></div>
              <div>
                <p className="text-sm text-gray-600">Categories</p>
                <p className="text-xl font-semibold text-gray-900">{categories.length}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow border border-gray-100 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
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
                <option value="sellingPrice-asc">Price (Low-High)</option>
                <option value="sellingPrice-desc">Price (High-Low)</option>
              </select>
              <div className="flex items-center border border-gray-200 rounded">
                <motion.button whileHover={{ scale: 1.05 }} onClick={() => setViewMode('table')} className={`p-2 ${viewMode === 'table' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-blue-600'}`} title="Table">
                  <List className="w-4 h-4" />
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-blue-600'}`} title="Grid">
                  <Grid3X3 className="w-4 h-4" />
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-blue-600'}`} title="List">
                  <List className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
            {error}
          </motion.div>
        )}
        {loading ? (
          <div className="bg-white rounded-lg shadow border border-gray-100 p-8 text-center">
            <div className="inline-flex items-center space-x-2">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">Loading items...</span>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-lg shadow border border-gray-100 p-8 text-center">
            <p className="text-lg font-semibold text-gray-900">
              {searchTerm ? 'No Items Found' : 'No Menu Items Available'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {searchTerm ? 'Try adjusting your search.' : 'Add your first menu item to get started.'}
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

        {/* Toasts & Loading */}
        <AnimatePresence>
          {operationStatus && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed top-4 right-4 z-50">
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg shadow-lg text-sm ${operationStatus.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
                {operationStatus.type === 'success' ? <CheckCircle className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-red-600" />}
                <span className="font-medium">{operationStatus.message}</span>
                <motion.button whileHover={{ scale: 1.1 }} onClick={() => setOperationStatus(null)}><X className="w-4 h-4" /></motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {operationLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/30 flex items-center justify-center z-40">
              <div className="bg-white rounded-lg p-4 shadow-xl">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-gray-700 text-sm font-medium">Processing...</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirm Modal */}
        <AnimatePresence>
          {deleteConfirm && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Delete Item</h3>
                    <p className="text-sm text-gray-500">This action cannot be undone</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-4">
                  Are you sure you want to delete <span className="font-semibold">{deleteConfirm.name}</span>?
                </p>
                <div className="flex justify-end space-x-3">
                  <motion.button whileHover={{ scale: 1.05 }} onClick={() => setDeleteConfirm(null)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded hover:bg-gray-50">
                    Cancel
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.05 }} onClick={() => handleDeleteItem(deleteConfirm)} className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700">
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

export default MenuItemDashboard;