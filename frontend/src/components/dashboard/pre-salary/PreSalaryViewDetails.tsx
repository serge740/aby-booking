// src/pages/PreSalaryViewDetails.tsx
import React, { useState, useEffect } from 'react';
import {
  Calendar, User, DollarSign, Clock, FileText,
  CheckCircle, XCircle, AlertCircle, ArrowLeft, X, Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import preSalaryService from '../../../services/preSalaryService';
import { useSocketEvent } from '../../../context/SocketContext';

// ────────────────────── Types ──────────────────────
type Role = 'company' | 'employee';
interface Roles {
  role: Role;
}
interface PreSalaryData {
  id: string;
  amount: number;
  currency: string;
  periodStart: string;
  periodEnd: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reason?: string | null;
  reasonForRejection?: string | null;
  approvedAt?: string | null;
  rejectedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  employee: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

// ────────────────────── Component ──────────────────────
const PreSalaryViewDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { role } = useOutletContext<Roles>();
  const isCompany = role === 'company';

  const [preSalary, setPreSalary] = useState<PreSalaryData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [opLoading, setOpLoading] = useState<boolean>(false);
  const [showReject, setShowReject] = useState<boolean>(false);
  const [rejectReason, setRejectReason] = useState<string>('');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // ── FETCH ──
  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await preSalaryService.getPreSalaryById(id);
        setPreSalary(data);
      } catch (e: any) {
        setError(e.message ?? 'Failed to load pre-salary');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  // ── REAL-TIME SOCKET UPDATES ──
  useSocketEvent(
    'preSalaryUpdated',
    (updated: PreSalaryData) => {
      if (updated.id === preSalary?.id) setPreSalary(updated);
    },
    [preSalary?.id]
  );

  useSocketEvent(
    'preSalaryApproved',
    (approved: PreSalaryData) => {
      if (approved.id === preSalary?.id) setPreSalary(approved);
    },
    [preSalary?.id]
  );

  useSocketEvent(
    'preSalaryRejected',
    (rejected: PreSalaryData) => {
      if (rejected.id === preSalary?.id) setPreSalary(rejected);
    },
    [preSalary?.id]
  );

  useSocketEvent(
    'preSalaryDeleted',
    ({ id: deletedId }: { id: string }) => {
      if (deletedId === preSalary?.id) {
        toastMsg('error', 'This pre-salary request was deleted');
        navigate(-1);
      }
    },
    [preSalary?.id, navigate]
  );

  // ── APPROVE / REJECT ──
  const approve = async () => {
    if (!preSalary) return;
    try {
      setOpLoading(true);
      await preSalaryService.approvePreSalary(preSalary.id);
      toastMsg('success', 'Pre-salary approved');
    } catch (e: any) {
      toastMsg('error', e.message ?? 'Approve failed');
    } finally {
      setOpLoading(false);
    }
  };

  const reject = async () => {
    if (!rejectReason.trim()) return toastMsg('error', 'Reason required');
    if (!preSalary) return;
    try {
      setOpLoading(true);
      await preSalaryService.rejectPreSalary(preSalary.id, rejectReason);
      setShowReject(false);
      setRejectReason('');
      toastMsg('success', 'Pre-salary rejected');
    } catch (e: any) {
      toastMsg('error', e.message ?? 'Reject failed');
    } finally {
      setOpLoading(false);
    }
  };

  const toastMsg = (type: 'success' | 'error', msg: string, dur = 3000) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), dur);
  };

  // ── HELPERS ──
  const statusClr = (s: PreSalaryData['status']) => {
    switch (s) {
      case 'APPROVED': return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const statusIco = (s: PreSalaryData['status']) => {
    switch (s) {
      case 'APPROVED': return <CheckCircle className="w-5 h-5" />;
      case 'REJECTED': return <XCircle className="w-5 h-5" />;
      default: return <AlertCircle className="w-5 h-5" />;
    }
  };

  const days = (s: string, e: string) => {
    const diff = Math.abs(new Date(e).getTime() - new Date(s).getTime());
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  };

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const fmtDT = (d: string) => new Date(d).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  const fmtCurrency = (amount: number, currency: string) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'RWF' }).format(amount);

  // ── EARLY RETURNS ──
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !preSalary) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
          <p className="text-red-800 font-medium">{error || 'Pre-salary not found'}</p>
          <button onClick={() => navigate(-1)} className="mt-4 text-sm text-red-600 hover:underline">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // ── MAIN UI ──
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-5 h-5 mr-2" /> Back to Pre-Salary Requests
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Pre-Salary Request Details</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── EMPLOYEE CARD ── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" /> Employee
              </h2>
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-3">
                  {preSalary.employee.first_name[0]}{preSalary.employee.last_name[0]}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {preSalary.employee.first_name} {preSalary.employee.last_name}
                </h3>
                <p className="text-sm text-gray-500">{preSalary.employee.email}</p>
              </div>
            </div>
          </div>

          {/* ── PRE-SALARY DETAILS ── */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* Status */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <span className={`px-4 py-2 rounded-lg text-sm font-semibold border flex items-center gap-2 ${statusClr(preSalary.status)}`}>
                    {statusIco(preSalary.status)} {preSalary.status}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Request ID</p>
                  <p className="text-sm font-mono text-gray-900">{preSalary.id}</p>
                </div>
              </div>

              {/* Amount */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-center">
                  <DollarSign className="w-8 h-8 text-green-600 mr-3" />
                  <p className="text-3xl font-bold text-gray-900">
                    {fmtCurrency(preSalary.amount, preSalary.currency)}
                  </p>
                </div>
              </div>

              {/* Period */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Start Date</p>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                      <p className="font-semibold text-gray-900">{fmtDate(preSalary.periodStart)}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">End Date</p>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                      <p className="font-semibold text-gray-900">{fmtDate(preSalary.periodEnd)}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Duration</p>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-blue-600" />
                      <p className="font-semibold text-gray-900">{days(preSalary.periodStart, preSalary.periodEnd)} days</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reason */}
              {preSalary.reason && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-gray-600" /> Reason
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 leading-relaxed">{preSalary.reason}</p>
                  </div>
                </div>
              )}

              {/* Rejection */}
              {preSalary.status === 'REJECTED' && preSalary.reasonForRejection && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2 flex items-center text-red-800">
                    <XCircle className="w-5 h-5 mr-2" /> Reason for Rejection
                  </h3>
                  <p className="text-red-700">{preSalary.reasonForRejection}</p>
                  <p className="text-xs text-red-600 mt-2">
                    Rejected on: {preSalary.rejectedAt ? fmtDT(preSalary.rejectedAt) : '—'}
                  </p>
                </div>
              )}

              {/* Approval */}
              {preSalary.status === 'APPROVED' && preSalary.approvedAt && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2 flex items-center text-green-800">
                    <CheckCircle className="w-5 h-5 mr-2" /> Pre-Salary Approved
                  </h3>
                  <p className="text-xs text-green-600">
                    Approved on: {fmtDT(preSalary.approvedAt)}
                  </p>
                </div>
              )}

              {/* Timestamps */}
              <div className="mt-6 pt-6 border-t grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Created At</p>
                  <p className="text-gray-900 font-medium">{fmtDT(preSalary.createdAt)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Last Updated</p>
                  <p className="text-gray-900 font-medium">{fmtDT(preSalary.updatedAt)}</p>
                </div>
              </div>
            </div>

            {/* ── ACTION BUTTONS – ONLY FOR COMPANY & PENDING ── */}
            {isCompany && preSalary.status === 'PENDING' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Actions</h3>
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={approve} disabled={opLoading}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center disabled:opacity-50"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" /> Approve
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => setShowReject(true)} disabled={opLoading}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center disabled:opacity-50"
                  >
                    <XCircle className="w-5 h-5 mr-2" /> Reject
                  </motion.button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── REJECT MODAL ── */}
      <AnimatePresence>
        {showReject && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: .95 }} animate={{ scale: 1 }} exit={{ scale: .95 }}
              className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Reject Pre-Salary</h3>
                <button onClick={() => { setShowReject(false); setRejectReason(''); }} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Rejection <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  placeholder="Explain why..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => { setShowReject(false); setRejectReason(''); }}
                  className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={reject}
                  disabled={opLoading || !rejectReason.trim()}
                  className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {opLoading ? 'Rejecting...' : 'Reject'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── TOAST ── */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg shadow-lg text-sm ${toast.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
              {toast.type === 'success' ? <CheckCircle className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-red-600" />}
              <span className="font-medium">{toast.msg}</span>
              <button onClick={() => setToast(null)} className="hover:opacity-70">
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── OPERATION LOADING ── */}
      <AnimatePresence>
        {opLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 flex items-center justify-center z-40">
            <div className="bg-white rounded-lg p-4 shadow-xl flex items-center space-x-2">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-gray-700 text-sm font-medium">Processing...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PreSalaryViewDetails;