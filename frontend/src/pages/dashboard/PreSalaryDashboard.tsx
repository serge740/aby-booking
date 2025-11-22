// src/pages/PreSalaryDashboard.tsx
import React, { useState, useEffect } from 'react';
import {
  Plus, Edit, Trash2, Search, Eye, ChevronLeft, ChevronRight,
  AlertTriangle, CheckCircle, XCircle, X, RefreshCw, Grid3X3, List,
  DollarSign, User, Check, AlertOctagon, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useOutletContext } from 'react-router-dom';
import preSalaryService, { PreSalary } from '../../services/preSalaryService';
import { useEmployeeAuth } from '../../context/EmployeeAuthContext';
import { format } from 'date-fns';
import { useSocketEvent } from '../../context/SocketContext';

interface OutletContext {
  role: 'employee' | 'company';
}

interface OperationStatus {
  type: 'success' | 'error';
  message: string;
}

interface FormData {
  amount: string;
  currency: string;
  periodStart: string;
  periodEnd: string;
  reason: string;
}

const PreSalaryDashboard: React.FC = () => {
  /* ── AUTH & ROLE ── */
  const { user } = useEmployeeAuth();
  const { role } = useOutletContext<OutletContext>();
  const employeeId = user?.id;
  const isCompany = role === 'company';
  const isEmployee = role === 'employee';

  /* ── STATE ── */
  const [preSalaries, setPreSalaries] = useState<PreSalary[]>([]);
  const [allPreSalaries, setAllPreSalaries] = useState<PreSalary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<keyof PreSalary>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5);
  const [deleteConfirm, setDeleteConfirm] = useState<PreSalary | null>(null);
  const [operationStatus, setOperationStatus] = useState<OperationStatus | null>(null);
  const [operationLoading, setOperationLoading] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid' | 'list'>('table');
  const [showFormModal, setShowFormModal] = useState<boolean>(false);
  const [editPreSalary, setEditPreSalary] = useState<PreSalary | null>(null);
  const [approveConfirm, setApproveConfirm] = useState<PreSalary | null>(null);
  const [rejectConfirm, setRejectConfirm] = useState<PreSalary | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');
  const [formData, setFormData] = useState<FormData>({
    amount: '',
    currency: 'RWF',
    periodStart: '',
    periodEnd: '',
    reason: '',
  });
  const [approveNote, setApproveNote] = useState<string>('');

  const navigate = useNavigate();


// ── REAL-TIME STATE UPDATE (inside the component) ──
useSocketEvent(
  'preSalaryCreated',
  (newPre: PreSalary) => {
    setAllPreSalaries(prev => [...prev, newPre]);
    if (isEmployee && newPre.employeeId === employeeId){

    setPreSalaries(prev => [...prev, newPre]);   // will be filtered/sorted on next render
    }

  },
  []
);

useSocketEvent(
  'preSalaryUpdated',
  (updated: PreSalary) => {
    const replace = (prev: PreSalary[]) =>
      prev.map(p => (p.id === updated.id ? updated : p));

    setAllPreSalaries(replace);
    setPreSalaries(replace);
  },
  []
);

useSocketEvent(
  'preSalaryApproved',
  (approved: PreSalary) => {
    const replace = (prev: PreSalary[]) =>
      prev.map(p => (p.id === approved.id ? approved : p));

    setAllPreSalaries(replace);
    setPreSalaries(replace);
  },
  []
);

useSocketEvent(
  'preSalaryRejected',
  (rejected: PreSalary) => {
    const replace = (prev: PreSalary[]) =>
      prev.map(p => (p.id === rejected.id ? rejected : p));

    setAllPreSalaries(replace);
    setPreSalaries(replace);
  },
  []
);

useSocketEvent(
  'preSalaryDeleted',
  ({ id }: { id: string }) => {
    const remove = (prev: PreSalary[]) => prev.filter(p => p.id !== id);
    setAllPreSalaries(remove);
    setPreSalaries(remove);
  },
  []
);

  /* ── HELPERS ── */
  const formatCurrency = (amount: number, currency: string): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'RWF',
    }).format(amount);
  };

  const canEditPreSalary = (item: PreSalary): boolean => {
    return isCompany || (isEmployee && item.employeeId === employeeId && item.status === 'PENDING');
  };

  const canDeletePreSalary = (item: PreSalary): boolean => {
    return isCompany || (isEmployee && item.employeeId === employeeId && item.status === 'PENDING');
  };

  const canApproveReject = (item: PreSalary): boolean => {
    return isCompany && item.status === 'PENDING';
  };

  /* ── LOAD DATA ── */
  useEffect(() => {
    if (employeeId || isCompany) loadData();
  }, [employeeId, isCompany]);

  useEffect(() => {
    handleFilterAndSort();
  }, [searchTerm, sortBy, sortOrder, allPreSalaries]);

  const loadData = async (): Promise<void> => {
    try {
      setLoading(true);
      const data: PreSalary[] = await preSalaryService.getAllPreSalaries();
      let filtered = data;

      if (isEmployee && employeeId) {
        filtered = data.filter(l => l.employeeId === employeeId);
      }

      setAllPreSalaries(Array.isArray(filtered) ? filtered : []);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load pre-salary requests');
      setAllPreSalaries([]);
    } finally {
      setLoading(false);
    }
  };

  /* ── TOAST ── */
  const showOperationStatus = (type: 'success' | 'error', message: string, duration = 3000): void => {
    setOperationStatus({ type, message });
    setTimeout(() => setOperationStatus(null), duration);
  };

  /* ── FILTER / SORT ── */
  const handleFilterAndSort = (): void => {
    let filtered: PreSalary[] = [...allPreSalaries];

    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (l) =>
          l.amount?.toString().includes(searchTerm) ||
          l.employee?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          l.employee?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          l.currency?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      const aVal = a[sortBy] ?? '';
      const bVal = b[sortBy] ?? '';
      const aStr = aVal.toString().toLowerCase();
      const bStr = bVal.toString().toLowerCase();
      return sortOrder === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
    });

    setPreSalaries(filtered);
    setCurrentPage(1);
  };

  /* ── CREATE / UPDATE ── */
  const handleCreateOrUpdatePreSalary = async (): Promise<void> => {
    if (!formData.amount || !formData.periodStart || !formData.periodEnd) {
      showOperationStatus('error', 'Amount, start date, and end date are required');
      return;
    }

    const data = {
      amount: parseFloat(formData.amount),
      currency: formData.currency,
      periodStart: formData.periodStart,
      periodEnd: formData.periodEnd,
      reason: formData.reason || undefined,

    };

    try {
      setOperationLoading(true);
      if (editPreSalary) {
        await preSalaryService.updatePreSalary(editPreSalary.id, data);
        showOperationStatus('success', 'Pre-salary request updated');
      } else {
        await preSalaryService.createPreSalary({...data  ,employeeId,companyId:user?.companyId as any});
        showOperationStatus('success', 'Pre-salary request created');
      }
      resetForm();
      await loadData();
    } catch (err: any) {
      showOperationStatus('error', err.message || 'Operation failed');
    } finally {
      setOperationLoading(false);
    }
  };

  const resetForm = (): void => {
    setFormData({
      amount: '',
      currency: 'RWF',
      periodStart: '',
      periodEnd: '',
      reason: '',
    });
    setEditPreSalary(null);
    setShowFormModal(false);
  };

  /* ── EDIT / DELETE / APPROVE / REJECT ── */
  const handleEditPreSalary = (item: PreSalary): void => {
    if (!canEditPreSalary(item)) return;
    setEditPreSalary(item);
    setFormData({
      amount: item.amount.toString(),
      currency: item.currency,
      periodStart: item.periodStart.split('T')[0],
      periodEnd: item.periodEnd.split('T')[0],
      reason: item.reason || '',
    });
    setShowFormModal(true);
  };

  const handleDeletePreSalary = async (item: PreSalary): Promise<void> => {
    if (!canDeletePreSalary(item)) return;
    try {
      setOperationLoading(true);
      await preSalaryService.deletePreSalary(item.id);
      setDeleteConfirm(null);
      await loadData();
      showOperationStatus('success', 'Pre-salary request deleted');
    } catch (err: any) {
      showOperationStatus('error', err.message || 'Failed to delete');
    } finally {
      setOperationLoading(false);
    }
  };

const handleApprovePreSalary = async (): Promise<void> => {
  if (!approveConfirm || !canApproveReject(approveConfirm)) return;
  try {
    setOperationLoading(true);
    await preSalaryService.approvePreSalary(approveConfirm.id, approveNote.trim());
    setApproveConfirm(null);
    setApproveNote('');
    await loadData();
    showOperationStatus('success', 'Pre-salary approved successfully');
  } catch (err: any) {
    showOperationStatus('error', err.message || 'Failed to approve');
  } finally {
    setOperationLoading(false);
  }
};

  const handleRejectPreSalary = async (): Promise<void> => {
    if (!rejectReason.trim()) {
      showOperationStatus('error', 'Rejection reason required');
      return;
    }
    if (!rejectConfirm || !canApproveReject(rejectConfirm)) return;
    try {
      setOperationLoading(true);
      await preSalaryService.rejectPreSalary(rejectConfirm.id, rejectReason);
      setRejectConfirm(null);
      setRejectReason('');
      await loadData();
      showOperationStatus('success', 'Pre-salary rejected');
    } catch (err: any) {
      showOperationStatus('error', err.message);
    } finally {
      setOperationLoading(false);
    }
  };

  const handleViewPreSalary = (item: PreSalary): void => {
    if (!item?.id) return;
    navigate(`/${role}/dashboard/pre-salary/${item.id}`);
  };

  /* ── PAGINATION ── */
  const totalPreSalaries = allPreSalaries.length;
  const totalPages = Math.ceil(preSalaries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPreSalaries = preSalaries.slice(startIndex, endIndex);

  /* ── RENDER HELPERS ── */
  const renderStatusBadge = (status: PreSalary['status']) => {
    const cfg: Record<PreSalary['status'], { bg: string; txt: string; icon: any }> = {
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

  const renderAvatar = (employee: PreSalary['employee']) => {
    if (!employee) return (
      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
        <User className="w-5 h-5 text-gray-400" />
      </div>
    );
    return (
      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
        <span className="text-xs font-medium text-gray-700">
          {employee.first_name[0]}{employee.last_name[0]}
        </span>
      </div>
    );
  };

  /* ── ACTION BUTTONS ── */
  const renderActions = (item: PreSalary) => (
    <div className="flex items-center space-x-2">
      <motion.button
        whileHover={{ scale: 1.1 }}
        onClick={() => handleViewPreSalary(item)}
        className="text-gray-500 hover:text-primary-600 p-2 rounded-full hover:bg-primary-50 transition-colors"
        title="View"
      >
        <Eye className="w-4 h-4" />
      </motion.button>

      {canEditPreSalary(item) && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => handleEditPreSalary(item)}
          className="text-gray-500 hover:text-primary-600 p-2 rounded-full hover:bg-primary-50 transition-colors"
          title="Edit"
        >
          <Edit className="w-4 h-4" />
        </motion.button>
      )}

      {canDeletePreSalary(item) && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => setDeleteConfirm(item)}
          className="text-gray-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </motion.button>
      )}

      {canApproveReject(item) && (
        <>
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={() => setApproveConfirm(item)}
            className="text-gray-500 hover:text-green-600 p-2 rounded-full hover:bg-green-50 transition-colors"
            title="Approve"
          >
            <Check className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={() => setRejectConfirm(item)}
            className="text-gray-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
            title="Reject"
          >
            <AlertOctagon className="w-4 h-4" />
          </motion.button>
        </>
      )}
    </div>
  );

  /* ── VIEWS ── */
  const renderTableView = () => (
    <div className="bg-white rounded-lg shadow border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-3 px-4 text-gray-600 font-semibold">Employee</th>
              <th className="text-left py-3 px-4 text-gray-600 font-semibold">Amount</th>
              <th className="text-left py-3 px-4 text-gray-600 font-semibold hidden md:table-cell">Period</th>
              <th className="text-left py-3 px-4 text-gray-600 font-semibold">Status</th>
              <th className="text-right py-3 px-4 text-gray-600 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentPreSalaries.map((item) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="hover:bg-gray-50"
              >
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    {renderAvatar(item.employee)}
                    <span className="font-medium text-gray-900">
                      {item.employee ? `${item.employee.first_name} ${item.employee.last_name}` : '—'}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 font-medium text-gray-900">
                  {formatCurrency(item.amount, item.currency)}
                </td>
                <td className="py-3 px-4 text-gray-600 hidden md:table-cell">
                  {format(new Date(item.periodStart), 'dd MMM yyyy')} – {format(new Date(item.periodEnd), 'dd MMM yyyy')}
                </td>
                <td className="py-3 px-4">{renderStatusBadge(item.status)}</td>
                <td className="py-3 px-4 text-right">{renderActions(item)}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderGridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {currentPreSalaries.map((item) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow border border-gray-100 p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col items-center space-y-3 mb-3">
            {renderAvatar(item.employee)}
            <div className="text-center w-full">
              <div className="font-semibold text-gray-900 text-sm">
                {formatCurrency(item.amount, item.currency)}
              </div>
              <div className="text-gray-500 text-xs">
                {format(new Date(item.periodStart), 'dd MMM')} – {format(new Date(item.periodEnd), 'dd MMM')}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>{renderActions(item)}</div>
          </div>
          <div className="mt-2">{renderStatusBadge(item.status)}</div>
        </motion.div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="bg-white rounded-lg shadow border border-gray-100 divide-y divide-gray-100">
      {currentPreSalaries.map((item) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="px-4 py-4 hover:bg-gray-50"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              {renderAvatar(item.employee)}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 text-sm truncate">
                  {formatCurrency(item.amount, item.currency)}
                </div>
                <div className="text-gray-500 text-xs truncate">
                  {item.employee?.first_name} {item.employee?.last_name} • {format(new Date(item.periodStart), 'dd MMM')} – {format(new Date(item.periodEnd), 'dd MMM')}
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4 text-sm text-gray-600 flex-1 max-w-md px-4">
              <span className="truncate">{renderStatusBadge(item.status)}</span>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
              {renderActions(item)}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  /* ── PAGINATION ── */
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
          Showing {startIndex + 1}-{Math.min(endIndex, preSalaries.length)} of {preSalaries.length}
        </div>
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-200 rounded hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
            >
              {page}
            </motion.button>
          ))}
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-200 rounded hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    );
  };

  /* ── MAIN RETURN ── */
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Header */}
      <div className="sticky top-0 bg-white shadow-md z-10">
        <div className="mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Pre-Salary Management</h1>
                <p className="text-sm text-gray-500">Manage advance salary requests</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={loadData}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-primary-600 border border-gray-200 rounded hover:bg-primary-50 disabled:opacity-50"
                title="Refresh"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="text-sm">Refresh</span>
              </motion.button>
              {(isEmployee) && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => {
                    setEditPreSalary(null);
                    setFormData({
                      amount: '',
                      currency: 'RWF',
                      periodStart: '',
                      periodEnd: '',
                      reason: '',
                    });
                    setShowFormModal(true);
                  }}
                  disabled={operationLoading}
                  className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded font-medium transition-colors disabled:opacity-50 shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">Request Advance</span>
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
                <DollarSign className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Requests</p>
                <p className="text-xl font-semibold text-gray-900">{totalPreSalaries}</p>
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
                  {allPreSalaries.filter((l) => l.status === 'APPROVED').length}
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
                  {allPreSalaries.filter((l) => l.status === 'PENDING').length}
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
                  className="w-64 pl-10 pr-4 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-') as [keyof PreSalary, 'asc' | 'desc'];
                  setSortBy(field);
                  setSortOrder(order);
                }}
                className="text-sm border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="amount-desc">Amount (High-Low)</option>
                <option value="amount-asc">Amount (Low-High)</option>
              </select>
              <div className="flex items-center border border-gray-200 rounded">
                <motion.button whileHover={{ scale: 1.05 }} onClick={() => setViewMode('table')} className={`p-2 text-sm transition-colors ${viewMode === 'table' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:text-primary-600'}`} title="Table View">
                  <List className="w-4 h-4" />
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} onClick={() => setViewMode('grid')} className={`p-2 text-sm transition-colors ${viewMode === 'grid' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:text-primary-600'}`} title="Grid View">
                  <Grid3X3 className="w-4 h-4" />
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} onClick={() => setViewMode('list')} className={`p-2 text-sm transition-colors ${viewMode === 'list' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:text-primary-600'}`} title="List View">
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
              <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">Loading pre-salary requests...</span>
            </div>
          </div>
        ) : preSalaries.length === 0 ? (
          <div className="bg-white rounded-lg shadow border border-gray-100 p-8 text-center">
            <p className="text-lg font-semibold text-gray-900">
              {searchTerm ? 'No Requests Found' : 'No Pre-Salary Requests'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {searchTerm ? 'Try adjusting your search.' : 'Request an advance to get started.'}
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
                <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
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
                  Delete request for <span className="font-semibold">{formatCurrency(deleteConfirm.amount, deleteConfirm.currency)}</span>?
                </p>
              </div>
              <div className="flex items-center justify-end space-x-3">
                <motion.button whileHover={{ scale: 1.05 }} onClick={() => setDeleteConfirm(null)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded hover:bg-gray-50">
                  Cancel
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} onClick={() => handleDeletePreSalary(deleteConfirm)} className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700">
                  Delete
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* APPROVE WITH NOTE MODAL */}
<AnimatePresence>
  {approveConfirm && (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Approve Salary Advance</h3>
            <p className="text-sm text-gray-500">Add optional note for audit trail</p>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-700 mb-3">
            Approve <strong>{formatCurrency(approveConfirm.amount, approveConfirm.currency)}</strong> for{' '}
            <strong>{approveConfirm.employee?.first_name} {approveConfirm.employee?.last_name}</strong>?
          </p>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Approval Note <span className="text-gray-400">(optional)</span>
          </label>
          <textarea
            value={approveNote}
            onChange={(e) => setApproveNote(e.target.value)}
            placeholder="e.g., Emergency approved – payment scheduled for tomorrow"
            rows={3}
            className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="flex items-center justify-end space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => {
              setApproveConfirm(null);
              setApproveNote('');
            }}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded hover:bg-gray-50"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={handleApprovePreSalary}
            disabled={operationLoading}
            className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {operationLoading ? 'Approving...' : 'Approve Request'}
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
                  <h3 className="text-lg font-semibold text-gray-900">Reject Advance</h3>
                  <p className="text-sm text-gray-500">Provide a reason</p>
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
                <motion.button whileHover={{ scale: 1.05 }} onClick={handleRejectPreSalary} disabled={!rejectReason.trim()} className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50">
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
                <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {editPreSalary ? 'Edit Advance Request' : 'Request Salary Advance'}
                  </h3>
                  <p className="text-sm text-gray-500">Fill in the details below</p>
                </div>
              </div>
              <div className="space-y-4 mb-4">
                {/* Amount & Currency */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
                    <input
                      type="number"
                      min="1"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="500.00"
                    />
                  </div>
                  
                </div>
                {/* Period */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Period Start *</label>
                    <input
                      type="date"
                      value={formData.periodStart}
                      onChange={(e) => setFormData((prev) => ({ ...prev, periodStart: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Period End *</label>
                    <input
                      type="date"
                      value={formData.periodEnd}
                      onChange={(e) => setFormData((prev) => ({ ...prev, periodEnd: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                {/* Reason */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason (Optional)</label>
                  <textarea
                    value={formData.reason}
                    onChange={(e) => setFormData((prev) => ({ ...prev, reason: e.target.value }))}
                    placeholder="e.g., Emergency medical expense..."
                    className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex items-center justify-end space-x-3">
                <motion.button whileHover={{ scale: 1.05 }} onClick={resetForm} className="px-4 py-2 textUSERNAME-sm text-gray-600 border border-gray-200 rounded hover:bg-gray-50">
                  Cancel
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} onClick={handleCreateOrUpdatePreSalary} disabled={operationLoading} className="px-4 py-2 text-sm bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-50">
                  {editPreSalary ? 'Update' : 'Submit'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PreSalaryDashboard;