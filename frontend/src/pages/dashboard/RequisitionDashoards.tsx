// src/pages/RequisitionDashboard.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Plus, Edit, Trash2, Search, ChevronDown, Eye, ChevronLeft, ChevronRight,
  AlertTriangle, CheckCircle, XCircle, X, RefreshCw,
  Grid3X3, List, Package, Truck, Clock, User, Check, AlertOctagon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useOutletContext } from 'react-router-dom';
import requisitionService from '../../services/requisitionService';
import { useEmployeeAuth } from '../../context/EmployeeAuthContext';
import { format } from 'date-fns';
import { API_URL } from '../../api/api';
import { useSocketEvent } from '../../context/SocketContext';

import type {
  Requisition, RequisitionStatus, RequisitionItem,
  StockPurposeStatus,
} from '../../services/requisitionService';

import type { Employee } from '../../context/EmployeeAuthContext';

// ──────────────────────────────────────────────────────────────
// ── TYPES & INTERFACES ───────────────────────────────────────
// ──────────────────────────────────────────────────────────────
interface OutletContext {
  role: 'employee' | 'company';
}
interface OperationStatus {
  type: 'success' | 'error';
  message: string;
}
interface FormItem {
  itemName: string;
  quantity: number;
  unit: string;
  purpose: StockPurposeStatus | '';
  note?: string;
}
interface FormData {
  description: string;
  items: FormItem[];
}
interface ReceiveItem {
  itemId: string;
  itemName: string;
  quantity: number;
  unit: string;
  receivedQty: number;
  note?: string;
}

// ──────────────────────────────────────────────────────────────
// ── COMPONENT ─────────────────────────────────────────────────
// ──────────────────────────────────────────────────────────────
const RequisitionDashboard: React.FC = () => {
  const { user } = useEmployeeAuth();
  const { role } = useOutletContext<OutletContext>();
  const employeeId = user?.id;
  const isCompany = role === 'company';
  const isEmployee = role === 'employee';

  // ── STATE ──
  const [requisitions, setRequisitions] = useState<Requisition[]>([]);
  const [allRequisitions, setAllRequisitions] = useState<Requisition[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<keyof Requisition>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5);
  const [deleteConfirm, setDeleteConfirm] = useState<Requisition | null>(null);
  const [operationStatus, setOperationStatus] = useState<OperationStatus | null>(null);
  const [operationLoading, setOperationLoading] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid' | 'list'>('table');
  const [showFormModal, setShowFormModal] = useState<boolean>(false);
  const [editRequisition, setEditRequisition] = useState<Requisition | null>(null);
  const [approveConfirm, setApproveConfirm] = useState<Requisition | null>(null);
  const [rejectConfirm, setRejectConfirm] = useState<Requisition | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');
  const [receiveModal, setReceiveModal] = useState<Requisition | null>(null);
  const [receiveItems, setReceiveItems] = useState<ReceiveItem[]>([]);

  const [formData, setFormData] = useState<FormData>({
    description: '',
    items: []
  });

  const navigate = useNavigate();

  // ── SOCKET EVENTS ──
  useSocketEvent('requisitionCreated', (newReq: Requisition) => {
    setAllRequisitions(prev => [...prev, newReq]);
  }, []);

  useSocketEvent('requisitionUpdated', (updated: Requisition) => {
    setAllRequisitions(prev => prev.map(r => r.id === updated.id ? updated : r));
  }, []);

  useSocketEvent('requisitionApproved', (updated: Requisition) => {
    setAllRequisitions(prev => prev.map(r => r.id === updated.id ? updated : r));
  }, []);

  useSocketEvent('requisitionReceived', (updated: Requisition) => {
    setAllRequisitions(prev => prev.map(r => r.id === updated.id ? updated : r));
  }, []);

  useSocketEvent('requisitionRejected', (updated: Requisition) => {
    setAllRequisitions(prev => prev.map(r => r.id === updated.id ? updated : r));
  }, []);

  useSocketEvent('requisitionDeleted', ({ id }: { id: string }) => {
    setAllRequisitions(prev => prev.filter(r => r.id !== id));
  }, []);

  // ── LOAD DATA ──
  useEffect(() => {
    if (employeeId || isCompany) loadData();
  }, [employeeId, isCompany]);

  useEffect(() => {
    handleFilterAndSort();
  }, [searchTerm, sortBy, sortOrder, allRequisitions]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await requisitionService.getAll();
      let filtered = data;
      if (isEmployee && employeeId) {
        filtered = data.filter((r: Requisition) => r.employeeId === employeeId);
      }
      setAllRequisitions(Array.isArray(filtered) ? filtered : []);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load requisitions');
      setAllRequisitions([]);
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
    let filtered = [...allRequisitions];
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((r) =>
        r.description?.toLowerCase().includes(term) ||
        r.employee?.name?.toLowerCase().includes(term) ||
        r.items.some(i => i.itemName.toLowerCase().includes(term))
      );
    }
    filtered.sort((a, b) => {
      const aVal = (a[sortBy] ?? '').toString().toLowerCase();
      const bVal = (b[sortBy] ?? '').toString().toLowerCase();
      return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
    setRequisitions(filtered);
    setCurrentPage(1);
  };

  // ── FORM HELPERS ──
  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { itemName: '', quantity: 1, unit: 'pcs', purpose: '', note: '' }]
    }));
  };

  const updateItem = (index: number, field: keyof FormItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => i === index ? { ...item, [field]: value } : item)
    }));
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const resetForm = () => {
    setFormData({ description: '', items: [] });
    setEditRequisition(null);
    setShowFormModal(false);
  };

  // ── CRUD OPERATIONS ──
  const handleCreateOrUpdate = async () => {
    if (formData.items.length === 0 || formData.items.some(i => !i.itemName || !i.purpose)) {
      showOperationStatus('error', 'All items must have name and purpose');
      return;
    }
    try {
      setOperationLoading(true);
      const payload = {
        description: formData.description || undefined,
        items: formData.items.map(i => ({
          itemName: i.itemName,
          quantity: i.quantity,
          unit: i.unit || 'pcs',
          purpose: i.purpose,
          note: i.note
        }))
      };

      if (editRequisition) {
        await requisitionService.update(editRequisition.id, payload);
        showOperationStatus('success', 'Requisition updated');
      } else {
        await requisitionService.createRequisition(payload);
        showOperationStatus('success', 'Requisition created');
      }
      resetForm();
      await loadData();
    } catch (err: any) {
      showOperationStatus('error', err.message || 'Operation failed');
    } finally {
      setOperationLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!approveConfirm) return;
    try {
      setOperationLoading(true);
      await requisitionService.approve(approveConfirm.id);
      setApproveConfirm(null);
      showOperationStatus('success', 'Requisition approved');
    } catch (err: any) {
      showOperationStatus('error', err.message);
    } finally {
      setOperationLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      showOperationStatus('error', 'Rejection reason required');
      return;
    }
    if (!rejectConfirm) return;
    try {
      setOperationLoading(true);
      await requisitionService.reject(rejectConfirm.id, rejectReason);
      setRejectConfirm(null);
      setRejectReason('');
      showOperationStatus('success', 'Requisition rejected');
    } catch (err: any) {
      showOperationStatus('error', err.message);
    } finally {
      setOperationLoading(false);
    }
  };

  const handleReceiveItems = async () => {
    if (!receiveModal || receiveItems.some(i => i.receivedQty > i.quantity - i.receivedQty)) {
      showOperationStatus('error', 'Received quantity cannot exceed remaining');
      return;
    }
    try {
      setOperationLoading(true);
      const payload = receiveItems
        .filter(i => i.receivedQty > 0)
        .map(i => ({ itemId: i.itemId, receivedQty: i.receivedQty, note: i.note }));
      await requisitionService.receiveItems(receiveModal.id, payload);
      setReceiveModal(null);
      setReceiveItems([]);
      showOperationStatus('success', 'Items received successfully');
    } catch (err: any) {
      showOperationStatus('error', err.message);
    } finally {
      setOperationLoading(false);
    }
  };

  const handleDelete = async (req: Requisition) => {
    try {
      setOperationLoading(true);
      await requisitionService.delete(req.id);
      setDeleteConfirm(null);
      showOperationStatus('success', 'Requisition deleted');
    } catch (err: any) {
      showOperationStatus('error', err.message);
    } finally {
      setOperationLoading(false);
    }
  };

  // ── PERMISSIONS ──
  const canEdit = (req: Requisition) => isEmployee && req.employeeId === employeeId && req.status === 'PENDING';
  const canDelete = (req: Requisition) => isEmployee && req.employeeId === employeeId && req.status === 'PENDING';
  const canApproveReject = (req: Requisition) => isCompany && req.status === 'PENDING';
  const canReceive = (req: Requisition) => isEmployee && ['APPROVED', 'PARTIALLY_RECEIVED'].includes(req.status);

  // ── RENDER HELPERS ──
  const getStatusConfig = (status: RequisitionStatus) => {
    const cfg: Record<RequisitionStatus, { bg: string; txt: string; icon: any; label: string }> = {
      PENDING: { bg: 'bg-yellow-100', txt: 'text-yellow-800', icon: Clock, label: 'Pending' },
      APPROVED: { bg: 'bg-blue-100', txt: 'text-blue-800', icon: CheckCircle, label: 'Approved' },
      PARTIALLY_RECEIVED: { bg: 'bg-orange-100', txt: 'text-orange-800', icon: Package, label: 'Partially Received' },
      FULLY_RECEIVED: { bg: 'bg-green-100', txt: 'text-green-800', icon: Truck, label: 'Fully Received' },
      COMPLETED: { bg: 'bg-purple-100', txt: 'text-purple-800', icon: CheckCircle, label: 'Completed' },
      REJECTED: { bg: 'bg-red-100', txt: 'text-red-800', icon: XCircle, label: 'Rejected' },
    };
    return cfg[status] || cfg.PENDING;
  };

  const renderStatusBadge = (status: RequisitionStatus) => {
    const { bg, txt, icon: Icon, label } = getStatusConfig(status);
    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-medium ${bg} ${txt}`}>
        <Icon className="w-3 h-3" />
        <span>{label}</span>
      </span>
    );
  };

  const renderAvatar = (url?: string, size = 'w-10 h-10') => {
    if (!url) {
      return (
        <div className={`${size} bg-gray-100 rounded-full flex items-center justify-center`}>
          <User className="w-5 h-5 text-gray-400" />
        </div>
      );
    }
    return <img src={`${API_URL}${url}`} alt="" className={`${size} rounded-full object-cover border border-gray-200`} />;
  };

  const renderActions = (req: Requisition) => (
    <div className="flex items-center space-x-2">
      <motion.button whileHover={{ scale: 1.1 }} onClick={() => navigate(`/${role}/dashboard/requisition-management/view/${req.id}`)} className="text-gray-500 hover:text-primary-600 p-2 rounded-full hover:bg-primary-50 transition-colors" title="View">
        <Eye className="w-4 h-4" />
      </motion.button>
      {canEdit(req) && (
        <motion.button whileHover={{ scale: 1.1 }} onClick={() => {
         navigate(`/${role}/dashboard/requisition-management/update/${req.id}`)
        }} className="text-gray-500 hover:text-primary-600 p-2 rounded-full hover:bg-primary-50 transition-colors" title="Edit">
          <Edit className="w-4 h-4" />
        </motion.button>
      )}
      {canDelete(req) && (
        <motion.button whileHover={{ scale: 1.1 }} onClick={() => setDeleteConfirm(req)} className="text-gray-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors" title="Delete">
          <Trash2 className="w-4 h-4" />
        </motion.button>
      )}
      {canApproveReject(req) && (
        <>
          <motion.button whileHover={{ scale: 1.1 }} onClick={() => 
               navigate(`/${role}/dashboard/requisition-management/approve/${req.id}`)
               } className="text-gray-500 hover:text-green-600 p-2 rounded-full hover:bg-green-50 transition-colors" title="Approve">
            <Check className="w-4 h-4" />
          </motion.button>
          <motion.button whileHover={{ scale: 1.1 }} onClick={() => setRejectConfirm(req)} className="text-gray-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors" title="Reject">
            <AlertOctagon className="w-4 h-4" />
          </motion.button>
        </>
      )}
      {canReceive(req) && (
        <motion.button whileHover={{ scale: 1.1 }} onClick={() => {
          navigate(`/${role}/dashboard/requisition-management/receive/${req.id}`)
        }} className="text-gray-500 hover:text-orange-600 p-2 rounded-full hover:bg-orange-50 transition-colors" title="Receive Items">
          <Truck className="w-4 h-4" />
        </motion.button>
      )}
    </div>
  );

  // ── PAGINATION ──
  const totalRequisitions = allRequisitions.length;
  const totalPages = Math.ceil(requisitions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRequisitions = requisitions.slice(startIndex, endIndex);

  const renderPagination = () => {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    for (let i = startPage; i <= endPage; i++) pages.push(i);

    return (
      <div className="flex items-center justify-between bg-white px-4 py-3 border-t border-gray-100 rounded-b-lg shadow">
        <div className="text-xs text-gray-600">
          Showing {startIndex + 1}-{Math.min(endIndex, requisitions.length)} of {requisitions.length}
        </div>
        <div className="flex items-center space-x-2">
          <motion.button whileHover={{ scale: 1.05 }} onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}
            className="flex items-center px-3 py-1.5 text-xs text-gray-600 bg-white border border-gray-200 rounded hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed">
            <ChevronLeft className="w-4 h-4" />
          </motion.button>
          {pages.map((page) => (
            <motion.button key={page} whileHover={{ scale: 1.05 }} onClick={() => setCurrentPage(page)}
              className={`px-3 py-1.5 text-xs rounded ${currentPage === page ? 'bg-primary-600 text-white' : 'text-gray-600 bg-white border border-gray-200 hover:bg-primary-50'}`}>
              {page}
            </motion.button>
          ))}
          <motion.button whileHover={{ scale: 1.05 }} onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}
            className="flex items-center px-3 py-1.5 text-xs text-gray-600 bg-white border border-gray-200 rounded hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed">
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    );
  };

  // ── VIEWS ──
  const renderTableView = () => (
    <div className="bg-white rounded-lg shadow border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-3 px-4 text-gray-600 font-semibold">Employee profile</th>
              <th className="text-left py-3 px-4 text-gray-600 font-semibold">Employee Names</th>
              <th className="text-left py-3 px-4 text-gray-600 font-semibold">Items</th>
              <th className="text-left py-3 px-4 text-gray-600 font-semibold">Description</th>
              <th className="text-left py-3 px-4 text-gray-600 font-semibold">Status</th>
              <th className="text-right py-3 px-4 text-gray-600 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentRequisitions.map((req) => (
              <motion.tr key={req.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    {renderAvatar(req.employee?.profile_picture)}
                  </div>

                  
                  
                </td>
                <td className="py-3 px-4">
                  {req.employee?.first_name || req.employee?.last_name
                    ? `${req.employee?.first_name || ''} ${req.employee?.last_name || ''}`.trim()
                    : '—'}
                </td>
                <td className="py-3 px-4">
                  <div className="text-xs">
                    <span className="font-medium">{req.items.length} item{req.items.length > 1 ? 's' : ''}</span>
                    <div className="text-gray-500 truncate max-w-xs">
                      {req.items.map(i => `${i.quantity} ${i.unit} ${i.itemName}`).join(', ')}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-600">{req.description || '—'}</td>
                <td className="py-3 px-4">{renderStatusBadge(req.status)}</td>
                <td className="py-3 px-4 text-right">{renderActions(req)}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderGridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {currentRequisitions.map((req) => (
        <motion.div key={req.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow border border-gray-100 p-4 hover:shadow-md transition-shadow">
          <div className="flex flex-col items-center space-y-3 mb-3">
            {renderAvatar(req.employee?.profile_picture, 'w-16 h-16')}
            <div className="text-center w-full">
              <div className="font-semibold text-gray-900 text-xs truncate">{req.items.length} item{req.items.length > 1 ? 's' : ''}</div>
              <div className="text-gray-500 text-xs">
                {format(new Date(req.createdAt), 'dd MMM yyyy')}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>{renderActions(req)}</div>
          </div>
          <div className="mt-2">{renderStatusBadge(req.status)}</div>
        </motion.div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="bg-white rounded-lg shadow border border-gray-100 divide-y divide-gray-100">
      {currentRequisitions.map((req) => (
        <motion.div key={req.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="px-4 py-4 hover:bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              {renderAvatar(req.employee?.profile_picture)}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 text-xs truncate">{req.items.length} item{req.items.length > 1 ? 's' : ''}</div>
                <div className="text-gray-500 text-xs truncate">
                  {req.employee?.name || 'Unknown'} • {format(new Date(req.createdAt), 'dd MMM yyyy')}
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4 text-xs text-gray-600 flex-1 max-w-md px-4">
              <span className="truncate">{renderStatusBadge(req.status)}</span>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
              {renderActions(req)}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  // ── MAIN RETURN ──
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Header */}
      <div className="sticky top-0 bg-white shadow-md z-10">
        <div className="mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Requisition Management</h1>
                <p className="text-xs text-gray-500">Create, view and manage item requisitions</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <motion.button whileHover={{ scale: 1.05 }} onClick={loadData} disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-primary-600 border border-gray-200 rounded hover:bg-primary-50 disabled:opacity-50">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="text-xs">Refresh</span>
              </motion.button>
              {isEmployee && (
                <motion.button whileHover={{ scale: 1.05 }} onClick={() => {  navigate('/employee/dashboard/requisition-management/create') }}
                  className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded font-medium transition-colors shadow-md">
                  <Plus className="w-4 h-4" />
                  <span className="text-xs">New Requisition</span>
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white rounded-lg shadow border border-gray-100 p-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-primary-50 rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Total Requisitions</p>
                <p className="text-xl font-semibold text-gray-900">{totalRequisitions}</p>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white rounded-lg shadow border border-gray-100 p-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-50 rounded-full flex items-center justify-center">
                <Truck className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Fully Received</p>
                <p className="text-xl font-semibold text-gray-900">
                  {allRequisitions.filter(r => r.status === 'FULLY_RECEIVED').length}
                </p>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white rounded-lg shadow border border-gray-100 p-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-yellow-50 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Pending</p>
                <p className="text-xl font-semibold text-gray-900">
                  {allRequisitions.filter(r => r.status === 'PENDING').length}
                </p>
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
                  placeholder="Search requisitions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-') as [keyof Requisition, 'asc' | 'desc'];
                  setSortBy(field);
                  setSortOrder(order);
                }}
                className="text-xs border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="status-asc">Status A-Z</option>
                <option value="status-desc">Status Z-A</option>
              </select>
              <div className="flex items-center border border-gray-200 rounded">
                <motion.button whileHover={{ scale: 1.05 }} onClick={() => setViewMode('table')} className={`p-2 text-xs transition-colors ${viewMode === 'table' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:text-primary-600'}`} title="Table View">
                  <List className="w-4 h-4" />
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} onClick={() => setViewMode('grid')} className={`p-2 text-xs transition-colors ${viewMode === 'grid' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:text-primary-600'}`} title="Grid View">
                  <Grid3X3 className="w-4 h-4" />
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} onClick={() => setViewMode('list')} className={`p-2 text-xs transition-colors ${viewMode === 'list' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:text-primary-600'}`} title="List View">
                  <List className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-xs">
            {error}
          </motion.div>
        )}
        {loading ? (
          <div className="bg-white rounded-lg shadow border border-gray-100 p-8 text-center text-gray-600">
            <div className="inline-flex items-center space-x-2">
              <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs">Loading requisitions...</span>
            </div>
          </div>
        ) : requisitions.length === 0 ? (
          <div className="bg-white rounded-lg shadow border border-gray-100 p-8 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-lg font-semibold text-gray-900">
              {searchTerm ? 'No Requisitions Found' : 'No Requisitions Available'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {searchTerm ? 'Try adjusting your search criteria.' : 'Create a new requisition to get started.'}
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
      </div>

      {/* TOASTS */}
      <AnimatePresence>
        {operationStatus && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed top-4 right-4 z-50">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg shadow-lg text-xs ${operationStatus.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
              {operationStatus.type === 'success' ? <CheckCircle className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-red-600" />}
              <span className="font-medium">{operationStatus.message}</span>
              <motion.button whileHover={{ scale: 1.1 }} onClick={() => setOperationStatus(null)} className="hover:opacity-70">
                <X className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LOADING OVERLAY */}
      <AnimatePresence>
        {operationLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/30 flex items-center justify-center z-40">
            <div className="bg-white rounded-lg p-4 shadow-xl">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-700 text-xs font-medium">Processing...</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRM */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Requisition</h3>
                  <p className="text-xs text-gray-500">This action cannot be undone</p>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-xs text-gray-700">
                  Are you sure you want to delete this requisition?
                </p>
              </div>
              <div className="flex items-center justify-end space-x-3">
                <motion.button whileHover={{ scale: 1.05 }} onClick={() => setDeleteConfirm(null)} className="px-4 py-2 text-xs text-gray-600 border border-gray-200 rounded hover:bg-gray-50">
                  Cancel
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} onClick={() => handleDelete(deleteConfirm)} className="px-4 py-2 text-xs bg-red-600 text-white rounded hover:bg-red-700">
                  Delete
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* APPROVE CONFIRM */}
      <AnimatePresence>
        {approveConfirm && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Approve Requisition</h3>
                  <p className="text-xs text-gray-500">This will approve the requisition</p>
                </div>
              </div>
              <div className="flex items-center justify-end space-x-3">
                <motion.button whileHover={{ scale: 1.05 }} onClick={() => setApproveConfirm(null)} className="px-4 py-2 text-xs text-gray-600 border border-gray-200 rounded hover:bg-gray-50">
                  Cancel
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} onClick={handleApprove} className="px-4 py-2 text-xs bg-green-600 text-white rounded hover:bg-green-700">
                  Approve
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* REJECT WITH REASON */}
      <AnimatePresence>
        {rejectConfirm && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Reject Requisition</h3>
                  <p className="text-xs text-gray-500">Provide a reason for rejection</p>
                </div>
              </div>
              <div className="mb-4">
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Enter reason for rejection..."
                  className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows={3}
                />
              </div>
              <div className="flex items-center justify-end space-x-3">
                <motion.button whileHover={{ scale: 1.05 }} onClick={() => { setRejectConfirm(null); setRejectReason(''); }} className="px-4 py-2 text-xs text-gray-600 border border-gray-200 rounded hover:bg-gray-50">
                  Cancel
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} onClick={handleReject} disabled={!rejectReason.trim()} className="px-4 py-2 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50">
                  Reject
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RECEIVE ITEMS MODAL */}
      <AnimatePresence>
        {receiveModal && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-xl max-h-screen overflow-y-auto">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center">
                  <Truck className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Receive Items</h3>
                  <p className="text-xs text-gray-500">Enter received quantities</p>
                </div>
              </div>
              <div className="space-y-4">
                {receiveItems.map((item, idx) => (
                  <div key={item.itemId} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium text-sm">{item.itemName}</p>
                        <p className="text-xs text-gray-500">Requested: {item.quantity} {item.unit}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="number"
                        min="0"
                        max={item.quantity}
                        value={item.receivedQty}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          setReceiveItems(prev => prev.map((i, iidx) => iidx === idx ? { ...i, receivedQty: val } : i));
                        }}
                        className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Received quantity"
                      />
                      <input
                        type="text"
                        value={item.note || ''}
                        onChange={(e) => setReceiveItems(prev => prev.map((i, iidx) => iidx === idx ? { ...i, note: e.target.value } : i))}
                        className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Note (optional)"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-end space-x-3 mt-6">
                <motion.button whileHover={{ scale: 1.05 }} onClick={() => { setReceiveModal(null); setReceiveItems([]); }} className="px-4 py-2 text-xs text-gray-600 border border-gray-200 rounded hover:bg-gray-50">
                  Cancel
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} onClick={handleReceiveItems} className="px-4 py-2 text-xs bg-orange-600 text-white rounded hover:bg-orange-700">
                  Receive Items
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FORM MODAL */}
      <AnimatePresence>
        {showFormModal && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-xl max-h-screen overflow-y-auto">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {editRequisition ? 'Edit Requisition' : 'Create Requisition'}
                  </h3>
                  <p className="text-xs text-gray-500">Add items you need</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Description (Optional)</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows={2}
                    placeholder="Purpose of this requisition..."
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-medium text-gray-700">Items</label>
                    <button onClick={addItem} className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1">
                      <Plus className="w-4 h-4" /> Add Item
                    </button>
                  </div>
                  {formData.items.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded">
                      <Package className="w-12 h-12 mx-auto mb-2" />
                      <p>No items added yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {formData.items.map((item, idx) => (
                        <div key={idx} className="border border-gray-200 rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            <input
                              type="text"
                              value={item.itemName}
                              onChange={(e) => updateItem(idx, 'itemName', e.target.value)}
                              placeholder="Item name"
                              className="px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateItem(idx, 'quantity', parseInt(e.target.value) || 1)}
                              min="1"
                              className="px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                            <input
                              type="text"
                              value={item.unit}
                              onChange={(e) => updateItem(idx, 'unit', e.target.value)}
                              placeholder="Unit (pcs, kg, etc)"
                              className="px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                            <select
                              value={item.purpose}
                              onChange={(e) => updateItem(idx, 'purpose', e.target.value as StockPurposeStatus)}
                              className="px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                              <option value="">Purpose</option>
                              <option value="EATING">Eating</option>
                              <option value="DRINKING">Drinking</option>
                            </select>
                          </div>
                          <div className="mt-3">
                            <input
                              type="text"
                              value={item.note || ''}
                              onChange={(e) => updateItem(idx, 'note', e.target.value)}
                              placeholder="Note (optional)"
                              className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          </div>
                          <button onClick={() => removeItem(idx)} className="mt-2 text-xs text-red-600 hover:text-red-700">
                            Remove item
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-end space-x-3 mt-6">
                <motion.button whileHover={{ scale: 1.05 }} onClick={resetForm} className="px-4 py-2 text-xs text-gray-600 border border-gray-200 rounded hover:bg-gray-50">
                  Cancel
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} onClick={handleCreateOrUpdate} disabled={operationLoading} className="px-4 py-2 text-xs bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-50">
                  {editRequisition ? 'Update' : 'Submit'} Requisition
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RequisitionDashboard;