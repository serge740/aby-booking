import React, { useState, useEffect } from 'react';
import { Package, AlertCircle, CheckCircle, ArrowLeft, Clock, CheckSquare } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

// Import services
import requisitionService from '../../../services/requisitionService'; // Adjust path
import stockService from '../../../services/stockService';             // Optional, if needed later

const formatCurrency = (amount, currency = 'RWF') => {
  return new Intl.NumberFormat('en-RW', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};

const ReceiveRequisition = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {employee} = useNavigate();

  const [requisition, setRequisition] = useState(null);
  const [receiveData, setReceiveData] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [expandedLogs, setExpandedLogs] = useState({});
  const [loading, setLoading] = useState(true);

  // Load requisition
  useEffect(() => {
    const fetchRequisition = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const req = await requisitionService.getOne(id);
        setRequisition(req);

        // Initialize receive data for items that are not fully received
        const initialData = req.items
          .filter(item => item.receivingStatus !== 'FULLY_RECEIVED')
          .map(item => ({
            itemId: item?.id,
            receivedQty: '',
            note: ''
          }));
        setReceiveData(initialData);

      } catch (err) {
        console.error('Failed to load requisition:', err);
        setErrors({ load: 'Failed to load requisition. Please try again.' });
      } finally {
        setLoading(false);
      }
    };

    fetchRequisition();
  }, [id]);

  const handleReceiveChange = (itemId, field, value) => {
    setReceiveData(prev => {
      const existing = prev.find(d => d.itemId === itemId);
      if (existing) {
        return prev.map(d => d.itemId === itemId ? { ...d, [field]: value } : d);
      } else {
        return [...prev, { itemId, receivedQty: field === 'receivedQty' ? value : '', note: field === 'note' ? value : '' }];
      }
    });

    // Clear error
    if (errors[`items.${itemId}.${field}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`items.${itemId}.${field}`];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const itemsToReceive = receiveData.filter(d => d.receivedQty && parseFloat(d.receivedQty) > 0);

    if (itemsToReceive.length === 0) {
      newErrors.general = 'Enter quantity for at least one item to receive';
    }

    itemsToReceive.forEach(data => {
      const item = requisition.items.find(i => i?.id === data.itemId);
      const remainingQty = item.quantity - item.receivedQty;

      const qty = parseFloat(data.receivedQty);
      if (qty <= 0) {
        newErrors[`items.${data.itemId}.receivedQty`] = 'Must be greater than 0';
      } else if (qty > remainingQty) {
        newErrors[`items.${data.itemId}.receivedQty`] = `Cannot exceed remaining quantity (${remainingQty} ${item.unit})`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReceive = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const itemsToReceive = receiveData
        .filter(d => d.receivedQty && parseFloat(d.receivedQty) > 0)
        .map(d => ({
          itemId: d.itemId,
          receivedQty: parseFloat(d.receivedQty),
          receivedBy:employee?.id,
          note: d.note || undefined
        }));

        console.warn('sht');
        

     const result =  await requisitionService.receiveItems(id, itemsToReceive);

      setSubmitSuccess(true);
      setTimeout(() => {
        // Refetch or redirect
      setRequisition(result)
      }, 1000);

    } catch (err) {
      setErrors({ submit: err.message || 'Failed to receive items. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'NOT_RECEIVED': return 'bg-gray-100 text-gray-800';
      case 'PARTIALLY_RECEIVED': return 'bg-yellow-100 text-yellow-800';
      case 'FULLY_RECEIVED': return 'bg-green-100 text-green-800';
      case 'APPROVED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'NOT_RECEIVED': return <Clock className="h-4 w-4" />;
      case 'PARTIALLY_RECEIVED': return <Package className="h-4 w-4" />;
      case 'FULLY_RECEIVED': return <CheckSquare className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const toggleLogs = (itemId) => {
    setExpandedLogs(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (errors.load || !requisition) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-800">Error Loading Requisition</p>
          <p className="text-gray-600 mt-2">{errors.load || 'Requisition not found'}</p>
          <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const allItemsReceived = requisition.items.every(item => item.receivingStatus === 'FULLY_RECEIVED');
  const canReceive = ['APPROVED', 'PARTIALLY_RECEIVED'].includes(requisition.status);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="mx-auto ">
        <button onClick={() => navigate(-1)} className="mb-4 inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Requisitions
        </button>

        {/* Requisition Info */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-6 border border-gray-200">
          <div className="flex justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold">Requisition #{requisition?.id}</h2>
              <p className="text-sm text-gray-600">Created: {new Date(requisition.createdAt).toLocaleDateString()}</p>
              {requisition.approvedAt && (
                <p className="text-sm text-gray-600">Approved: {new Date(requisition.approvedAt).toLocaleDateString()}</p>
              )}
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(requisition.status)}`}>
              {requisition.status.replace('_', ' ')}
            </span>
          </div>
          
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div>
              <p className="text-xs text-gray-500">Requested By</p>
              <p className="font-semibold">{requisition.employee?.first_name} {requisition.employee?.last_name}</p>
              <p className="text-sm text-gray-600">{requisition.employee?.position}</p>
            </div>
            {requisition.approvedBy && (
              <div>
                <p className="text-xs text-gray-500">Approved By</p>
                <p className="font-semibold">{requisition.approvedBy.first_name} {requisition.approvedBy.last_name}</p>
                <p className="text-sm text-gray-600">{requisition.approvedBy.position}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-500">Description</p>
              <p className="text-sm">{requisition.description || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Progress Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm mb-6 p-6 border border-blue-200">
          <h3 className="text-lg font-semibold mb-4">Receiving Progress</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{requisition.items.length}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600">Fully Received</p>
              <p className="text-2xl font-bold text-green-600">
                {requisition.items.filter(i => i.receivingStatus === 'FULLY_RECEIVED').length}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {requisition.items.filter(i => i.receivingStatus !== 'FULLY_RECEIVED').length}
              </p>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b px-6 py-4">
            <h1 className="text-2xl font-bold">Receive Items</h1>
            <p className="text-sm text-gray-600">Enter quantities received for each item</p>
          </div>

          {submitSuccess && (
            <div className="mx-6 mt-6 bg-green-50 border border-green-200 rounded-md p-4 flex">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <p className="ml-3 text-sm text-green-800">Items received successfully!</p>
            </div>
          )}

          {errors.submit && (
            <div className="mx-6 mt-6 bg-red-50 border border-red-200 rounded-md p-4 flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <p className="ml-3 text-sm text-red-800">{errors.submit}</p>
            </div>
          )}

          {errors.general && (
            <div className="mx-6 mt-6 bg-red-50 border border-red-200 rounded-md p-4 flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <p className="ml-3 text-sm text-red-800">{errors.general}</p>
            </div>
          )}

          {allItemsReceived && (
            <div className="mx-6 mt-6 bg-green-50 border border-green-200 rounded-md p-4 flex">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <p className="ml-3 text-sm text-green-800">All items have been fully received!</p>
            </div>
          )}

          <div className="p-6 space-y-4">
            {requisition.items.map((item) => {
              const remainingQty = item.quantity - item.receivedQty;
              const progressPercent = item.quantity > 0 ? (item.receivedQty / item.quantity) * 100 : 0;
              const receiveInput = receiveData.find(d => d.itemId === item?.id);
              const isFullyReceived = item.receivingStatus === 'FULLY_RECEIVED';
              
              return (
                <div key={item?.id} className={`border rounded-lg p-4 ${
                  isFullyReceived ? 'bg-green-50 border-green-300' : 'bg-white border-gray-200'
                }`}>
                  {/* Item Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold">{item.itemName}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(item.receivingStatus)}`}>
                          {getStatusIcon(item.receivingStatus)}
                          {item.receivingStatus.replace('_', ' ')}
                        </span>
                      </div>
                      {item.note && <p className="text-sm text-gray-600">Note: {item.note}</p>}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">{item.receivedQty} / {item.quantity} {item.unit} ({progressPercent.toFixed(0)}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          isFullyReceived ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Receiving History */}
                  {item.receivingLogs && item.receivingLogs.length > 0 && (
                    <div className="mb-4">
                      <button
                        onClick={() => toggleLogs(item?.id)}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {expandedLogs[item?.id] ? '▼' : '▶'} View Receiving History ({item.receivingLogs.length})
                      </button>
                      
                      {expandedLogs[item?.id] && (
                        <div className="mt-2 space-y-2">
                          {item.receivingLogs.map((log, logIdx) => (
                            <div key={logIdx} className="bg-gray-50 rounded p-3 text-sm border border-gray-200">
                              <div className="flex justify-between mb-1">
                                <span className="font-medium">{log.receivedQty} {item.unit} received</span>
                                <span className="text-gray-500">{new Date(log.receivedAt).toLocaleString()}</span>
                              </div>
                              <p className="text-gray-600">
                                By: {log.receivedBy?.first_name} {log.receivedBy?.last_name}
                              </p>
                              {log.note && <p className="text-gray-600 mt-1">Note: {log.note}</p>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Receive Input */}
                  {!isFullyReceived && canReceive && (
                    <div className="border-t pt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Quantity to Receive <span className="text-gray-500">(Max: {remainingQty} {item.unit})</span>
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max={remainingQty}
                            value={receiveInput?.receivedQty || ''}
                            onChange={(e) => handleReceiveChange(item?.id, 'receivedQty', e.target.value)}
                            placeholder={`0 - ${remainingQty}`}
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors[`items.${item?.id}.receivedQty`] ? 'border-red-300' : 'border-gray-300'
                            }`}
                          />
                          {errors[`items.${item?.id}.receivedQty`] && (
                            <p className="text-sm text-red-600 mt-1">{errors[`items.${item?.id}.receivedQty`]}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Note (Optional)</label>
                          <input
                            type="text"
                            value={receiveInput?.note || ''}
                            onChange={(e) => handleReceiveChange(item?.id, 'note', e.target.value)}
                            placeholder="Delivery note..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {isFullyReceived && (
                    <div className="flex items-center gap-2 text-green-700 bg-green-100 rounded p-3">
                      <CheckSquare className="h-5 w-5" />
                      <span className="font-medium">This item has been fully received</span>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Action Buttons */}
            {canReceive && !allItemsReceived && (
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button 
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleReceive}
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Package className="h-4 w-4" />
                  {isSubmitting ? 'Receiving...' : 'Receive Items'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiveRequisition;