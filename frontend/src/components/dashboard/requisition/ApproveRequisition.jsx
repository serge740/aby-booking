import React, { useState, useEffect } from 'react';
import { Plus, Trash2, AlertCircle, CheckCircle, X, Search, ArrowLeft } from 'lucide-react';
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

const ApproveRequisition = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {role} = useOutletContext();

  const [requisition, setRequisition] = useState(null);
  const [items, setItems] = useState([]);
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
        const req = await requisitionService.getOne(id);
        setRequisition(req);
        setItems(req.items.map(item => ({
          ...item,
          isEdited: false,
          remove: false,
          isNew: false
        })));

        // Load stocks
        
        const combined = await stockService.getAllStock();
        setAllStocks(combined);
        setFilteredStocks(combined);

      } catch (err) {
        console.error('Failed to load requisition:', err);
        setErrors({ load: 'Failed to load requisition. Please try again.' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Search filtering
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

  // Prevent duplicate stock selection
  const isStockAlreadySelected = (stockId, currentIndex) => {
    if (!stockId) return false;
    return items.some((item, idx) => 
      idx !== currentIndex && item.stockId === stockId && !item.remove
    );
  };

  const openStockModal = (index) => {
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
    if (selectedItemIndex === null) return;

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

    const newItems = [...items];
    newItems[selectedItemIndex] = {
      ...newItems[selectedItemIndex],
      stockId: stock.id,
      itemName: stock.name,
      unit: stock.unit,
      purpose: stock.purpose,
      isEdited: true
    };
    setItems(newItems);

    setShowStockModal(false);
    setSelectedItemIndex(null);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value, isEdited: true };
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, {
      itemName: '',
      quantity: '',
      unit: '',
      purpose: 'EATING',
      note: '',
      stockId: '',
      isNew: true
    }]);
  };

  const markForRemoval = (index) => {
    const newItems = [...items];
    newItems[index].remove = !newItems[index].remove;
    setItems(newItems);
  };

  const removeNewItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};
    const activeItems = items.filter(item => !item.remove);

    if (activeItems.length === 0) {
      newErrors.items = 'At least one active item is required';
    }

    activeItems.forEach((item, idx) => {
      const originalIndex = items.indexOf(item);
      if (!item.itemName.trim()) newErrors[`items.${originalIndex}.itemName`] = 'Required';
      if (!item.quantity || parseFloat(item.quantity) <= 0) newErrors[`items.${originalIndex}.quantity`] = 'Must be > 0';
      if (!item.unit) newErrors[`items.${originalIndex}.unit`] = 'Required';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleApprove = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const payload = items.map(item => {
        if (item.remove && item.id) return { id: item.id, remove: true };

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
      }).filter(Boolean);

      await requisitionService.approve(id, payload);

      setSubmitSuccess(true);
      setTimeout(() => navigate(`/${role}/dashboard/requisition-management`), 2000);

    } catch (err) {
      setErrors({ submit: err.message || 'Failed to approve requisition.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStockInfo = (stockId) => allStocks.find(s => s.id === stockId) || null;

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
      <div className="mx-auto">
        <button onClick={() => navigate(-1)} className="mb-4 inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4 mr-1" />Back
        </button>

        {/* Requisition Info */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-6 border border-gray-200">
          <div className="flex justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold">Requisition #{requisition.id}</h2>
              <p className="text-sm text-gray-600">{new Date(requisition.createdAt).toLocaleDateString()}</p>
            </div>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
              {requisition.status.replace('_', ' ')}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div>
              <p className="text-xs text-gray-500">Requested By</p>
              <p className="font-semibold">{requisition.employee?.first_name} {requisition.employee?.last_name}</p>
              <p className="text-sm text-gray-600">{requisition.employee?.position}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Description</p>
              <p className="text-sm">{requisition.description || 'No description'}</p>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b px-6 py-4">
            <h1 className="text-2xl font-bold">Review & Approve</h1>
            <p className="text-sm text-gray-600">Edit, add, or remove items</p>
          </div>

          {submitSuccess && (
            <div className="mx-6 mt-6 bg-green-50 border border-green-200 rounded-md p-4 flex">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <p className="ml-3 text-sm text-green-800">Approved successfully! Redirecting...</p>
            </div>
          )}

          {errors.submit && (
            <div className="mx-6 mt-6 bg-red-50 border border-red-200 rounded-md p-4 flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <p className="ml-3 text-sm text-red-800">{errors.submit}</p>
            </div>
          )}

          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Items</h2>
              <button onClick={addItem} className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <Plus className="h-4 w-4 mr-1" />Add Item
              </button>
            </div>

            {errors.items && <p className="text-sm text-red-600">{errors.items}</p>}

            <div className="space-y-4">
              {items.map((item, idx) => {
                const stockInfo = item.stockId ? getStockInfo(item.stockId) : null;
                const isMarkedForRemoval = item.remove;
                
                return (
                  <div key={idx} className={`border rounded-lg p-4 ${
                    isMarkedForRemoval ? 'bg-red-50 border-red-300 opacity-60' :
                    item.isNew ? 'bg-green-50 border-green-300' :
                    item.isEdited ? 'bg-yellow-50 border-yellow-300' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex justify-between mb-3">
                      <div className="flex gap-2 items-center">
                        <h3 className="text-sm font-medium">Item {idx + 1}</h3>
                        {item.isNew && <span className="text-xs px-2 py-1 bg-green-600 text-white rounded-full">NEW</span>}
                        {item.isEdited && !item.isNew && <span className="text-xs px-2 py-1 bg-yellow-600 text-white rounded-full">EDITED</span>}
                        {isMarkedForRemoval && <span className="text-xs px-2 py-1 bg-red-600 text-white rounded-full">TO REMOVE</span>}
                      </div>
                      <div className="flex gap-2">
                        {item.id && !item.isNew && (
                          <button onClick={() => markForRemoval(idx)} className={isMarkedForRemoval ? 'text-green-600' : 'text-red-600'}>
                            {isMarkedForRemoval ? <X className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
                          </button>
                        )}
                        {item.isNew && (
                          <button onClick={() => removeNewItem(idx)} className="text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {!isMarkedForRemoval && (
                      <>
                        <div className="mb-4">
                          {!stockInfo ? (
                            <button onClick={() => openStockModal(idx)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-left bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-between">
                              <span className="text-gray-500">Browse stock</span>
                              <Search className="h-4 w-4 text-gray-400" />
                            </button>
                          ) : (
                            <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                              <div className="flex justify-between">
                                <div>
                                  <p className="font-semibold">{stockInfo.name}</p>
                                  <span className="text-xs px-2 py-1 bg-white rounded mt-1 inline-block">{stockInfo.sku}</span>
                                </div>
                                <div className="text-right">
                                  <p className="text-lg font-bold text-blue-600">{stockInfo.quantity} {stockInfo.unit}</p>
                                  <p className="text-xs">{formatCurrency(stockInfo.sellingPrice)}/{stockInfo.unit}</p>
                                </div>
                              </div>

                              {errors[`items.${idx}.stockId`] && (
                                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                                  <p className="text-sm text-red-800 flex items-start">
                                    <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                                    {errors[`items.${idx}.stockId`]}
                                  </p>
                                </div>
                              )}

                              <button onClick={() => {
                                handleItemChange(idx, 'stockId', '');
                                handleItemChange(idx, 'itemName', '');
                                handleItemChange(idx, 'unit', '');
                                handleItemChange(idx, 'purpose', 'EATING');
                                setErrors(prev => {
                                  const newErr = { ...prev };
                                  delete newErr[`items.${idx}.stockId`];
                                  return newErr;
                                });
                              }} className="mt-2 text-xs text-red-600 font-medium">
                                Clear
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Item Name <span className="text-red-500">*</span></label>
                            <input type="text" value={item.itemName} onChange={(e) => handleItemChange(idx, 'itemName', e.target.value)}
                              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[`items.${idx}.itemName`] ? 'border-red-300' : 'border-gray-300'}`} />
                            {errors[`items.${idx}.itemName`] && <p className="text-sm text-red-600 mt-1">{errors[`items.${idx}.itemName`]}</p>}
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-1">Quantity <span className="text-red-500">*</span></label>
                            <input type="number" step="0.01" value={item.quantity} onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[`items.${idx}.quantity`] ? 'border-red-300' : 'border-gray-300'}`} />
                            {errors[`items.${idx}.quantity`] && <p className="text-sm text-red-600 mt-1">{errors[`items.${idx}.quantity`]}</p>}
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-1">Unit <span className="text-red-500">*</span></label>
                            <select value={item.unit} onChange={(e) => handleItemChange(idx, 'unit', e.target.value)}
                              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[`items.${idx}.unit`] ? 'border-red-300' : 'border-gray-300'}`}>
                              <option value="">Select</option>
                              {unitOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                            {errors[`items.${idx}.unit`] && <p className="text-sm text-red-600 mt-1">{errors[`items.${idx}.unit`]}</p>}
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-1">Purpose</label>
                            <select value={item.purpose} onChange={(e) => handleItemChange(idx, 'purpose', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                              {purposeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                          </div>

                          <div className="col-span-2">
                            <label className="block text-sm font-medium mb-1">Note</label>
                            <input type="text" value={item.note || ''} onChange={(e) => handleItemChange(idx, 'note', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button onClick={() => navigate(-1)} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Cancel</button>
              <button onClick={handleApprove} disabled={isSubmitting} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed">
                {isSubmitting ? 'Approving...' : 'Approve Requisition'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stock Modal */}
      {showStockModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowStockModal(false)} />
            
            <div className="relative bg-white rounded-lg p-6 w-full max-w-2xl">
              <div className="flex justify-between mb-4">
                <h3 className="text-lg font-semibold">Select Stock</h3>
                <button onClick={() => setShowStockModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="mb-4">
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or SKU..." className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div className="max-h-96 overflow-y-auto space-y-2">
                {filteredStocks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No stocks found</div>
                ) : (
                  filteredStocks.map(stock => {
                    const isSelected = selectedItemIndex !== null && items[selectedItemIndex]?.stockId === stock.id;
                    const isDuplicate = isStockAlreadySelected(stock.id, selectedItemIndex);

                    return (
                      <button key={stock.id} onClick={() => !isDuplicate && selectStock(stock)}
                        disabled={isDuplicate}
                        className={`w-full p-4 border rounded-lg text-left transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          isDuplicate
                            ? 'bg-gray-100 border-gray-300 opacity-60 cursor-not-allowed'
                            : isSelected ? 'bg-blue-100 border-blue-500 shadow-md' : 'border-gray-200 hover:bg-blue-50 hover:border-blue-300'
                        }`}>
                        <div className="flex justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{stock.name}</h4>
                              {isSelected && <span className="text-xs px-2 py-1 bg-blue-600 text-white rounded-full flex items-center">
                                <CheckCircle className="h-3 w-3 mr-1" />Selected
                              </span>}
                              {isDuplicate && <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">Already selected</span>}
                            </div>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded mt-1 inline-block">{stock.sku}</span>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{stock.quantity} {stock.unit}</p>
                            <p className="text-xs text-gray-500">{formatCurrency(stock.sellingPrice)}/{stock.unit}</p>
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

export default ApproveRequisition;