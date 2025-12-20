import React, { useState } from 'react';
import { X, RotateCcw, AlertCircle, CheckCircle2 } from 'lucide-react';
import orderService from '../../../services/orderService';

const ReturnItemsModal = ({ isOpen, onClose, order, onSuccess }) => {
  const [returnedItems, setReturnedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  React.useEffect(() => {
    if (isOpen && order?.items) {
      setReturnedItems(
        order.items.map(item => ({
          orderItemId: item.id,
          quantity: 0,
          maxQuantity: item.quantity,
          itemName: item.menuItem?.name || 'Unknown Item',
          unitPrice: item.unitPrice,
          currentQuantity: item.quantity
        }))
      );
      setError('');
      setSuccess(false);
    }
  }, [isOpen, order]);

  const handleQuantityChange = (orderItemId, value) => {
    const numValue = parseInt(value) || 0;
    setReturnedItems(prev =>
      prev.map(item =>
        item.orderItemId === orderItemId
          ? { ...item, quantity: Math.max(0, Math.min(numValue, item.maxQuantity)) }
          : item
      )
    );
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    const itemsToReturn = returnedItems.filter(item => item.quantity > 0);

    if (itemsToReturn.length === 0) {
      setError('Please select at least one item to return');
      setLoading(false);
      return;
    }

    try {
      const payload = itemsToReturn.map(({ orderItemId, quantity }) => ({
        orderItemId,
        quantity
      }));

    const result =  await orderService.returnOrderItems(order.id, payload);
      setSuccess(true);

      onSuccess(result)
      
   handleClose()
    } catch (err) {
      setError(err.message || 'Failed to return items');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setReturnedItems([]);
    setError('');
    setSuccess(false);
    onClose();
  };

  const totalRefund = returnedItems.reduce(
    (sum, item) => sum + (item.quantity * item.unitPrice),
    0
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Return Items</h2>
                <p className="text-sm text-white/80">Order #{order?.orderNumber}</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 max-h-[65vh] overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-r flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 rounded-r flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-700 font-medium">Items returned successfully!</p>
            </div>
          )}

          <div className="space-y-3">
            {returnedItems.map((item) => (
              <div
                key={item.orderItemId}
                className="p-5 bg-gray-50 rounded-xl border border-gray-200 hover:border-orange-300 transition-all"
              >
                <div className="flex items-center justify-between gap-6">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-lg truncate">{item.itemName}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span className="font-medium">{item.unitPrice.toLocaleString()} RWF</span>
                      <span>•</span>
                      <span>Available: {item.currentQuantity}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Return Qty
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={item.maxQuantity}
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.orderItemId, e.target.value)}
                      className="w-20 px-3 py-2 border-2 border-gray-300 rounded-lg text-center text-base font-semibold focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                      placeholder="0"
                    />
                    {item.quantity > 0 && (
                      <span className="text-sm text-orange-600 font-semibold">
                        -{(item.quantity * item.unitPrice).toLocaleString()} RWF
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          {totalRefund > 0 && (
            <div className="mt-6 p-5 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border-2 border-orange-200">
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-gray-700">Total Refund Amount</span>
                <span className="text-3xl font-bold text-orange-600">
                  {totalRefund.toLocaleString()} RWF
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 pb-8 flex items-center gap-4">
          <button
            onClick={handleClose}
            className="flex-1 px-6 py-3.5 text-gray-700 font-semibold bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-base"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || totalRefund === 0}
            className="flex-1 px-6 py-3.5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:from-orange-600 hover:to-red-600 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl text-base"
          >
            {loading ? 'Processing...' : 'Confirm Return'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Trigger Button Component
export const ReturnItemsButton = ({ onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`group flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 ${className}`}
    >
      <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
      <span>Return Items</span>
    </button>
  );
};

// Alternative compact button
export const ReturnItemsButtonCompact = ({ onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`group flex items-center justify-center gap-2 p-2 bg-orange-100 hover:bg-orange-200 text-orange-600 font-medium rounded-lg transition-all duration-200 ${className}`}
      title="Return Items"
    >
      <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
    </button>
  );
};

export default ReturnItemsModal;