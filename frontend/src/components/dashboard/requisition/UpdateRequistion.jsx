import React, { useState, useEffect } from 'react';
import { Plus, Trash2, AlertCircle, Search, CheckCircle, X, ArrowLeft, Lock } from 'lucide-react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';

// Import services
import requisitionService from '../../../services/requisitionService'; // Adjust path
import stockService from '../../../services/stockService';             // Adjust path

const formatCurrency = (amount, currency = 'RWF') => {
  return new Intl.NumberFormat('en-RW', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};

const UpdateRequisition = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {role} = useOutletContext()

  const [requisition, setRequisition] = useState(null);
  const [formData, setFormData] = useState({
    description: '',
    items: []
  });
  const [allStocks, setAllStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  const purposeOptions = [
    { value: 'EATING', label: 'Eating' },
    { value: 'DRINKING', label: 'Drinking' }
  ];

  const unitOptions = [
    { value: 'kg', label: 'Kilogram (kg)' },
    { value: 'pcs', label: 'Pieces (pcs)' },
    { value: 'L', label: 'Liter (L)' }
  ];

  // Load requisition and stocks
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      setLoading(true);
      try {
        // Fetch requisition
        const req = await requisitionService.getOne(id);
        setRequisition(req);

        // Initialize form data
        setFormData({
          description: req.description || '',
          items: req.items.map(item => ({
            ...item,
            isEdited: false,
            remove: false,
            isNew: false
          }))
        });

     
        const combined = await stockService.getAllStock();
        setAllStocks(combined);
        setFilteredStocks(combined);

      } catch (err) {
        console.error('Failed to load data:', err);
        setErrors({ load: 'Failed to load requisition. Please try again.' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Search filter
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredStocks(allStocks);
      return;
    }
    const term = searchTerm.toLowerCase();
    setFilteredStocks(allStocks.filter(s =>
      s.name.toLowerCase().includes(term) || s.sku.toLowerCase().includes(term)
    ));
  }, [searchTerm, allStocks]);

  const canEdit = requisition?.status === 'PENDING';

  // Helper: prevent duplicate stock selection
  const isStockAlreadySelected = (stockId, currentIndex) => {
    if (!stockId) return false;
    return formData.items.some((item, idx) => 
      idx !== currentIndex && item.stockId === stockId && !item.remove
    );
  };

  const openStockModal = (index) => {
    if (!canEdit) return;
    setSelectedItemIndex(index);
    setShowStockModal(true);
    setSearchTerm('');
    setFilteredStocks(allStocks);
    setErrors(prev => {
      const newErr = { ...prev };
      delete newErr[`items.${index}.stockId`];
      return newErr;
    });
  };

  const selectStock = (stock) => {
    if (selectedItemIndex === null || !canEdit) return;

    if (isStockAlreadySelected(stock.id, selectedItemIndex)) {
      setErrors(prev => ({
        ...prev,
        [`items.${selectedItemIndex}.stockId`]: 'This stock item is already selected in another active line.'
      }));
      setShowStockModal(false);
      setSelectedItemIndex(null);
      return;
    }

    setErrors(prev => {
      const newErr = { ...prev };
      delete newErr[`items.${selectedItemIndex}.stockId`];
      return newErr;
    });

    const newItems = [...formData.items];
    newItems[selectedItemIndex] = {
      ...newItems[selectedItemIndex],
      stockId: stock.id,
      itemName: stock.name,
      unit: stock.unit,
      purpose: stock.purpose,
      isEdited: true
    };
    setFormData(prev => ({ ...prev, items: newItems }));

    setShowStockModal(false);
    setSelectedItemIndex(null);
  };

  const handleInputChange = (e) => {
    if (!canEdit) return;
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, field, value) => {
    if (!canEdit) return;
    const newItems = [...formData.items];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
      isEdited: true
    };
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    if (!canEdit) return;
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          itemName: '',
          quantity: '',
          unit: '',
          purpose: 'EATING',
          note: '',
          stockId: '',
          isNew: true,
          isEdited: false,
          remove: false
        }
      ]
    }));
  };

  const markForRemoval = (index) => {
    if (!canEdit) return;
    const newItems = [...formData.items];
    newItems[index].remove = !newItems[index].remove;
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const removeNewItem = (index) => {
    if (!canEdit) return;
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const activeItems = formData.items.filter(i => !i.remove);

    if (activeItems.length === 0) {
      newErrors.items = 'At least one active item is required';
    }

    activeItems.forEach((item, idx) => {
      const originalIndex = formData.items.indexOf(item);

      if (!item.itemName.trim()) {
        newErrors[`items.${originalIndex}.itemName`] = 'Item name is required';
      }
      if (!item.quantity || parseFloat(item.quantity) <= 0) {
        newErrors[`items.${originalIndex}.quantity`] = 'Quantity must be greater than 0';
      }
      if (!item.unit) {
        newErrors[`items.${originalIndex}.unit`] = 'Unit is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canEdit) {
      setErrors({ submit: 'Cannot update requisition with current status' });
      return;
    }
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const payload = {
        description: formData.description || undefined,
        items: formData.items.map(item => {
          if (item.remove && item.id) {
            return { id: item.id, remove: true };
          }
          const data = {
            itemName: item.itemName,
            quantity: parseFloat(item.quantity),
            unit: item.unit,
            purpose: item.purpose,
            note: item.note || undefined,
            stockId: item.stockId || undefined
          };
          if (item.id && !item.isNew) data.id = item.id;
          return data;
        }).filter(Boolean)
      };

      await requisitionService.update(id, payload);

      setSubmitSuccess(true);
         setTimeout(() => navigate(`/${role}/dashboard/requisition-management`), 2000);

    } catch (err) {
      setErrors({ submit: err.message || 'Failed to update requisition.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStockInfo = (stockId) => allStocks.find(s => s.id === stockId) || null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED': return 'bg-blue-100 text-blue-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'PARTIALLY_RECEIVED': return 'bg-purple-100 text-purple-800';
      case 'FULLY_RECEIVED': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="mx-auto ">
        <button onClick={() => navigate(-1)} className="mb-4 inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Requisitions
        </button>

        {/* Requisition Info Card */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-6 border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold">Requisition #{requisition.id}</h2>
              <p className="text-sm text-gray-600">
                Created: {new Date(requisition.createdAt).toLocaleDateString()}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(requisition.status)}`}>
              {requisition.status.replace('_', ' ')}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div>
              <p className="text-xs text-gray-500">Requested By</p>
              <p className="font-semibold">{requisition.employee?.first_name} {requisition.employee?.last_name}</p>
              <p className="text-sm text-gray-600">{requisition.employee?.position}</p>
              <p className="text-sm text-gray-500">{requisition.employee?.email}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Employee ID</p>
              <p className="text-sm font-mono text-gray-700">{requisition.employee?.id}</p>
            </div>
          </div>
        </div>

        {/* Non-Editable Warning */}
        {!canEdit && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-start">
            <Lock className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-semibold text-amber-900">Cannot Edit Requisition</h3>
              <p className="text-sm text-amber-800 mt-1">
                This requisition has status <span className="font-semibold">{requisition.status}</span> and cannot be edited. 
                Only requisitions with <span className="font-semibold">PENDING</span> status can be modified.
              </p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b px-6 py-4">
            <h1 className="text-2xl font-bold">Update Requisition</h1>
            <p className="text-sm text-gray-600">
              {canEdit ? 'Edit items, quantities, or add new items' : 'View requisition details'}
            </p>
          </div>

          {submitSuccess && (
            <div className="mx-6 mt-6 bg-green-50 border border-green-200 rounded-md p-4 flex items-start">
              <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">Requisition updated successfully!</p>
                <p className="mt-1 text-sm text-green-700">Redirecting...</p>
              </div>
            </div>
          )}

          {errors.submit && (
            <div className="mx-6 mt-6 bg-red-50 border border-red-200 rounded-md p-4 flex items-start">
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{errors.submit}</p>
              </div>
            </div>
          )}

          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                disabled={!canEdit}
                rows={3}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !canEdit ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
                placeholder="Enter requisition description or purpose"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Requisition Items
                </h2>
                {canEdit && (
                  <button
                    type="button"
                    onClick={addItem}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Item
                  </button>
                )}
              </div>

              {errors.items && (
                <p className="text-sm text-red-600">{errors.items}</p>
              )}

              <div className="space-y-4">
                {formData.items.map((item, index) => {
                  const stockInfo = item.stockId ? getStockInfo(item.stockId) : null;
                  const isMarkedForRemoval = item.remove;
                  
                  return (
                    <div
                      key={index}
                      className={`border rounded-lg p-4 ${
                        isMarkedForRemoval ? 'bg-red-50 border-red-300 opacity-60' :
                        item.isNew ? 'bg-green-50 border-green-300' :
                        item.isEdited ? 'bg-yellow-50 border-yellow-300' : 
                        'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex gap-2 items-center">
                          <h3 className="text-sm font-medium text-gray-700">Item {index + 1}</h3>
                          {item.isNew && <span className="text-xs px-2 py-1 bg-green-600 text-white rounded-full">NEW</span>}
                          {item.isEdited && !item.isNew && <span className="text-xs px-2 py-1 bg-yellow-600 text-white rounded-full">EDITED</span>}
                          {isMarkedForRemoval && <span className="text-xs px-2 py-1 bg-red-600 text-white rounded-full">TO REMOVE</span>}
                        </div>
                        
                        {canEdit && (
                          <div className="flex gap-2">
                            {item.id && !item.isNew && (
                              <button
                                type="button"
                                onClick={() => markForRemoval(index)}
                                className={`${isMarkedForRemoval ? 'text-green-600' : 'text-red-600'} hover:opacity-75`}
                              >
                                {isMarkedForRemoval ? <X className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
                              </button>
                            )}
                            {item.isNew && (
                              <button
                                type="button"
                                onClick={() => removeNewItem(index)}
                                className="text-red-600 hover:opacity-75"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      {!isMarkedForRemoval && (
                        <>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Select from Stock <span className="text-gray-400 text-xs">(Optional)</span>
                            </label>
                            
                            {!stockInfo ? (
                              <button
                                type="button"
                                onClick={() => openStockModal(index)}
                                disabled={!canEdit}
                                className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-left bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between ${
                                  !canEdit ? 'cursor-not-allowed bg-gray-100' : ''
                                }`}
                              >
                                <span className="text-gray-500">Browse available stock items</span>
                                <Search className="h-4 w-4 text-gray-400" />
                              </button>
                            ) : (
                              <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <p className="font-semibold text-gray-900 mb-1">{stockInfo.name}</p>
                                    <p className="text-xs text-gray-600 mb-2">{stockInfo.description || 'No description'}</p>
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs px-2 py-1 bg-white rounded border border-blue-200 font-mono">
                                        {stockInfo.sku}
                                      </span>
                                      <span className={`text-xs px-2 py-1 rounded ${
                                        stockInfo.purpose === 'EATING' 
                                          ? 'bg-orange-100 text-orange-700' 
                                          : 'bg-cyan-100 text-cyan-700'
                                      }`}>
                                        {stockInfo.purpose}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="ml-4 text-right">
                                    <p className="text-lg font-bold text-blue-600">
                                      {stockInfo.quantity} <span className="text-sm text-gray-600">{stockInfo.unit}</span>
                                    </p>
                                    <p className="text-xs text-gray-600">
                                      {formatCurrency(stockInfo.sellingPrice)}/{stockInfo.unit}
                                    </p>
                                  </div>
                                </div>

                                {errors[`items.${index}.stockId`] && (
                                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                                    <p className="text-sm text-red-800 flex items-start">
                                      <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                                      {errors[`items.${index}.stockId`]}
                                    </p>
                                  </div>
                                )}

                                {canEdit && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      handleItemChange(index, 'stockId', '');
                                      handleItemChange(index, 'itemName', '');
                                      handleItemChange(index, 'unit', '');
                                      handleItemChange(index, 'purpose', 'EATING');
                                      setErrors(prev => {
                                        const newErr = { ...prev };
                                        delete newErr[`items.${index}.stockId`];
                                        return newErr;
                                      });
                                    }}
                                    className="mt-2 text-xs text-red-600 hover:text-red-800 font-medium"
                                  >
                                    Clear Selection
                                  </button>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Item Name <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={item.itemName}
                                onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                                disabled={!canEdit}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                  errors[`items.${index}.itemName`] ? 'border-red-300' : 'border-gray-300'
                                } ${!canEdit ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                placeholder="Enter item name"
                              />
                              {errors[`items.${index}.itemName`] && (
                                <p className="mt-1 text-sm text-red-600">{errors[`items.${index}.itemName`]}</p>
                              )}
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Quantity <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                disabled={!canEdit}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                  errors[`items.${index}.quantity`] ? 'border-red-300' : 'border-gray-300'
                                } ${!canEdit ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                placeholder="0.00"
                              />
                              {errors[`items.${index}.quantity`] && (
                                <p className="mt-1 text-sm text-red-600">{errors[`items.${index}.quantity`]}</p>
                              )}
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Unit <span className="text-red-500">*</span>
                              </label>
                              <select
                                value={item.unit}
                                onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                                disabled={!canEdit}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                  errors[`items.${index}.unit`] ? 'border-red-300' : 'border-gray-300'
                                } ${!canEdit ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                              >
                                <option value="">Select unit</option>
                                {unitOptions.map(option => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                              {errors[`items.${index}.unit`] && (
                                <p className="mt-1 text-sm text-red-600">{errors[`items.${index}.unit`]}</p>
                              )}
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Purpose <span className="text-red-500">*</span>
                              </label>
                              <select
                                value={item.purpose}
                                onChange={(e) => handleItemChange(index, 'purpose', e.target.value)}
                                disabled={!canEdit}
                                className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                  !canEdit ? 'bg-gray-100 cursor-not-allowed' : ''
                                }`}
                              >
                                {purposeOptions.map(option => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Note <span className="text-gray-400 text-xs">(Optional)</span>
                              </label>
                              <input
                                type="text"
                                value={item.note || ''}
                                onChange={(e) => handleItemChange(index, 'note', e.target.value)}
                                disabled={!canEdit}
                                className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                  !canEdit ? 'bg-gray-100 cursor-not-allowed' : ''
                                }`}
                                placeholder="Additional notes"
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              {canEdit && (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Updating...' : 'Update Requisition'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stock Selection Modal */}
      {showStockModal && canEdit && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowStockModal(false)} />
            
            <div className="relative bg-white rounded-lg p-6 w-full max-w-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Select Stock Item</h3>
                <button
                  onClick={() => setShowStockModal(false)}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Search by name or SKU..."
                  />
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto space-y-2">
                {filteredStocks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No stocks found</div>
                ) : (
                  filteredStocks.map(stock => {
                    const isSelected = selectedItemIndex !== null && formData.items[selectedItemIndex]?.stockId === stock.id;
                    const isDuplicate = isStockAlreadySelected(stock.id, selectedItemIndex);
                    
                    return (
                      <button
                        key={stock.id}
                        type="button"
                        onClick={() => !isDuplicate && selectStock(stock)}
                        disabled={isDuplicate}
                        className={`w-full p-4 border rounded-lg transition-colors text-left focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          isDuplicate
                            ? 'bg-gray-100 border-gray-300 opacity-60 cursor-not-allowed'
                            : isSelected 
                              ? 'bg-blue-100 border-blue-500 shadow-md' 
                              : 'border-gray-200 hover:bg-blue-50 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-gray-900">{stock.name}</h4>
                              {isSelected && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-600 text-white">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Selected
                                </span>
                              )}
                              {isDuplicate && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                  Already selected
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{stock.description || 'No description'}</p>
                            <div className="flex items-center gap-3 mt-2 text-xs">
                              <span className="font-mono bg-gray-100 px-2 py-1 rounded border border-gray-200">
                                SKU: {stock.sku}
                              </span>
                              <span className={`px-2 py-1 rounded ${
                                stock.purpose === 'EATING' 
                                  ? 'bg-orange-100 text-orange-700 border border-orange-200' 
                                  : 'bg-cyan-100 text-cyan-700 border border-cyan-200'
                              }`}>
                                {stock.purpose}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4 text-right">
                            <p className="text-xs text-gray-500 mb-1">Available</p>
                            <p className="text-lg font-bold text-blue-600">
                              {stock.quantity} <span className="text-sm font-normal text-gray-600">{stock.unit}</span>
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              {formatCurrency(stock.sellingPrice)}/{stock.unit}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}
     
    </div>
  );
};


export default UpdateRequisition;