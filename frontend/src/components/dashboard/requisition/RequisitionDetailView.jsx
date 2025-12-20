import React, { useState, useEffect } from 'react';
import { ArrowLeft, Package, User, Calendar, CheckCircle, XCircle, Clock, AlertCircle, ChevronDown, ChevronUp, TrendingUp, FileText } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

// Import your services
import requisitionService from '../../../services/requisitionService'; // Adjust path if needed
import stockService from '../../../services/stockService';             // Adjust path if needed

const formatCurrency = (amount, currency = 'RWF') => {
  return new Intl.NumberFormat('en-RW', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const RequisitionDetailView = () => {
  const [requisition, setRequisition] = useState(null);
  const [stocks, setStocks] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch requisition + included relations (items, employee, etc.)
        const reqResponse = await requisitionService.getOne(id);
        setRequisition(reqResponse); // assuming backend returns full Requisition with relations

        // Fetch all stocks to match stockId → stock info (price, sku, etc.)
        const allStocks = await stockService.getAllStock();
        setStocks(allStocks);

      } catch (err) {
        console.error("Failed to load requisition:", err);
        setError(err.message || "Failed to load requisition details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'APPROVED': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'REJECTED': return 'bg-red-100 text-red-800 border-red-300';
      case 'PARTIALLY_RECEIVED': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'FULLY_RECEIVED': return 'bg-green-100 text-green-800 border-green-300';
      case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getReceivingStatusColor = (status) => {
    switch (status) {
      case 'NOT_RECEIVED': return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'PARTIALLY_RECEIVED': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'FULLY_RECEIVED': return 'bg-green-100 text-green-700 border-green-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING': return <Clock className="h-5 w-5" />;
      case 'APPROVED': return <CheckCircle className="h-5 w-5" />;
      case 'REJECTED': return <XCircle className="h-5 w-5" />;
      case 'PARTIALLY_RECEIVED': return <TrendingUp className="h-5 w-5" />;
      case 'FULLY_RECEIVED': return <Package className="h-5 w-5" />;
      case 'COMPLETED': return <CheckCircle className="h-5 w-5" />;
      default: return <AlertCircle className="h-5 w-5" />;
    }
  };

  const toggleItemExpansion = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const getStockInfo = (stockId) => {
    return stocks.find(s => s.id === stockId) || null;
  };

  const calculateProgress = (received, total) => {
    return total > 0 ? (received / total) * 100 : 0;
  };

  const calculateTotals = () => {
    if (!requisition?.items) return { totalItems: 0, fullyReceived: 0, partiallyReceived: 0, notReceived: 0, overallProgress: 0 };

    const totalItems = requisition.items.length;
    const fullyReceived = requisition.items.filter(i => i.receivingStatus === 'FULLY_RECEIVED').length;
    const partiallyReceived = requisition.items.filter(i => i.receivingStatus === 'PARTIALLY_RECEIVED').length;
    const notReceived = requisition.items.filter(i => i.receivingStatus === 'NOT_RECEIVED').length;

    const overallProgress = requisition.items.reduce((acc, item) => {
      return acc + ((item.receivedQty / item.quantity) * 100);
    }, 0) / totalItems;

    return { totalItems, fullyReceived, partiallyReceived, notReceived, overallProgress };
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Error state
  if (error || !requisition) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-800">Error Loading Requisition</p>
          <p className="text-gray-600 mt-2">{error || "Requisition not found"}</p>
          <button 
            onClick={() => navigate(-1)} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const totals = calculateTotals();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="mx-auto ">
        <button 
          onClick={() => navigate(-1)} 
          className="mb-4 inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Requisitions
        </button>

        {/* Header Card */}
        <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold mb-2">Requisition #{requisition.id}</h1>
                <p className="text-blue-100 text-sm">
                  Created on {formatDate(requisition.createdAt)}
                </p>
              </div>
              <div className={`px-4 py-2 rounded-lg border-2 font-semibold flex items-center gap-2 ${getStatusColor(requisition.status)} bg-white`}>
                {getStatusIcon(requisition.status)}
                {requisition.status.replace(/_/g, ' ')}
              </div>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="px-6 py-4 bg-gray-50 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-xs font-medium text-gray-900">Created</p>
                  <p className="text-xs text-gray-500">{new Date(requisition.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="flex-1 h-1 bg-gray-300 relative">
                  <div 
                    className={`absolute top-0 left-0 h-full ${requisition.approvedAt ? 'bg-green-500' : 'bg-gray-300'}`}
                    style={{ width: requisition.approvedAt ? '100%' : '0%' }}
                  />
                </div>

                <div className="text-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    requisition.approvedAt ? 'bg-green-100' : requisition.status === 'REJECTED' ? 'bg-red-100' : 'bg-gray-100'
                  }`}>
                    {requisition.status === 'REJECTED' ? (
                      <XCircle className="h-5 w-5 text-red-600" />
                    ) : (
                      <CheckCircle className={`h-5 w-5 ${requisition.approvedAt ? 'text-green-600' : 'text-gray-400'}`} />
                    )}
                  </div>
                  <p className="text-xs font-medium text-gray-900">
                    {requisition.status === 'REJECTED' ? 'Rejected' : 'Approved'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {requisition.approvedAt ? new Date(requisition.approvedAt).toLocaleDateString() : '-'}
                  </p>
                </div>

                {requisition.status !== 'REJECTED' && (
                  <>
                    <div className="flex-1 h-1 bg-gray-300 relative">
                      <div 
                        className={`absolute top-0 left-0 h-full ${totals.overallProgress > 0 ? 'bg-green-500' : 'bg-gray-300'}`}
                        style={{ width: `${Math.min(totals.overallProgress, 100)}%` }}
                      />
                    </div>

                    <div className="text-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                        requisition.completedAt ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        <CheckCircle className={`h-5 w-5 ${requisition.completedAt ? 'text-green-600' : 'text-gray-400'}`} />
                      </div>
                      <p className="text-xs font-medium text-gray-900">Completed</p>
                      <p className="text-xs text-gray-500">
                        {requisition.completedAt ? new Date(requisition.completedAt).toLocaleDateString() : '-'}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Main Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            {/* Requested By */}
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">REQUESTED BY</p>
                <p className="font-semibold text-gray-900">
                  {requisition.employee?.first_name} {requisition.employee?.last_name}
                </p>
                <p className="text-sm text-gray-600">{requisition.employee?.position || 'N/A'}</p>
                <p className="text-sm text-gray-500">{requisition.employee?.email || 'N/A'}</p>
                <p className="text-xs text-gray-400 mt-1 font-mono">ID: {requisition.employee?.id}</p>
              </div>
            </div>

            {/* Approved By - Only if exists (depends on backend population) */}
            {requisition.approvedBy && (
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">APPROVED BY</p>
                  <p className="font-semibold text-gray-900">{requisition.approvedBy.first_name} {requisition.approvedBy.last_name}</p>
                  <p className="text-sm text-gray-600">{requisition.approvedBy.position}</p>
                  <p className="text-sm text-gray-500">{requisition.approvedBy.email}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {requisition.approvedAt && formatDate(requisition.approvedAt)}
                  </p>
                </div>
              </div>
            )}

            {/* Status Summary */}
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">RECEIVING STATUS</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <p className="text-sm text-gray-700">Fully Received: <span className="font-semibold">{totals.fullyReceived}</span></p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    <p className="text-sm text-gray-700">Partially Received: <span className="font-semibold">{totals.partiallyReceived}</span></p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                    <p className="text-sm text-gray-700">Not Received: <span className="font-semibold">{totals.notReceived}</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {requisition.description && (
            <div className="px-6 pb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <FileText className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-blue-900 mb-1">DESCRIPTION</p>
                    <p className="text-sm text-gray-700">{requisition.description}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reject Reason */}
          {requisition.rejectReason && (
            <div className="px-6 pb-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-red-900 mb-1">REJECTION REASON</p>
                    <p className="text-sm text-gray-700">{requisition.rejectReason}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Overall Progress */}
        {requisition.status !== 'REJECTED' && requisition.status !== 'PENDING' && (
          <div className="bg-white rounded-lg shadow-md mb-6 p-6">
            <h2 className="text-lg font-semibold mb-4">Overall Receiving Progress</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Progress</span>
                <span className="font-semibold text-gray-900">{totals.overallProgress.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(totals.overallProgress, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{totals.fullyReceived + totals.partiallyReceived} of {totals.totalItems} items have progress</span>
                <span>{totals.fullyReceived} fully received</span>
              </div>
            </div>
          </div>
        )}

        {/* Items List */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b px-6 py-4">
            <h2 className="text-xl font-bold">Requisition Items ({requisition.items.length})</h2>
          </div>

          <div className="p-6 space-y-4">
            {requisition.items.map((item, index) => {
              const stockInfo = item.stockId ? getStockInfo(item.stockId) : null;
              const progress = calculateProgress(item.receivedQty, item.quantity);
              const isExpanded = expandedItems[item.id];

              return (
                <div key={item.id} className="border-2 border-gray-200 rounded-lg overflow-hidden">
                  <div className="p-4 bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{item.itemName}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getReceivingStatusColor(item.receivingStatus)}`}>
                            {item.receivingStatus.replace(/_/g, ' ')}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            item.purpose === 'EATING' 
                              ? 'bg-orange-100 text-orange-700' 
                              : 'bg-cyan-100 text-cyan-700'
                          }`}>
                            {item.purpose}
                          </span>
                        </div>

                        {stockInfo && (
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <span className="font-mono bg-white px-2 py-1 rounded border border-gray-200">
                              SKU: {stockInfo.sku}
                            </span>
                            <span>Unit Price: {formatCurrency(stockInfo.sellingPrice)}</span>
                            <span>Available in Stock: {stockInfo.quantity} {stockInfo.unit}</span>
                          </div>
                        )}

                        <div className="grid grid-cols-3 gap-4 mb-3">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Requested</p>
                            <p className="text-lg font-bold text-gray-900">{item.quantity} {item.unit}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Received</p>
                            <p className="text-lg font-bold text-green-600">{item.receivedQty} {item.unit}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Remaining</p>
                            <p className="text-lg font-bold text-orange-600">{item.quantity - item.receivedQty} {item.unit}</p>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>Progress</span>
                            <span className="font-semibold">{progress.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className={`h-3 rounded-full transition-all duration-500 ${
                                progress === 100 ? 'bg-green-500' : progress > 0 ? 'bg-orange-500' : 'bg-gray-300'
                              }`}
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            />
                          </div>
                        </div>

                        {item.note && (
                          <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-gray-700">
                            <span className="font-medium">Note:</span> {item.note}
                          </div>
                        )}

                        {stockInfo && (
                          <div className="mt-3 text-sm text-gray-700">
                            <span className="font-medium">Estimated Value:</span> {formatCurrency(item.quantity * stockInfo.sellingPrice)}
                          </div>
                        )}
                      </div>

                      {item.receivingLogs && item.receivingLogs.length > 0 && (
                        <button
                          onClick={() => toggleItemExpansion(item.id)}
                          className="ml-4 p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          {isExpanded ? (
                            <ChevronUp className="h-5 w-5 text-gray-600" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-600" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Receiving Logs */}
                  {isExpanded && item.receivingLogs && item.receivingLogs.length > 0 && (
                    <div className="border-t border-gray-200 bg-white p-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Receiving History ({item.receivingLogs.length})
                      </h4>
                      <div className="space-y-3">
                        {item.receivingLogs.map((log) => (
                          <div key={log.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <p className="font-semibold text-gray-900">
                                  Received {log.receivedQty} {item.unit}
                                </p>
                                <span className="text-xs text-gray-500">{formatDate(log.receivedAt)}</span>
                              </div>
                              <p className="text-sm text-gray-600">
                                By: <span className="font-medium">
                                  {log.receivedBy?.first_name} {log.receivedBy?.last_name}
                                </span>
                                {log.receivedBy?.position && <span className="text-gray-500"> ({log.receivedBy.position})</span>}
                              </p>
                              {log.note && (
                                <p className="text-sm text-gray-600 mt-1 italic">"{log.note}"</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Metadata Footer */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span>Requisition ID: <span className="font-mono text-gray-700">{requisition.id}</span></span>
              <span>Last Updated: {formatDate(requisition.updatedAt)}</span>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 text-xs font-medium">
                Export PDF
              </button>
              <button className="px-3 py-1.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 text-xs font-medium">
                Print
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequisitionDetailView;