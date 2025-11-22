// src/pages/LeaveViewDetails.tsx
import React, { useState, useEffect } from 'react';
import {
  Calendar, User, Mail, Phone, MapPin, Briefcase, Clock, FileText,
  CheckCircle, XCircle, AlertCircle, Download, ArrowLeft, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import leaveService from '../../../services/leaveService';
import { useSocketEvent } from '../../../context/SocketContext';

// ────────────────────── Types ──────────────────────
type Role = 'company' | 'employee';

interface Roles {
  role: Role;
}

interface Attachment {
  filename: string;
  url: string;
  mimeType: string;
}

interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  position: string;
  profile_picture?: string;
  address: string;
  date_hired: string;
  status: 'ACTIVE' | 'INACTIVE';
  marital_status: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
}

interface LeaveData {
  id: string;
  type: 'VACATION' | 'SICK' | 'PERSONAL' | 'MATERNITY' | 'PATERNITY' | 'UNPAID' | 'COMPASSIONATE';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  startDate: string;
  endDate: string;
  reasonForRequest?: string;
  attachments: Attachment[];
  approvedAt?: string | null;
  rejectedAt?: string | null;
  reasonForRejection?: string | null;
  reasonForApproval?: string | null;
  createdAt: string;
  updatedAt: string;
  employee: Employee;
}

// ────────────────────── Component ──────────────────────
const LeaveViewDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // ── GET ROLE FROM OUTLET CONTEXT ──
  const { role } = useOutletContext<Roles>();   // <-- exactly what you asked for
  const isCompany = role === 'company';

  const [leaveData, setLeaveData] = useState<LeaveData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [opLoading, setOpLoading] = useState<boolean>(false);
  const [showReject, setShowReject] = useState<boolean>(false);
  const [rejectReason, setRejectReason] = useState<string>('');
  const [showApprove, setShowApprove] = useState<boolean>(false);
const [approveReason, setApproveReason] = useState<string>('');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // ── FETCH ──
  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await leaveService.getLeaveById(id);
        setLeaveData(data);
      } catch (e: any) {
        setError(e.message ?? 'Failed to load leave');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  // ── APPROVE / REJECT ──
const approve = async () => {
  if (!leaveData) return;
  try {
    setOpLoading(true);
    await leaveService.approveLeave(leaveData.id, approveReason.trim());
    setShowApprove(false);
    setApproveReason('');
    await refresh();
    toastMsg('success', 'Leave approved successfully');
  } catch (e: any) {
    toastMsg('error', e.message ?? 'Approve failed');
  } finally {
    setOpLoading(false);
  }
};

  const reject = async () => {
    if (!rejectReason.trim()) return toastMsg('error', 'Reason required');
    if (!leaveData) return;
    try {
      setOpLoading(true);
      await leaveService.rejectLeave(leaveData.id, rejectReason);
      setShowReject(false);
      setRejectReason('');
      await refresh();
      toastMsg('success', 'Leave rejected');
    } catch (e: any) {
      toastMsg('error', e.message ?? 'Reject failed');
    } finally {
      setOpLoading(false);
    }
  };

  const refresh = async () => {
    if (!id) return;
    const data = await leaveService.getLeaveById(id);
    setLeaveData(data);
  };

  useSocketEvent(
  'leaveUpdated',
  (updated: LeaveData) => {
    if (updated.id === leaveData?.id) setLeaveData(updated);
  },
  [leaveData?.id]
);

useSocketEvent(
  'leaveApproved',
  (approved: LeaveData) => {
    if (approved.id === leaveData?.id) setLeaveData(approved);
  },
  [leaveData?.id]
);

useSocketEvent(
  'leaveRejected',
  (rejected: LeaveData) => {
    if (rejected.id === leaveData?.id) setLeaveData(rejected);
  },
  [leaveData?.id]
);

useSocketEvent(
  'leaveDeleted',
  ({ id }: { id: string }) => {
    if (id === leaveData?.id) {
      toastMsg('error', 'This leave request was deleted');
      navigate(-1);
    }
  },
  [leaveData?.id, navigate]
);

  const toastMsg = (type: 'success' | 'error', msg: string, dur = 3000) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), dur);
  };

  // ── HELPERS ──
  const statusClr = (s: LeaveData['status']) => {
    switch (s) {
      case 'APPROVED': return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };
  const statusIco = (s: LeaveData['status']) => {
    switch (s) {
      case 'APPROVED': return <CheckCircle className="w-5 h-5" />;
      case 'REJECTED': return <XCircle className="w-5 h-5" />;
      default: return <AlertCircle className="w-5 h-5" />;
    }
  };
  const typeClr = (t: LeaveData['type']) => {
    switch (t) {
      case 'VACATION': return 'bg-blue-100 text-blue-800';
      case 'SICK': return 'bg-red-100 text-red-800';
      case 'PERSONAL': return 'bg-purple-100 text-purple-800';
      case 'MATERNITY':
      case 'PATERNITY': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  const days = (s: string, e: string) => {
    const diff = Math.abs(new Date(e).getTime() - new Date(s).getTime());
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  };
  const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const fmtDT = (d: string) => new Date(d).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

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

  if (error || !leaveData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
          <p className="text-red-800 font-medium">{error || 'Leave not found'}</p>
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
      <div className=" mx-auto">

        {/* Header */}
        <div className="mb-6">
          <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-5 h-5 mr-2" /> Back to Leave Requests
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Leave Request Details</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── EMPLOYEE CARD ── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" /> Employee Information
              </h2>

              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-3">
                  {leaveData.employee.first_name[0]}{leaveData.employee.last_name[0]}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {leaveData.employee.first_name} {leaveData.employee.last_name}
                </h3>
                <p className="text-sm text-gray-500">{leaveData.employee.position}</p>
                <span className={`mt-2 px-3 py-1 rounded-full text-xs font-medium ${leaveData.employee.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {leaveData.employee.status}
                </span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-start"><Mail className="w-4 h-4 mr-3 mt-0.5 text-gray-400" /><div><p className="text-gray-500">Email</p><p className="text-gray-900 font-medium">{leaveData.employee.email}</p></div></div>
                <div className="flex items-start"><Phone className="w-4 h-4 mr-3 mt-0.5 text-gray-400" /><div><p className="text-gray-500">Phone</p><p className="text-gray-900 font-medium">{leaveData.employee.phone}</p></div></div>
                <div className="flex items-start"><MapPin className="w-4 h-4 mr-3 mt-0.5 text-gray-400" /><div><p className="text-gray-500">Address</p><p className="text-gray-900 font-medium">{leaveData.employee.address}</p></div></div>
                <div className="flex items-start"><Briefcase className="w-4 h-4 mr-3 mt-0.5 text-gray-400" /><div><p className="text-gray-500">Date Hired</p><p className="text-gray-900 font-medium">{fmtDate(leaveData.employee.date_hired)}</p></div></div>
                <div className="flex items-start"><User className="w-4 h-4 mr-3 mt-0.5 text-gray-400" /><div><p className="text-gray-500">Marital Status</p><p className="text-gray-900 font-medium">{leaveData.employee.marital_status}</p></div></div>
                <div className="pt-3 border-t mt-4">
                  <p className="text-gray-500 font-medium mb-2">Emergency Contact</p>
                  <div className="pl-2"><p className="text-gray-900 font-medium">{leaveData.employee.emergency_contact_name}</p><p className="text-gray-600 text-xs">{leaveData.employee.emergency_contact_phone}</p></div>
                </div>
              </div>
            </div>
          </div>

          {/* ── LEAVE DETAILS ── */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">

              {/* Status + Type */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${typeClr(leaveData.type)}`}>
                    {leaveData.type.replace('_', ' ')}
                  </span>
                  <span className={`px-4 py-2 rounded-lg text-sm font-semibold border flex items-center gap-2 ${statusClr(leaveData.status)}`}>
                    {statusIco(leaveData.status)} {leaveData.status}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Request ID</p>
                  <p className="text-sm font-mono text-gray-900">{leaveData.id}</p>
                </div>
              </div>

              {/* Duration */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-3 gap-4">
                  <div><p className="text-sm text-gray-600 mb-1">Start Date</p><div className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-blue-600" /><p className="font-semibold text-gray-900">{fmtDate(leaveData.startDate)}</p></div></div>
                  <div><p className="text-sm text-gray-600 mb-1">End Date</p><div className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-blue-600" /><p className="font-semibold text-gray-900">{fmtDate(leaveData.endDate)}</p></div></div>
                  <div><p className="text-sm text-gray-600 mb-1">Duration</p><div className="flex items-center"><Clock className="w-4 h-4 mr-2 text-blue-600" /><p className="font-semibold text-gray-900">{days(leaveData.startDate, leaveData.endDate)} days</p></div></div>
                </div>
              </div>

              {/* Reason */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center"><FileText className="w-5 h-5 mr-2 text-gray-600" /> Reason for Request</h3>
                <div className="bg-gray-50 rounded-lg p-4"><p className="text-gray-700 leading-relaxed">{leaveData.reasonForRequest || 'No reason provided'}</p></div>
              </div>

              {/* Attachments */}
              {leaveData.attachments.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center"><Download className="w-5 h-5 mr-2 text-gray-600" /> Attachments ({leaveData.attachments.length})</h3>
                  <div className="space-y-2">
                    {leaveData.attachments.map((a, i) => (
                      <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg p-3 hover:bg-gray-100">
                        <div className="flex items-center"><FileText className="w-5 h-5 mr-3 text-blue-600" /><div><p className="text-sm font-medium text-gray-900">{a.filename}</p><p className="text-xs text-gray-500">{a.mimeType}</p></div></div>
                        <a href={a.url} download={a.filename} className="p-2 hover:bg-white rounded-lg"><Download className="w-4 h-4 text-gray-600" /></a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rejection */}
              {leaveData.status === 'REJECTED' && leaveData.reasonForRejection && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2 flex items-center text-red-800"><XCircle className="w-5 h-5 mr-2" /> Reason for Rejection</h3>
                  <p className="text-red-700">{leaveData.reasonForRejection}</p>
                  <p className="text-xs text-red-600 mt-2">Rejected on: {leaveData.rejectedAt ? fmtDT(leaveData.rejectedAt) : '—'}</p>
                </div>
              )}

              {/* Approval */}
          {/* Approval */}
{leaveData.status === 'APPROVED' && (
  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
    <h3 className="text-lg font-semibold mb-2 flex items-center text-green-800">
      <CheckCircle className="w-5 h-5 mr-2" /> Leave Approved
    </h3>
    {leaveData.reasonForApproval && (
      <p className="text-green-700 mb-2">{leaveData.reasonForApproval}</p>
    )}
    <p className="text-xs text-green-600">
      Approved on: {leaveData.approvedAt ? fmtDT(leaveData.approvedAt) : '—'}
    </p>
  </div>
)}
              {/* Timestamps */}
              <div className="mt-6 pt-6 border-t grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-gray-500">Created At</p><p className="text-gray-900 font-medium">{fmtDT(leaveData.createdAt)}</p></div>
                <div><p className="text-gray-500">Last Updated</p><p className="text-gray-900 font-medium">{fmtDT(leaveData.updatedAt)}</p></div>
              </div>
            </div>

            {/* ── ACTION BUTTONS – ONLY FOR COMPANY & PENDING ── */}
            {isCompany && leaveData.status === 'PENDING' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Actions</h3>
                <div className="flex gap-3">
                 <motion.button
  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
  onClick={() => setShowApprove(true)}
  disabled={opLoading}
  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center disabled:opacity-50"
>
  <CheckCircle className="w-5 h-5 mr-2" /> Approve Leave
</motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => setShowReject(true)} disabled={opLoading}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center disabled:opacity-50"
                  >
                    <XCircle className="w-5 h-5 mr-2" /> Reject Leave
                  </motion.button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* APPROVE WITH OPTIONAL REASON */}
<AnimatePresence>
  {showApprove && (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div initial={{ scale: .95 }} animate={{ scale: 1 }} exit={{ scale: .95 }}
        className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Approve Leave Request</h3>
          <button onClick={() => { setShowApprove(false); setApproveReason(''); }}
            className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <div className="mb-4">
          <p className="text-sm text-gray-700 mb-3">
            Approve <strong>{leaveData.type.replace('_', ' ')}</strong> for{' '}
            <strong>{leaveData.employee.first_name} {leaveData.employee.last_name}</strong>?
          </p>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Approval Note <span className="text-gray-400">(optional)</span>
          </label>
          <textarea
            value={approveReason}
            onChange={e => setApproveReason(e.target.value)}
            placeholder="e.g., Enjoy your vacation! or Approved – coverage arranged."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="flex justify-end space-x-3">
          <button onClick={() => { setShowApprove(false); setApproveReason(''); }}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={approve} disabled={opLoading}
            className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
            {opLoading ? 'Approving...' : 'Approve Leave'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

      {/* ── REJECT MODAL ── */}
      <AnimatePresence>
        {showReject && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: .95 }} animate={{ scale: 1 }} exit={{ scale: .95 }}
              className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Reject Leave Request</h3>
                <button onClick={() => { setShowReject(false); setRejectReason(''); }} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Rejection <span className="text-red-500">*</span></label>
                <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)}
                  placeholder="Explain why..." rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
              <div className="flex justify-end space-x-3">
                <button onClick={() => { setShowReject(false); setRejectReason(''); }}
                  className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                <button onClick={reject} disabled={opLoading || !rejectReason.trim()}
                  className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50">
                  {opLoading ? 'Rejecting...' : 'Reject Leave'}
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
              <button onClick={() => setToast(null)} className="hover:opacity-70"><X className="w-4 h-4" /></button>
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

export default LeaveViewDetails;