import React, { useState, useEffect } from 'react';
import {
  Calendar, User, AlertTriangle, Clock, FileText,
  CheckCircle, XCircle, Download, ArrowLeft, X, Shield, Building
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import riskReportService, { RiskReport } from '../../../services/riskReportService';
import { useSocketEvent } from '../../../context/SocketContext';

type Role = 'company' | 'employee';
interface Roles {
  role: Role;
}

const RiskReportViewDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { role } = useOutletContext<Roles>();
  const isCompany = role === 'company';

  const [report, setReport] = useState<RiskReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [opLoading, setOpLoading] = useState<boolean>(false);
  const [showReject, setShowReject] = useState<boolean>(false);
  const [rejectReason, setRejectReason] = useState<string>('');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // ── FETCH SINGLE REPORT ──
  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await riskReportService.getRiskReportById(id);
        setReport(data);
      } catch (e: any) {
        setError(e.message ?? 'Failed to load risk report');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  // ── REAL-TIME UPDATES ──
  useSocketEvent('riskReportUpdated', (updated: RiskReport) => {
    if (updated.id === report?.id) setReport(updated);
  }, [report?.id]);

  useSocketEvent('riskReportResolved', (resolved: RiskReport) => {
    if (resolved.id === report?.id) setReport(resolved);
  }, [report?.id]);

  useSocketEvent('riskReportRejected', (rejected: RiskReport) => {
    if (rejected.id === report?.id) setReport(rejected);
  }, [report?.id]);

  useSocketEvent('riskReportDeleted', ({ id: deletedId }: { id: string }) => {
    if (deletedId === report?.id) {
      toastMsg('error', 'This risk report was deleted');
      navigate(-1);
    }
  }, [report?.id, navigate]);

  // ── ACTIONS ──
  const resolve = async () => {
    if (!report) return;
    try {
      setOpLoading(true);
      await riskReportService.resolveRiskReport(report.id);
      toastMsg('success', 'Risk report resolved');
    } catch (e: any) {
      toastMsg('error', e.message ?? 'Failed to resolve');
    } finally {
      setOpLoading(false);
    }
  };

  const reject = async () => {
    if (!rejectReason.trim()) return toastMsg('error', 'Reason required');
    if (!report) return;
    try {
      setOpLoading(true);
      await riskReportService.rejectRiskReport(report.id, rejectReason);
      setShowReject(false);
      setRejectReason('');
      toastMsg('success', 'Risk report rejected');
    } catch (e: any) {
      toastMsg('error', e.message ?? 'Failed to reject');
    } finally {
      setOpLoading(false);
    }
  };

  const toastMsg = (type: 'success' | 'error', msg: string, dur = 3000) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), dur);
  };

  // ── HELPERS ──
  const severityColor = (s: string) => {
    switch (s) {
      case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-200';
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const statusColor = (s: string) => {
    switch (s) {
      case 'RESOLVED': return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const statusIcon = (s: string) => {
    switch (s) {
      case 'RESOLVED': return <CheckCircle className="w-5 h-5" />;
      case 'REJECTED': return <XCircle className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const fmtDT = (d: string) => new Date(d).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  // ── EARLY RETURNS ──
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-600">Loading report...</span>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
          <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-3" />
          <p className="text-red-800 font-medium">{error || 'Report not found'}</p>
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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-5 h-5 mr-2" /> Back to Risk Reports
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Risk Report Details</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── REPORTER CARD ── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" /> Reported By
              </h2>
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-3">
                  {report.employee?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{report.employee?.name || 'Unknown'}</h3>
                <p className="text-sm text-gray-500">{report.employee?.email || '—'}</p>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center">
                  <Building className="w-4 h-4 mr-3 text-gray-400" />
                  <div>
                    <p className="text-gray-500">Company ID</p>
                    <p className="text-gray-900 font-medium">{report.companyId}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── REPORT DETAILS ── */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* Status + Severity */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${severityColor(report.severity)}`}>
                    {report.severity}
                  </span>
                  <span className={`px-4 py-2 rounded-lg text-sm font-semibold border flex items-center gap-2 ${statusColor(report.status)}`}>
                    {statusIcon(report.status)} {report.status}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Report ID</p>
                  <p className="text-sm font-mono text-gray-900">{report.id}</p>
                </div>
              </div>

              {/* Title */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <Shield className="w-6 h-6 mr-2 text-red-600" />
                  {report.title}
                </h3>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-gray-600" /> Description
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{report.description}</p>
                </div>
              </div>

              {/* Attachments */}
              {report.attachments && report.attachments.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Download className="w-5 h-5 mr-2 text-gray-600" /> Attachments ({report.attachments.length})
                  </h3>
                  <div className="space-y-2">
                    {report.attachments.map((a, i) => (
                      <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg p-3 hover:bg-gray-100">
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 mr-3 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{a.filename}</p>
                            <p className="text-xs text-gray-500">{a.mimeType}</p>
                          </div>
                        </div>
                        <a href={a.url} download={a.filename} className="p-2 hover:bg-white rounded-lg">
                          <Download className="w-4 h-4 text-gray-600" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rejection Reason */}
              {report.status === 'REJECTED' && report.reason && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2 flex items-center text-red-800">
                    <XCircle className="w-5 h-5 mr-2" /> Reason for Rejection
                  </h3>
                  <p className="text-red-700">{report.reason}</p>
                </div>
              )}

              {/* Resolved At */}
              {report.status === 'RESOLVED' && report.resolvedAt && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2 flex items-center text-green-800">
                    <CheckCircle className="w-5 h-5 mr-2" /> Report Resolved
                  </h3>
                  <p className="text-xs text-green-600">Resolved on: {fmtDT(report.resolvedAt)}</p>
                </div>
              )}

              {/* Timestamps */}
              <div className="mt-6 pt-6 border-t grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Submitted</p>
                  <p className="text-gray-900 font-medium">{fmtDT(report.createdAt)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Last Updated</p>
                  <p className="text-gray-900 font-medium">{fmtDT(report.updatedAt)}</p>
                </div>
              </div>
            </div>

            {/* ── ACTIONS (Company + PENDING) ── */}
            {isCompany && report.status === 'PENDING' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Actions</h3>
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={resolve} disabled={opLoading}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center disabled:opacity-50"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" /> Resolve
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
                <h3 className="text-lg font-semibold text-gray-900">Reject Risk Report</h3>
                <button onClick={() => { setShowReject(false); setRejectReason(''); }} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Rejection <span className="text-red-500">*</span></label>
                <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)}
                  placeholder="Explain why this report is invalid..." rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
              <div className="flex justify-end space-x-3">
                <button onClick={() => { setShowReject(false); setRejectReason(''); }}
                  className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                <button onClick={reject} disabled={opLoading || !rejectReason.trim()}
                  className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50">
                  {opLoading ? 'Rejecting...' : 'Reject Report'}
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

export default RiskReportViewDetails;