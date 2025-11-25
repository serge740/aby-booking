// src/pages/RiskReportDashboard.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Plus, Edit, Trash2, Search, Eye, ChevronLeft, ChevronRight,
  AlertTriangle, CheckCircle, XCircle, X, RefreshCw,
  Grid3X3, List, Upload, Image as ImageIcon, FileText, Clock,
  Check, AlertOctagon, User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useOutletContext } from 'react-router-dom';
import riskReportService, { RiskReport, RiskReportAttachment } from '../../services/riskReportService';
import { useEmployeeAuth } from '../../context/EmployeeAuthContext';
import { format } from 'date-fns';
import { API_URL } from '../../api/api';
import { useSocketEvent } from '../../context/SocketContext';

interface OutletContext {
  role: 'employee' | 'company';
}

interface OperationStatus {
  type: 'success' | 'error';
  message: string;
}

interface FormData {
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  attachments: File[];
  attachmentPreviews: string[];
}

const SEVERITY_LABELS: Record<FormData['severity'], string> = {
  LOW: 'Low Risk',
  MEDIUM: 'Medium Risk',
  HIGH: 'High Risk',
  CRITICAL: 'Critical Risk',
};

const RiskReportDashboard: React.FC = () => {
  /* ── AUTH & ROLE ── */
  const { user } = useEmployeeAuth();
  const { role } = useOutletContext<OutletContext>();
  const employeeId = user?.id;
  const isCompany = role === 'company';
  const isEmployee = role === 'employee';

  /* ── STATE ── */
  const [reports, setReports] = useState<RiskReport[]>([]);
  const [allReports, setAllReports] = useState<RiskReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<keyof RiskReport>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5);
  const [deleteConfirm, setDeleteConfirm] = useState<RiskReport | null>(null);
  const [operationStatus, setOperationStatus] = useState<OperationStatus | null>(null);
  const [operationLoading, setOperationLoading] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid' | 'list'>('table');
  const [showFormModal, setShowFormModal] = useState<boolean>(false);
  const [editReport, setEditReport] = useState<RiskReport | null>(null);
const [resolveConfirm, setResolveConfirm] = useState<RiskReport | null>(null);
const [resolveReason, setResolveReason] = useState<string>(''); // ← ADD THIS
  const [rejectConfirm, setRejectConfirm] = useState<RiskReport | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    severity: 'MEDIUM',
    attachments: [],
    attachmentPreviews: [],
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // ── REAL-TIME STATE UPDATE (inside the component) ──
useSocketEvent(
  'riskReportCreated',
  (newReport: RiskReport) => {
    setAllReports(prev => [...prev, newReport]);
    if( isEmployee && newReport.employeeId === employeeId){
    setReports(prev => [...prev, newReport]); // will be filtered/sorted automatically on next render
    }
  },
  []
);
useSocketEvent(
  'riskReportUpdated',
  (updatedReport: RiskReport) => {
    const updateOne = (prev: RiskReport[]) =>
      prev.map(r => (r.id === updatedReport.id ? updatedReport : r));
    setAllReports(updateOne);
    setReports(updateOne);
  },
  []
);
useSocketEvent(
  'riskReportResolved',
  (resolvedReport: RiskReport) => {
    const updateOne = (prev: RiskReport[]) =>
      prev.map(r => (r.id === resolvedReport.id ? resolvedReport : r));
    setAllReports(updateOne);
    setReports(updateOne);
  },
  []
);
useSocketEvent(
  'riskReportRejected',
  (rejectedReport: RiskReport) => {
    const updateOne = (prev: RiskReport[]) =>
      prev.map(r => (r.id === rejectedReport.id ? rejectedReport : r));
    setAllReports(updateOne);
    setReports(updateOne);
  },
  []
);
useSocketEvent(
  'riskReportDeleted',
  ({ id }: { id: string }) => {
    const removeOne = (prev: RiskReport[]) => prev.filter(r => r.id !== id);
    setAllReports(removeOne);
    setReports(removeOne);
  },
  []
);
  /* ── HELPERS ── */
  const canEditReport = (r: RiskReport): boolean => {
    return isCompany || (isEmployee && r.employeeId === employeeId && r.status === 'PENDING');
  };
  const canDeleteReport = (r: RiskReport): boolean => {
    return isCompany || (isEmployee && r.employeeId === employeeId && r.status === 'PENDING');
  };
  const canResolveReject = (r: RiskReport): boolean => {
    return isCompany && r.status === 'PENDING';
  };

  const formatDate = (d: string) => format(new Date(d), 'dd MMM yyyy');

  const showOperationStatus = (type: 'success' | 'error', message: string, duration = 3000) => {
    setOperationStatus({ type, message });
    setTimeout(() => setOperationStatus(null), duration);
  };

  /* ── LOAD DATA ── */
  useEffect(() => {
    if (employeeId || isCompany) loadData();
  }, [employeeId, isCompany]);

  useEffect(() => {
    handleFilterAndSort();
  }, [searchTerm, sortBy, sortOrder, allReports]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await riskReportService.getAllRiskReports();
      let filtered = data;
      if (isEmployee && employeeId) {
        filtered = data.filter(r => r.employeeId === employeeId);
      }
      setAllReports(Array.isArray(filtered) ? filtered : []);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load risk reports');
      setAllReports([]);
    } finally {
      setLoading(false);
    }
  };

  /* ── FILTER / SORT ── */
  const handleFilterAndSort = () => {
    let filtered = [...allReports];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(r =>
        r.title.toLowerCase().includes(term) ||
        r.description.toLowerCase().includes(term) ||
        r.employee?.name?.toLowerCase().includes(term) ||
        r.severity.toLowerCase().includes(term)
      );
    }

    filtered.sort((a, b) => {
      const aVal = a[sortBy] ?? '';
      const bVal = b[sortBy] ?? '';
      const aStr = aVal.toString().toLowerCase();
      const bStr = bVal.toString().toLowerCase();
      return sortOrder === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
    });

    setReports(filtered);
    setCurrentPage(1);
  };

  /* ── FILE HANDLING ── */
  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newFiles: File[] = [];
    const newPreviews: string[] = [];

    files.forEach(f => {
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

    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...newFiles],
      attachmentPreviews: [...prev.attachmentPreviews, ...newPreviews],
    }));
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
      attachmentPreviews: prev.attachmentPreviews.filter((_, i) => i !== index),
    }));
  };

  /* ── CREATE / UPDATE ── */
  const handleCreateOrUpdateReport = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      showOperationStatus('error', 'Title and description are required');
      return;
    }

    const fd = new FormData();
    fd.append('title', formData.title);
    fd.append('description', formData.description);
    fd.append('severity', formData.severity);
   if(user?.companyId) fd.append('companyId', user?.companyId);
    formData.attachments.forEach(file => fd.append('attachments', file));
    if (editReport?.attachments) {
      editReport.attachments.forEach(att => fd.append('existingAttachments', att.url));
    }

    try {
      setOperationLoading(true);
      if (editReport) {
        await riskReportService.updateRiskReport(editReport.id, fd);
        showOperationStatus('success', 'Risk report updated');
      } else {
        await riskReportService.createRiskReport(fd);
        showOperationStatus('success', 'Risk report created');
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
      title: '',
      description: '',
      severity: 'MEDIUM',
      attachments: [],
      attachmentPreviews: [],
    });
    setEditReport(null);
    setShowFormModal(false);
  };

  /* ── EDIT / DELETE / RESOLVE / REJECT ── */
  const handleEditReport = (r: RiskReport) => {
    if (!canEditReport(r)) return;
    setEditReport(r);
    setFormData({
      title: r.title,
      description: r.description,
      severity: r.severity as FormData['severity'],
      attachments: [],
      attachmentPreviews: [],
    });
    setShowFormModal(true);
  };

  const handleDeleteReport = async (r: RiskReport) => {
    if (!canDeleteReport(r)) return;
    try {
      setOperationLoading(true);
      await riskReportService.deleteRiskReport(r.id);
      setDeleteConfirm(null);
      await loadData();
      showOperationStatus('success', 'Risk report deleted');
    } catch (err: any) {
      showOperationStatus('error', err.message || 'Failed to delete');
    } finally {
      setOperationLoading(false);
    }
  };
const handleResolveReport = async () => {
  if (!resolveConfirm || !canResolveReject(resolveConfirm)) return;

  try {
    setOperationLoading(true);
    // Pass the optional resolution note
    await riskReportService.resolveRiskReport(resolveConfirm.id, resolveReason.trim());
    setResolveConfirm(null);
    setResolveReason('');
    await loadData();
    showOperationStatus('success', 'Risk report resolved successfully');
  } catch (err: any) {
    showOperationStatus('error', err.message || 'Failed to resolve report');
  } finally {
    setOperationLoading(false);
  }
};

  const handleRejectReport = async () => {
    if (!rejectReason.trim()) {
      showOperationStatus('error', 'Rejection reason required');
      return;
    }
    if (!rejectConfirm) return;
    try {
      setOperationLoading(true);
      await riskReportService.rejectRiskReport(rejectConfirm.id, rejectReason);
      setRejectConfirm(null);
      setRejectReason('');
      await loadData();
      showOperationStatus('success', 'Risk report rejected');
    } catch (err: any) {
      showOperationStatus('error', err.message);
    } finally {
      setOperationLoading(false);
    }
  };

  const handleViewReport = (r: RiskReport) => {
    if (!r?.id) return;
    navigate(`/${role}/dashboard/risk-report/${r.id}`);
  };

  /* ── PAGINATION ── */
  const totalReports = allReports.length;
  const totalPages = Math.ceil(reports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReports = reports.slice(startIndex, endIndex);

  /* ── RENDER HELPERS ── */
  const renderStatusBadge = (status: string) => {
    const cfg = {
      PENDING: { bg: 'bg-yellow-100', txt: 'text-yellow-800', icon: Clock },
      RESOLVED: { bg: 'bg-green-100', txt: 'text-green-800', icon: CheckCircle },
      REJECTED: { bg: 'bg-red-100', txt: 'text-red-800', icon: XCircle },
    }[status] || cfg.PENDING;
    const Icon = cfg.icon;
    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.txt}`}>
        <Icon className="w-3 h-3" />
        <span>{status}</span>
      </span>
    );
  };

  const renderSeverityBadge = (severity: string) => {
    const cfg = {
      LOW: { bg: 'bg-green-100', txt: 'text-green-800' },
      MEDIUM: { bg: 'bg-yellow-100', txt: 'text-yellow-800' },
      HIGH: { bg: 'bg-orange-100', txt: 'text-orange-800' },
      CRITICAL: { bg: 'bg-red-100', txt: 'text-red-800' },
    }[severity] || cfg.MEDIUM;
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.txt}`}>
        {SEVERITY_LABELS[severity as keyof typeof SEVERITY_LABELS]}
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

  const renderActions = (r: RiskReport) => (
    <div className="flex items-center space-x-2">
      <motion.button
        whileHover={{ scale: 1.1 }}
        onClick={() => handleViewReport(r)}
        className="text-gray-500 hover:text-primary-600 p-2 rounded-full hover:bg-primary-50 transition-colors"
        title="View"
      >
        <Eye className="w-4 h-4" />
      </motion.button>
      {canEditReport(r) && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => handleEditReport(r)}
          className="text-gray-500 hover:text-primary-600 p-2 rounded-full hover:bg-primary-50 transition-colors"
          title="Edit"
        >
          <Edit className="w-4 h-4" />
        </motion.button>
      )}
      {canDeleteReport(r) && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => setDeleteConfirm(r)}
          className="text-gray-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </motion.button>
      )}
      {canResolveReject(r) && (
        <>
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={() => setResolveConfirm(r)}
            className="text-gray-500 hover:text-green-600 p-2 rounded-full hover:bg-green-50 transition-colors"
            title="Resolve"
          >
            <Check className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={() => setRejectConfirm(r)}
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
              <th className="text-left py-3 px-4 text-gray-600 font-semibold">Title</th>
              <th className="text-left py-3 px-4 text-gray-600 font-semibold hidden md:table-cell">Severity</th>
              <th className="text-left py-3 px-4 text-gray-600 font-semibold">Status</th>
              <th className="text-right py-3 px-4 text-gray-600 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentReports.map((r) => (
              <motion.tr
                key={r.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="hover:bg-gray-50"
              >
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    {renderAvatar(r.employee?.profile_picture)}
<span className="font-medium text-gray-900">
  {r.employee?.first_name || r.employee?.last_name
    ? `${r.employee?.first_name || ''} ${r.employee?.last_name || ''}`.trim()
    : '—'}
</span>

                  </div>
                </td>
                <td className="py-3 px-4 font-medium text-gray-900 truncate max-w-xs">{r.title}</td>
                <td className="py-3 px-4 hidden md:table-cell">{renderSeverityBadge(r.severity)}</td>
                <td className="py-3 px-4">{renderStatusBadge(r.status)}</td>
                <td className="py-3 px-4 text-right">{renderActions(r)}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderGridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {currentReports.map((r) => (
        <motion.div
          key={r.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow border border-gray-100 p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col items-center space-y-3 mb-3">
            {renderAvatar(r.employee?.profile_picture, 'w-16 h-16')}
            <div className="text-center w-full">
              <div className="font-semibold text-gray-900 text-sm truncate">{r.title}</div>
              <div className="text-gray-500 text-xs">{formatDate(r.createdAt)}</div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>{renderActions(r)}</div>
          </div>
          <div className="mt-2">{renderStatusBadge(r.status)}</div>
        </motion.div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="bg-white rounded-lg shadow border border-gray-100 divide-y divide-gray-100">
      {currentReports.map((r) => (
        <motion.div
          key={r.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="px-4 py-4 hover:bg-gray-50"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              {renderAvatar(r.employee?.profile_picture)}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 text-sm truncate">{r.title}</div>
                <div className="text-gray-500 text-xs truncate">
                  {r.employee?.name} • {formatDate(r.createdAt)}
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4 text-sm text-gray-600 flex-1 max-w-md px-4">
              <span className="truncate">{renderStatusBadge(r.status)}</span>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
              {renderActions(r)}
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
    for (let i = startPage; i <= endPage; i++) pages.push(i);

    return (
      <div className="flex items-center justify-between bg-white px-4 py-3 border-t border-gray-100 rounded-b-lg shadow">
        <div className="text-sm text-gray-600">
          Showing {startIndex + 1}-{Math.min(endIndex, reports.length)} of {reports.length}
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
                <h1 className="text-xl font-semibold text-gray-900">Risk Report Management</h1>
                <p className="text-sm text-gray-500">Create, view and manage workplace risk reports</p>
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
                    setEditReport(null);
                    setFormData({
                      title: '',
                      description: '',
                      severity: 'MEDIUM',
                      attachments: [],
                      attachmentPreviews: [],
                    });
                    setShowFormModal(true);
                  }}
                  disabled={operationLoading}
                  className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded font-medium transition-colors disabled:opacity-50 shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">Add Report</span>
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
                <FileText className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Reports</p>
                <p className="text-xl font-semibold text-gray-900">{totalReports}</p>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white rounded-lg shadow border border-gray-100 p-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-50 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Resolved</p>
                <p className="text-xl font-semibold text-gray-900">
                  {allReports.filter((r) => r.status === 'RESOLVED').length}
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
                  {allReports.filter((r) => r.status === 'PENDING').length}
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
                  placeholder="Search reports..."
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
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field as keyof RiskReport);
                  setSortOrder(order as 'asc' | 'desc');
                }}
                className="text-sm border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="severity-asc">Severity (Low-High)</option>
                <option value="severity-desc">Severity (High-Low)</option>
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
              <span className="text-sm">Loading risk reports...</span>
            </div>
          </div>
        ) : reports.length === 0 ? (
          <div className="bg-white rounded-lg shadow border border-gray-100 p-8 text-center">
            <p className="text-lg font-semibold text-gray-900">
              {searchTerm ? 'No Reports Found' : 'No Risk Reports Available'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {searchTerm ? 'Try adjusting your search criteria.' : 'Add a new report to get started.'}
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
                  <h3 className="text-lg font-semibold text-gray-900">Delete Report</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-700">
                  Are you sure you want to delete <span className="font-semibold">{deleteConfirm.title}</span>?
                </p>
              </div>
              <div className="flex items-center justify-end space-x-3">
                <motion.button whileHover={{ scale: 1.05 }} onClick={() => setDeleteConfirm(null)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded hover:bg-gray-50">
                  Cancel
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} onClick={() => handleDeleteReport(deleteConfirm)} className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700">
                  Delete
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RESOLVE WITH OPTIONAL NOTE */}
<AnimatePresence>
  {resolveConfirm && (
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
            <h3 className="text-lg font-semibold text-gray-900">Resolve Risk Report</h3>
            <p className="text-sm text-gray-500">Mark as resolved with optional note</p>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-700 mb-3">
            Resolve <span className="font-semibold">{resolveConfirm.title}</span>?
          </p>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Resolution Note <span className="text-gray-400">(optional)</span>
          </label>
          <textarea
            value={resolveReason}
            onChange={(e) => setResolveReason(e.target.value)}
            placeholder="e.g., Issue fixed, safety measure implemented, false alarm..."
            className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            rows={3}
          />
        </div>

        <div className="flex items-center justify-end space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => {
              setResolveConfirm(null);
              setResolveReason('');
            }}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded hover:bg-gray-50"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={handleResolveReport}
            className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700"
          >
            Resolve Report
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
                  <h3 className="text-lg font-semibold text-gray-900">Reject Report</h3>
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
                <motion.button whileHover={{ scale: 1.05 }} onClick={handleRejectReport} disabled={!rejectReason.trim()} className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50">
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
                  <AlertTriangle className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {editReport ? 'Edit Risk Report' : 'Create Risk Report'}
                  </h3>
                  <p className="text-sm text-gray-500">Fill in the details below</p>
                </div>
              </div>
              <div className="space-y-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Brief title of the risk"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Describe the risk in detail..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Severity *</label>
                  <select
                    value={formData.severity}
                    onChange={(e) => setFormData(prev => ({ ...prev, severity: e.target.value as FormData['severity'] }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="LOW">Low Risk</option>
                    <option value="MEDIUM">Medium Risk</option>
                    <option value="HIGH">High Risk</option>
                    <option value="CRITICAL">Critical Risk</option>
                  </select>
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
                      id="risk-attachments"
                    />
                    <label
                      htmlFor="risk-attachments"
                      className="cursor-pointer inline-flex items-center space-x-2 px-3 py-2 text-sm bg-primary-50 text-primary-700 rounded hover:bg-primary-100 transition-colors"
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
                <motion.button whileHover={{ scale: 1.05 }} onClick={handleCreateOrUpdateReport} disabled={operationLoading} className="px-4 py-2 text-sm bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-50">
                  {editReport ? 'Update' : 'Submit'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RiskReportDashboard;