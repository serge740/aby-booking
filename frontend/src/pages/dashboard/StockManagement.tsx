// src/pages/StockManagementDashboard.tsx
import React, { useState, useEffect } from 'react';
import {
  Plus, Edit, Trash2, Search, ChevronDown, Eye, ChevronLeft, ChevronRight,
  AlertTriangle, CheckCircle, XCircle, X, RefreshCw,
  Grid3X3, List, Package, DollarSign, Hash, Box
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useOutletContext } from 'react-router-dom';
import stockService from '../../services/stockService';
import { useEmployeeAuth } from '../../context/EmployeeAuthContext';
import { useSocketEvent } from '../../context/SocketContext';

// ──────────────────────────────────────────────────────────────
// ── TYPES & INTERFACES ───────────────────────────────────────
// ──────────────────────────────────────────────────────────────
interface Stock {
  id: string;
  companyId: string;
  name: string;
  sku: string;
  quantity: number;
  unit: string;
  price: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface OutletContext {
  role: 'employee' | 'company';
}

interface OperationStatus {
  type: 'success' | 'error';
  message: string;
}

interface FormData {
  name: string;
  sku: string;
  quantity: string;
  unit: string;
  price: string;
  description: string;
}

const UNIT_OPTIONS = [
  'pcs', 'kg', 'g', 'lb', '6', 'box', 'pack', 'liter', 'ml', 'meter', 'cm', 'dozen', 'roll', 'set', 'pair', 'unit'
];

// ──────────────────────────────────────────────────────────────
// ── COMPONENT ─────────────────────────────────────────────────
// ──────────────────────────────────────────────────────────────
const StockManagementDashboard: React.FC = () => {
  const { user } = useEmployeeAuth();
  const { role } = useOutletContext<OutletContext>();
  const isCompany = role === 'company';

  // ── STATE ──
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [allStocks, setAllStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<keyof Stock>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5);
  const [deleteConfirm, setDeleteConfirm] = useState<Stock | null>(null);
  const [operationStatus, setOperationStatus] = useState<OperationStatus | null>(null);
  const [operationLoading, setOperationLoading] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid' | 'list'>('table');
  const [showFormModal, setShowFormModal] = useState<boolean>(false);
  const [editStock, setEditStock] = useState<Stock | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    sku: '',
    quantity: '',
    unit: 'pcs',
    price: '',
    description: '',
  });

  const navigate = useNavigate();

  // ── AUTO GENERATE SKU ──
  const generateSKU = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `SKU-${timestamp}-${random}`;
  };

  const openAddForm = () => {
    setEditStock(null);
    setFormData({
      name: '',
      sku: generateSKU(),
      quantity: '',
      unit: 'pcs',
      price: '',
      description: '',
    });
    setShowFormModal(true);
  };

  // ── REAL-TIME ──
  useSocketEvent('stockCreated', (newStock: Stock) => {
    setAllStocks(prev => [...prev, newStock]);
    setStocks(prev => [...prev, newStock]);
  }, []);

  useSocketEvent('stockUpdated', (updatedStock: Stock) => {
    const updateOne = (prev: Stock[]) => prev.map(s => s.id === updatedStock.id ? updatedStock : s);
    setAllStocks(updateOne);
    setStocks(updateOne);
  }, []);

  useSocketEvent('stockDeleted', ({ id }: { id: string }) => {
    const removeOne = (prev: Stock[]) => prev.filter(s => s.id !== id);
    setAllStocks(removeOne);
    setStocks(removeOne);
  }, []);

  // ── LOAD DATA ──
  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    handleFilterAndSort();
  }, [searchTerm, sortBy, sortOrder, allStocks]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await stockService.getAllStock();
      setAllStocks(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load stock');
      setAllStocks([]);
    } finally {
      setLoading(false);
    }
  };

  // ── TOAST ──
  const showOperationStatus = (type: 'success' | 'error', message: string, duration = 3000) => {
    setOperationStatus({ type, message });
    setTimeout(() => setOperationStatus(null), duration);
  };

  // ── FILTER / SORT ──
  const handleFilterAndSort = () => {
    let filtered = [...allStocks];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(term) ||
        s.sku.toLowerCase().includes(term) ||
        s.unit.toLowerCase().includes(term)
      );
    }

    filtered.sort((a, b) => {
      const aVal = (a[sortBy] ?? '').toString().toLowerCase();
      const bVal = (b[sortBy] ?? '').toString().toLowerCase();
      return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });

    setStocks(filtered);
    setCurrentPage(1);
  };

  // ── CREATE / UPDATE ──
  const handleCreateOrUpdateStock = async () => {
    if (!formData.name || !formData.quantity || !formData.price) {
      showOperationStatus('error', 'Name, Quantity and Price are required');
      return;
    }

    const data = {
      name: formData.name,
      sku: editStock ? editStock.sku : formData.sku,
      quantity: Number(formData.quantity),
      unit: formData.unit,
      price: Number(formData.price),
      description: formData.description || undefined,
    };

    try {
      setOperationLoading(true);
      if (editStock) {
        await stockService.updateStock(editStock.id, data);
        showOperationStatus('success', 'Stock updated successfully');
      } else {
        await stockService.createStock(data);
        showOperationStatus('success', 'Stock created successfully');
      }
      setShowFormModal(false);
      await loadData();
    } catch (err: any) {
      showOperationStatus('error', err.message || 'Operation failed');
    } finally {
      setOperationLoading(false);
    }
  };

  // ── EDIT / DELETE / VIEW ──
  const handleEditStock = (stock: Stock) => {
    setEditStock(stock);
    setFormData({
      name: stock.name,
      sku: stock.sku,
      quantity: String(stock.quantity),
      unit: stock.unit,
      price: String(stock.price),
      description: stock.description || '',
    });
    setShowFormModal(true);
  };

  const handleDeleteStock = async (stock: Stock) => {
    try {
      setOperationLoading(true);
      await stockService.deleteStock(stock.id);
      setDeleteConfirm(null);
      showOperationStatus('success', 'Stock deleted');
    } catch (err: any) {
      showOperationStatus('error', err.message || 'Failed to delete');
    } finally {
      setOperationLoading(false);
    }
  };

  const handleViewStock = (stock: Stock) => {
    navigate(`/${role}/dashboard/stock/${stock.id}`);
  };

  // ── PAGINATION ──
  const totalStocks = stocks.length;
  const totalPages = Math.ceil(totalStocks / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStocks = stocks.slice(startIndex, endIndex);

  // ── HELPERS ──
  const formatPrice = (price: number) => `$${Number(price).toFixed(2)}`;

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { bg: 'bg-red-100', txt: 'text-red-800', icon: XCircle, label: 'Out of Stock' };
    if (quantity < 10) return { bg: 'bg-yellow-100', txt: 'text-yellow-800', icon: AlertTriangle, label: 'Low Stock' };
    return { bg: 'bg-green-100', txt: 'text-green-800', icon: CheckCircle, label: 'In Stock' };
  };

  const renderStatusBadge = (quantity: number) => {
    const { bg, txt, icon: Icon, label } = getStockStatus(quantity);
    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-medium ${bg} ${txt}`}>
        <Icon className="w-3 h-3" />
        <span>{label}</span>
      </span>
    );
  };

  const renderActions = (stock: Stock) => (
    <div className="flex items-center space-x-2">
      <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleViewStock(stock)}
        className="text-gray-500 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-colors" title="View">
        <Eye className="w-4 h-4" />
      </motion.button>
      <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleEditStock(stock)}
        className="text-gray-500 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-colors" title="Edit">
        <Edit className="w-4 h-4" />
      </motion.button>
      <motion.button whileHover={{ scale: 1.1 }} onClick={() => setDeleteConfirm(stock)}
        className="text-gray-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors" title="Delete">
        <Trash2 className="w-4 h-4" />
      </motion.button>
    </div>
  );

  // ── VIEWS ──
  const renderTableView = () => (
    <div className="bg-white rounded-lg shadow border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-3 px-4 text-gray-600 font-semibold">Item Name</th>
              <th className="text-left py-3 px-4 text-gray-600 font-semibold">SKU</th>
              <th className="text-left py-3 px-4 text-gray-600 font-semibold">Quantity</th>
              <th className="text-left py-3 px-4 text-gray-600 font-semibold">Price</th>
              <th className="text-left py-3 px-4 text-gray-600 font-semibold">Status</th>
              <th className="text-right py-3 px-4 text-gray-600 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentStocks.map(stock => (
              <motion.tr key={stock.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-gray-50">
                <td className="py-3 px-4 font-medium text-gray-900">{stock.name}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-1">
                    <Hash className="w-3.5 h-3.5 text-gray-400" />
                    <span className="font-mono text-xs">{stock.sku}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="font-semibold">{stock.quantity}</span>
                  <span className="text-gray-500 text-xs ml-1">{stock.unit}</span>
                </td>
                <td className="py-3 px-4 font-semibold text-green-600">{formatPrice(stock.price)}</td>
                <td className="py-3 px-4">{renderStatusBadge(stock.quantity)}</td>
                <td className="py-3 px-4 text-right">{renderActions(stock)}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderGridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {currentStocks.map(stock => (
        <motion.div key={stock.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow border border-gray-100 p-4 hover:shadow-md transition-shadow">
          <div className="flex flex-col items-center space-y-3 mb-3">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <div className="text-center w-full">
              <div className="font-semibold text-gray-900 text-sm truncate">{stock.name}</div>
              <div className="text-gray-500 text-xs">SKU: {stock.sku}</div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <div>{stock.quantity} {stock.unit}</div>
              <div className="font-semibold text-green-600">{formatPrice(stock.price)}</div>
            </div>
            {renderStatusBadge(stock.quantity)}
          </div>
          <div className="mt-3 flex justify-center">{renderActions(stock)}</div>
        </motion.div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="bg-white rounded-lg shadow border border-gray-100 divide-y divide-gray-100">
      {currentStocks.map(stock => (
        <motion.div key={stock.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="px-4 py-4 hover:bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 text-sm truncate">{stock.name}</div>
                <div className="text-gray-500 text-xs truncate">SKU: {stock.sku} • {stock.quantity} {stock.unit}</div>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4 text-sm text-gray-600 flex-1 max-w-md px-4">
              <span className="truncate">{renderStatusBadge(stock.quantity)}</span>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
              {renderActions(stock)}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderPagination = () => {
    const pages: number[] = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const endPage = Math.min(totalPages, startPage + maxVisible - 1);
    if (endPage - startPage + 1 < maxVisible) startPage = Math.max(1, endPage - maxVisible + 1);
    for (let i = startPage; i <= endPage; i++) pages.push(i);

    return totalPages > 1 && (
      <div className="flex items-center justify-between bg-white px-4 py-3 border-t border-gray-100 rounded-b-lg shadow">
        <div className="text-sm text-gray-600">
          Showing {startIndex + 1}-{Math.min(endIndex, totalStocks)} of {totalStocks}
        </div>
        <div className="flex items-center space-x-2">
          <motion.button whileHover={{ scale: 1.05 }} onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-200 rounded hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed">
            <ChevronLeft className="w-4 h-4" />
          </motion.button>
          {pages.map(p => (
            <motion.button key={p} whileHover={{ scale: 1.05 }} onClick={() => setCurrentPage(p)}
              className={`px-3 py-1.5 text-sm rounded ${currentPage === p ? 'bg-blue-600 text-white' : 'text-gray-600 bg-white border border-gray-200 hover:bg-blue-50'}`}>
              {p}
            </motion.button>
          ))}
          <motion.button whileHover={{ scale: 1.05 }} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-200 rounded hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed">
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
            <div className="flex items-center space-x-3">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Stock Management</h1>
                <p className="text-sm text-gray-500">Create, view and manage inventory items</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <motion.button whileHover={{ scale: 1.05 }} onClick={loadData} disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-blue-600 border border-gray-200 rounded hover:bg-blue-50 disabled:opacity-50">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="text-sm">Refresh</span>
              </motion.button>
              <motion.button whileHover={{ scale: 1.05 }} onClick={openAddForm}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition-colors shadow-md">
                <Plus className="w-4 h-4" />
                <span className="text-sm">Add Item</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg shadow border border-gray-100 p-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-50 rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-indigo-600">Total Items</p>
                <p className="text-xl font-semibold text-gray-900">{allStocks.length}</p>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg shadow border border-gray-100 p-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-50 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">In Stock</p>
                <p className="text-xl font-semibold text-gray-900">{allStocks.filter(s => s.quantity > 0).length}</p>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg shadow border border-gray-100 p-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-yellow-50 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Low Stock</p>
                <p className="text-xl font-semibold text-gray-900">{allStocks.filter(s => s.quantity > 0 && s.quantity < 10).length}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-lg shadow border border-gray-100 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={e => {
                  const [field, order] = e.target.value.split('-') as [keyof Stock, 'asc' | 'desc'];
                  setSortBy(field);
                  setSortOrder(order);
                }}
                className="text-sm border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="quantity-desc">Highest Stock</option>
                <option value="price-desc">Highest Price</option>
              </select>
              <div className="flex items-center border border-gray-200 rounded">
                <motion.button whileHover={{ scale: 1.05 }} onClick={() => setViewMode('table')} className={`p-2 text-sm transition-colors ${viewMode === 'table' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}>
                  <List className="w-4 h-4" />
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} onClick={() => setViewMode('grid')} className={`p-2 text-sm transition-colors ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}>
                  <Grid3X3 className="w-4 h-4" />
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} onClick={() => setViewMode('list')} className={`p-2 text-sm transition-colors ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}>
                  <List className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="bg-white rounded-lg shadow border border-gray-100 p-8 text-center text-gray-600">
            <div className="inline-flex items-center space-x-2">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">Loading stock items...</span>
            </div>
          </div>
        ) : stocks.length === 0 ? (
          <div className="bg-white rounded-lg shadow border border-gray-100 p-8 text-center">
            <p className="text-lg font-semibold text-gray-900">No Stock Items Available</p>
            <p className="text-sm text-gray-500 mt-1">Add your first item to get started.</p>
          </div>
        ) : (
          <div>
            {viewMode === 'table' && renderTableView()}
            {viewMode === 'grid' && renderGridView()}
            {viewMode === 'list' && renderListView()}
            {renderPagination()}
          </div>
        )}
      </div>

      {/* Toast, Loading, Delete Modal, Form Modal – 100% same as LeaveRequestDashboard */}
      <AnimatePresence>
        {operationStatus && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed top-4 right-4 z-50">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg shadow-lg text-sm ${operationStatus.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
              {operationStatus.type === 'success' ? <CheckCircle className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-red-600" />}
              <span className="font-medium">{operationStatus.message}</span>
              <motion.button whileHover={{ scale: 1.1 }} onClick={() => setOperationStatus(null)}>
                <X className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {operationLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40">
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
                Are you sure you want to delete <span className="font-semibold">{deleteConfirm.name}</span> (SKU: {deleteConfirm.sku})?
              </p>
              <div className="flex justify-end space-x-3">
                <motion.button whileHover={{ scale: 1.05 }} onClick={() => setDeleteConfirm(null)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded hover:bg-gray-50">
                  Cancel
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} onClick={() => handleDeleteStock(deleteConfirm)} className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700">
                  Delete
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form Modal – IDENTICAL to LeaveRequestDashboard */}
      <AnimatePresence>
        {showFormModal && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-xl overflow-y-auto max-h-screen">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                  <Box className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{editStock ? 'Edit Stock Item' : 'Create Stock Item'}</h3>
                  <p className="text-sm text-gray-500">Fill in the details below</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
                  <input value={formData.name} onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU (Auto-generated)</label>
                  <input value={formData.sku} disabled className="w-full px-3 py-2 border border-gray-200 rounded bg-gray-50 text-gray-500 cursor-not-allowed" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  |<div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                    <input type="number" value={formData.quantity} onChange={e => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit *</label>
                    <select value={formData.unit} onChange={e => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                      {UNIT_OPTIONS.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                  <input type="number" step="0.01" value={formData.price} onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                  <textarea value={formData.description} onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3} className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <motion.button whileHover={{ scale: 1.05 }} onClick={() => setShowFormModal(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded hover:bg-gray-50">
                  Cancel
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} onClick={handleCreateOrUpdateStock} disabled={operationLoading}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
                  {editStock ? 'Update' : 'Create'} Item
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StockManagementDashboard;