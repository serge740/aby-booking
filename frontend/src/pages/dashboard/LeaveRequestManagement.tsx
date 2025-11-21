// src/pages/LeaveRequestDashboard.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Plus, Edit, Trash2, Search, ChevronDown, Eye, ChevronLeft, ChevronRight,
  AlertTriangle, CheckCircle, XCircle, X, RefreshCw,
  Grid3X3, List, Upload, Image as ImageIcon, Calendar, Clock, User,
  Check, AlertOctagon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useOutletContext } from 'react-router-dom';
import leaveService from '../../services/leaveService';
import { useEmployeeAuth } from '../../context/EmployeeAuthContext';
import { format } from 'date-fns';
import { API_URL } from '../../api/api';
import { useSocketEvent } from '../../context/SocketContext';

// ──────────────────────────────────────────────────────────────
// ── TYPES & INTERFACES ───────────────────────────────────────
// ──────────────────────────────────────────────────────────────

interface Employee {
  id: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  profile_picture?: string;
}

interface LeaveRequest {
  id: string;
  type: 'VACATION' | 'SICK' | 'PERSONAL' | 'MATERNITY' | 'PATERNITY' | 'UNPAID' | 'COMPASSIONATE';
  startDate: string;
  endDate: string;
  reasonForRequest?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  employeeId: string;
  employee?: Employee;
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
  type: LeaveRequest['type'] | '';
  startDate: string;
  endDate: string;
  reasonForRequest: string;
  attachments: File[];
  attachmentPreviews: string[];
}

// ──────────────────────────────────────────────────────────────
// ── COMPONENT ─────────────────────────────────────────────────
// ──────────────────────────────────────────────────────────────

const LeaveRequestDashboard: React.FC = () => {
  // ── AUTH & ROLE ──
  const { user } = useEmployeeAuth();
  const { role } = useOutletContext<OutletContext>();
  const employeeId = user?.id;
  const isCompany = role === 'company';
  const isEmployee = role === 'employee';

  // ── STATE ──
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [allLeaves, setAllLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<keyof LeaveRequest>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5);
  const [deleteConfirm, setDeleteConfirm] = useState<LeaveRequest | null>(null);
  const [operationStatus, setOperationStatus] = useState<OperationStatus | null>(null);
  const [operationLoading, setOperationLoading] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid' | 'list'>('table');
  const [showFormModal, setShowFormModal] = useState<boolean>(false);
  const [editLeave, setEditLeave] = useState<LeaveRequest | null>(null);
  const [approveConfirm, setApproveConfirm] = useState<LeaveRequest | null>(null);
  const [rejectConfirm, setRejectConfirm] = useState<LeaveRequest | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');
  const [formData, setFormData] = useState<FormData>({
    type: '',
    startDate: '',
    endDate: '',
    reasonForRequest: '',
    attachments: [],
    attachmentPreviews: [],
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // ── HELPERS ──
  const formatLeaveType = (type: LeaveRequest['type']): string => {
    const map: Record<LeaveRequest['type'], string> = {
      VACATION: 'Vacation Leave',
      SICK: 'Sick Leave',
      PERSONAL: 'Personal Leave',
      MATERNITY: 'Maternity Leave',
      PATERNITY: 'Paternity Leave',
      UNPAID: 'Unpaid Leave',
      COMPASSIONATE: 'Compassionate Leave',
    };
    return map[type] || type;
  };

  const canEditLeave = (leave: LeaveRequest): boolean => {
    return isCompany || (isEmployee && leave.employeeId === employeeId && leave.status === 'PENDING');
  };

  const canDeleteLeave = (leave: LeaveRequest): boolean => {
    return isCompany || (isEmployee && leave.employeeId === employeeId && leave.status === 'PENDING');
  };

  const canApproveReject = (leave: LeaveRequest): boolean => {
    return isCompany && leave.status === 'PENDING';
  };

  useSocketEvent(
  'leaveCreated',
  (newLeave: LeaveRequest) => {
    setAllLeaves(prev => [...prev, newLeave]);
    setLeaves(prev => [...prev, newLeave]);   // will be filtered/sorted automatically on next render
  },
  []
);

useSocketEvent(
  'leaveUpdated',
  (updatedLeave: LeaveRequest) => {
    const updateOne = (prev: LeaveRequest[]) =>
      prev.map(l => (l.id === updatedLeave.id ? updatedLeave : l));

    setAllLeaves(updateOne);
    setLeaves(updateOne);
  },
  []
);

useSocketEvent(
  'leaveApproved',
  (approvedLeave: LeaveRequest) => {
    const updateOne = (prev: LeaveRequest[]) =>
      prev.map(l => (l.id === approvedLeave.id ? approvedLeave : l));

    setAllLeaves(updateOne);
    setLeaves(updateOne);
  },
  []
);

useSocketEvent(
  'leaveRejected',
  (rejectedLeave: LeaveRequest) => {
    const updateOne = (prev: LeaveRequest[]) =>
      prev.map(l => (l.id === rejectedLeave.id ? rejectedLeave : l));

    setAllLeaves(updateOne);
    setLeaves(updateOne);
  },
  []
);

useSocketEvent(
  'leaveDeleted',
  ({ id }: { id: string }) => {
    const removeOne = (prev: LeaveRequest[]) => prev.filter(l => l.id !== id);
    setAllLeaves(removeOne);
    setLeaves(removeOne);
  },
  []
);

  // ── LOAD DATA ──
  useEffect(() => {
    if (employeeId || isCompany) loadData();
  }, [employeeId, isCompany]);

  useEffect(() => {
    handleFilterAndSort();
  }, [searchTerm, sortBy, sortOrder, allLeaves]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await leaveService.getAllLeaves();
      let filtered = data;

      if (isEmployee && employeeId) {
        filtered = data.filter((l: LeaveRequest) => l.employeeId === employeeId);
      }

      setAllLeaves(Array.isArray(filtered) ? filtered : []);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load leave requests');
      setAllLeaves([]);
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
    let filtered = [...allLeaves];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((l) =>
        formatLeaveType(l.type).toLowerCase().includes(term) ||
        l.employee?.name?.toLowerCase().includes(term)
      );
    }

    filtered.sort((a, b) => {
      const aVal = (a[sortBy] ?? '').toString().toLowerCase();
      const bVal = (b[sortBy] ?? '').toString().toLowerCase();
      return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });

    setLeaves(filtered);
    setCurrentPage(1);
  };

  // ── FILE HANDLING ──
  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newFiles: File[] = [];
    const newPreviews: string[] = [];

    files.forEach((f) => {
      if (!f.type.startsWith('image/') && f.type !== 'application/pdf') {
        showOperationStatus('error', 'Only images and PDFs are allowed');
        return;
      }
      if (f.size > 5 * 1024 * 1024) {
        showOperationStatus('error', `${f.name} exceeds 5 MB`);
        return;
      }
      newFiles.push(f);
      newPreviews.push(URL.createObjectURL(f));
    });

    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...newFiles],
      attachmentPreviews: [...prev.attachmentPreviews, ...newPreviews],
    }));
  };

  const removeAttachment = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
      attachmentPreviews: prev.attachmentPreviews.filter((_, i) => i !== index),
    }));
  };

  // ── CREATE / UPDATE ──
  const handleCreateOrUpdateLeave = async () => {
    if (!formData.type || !formData.startDate || !formData.endDate) {
      showOperationStatus('error', 'All required fields must be filled');
      return;
    }

    const fd = new FormData();
    fd.append('type', formData.type);
    fd.append('startDate', formData.startDate);
    fd.append('endDate', formData.endDate);
    if (user?.companyId) fd.append('companyId', user.companyId);
    if (formData.reasonForRequest) fd.append('reasonForRequest', formData.reasonForRequest);
    formData.attachments.forEach((file) => fd.append('attachments[]', file));

    try {
      setOperationLoading(true);
      if (editLeave) {
        await leaveService.updateLeave(editLeave.id, fd);
        showOperationStatus('success', 'Leave request updated');
      } else {
        await leaveService.createLeave(fd);
        showOperationStatus('success', 'Leave request created');
      }
      resetForm();
      await loadData();
    } catch (err: any) {
      showOperationStatus('error', err.message || 'Operation failed');
    } finally {
      setOperationLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      type: '',
      startDate: '',
      endDate: '',
      reasonForRequest: '',
      attachments: [],
      attachmentPreviews: [],
    });
    setEditLeave(null);
    setShowFormModal(false);
  };

  // ── EDIT / DELETE / APPROVE / REJECT ──
  const handleEditLeave = (leave: LeaveRequest) => {
    if (!canEditLeave(leave)) return;
    setEditLeave(leave);
    setFormData({
      type: leave.type,
      startDate: leave.startDate.split('T')[0],
      endDate: leave.endDate.split('T')[0],
      reasonForRequest: leave.reasonForRequest || '',
      attachments: [],
      attachmentPreviews: [],
    });
    setShowFormModal(true);
  };

  const handleDeleteLeave = async (leave: LeaveRequest) => {
    if (!canDeleteLeave(leave)) return;
    try {
      setOperationLoading(true);
      await leaveService.deleteLeave(leave.id);
      setDeleteConfirm(null);
      await loadData();
      showOperationStatus('success', `${formatLeaveType(leave.type)} deleted`);
    } catch (err: any) {
      showOperationStatus('error', err.message || 'Failed to delete');
    } finally {
      setOperationLoading(false);
    }
  };

  const handleApproveLeave = async (leave: LeaveRequest) => {
    if (!canApproveReject(leave)) return;
    try {
      setOperationLoading(true);
      await leaveService.approveLeave(leave.id);
      setApproveConfirm(null);
      await loadData();
      showOperationStatus('success', 'Leave approved');
    } catch (err: any) {
      showOperationStatus('error', err.message);
    } finally {
      setOperationLoading(false);
    }
  };

  const handleRejectLeave = async () => {
    if (!rejectReason.trim()) {
      showOperationStatus('error', 'Rejection reason required');
      return;
    }
    if (!rejectConfirm || !canApproveReject(rejectConfirm)) return;
    try {
      setOperationLoading(true);
      await leaveService.rejectLeave(rejectConfirm.id, rejectReason);
      setRejectConfirm(null);
      setRejectReason('');
      await loadData();
      showOperationStatus('success', 'Leave rejected');
    } catch (err: any) {
      showOperationStatus('error', err.message);
    } finally {
      setOperationLoading(false);
    }
  };

  const handleViewLeave = (leave: LeaveRequest) => {
    if (!leave?.id) return;
    navigate(`/${role}/dashboard/leave-request/${leave.id}`);
  };

  // ── PAGINATION ──
  const totalLeaves = allLeaves.length;
  const totalPages = Math.ceil(leaves.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLeaves = leaves.slice(startIndex, endIndex);

  // ── RENDER HELPERS ──
  const renderStatusBadge = (status: LeaveRequest['status']) => {
    const cfg: Record<LeaveRequest['status'], { bg: string; txt: string; icon: any }> = {
      PENDING: { bg: 'bg-yellow-100', txt: 'text-yellow-800', icon: Clock },
      APPROVED: { bg: 'bg-green-100', txt: 'text-green-800', icon: CheckCircle },
      REJECTED: { bg: 'bg-red-100', txt: 'text-red-800', icon: XCircle },
    };
    const { bg, txt, icon: Icon } = cfg[status];
    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-medium ${bg} ${txt}`}>
        <Icon className="w-3 h-3" />
        <span>{status}</span>
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

  // ── ACTION BUTTONS ──
  const renderActions = (leave: LeaveRequest) => (
    <div className="flex items-center space-x-2">
      <motion.button
        whileHover={{ scale: 1.1 }}
        onClick={() => handleViewLeave(leave)}
        className="text-gray-500 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-colors"
        title="View"
      >
        <Eye className="w-4 h-4" />
      </motion.button>

      {canEditLeave(leave) && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => handleEditLeave(leave)}
          className="text-gray-500 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-colors"
          title="Edit"
        >
          <Edit className="w-4 h-4" />
        </motion.button>
      )}

      {canDeleteLeave(leave) && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => setDeleteConfirm(leave)}
          className="text-gray-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </motion.button>
      )}

      {canApproveReject(leave) && (
        <>
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={() => setApproveConfirm(leave)}
            className="text-gray-500 hover:text-green-600 p-2 rounded-full hover:bg-green-50 transition-colors"
            title="Approve"
          >
            <Check className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={() => setRejectConfirm(leave)}
            className="text-gray-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
            title="Reject"
          >
            <AlertOctagon className="w-4 h-4" />
          </motion.button>
        </>
      )}
    </div>
  );

  // ── VIEWS ──
  const renderTableView = () => (
    <div className="bg-white rounded-lg shadow border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-3 px-4 text-gray-600 font-semibold">Employee</th>
              <th
                className="text-left py-3 px-4 text-gray-600 font-semibold cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  setSortBy('type');
                  setSortOrder(sortBy === 'type' ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'asc');
                }}
              >
                <div className="flex items-center space-x-1">
                  <span>Type</span>
                  <ChevronDown className={`w-4 h-4 ${sortBy === 'type' ? 'text-blue-600' : 'text-gray-400'}`} />
                </div>
              </th>
              <th className="text-left py-3 px-4 text-gray-600 font-semibold hidden md:table-cell">Dates</th>
              <th className="text-left py-3 px-4 text-gray-600 font-semibold">Status</th>
              <th className="text-right py-3 px-4 text-gray-600 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentLeaves.map((leave) => (
              <motion.tr
                key={leave.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="hover:bg-gray-50"
              >
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    {renderAvatar(leave.employee?.profile_picture)}
                   <span className="font-medium text-gray-900">
  {leave.employee?.first_name || leave.employee?.last_name
    ? `${leave.employee?.first_name || ''} ${leave.employee?.last_name || ''}`.trim()
    : '—'}
</span>

                  </div>
                </td>
                <td className="py-3 px-4 font-medium text-gray-900">{formatLeaveType(leave.type)}</td>
                <td className="py-3 px-4 text-gray-600 hidden md:table-cell">
                  {format(new Date(leave.startDate), 'dd MMM yyyy')} – {format(new Date(leave.endDate), 'dd MMM yyyy')}
                </td>
                <td className="py-3 px-4">{renderStatusBadge(leave.status)}</td>
                <td className="py-3 px-4 text-right">{renderActions(leave)}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderGridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {currentLeaves.map((leave) => (
        <motion.div
          key={leave.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow border border-gray-100 p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col items-center space-y-3 mb-3">
            {renderAvatar(leave.employee?.profile_picture, 'w-16 h-16')}
            <div className="text-center w-full">
              <div className="font-semibold text-gray-900 text-sm truncate">{formatLeaveType(leave.type)}</div>
              <div className="text-gray-500 text-xs">
                {format(new Date(leave.startDate), 'dd MMM')} – {format(new Date(leave.endDate), 'dd MMM')}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>{renderActions(leave)}</div>
          </div>
          <div className="mt-2">{renderStatusBadge(leave.status)}</div>
        </motion.div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="bg-white rounded-lg shadow border border-gray-100 divide-y divide-gray-100">
      {currentLeaves.map((leave) => (
        <motion.div
          key={leave.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="px-4 py-4 hover:bg-gray-50"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              {renderAvatar(leave.employee?.profile_picture)}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 text-sm truncate">{formatLeaveType(leave.type)}</div>
                <div className="text-gray-500 text-xs truncate">
                  {leave.employee?.name} • {format(new Date(leave.startDate), 'dd MMM')} – {format(new Date(leave.endDate), 'dd MMM')}
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4 text-sm text-gray-600 flex-1 max-w-md px-4">
              <span className="truncate">{renderStatusBadge(leave.status)}</span>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
              {renderActions(leave)}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

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
        <div className="text-sm text-gray-600">
          Showing {startIndex + 1}-{Math.min(endIndex, leaves.length)} of {leaves.length}
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

  // ── MAIN RETURN ──
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Header */}
      <div className="sticky top-0 bg-white shadow-md z-10">
        <div className="mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Leave Request Management</h1>
                <p className="text-sm text-gray-500">Create, view and manage employee leave requests</p>
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
              {(isEmployee || isCompany) && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => {
                    setEditLeave(null);
                    setFormData({
                      type: '',
                      startDate: '',
                      endDate: '',
                      reasonForRequest: '',
                      attachments: [],
                      attachmentPreviews: [],
                    });
                    setShowFormModal(true);
                  }}
                  disabled={operationLoading}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition-colors disabled:opacity-50 shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">Add Request</span>
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
              <div className="p-3 bg-blue-50 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Requests</p>
                <p className="text-xl font-semibold text-gray-900">{totalLeaves}</p>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white rounded-lg shadow border border-gray-100 p-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-50 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-xl font-semibold text-gray-900">
                  {allLeaves.filter((l) => l.status === 'APPROVED').length}
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
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-xl font-semibold text-gray-900">
                  {allLeaves.filter((l) => l.status === 'PENDING').length}
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
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-') as [keyof LeaveRequest, 'asc' | 'desc'];
                  setSortBy(field);
                  setSortOrder(order);
                }}
                className="text-sm border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="type-asc">Type (A-Z)</option>
                <option value="type-desc">Type (Z-A)</option>
              </select>
              <div className="flex items-center border border-gray-200 rounded">
                <motion.button whileHover={{ scale: 1.05 }} onClick={() => setViewMode('table')} className={`p-2 text-sm transition-colors ${viewMode === 'table' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-blue-600'}`} title="Table View">
                  <List className="w-4 h-4" />
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} onClick={() => setViewMode('grid')} className={`p-2 text-sm transition-colors ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-blue-600'}`} title="Grid View">
                  <Grid3X3 className="w-4 h-4" />
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} onClick={() => setViewMode('list')} className={`p-2 text-sm transition-colors ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-blue-600'}`} title="List View">
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
          <div className="bg-white rounded-lg shadow border border-gray-100 p-8 text-center text-gray-600">
            <div className="inline-flex items-center space-x-2">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">Loading leave requests...</span>
            </div>
          </div>
        ) : leaves.length === 0 ? (
          <div className="bg-white rounded-lg shadow border border-gray-100 p-8 text-center">
            <p className="text-lg font-semibold text-gray-900">
              {searchTerm ? 'No Requests Found' : 'No Leave Requests Available'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {searchTerm ? 'Try adjusting your search criteria.' : 'Add a new request to get started.'}
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
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg shadow-lg text-sm ${operationStatus.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
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
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-700 text-sm font-medium">Processing...</span>
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
                  <h3 className="text-lg font-semibold text-gray-900">Delete Request</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-700">
                  Are you sure you want to delete <span className="font-semibold">{formatLeaveType(deleteConfirm.type)}</span>?
                </p>
              </div>
              <div className="flex items-center justify-end space-x-3">
                <motion.button whileHover={{ scale: 1.05 }} onClick={() => setDeleteConfirm(null)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded hover:bg-gray-50">
                  Cancel
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} onClick={() => handleDeleteLeave(deleteConfirm)} className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700">
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
                  <h3 className="text-lg font-semibold text-gray-900">Approve Leave</h3>
                  <p className="text-sm text-gray-500">Confirm approval of this request</p>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-700">
                  Approve <span className="font-semibold">{formatLeaveType(approveConfirm.type)}</span> for{' '}
                  <span className="font-semibold">{approveConfirm.employee?.name}</span>?
                </p>
              </div>
              <div className="flex items-center justify-end space-x-3">
                <motion.button whileHover={{ scale: 1.05 }} onClick={() => setApproveConfirm(null)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded hover:bg-gray-50">
                  Cancel
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} onClick={() => handleApproveLeave(approveConfirm)} className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700">
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
                  <h3 className="text-lg font-semibold text-gray-900">Reject Leave</h3>
                  <p className="text-sm text-gray-500">Provide a reason for rejection</p>
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
                <motion.button whileHover={{ scale: 1.05 }} onClick={() => { setRejectConfirm(null); setRejectReason(''); }} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded hover:bg-gray-50">
                  Cancel
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} onClick={handleRejectLeave} disabled={!rejectReason.trim()} className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50">
                  Reject
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
            <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-xl overflow-y-auto max-h-screen">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {editLeave ? 'Edit Leave Request' : 'Create Leave Request'}
                  </h3>
                  <p className="text-sm text-gray-500">Fill in the details below</p>
                </div>
              </div>
              <div className="space-y-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value as LeaveRequest['type'] | '' }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select type</option>
                    <option value="VACATION">Vacation Leave</option>
                    <option value="SICK">Sick Leave</option>
                    <option value="PERSONAL">Personal Leave</option>
                    <option value="MATERNITY">Maternity Leave</option>
                    <option value="PATERNITY">Paternity Leave</option>
                    <option value="UNPAID">Unpaid Leave</option>
                    <option value="COMPASSIONATE">Compassionate Leave</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason (Optional)</label>
                  <textarea
                    value={formData.reasonForRequest}
                    onChange={(e) => setFormData((prev) => ({ ...prev, reasonForRequest: e.target.value }))}
                    placeholder="Explain your leave request..."
                    className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Attachments (Images/PDF)</label>
                  <div className="space-y-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,application/pdf"
                      multiple
                      onChange={handleAttachmentChange}
                      className="hidden"
                      id="leave-attachments"
                    />
                    <label
                      htmlFor="leave-attachments"
                      className="cursor-pointer inline-flex items-center space-x-2 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      <span>
                        {formData.attachments.length ? `Change Files (${formData.attachments.length})` : 'Upload Files'}
                      </span>
                    </label>
                    <p className="text-xs text-gray-500">Max 5MB per file, multiple allowed</p>
                    {formData.attachmentPreviews.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.attachmentPreviews.map((preview, i) => (
                          <div key={i} className="relative group">
                            {formData.attachments[i].type.startsWith('image/') ? (
                              <img src={preview} alt="Preview" className="w-20 h-20 object-cover rounded border border-gray-200" />
                            ) : (
                              <div className="w-20 h-20 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                                <ImageIcon className="w-8 h-8 text-gray-400" />
                              </div>
                            )}
                            <button
                              onClick={() => removeAttachment(i)}
                              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end space-x-3">
                <motion.button whileHover={{ scale: 1.05 }} onClick={resetForm} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded hover:bg-gray-50">
                  Cancel
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} onClick={handleCreateOrUpdateLeave} disabled={operationLoading} className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
                  {editLeave ? 'Update' : 'Submit'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LeaveRequestDashboard;