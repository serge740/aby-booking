import React, { useState, useEffect } from 'react';
import { X, CreditCard, Smartphone, Banknote, CheckCircle } from 'lucide-react';

const PaymentMethodModal = ({ isOpen, onClose, onConfirm, isLoading }) => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setPaymentMethod('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = () => {
    setError('');

    if (!paymentMethod) {
      setError('Please select a payment method');
      return;
    }

    onConfirm(paymentMethod);
  };

  const handleClose = () => {
    setPaymentMethod('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Select Payment Method</h2>
                <p className="text-sm text-white/90">Choose how the customer paid</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-9 h-9 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
              disabled={isLoading}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Payment Method Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('MOMO')}
                className={`relative flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all ${
                  paymentMethod === 'MOMO'
                    ? 'border-orange-500 bg-orange-50 shadow-lg scale-105'
                    : 'border-gray-300 bg-white hover:border-gray-400 hover:shadow-md'
                }`}
                disabled={isLoading}
              >
                {paymentMethod === 'MOMO' && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle className="w-5 h-5 text-orange-500" />
                  </div>
                )}
                <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                  paymentMethod === 'MOMO' ? 'bg-orange-500' : 'bg-gray-200'
                }`}>
                  <Smartphone className={`w-8 h-8 ${
                    paymentMethod === 'MOMO' ? 'text-white' : 'text-gray-600'
                  }`} />
                </div>
                <div className="text-center">
                  <span className={`block text-base font-bold ${
                    paymentMethod === 'MOMO' ? 'text-orange-700' : 'text-gray-700'
                  }`}>
                    Mobile Money
                  </span>
                  <span className="text-xs text-gray-500 mt-1">MTN, Airtel</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('CASH')}
                className={`relative flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all ${
                  paymentMethod === 'CASH'
                    ? 'border-green-500 bg-green-50 shadow-lg scale-105'
                    : 'border-gray-300 bg-white hover:border-gray-400 hover:shadow-md'
                }`}
                disabled={isLoading}
              >
                {paymentMethod === 'CASH' && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                )}
                <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                  paymentMethod === 'CASH' ? 'bg-green-500' : 'bg-gray-200'
                }`}>
                  <Banknote className={`w-8 h-8 ${
                    paymentMethod === 'CASH' ? 'text-white' : 'text-gray-600'
                  }`} />
                </div>
                <div className="text-center">
                  <span className={`block text-base font-bold ${
                    paymentMethod === 'CASH' ? 'text-green-700' : 'text-gray-700'
                  }`}>
                    Cash
                  </span>
                  <span className="text-xs text-gray-500 mt-1">Physical money</span>
                </div>
              </button>
            </div>
            {error && (
              <div className="mt-3 flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                <X className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Info Message */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex gap-3">
              <CreditCard className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-800">
                Select the payment method used by the customer for this transaction. This will be recorded for your records.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex items-center gap-3">
          <button
            onClick={handleClose}
            className="flex-1 px-6 py-3.5 text-gray-700 font-semibold bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !paymentMethod}
            className="flex-1 px-6 py-3.5 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold rounded-xl disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Processing...</span>
              </div>
            ) : (
              'Confirm Payment Method'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Export the button component to trigger the modal
export const PaymentMethodButton = ({ onClick, disabled, className = '', value }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition ${className}`}
    >
      <CreditCard className="w-4 h-4" />
      {value || "Select Payment Method"}
    </button>
  );
};

export default PaymentMethodModal;