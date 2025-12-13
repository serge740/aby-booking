import React, { useState, useEffect } from 'react';
import { Plus, Trash2, AlertCircle, Search, CheckCircle } from 'lucide-react';
import { useEmployeeAuth } from '../../../context/EmployeeAuthContext';

// Import your services
import requisitionService from '../../../services/requisitionService'; // Adjust path as needed
import stockService from '../../../services/stockService';             // Adjust path as needed
import { useNavigate, useOutletContext } from 'react-router-dom';

// Currency formatter function
const formatCurrency = (amount, currency = 'RWF') => {
  return new Intl.NumberFormat('en-RW', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};

const CreateRequisition = () => {
  const { user: employee } = useEmployeeAuth();
  const navigate = useNavigate();
  const {role} = useOutletContext();

  const [formData, setFormData] = useState({
    description: '',
    items: [
      {
        itemName: '',
        quantity: '',
        unit: '',
        purpose: 'EATING',
        note: '',
        stockId: ''
      }
    ]
  });

  const [allStocks, setAllStocks] = useState([]);       // Full list from backend
  const [filteredStocks, setFilteredStocks] = useState([]); // For modal search
  const [searchTerm, setSearchTerm] = useState('');
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [loadingStocks, setLoadingStocks] = useState(true);

  const purposeOptions = [
    { value: 'EATING', label: 'Eating' },
    { value: 'DRINKING', label: 'Drinking' }
  ];

  const unitOptions = [
    { value: 'kg', label: 'Kilogram (kg)' },
    { value: 'pcs', label: 'Pieces (pcs)' },
    { value: 'L', label: 'Liters (L)' },
  ];

  // Load all stocks on mount
  useEffect(() => {
    const loadAllStocks = async () => {
      setLoadingStocks(true);
      try {
        
        const combined = await stockService.getAllStock();
        setAllStocks(combined);
        setFilteredStocks(combined);
      } catch (error) {
        console.error('Failed to load stocks:', error);
        setErrors(prev => ({ ...prev, loadStocks: 'Failed to load stock items' }));
      } finally {
        setLoadingStocks(false);
      }
    };

    loadAllStocks();
  }, []);

  // Handle search in modal (client-side filter)
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredStocks(allStocks);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = allStocks.filter(stock =>
      stock.name.toLowerCase().includes(term) ||
      stock.sku.toLowerCase().includes(term)
    );
    setFilteredStocks(filtered);
  }, [searchTerm, allStocks]);

  // Helper: Check if a stock is already used in another item
  const isStockAlreadySelected = (stockId, currentIndex) => {
    if (!stockId) return false;
    return formData.items.some((item, index) => 
      index !== currentIndex && item.stockId === stockId
    );
  };

  const openStockModal = (index) => {
    setSelectedItemIndex(index);
    setShowStockModal(true);
    setSearchTerm('');
    setFilteredStocks(allStocks);

    // Clear any previous duplication error
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`items.${index}.stockId`];
      return newErrors;
    });
  };

  const selectStock = (stock) => {
    if (selectedItemIndex === null) return;

    // Check for duplicate
    const alreadySelected = formData.items.some((item, index) => 
      index !== selectedItemIndex && item.stockId === stock.id
    );

    if (alreadySelected) {
      setErrors(prev => ({
        ...prev,
        [`items.${selectedItemIndex}.stockId`]: 'This stock item is already selected in another line. Duplicates are not allowed.'
      }));
      setShowStockModal(false);
      setSelectedItemIndex(null);
      return;
    }

    // Clear any previous error
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`items.${selectedItemIndex}.stockId`];
      return newErrors;
    });

    const newItems = [...formData.items];
    newItems[selectedItemIndex] = {
      ...newItems[selectedItemIndex],
      stockId: stock.id,
      itemName: stock.name,
      unit: stock.unit,
      purpose: stock.purpose
    };
    setFormData(prev => ({
      ...prev,
      items: newItems
    }));

    setShowStockModal(false);
    setSelectedItemIndex(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      items: newItems
    }));
    if (errors[`items.${index}.${field}`]) {
      setErrors(prev => ({ ...prev, [`items.${index}.${field}`]: '' }));
    }
  };

  const addItem = () => {
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
          stockId: ''
        }
      ]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        items: newItems
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.items.length === 0) {
      newErrors.items = 'At least one item is required';
    }

    formData.items.forEach((item, index) => {
      if (!item.itemName.trim()) {
        newErrors[`items.${index}.itemName`] = 'Item name is required';
      }
      
      if (!item.quantity) {
        newErrors[`items.${index}.quantity`] = 'Quantity is required';
      } else {
        const qty = parseFloat(item.quantity);
        if (isNaN(qty) || qty <= 0) {
          newErrors[`items.${index}.quantity`] = 'Quantity must be greater than 0';
        }
      }

      if (!item.unit || !item.unit.trim()) {
        newErrors[`items.${index}.unit`] = 'Unit is required';
      }

      // Check stock availability if stockId is provided
      if (item.stockId) {
        const stock = allStocks.find(s => s.id === item.stockId);
    
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitSuccess(false);
    setErrors({});

    try {
      const payload = {
        description: formData.description || undefined,
        items: formData.items.map(item => ({
          itemName: item.itemName,
          quantity: parseFloat(item.quantity),
          unit: item.unit,
          purpose: item.purpose,
          note: item.note || undefined,
          stockId: item.stockId || undefined
        }))
      };

      await requisitionService.createRequisition(payload);

      setSubmitSuccess(true);

      setTimeout(() => navigate(`/${role}/dashboard/requisition-management`), 2000);
      // Reset form
      setFormData({
        description: '',
        items: [{
          itemName: '',
          quantity: '',
          unit: '',
          purpose: 'EATING',
          note: '',
          stockId: ''
        }]
      });


    } catch (error) {
      console.error('Failed to create requisition:', error);
      setErrors({ submit: error.message || 'Failed to create requisition. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStockInfo = (stockId) => {
    return allStocks.find(s => s.id === stockId) || null;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto">
        {/* Employee Info Card */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Requesting Employee</h3>
              <p className="text-lg font-semibold text-gray-900">
                {employee?.first_name} {employee?.last_name}
              </p>
              <p className="text-sm text-gray-600">{employee?.position} • {employee?.email}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Employee ID</p>
              <p className="text-sm font-mono text-gray-700">{employee?.id}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Create New Requisition</h1>
            <p className="mt-1 text-sm text-gray-600">Request items from your company inventory</p>
          </div>

          {/* Success Message */}
          {submitSuccess && (
            <div className="mx-6 mt-6 bg-green-50 border border-green-200 rounded-md p-4 flex items-start">
              <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">Requisition created successfully!</p>
                <p className="mt-1 text-sm text-green-700">Your request is now pending approval.</p>
              </div>
            </div>
          )}

          {/* Submit Error */}
          {errors.submit && (
            <div className="mx-6 mt-6 bg-red-50 border border-red-200 rounded-md p-4 flex items-start">
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{errors.submit}</p>
              </div>
            </div>
          )}

          {/* Load stocks error */}
          {errors.loadStocks && (
            <div className="mx-6 mt-6 bg-red-50 border border-red-200 rounded-md p-4 flex items-start">
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{errors.loadStocks}</p>
              </div>
            </div>
          )}

          <div className="p-6 space-y-6">
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter requisition description or purpose"
              />
            </div>

            {/* Items Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Requisition Items <span className="text-red-500">*</span>
                </h2>
                <button
                  type="button"
                  onClick={addItem}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Item
                </button>
              </div>

              {errors.items && (
                <p className="text-sm text-red-600">{errors.items}</p>
              )}

              <div className="space-y-4">
                {formData.items.map((item, index) => {
                  const stockInfo = item.stockId ? getStockInfo(item.stockId) : null;
                  
                  return (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-medium text-gray-700">Item {index + 1}</h3>
                        {formData.items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="text-red-600 hover:text-red-800 focus:outline-none"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>

                      {/* Stock Selection */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Select from Stock <span className="text-gray-400 text-xs">(Optional)</span>
                        </label>
                        
                        {!stockInfo ? (
                          <button
                            type="button"
                            onClick={() => openStockModal(index)}
                            disabled={loadingStocks}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-left bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between disabled:opacity-50"
                          >
                            <span className="text-gray-500">
                              {loadingStocks ? 'Loading stocks...' : 'Browse available stock items'}
                            </span>
                            <Search className="h-4 w-4 text-gray-400" />
                          </button>
                        ) : null}

                        {stockInfo && (
                          <div className="mt-2 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900 mb-1">{stockInfo.name}</p>
                                <p className="text-xs text-gray-600 mb-2">{stockInfo.description || 'No description'}</p>
                                <div className="flex items-center gap-3 text-xs">
                                  <span className="inline-flex items-center px-2 py-1 bg-white rounded border border-blue-200">
                                    <span className="font-medium text-gray-700">SKU:</span>
                                    <span className="ml-1 font-mono text-blue-700">{stockInfo.sku}</span>
                                  </span>
                                  <span className={`inline-flex items-center px-2 py-1 rounded ${
                                    stockInfo.purpose === 'EATING' 
                                      ? 'bg-orange-100 text-orange-700 border border-orange-200' 
                                      : 'bg-cyan-100 text-cyan-700 border border-cyan-200'
                                  }`}>
                                    {stockInfo.purpose}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4 text-right">
                                <p className="text-xs text-gray-500 mb-1">Available</p>
                                <p className="text-lg font-bold text-blue-600">
                                  {stockInfo.quantity} <span className="text-sm font-normal text-gray-600">{stockInfo.unit}</span>
                                </p>
                                <p className="text-xs text-gray-600 mt-1">
                                  {formatCurrency(stockInfo.sellingPrice)}/{stockInfo.unit}
                                </p>
                              </div>
                            </div>

                            {/* Duplicate Stock Error */}
                            {errors[`items.${index}.stockId`] && (
                              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                                <p className="text-sm text-red-800 flex items-start">
                                  <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                                  {errors[`items.${index}.stockId`]}
                                </p>
                              </div>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                const newItems = [...formData.items];
                                newItems[index] = {
                                  ...newItems[index],
                                  stockId: '',
                                  itemName: '',
                                  unit: '',
                                  purpose: 'EATING'
                                };
                                setFormData(prev => ({
                                  ...prev,
                                  items: newItems
                                }));
                                setErrors(prev => {
                                  const newErrors = { ...prev };
                                  delete newErrors[`items.${index}.stockId`];
                                  return newErrors;
                                });
                              }}
                              className="mt-2 text-xs text-red-600 hover:text-red-800 font-medium"
                            >
                              Clear Selection
                            </button>
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
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors[`items.${index}.itemName`] ? 'border-red-300' : 'border-gray-300'
                            }`}
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
                            min="0"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors[`items.${index}.quantity`] ? 'border-red-300' : 'border-gray-300'
                            }`}
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
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors[`items.${index}.unit`] ? 'border-red-300' : 'border-gray-300'
                            }`}
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            value={item.note}
                            onChange={(e) => handleItemChange(index, 'note', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Additional notes or special instructions"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    description: '',
                    items: [{
                      itemName: '',
                      quantity: '',
                      unit: '',
                      purpose: 'EATING',
                      note: '',
                      stockId: ''
                    }]
                  });
                  setErrors({});
                }}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating...' : 'Create Requisition'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stock Selection Modal */}
      {showStockModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500/75" onClick={() => setShowStockModal(false)} />
            
            <div className="relative inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Select Stock Item</h3>
                <button
                  onClick={() => setShowStockModal(false)}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Search */}
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

              {/* Stock List */}
              <div className="max-h-96 overflow-y-auto space-y-2">
                {loadingStocks ? (
                  <div className="text-center py-8 text-gray-500">Loading stocks...</div>
                ) : filteredStocks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {searchTerm ? 'No stocks found matching your search' : 'No stock items available'}
                  </div>
                ) : (
                  filteredStocks.map(stock => {
                    const isSelected = selectedItemIndex !== null && 
                      formData.items[selectedItemIndex]?.stockId === stock.id;
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
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                              <span className="font-mono bg-gray-100 px-2 py-1 rounded">{stock.sku}</span>
                              <span className={`px-2 py-1 rounded ${
                                stock.purpose === 'EATING' ? 'bg-orange-100 text-orange-700' : 'bg-cyan-100 text-cyan-700'
                              }`}>
                                {stock.purpose}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4 text-right">
                            <p className="text-sm font-semibold text-gray-900">
                              {stock.quantity} {stock.unit}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
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

export default CreateRequisition;