import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, CreditCard, DollarSign, Wallet, CheckCircle, Smartphone, Banknote } from 'lucide-react';

const DebtedAmountModal = ({ isOpen, onClose, order, onConfirm, isLoading }) => {
  const [amountPaid, setAmountPaid] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && order) {
      setAmountPaid('');
      setPaymentMethod('');
      setError('');
    }
  }, [isOpen, order]);

  const handleSubmit = () => {
    setError('');

    // Validation
    if (!amountPaid || amountPaid.trim() === '') {
      setError('Please enter the amount paid');
      return;
    }

    const paid = parseFloat(amountPaid);

    if (isNaN(paid)) {
      setError('Please enter a valid number');
      return;
    }

    if (paid <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    // Check if this is new debt (not existing debt)
    const isExistingDebt = order.debtedAmount && order.debtedAmount > 0;
    
    // For new debt, require payment method
    if (!isExistingDebt && !paymentMethod) {
      setError('Please select a payment method');
      return;
    }

    // For existing debt, check if payment exceeds remaining debt
    if (isExistingDebt) {
      if (paid > order.debtedAmount) {
        setError(`Payment cannot exceed remaining debt of ${formatRWF(order.debtedAmount)}`);
        return;
      }
    } else {
      // First time marking as debted
      if (paid >= order.totalAmount) {
        setError('Amount paid must be less than order total. Use "Mark as Paid" instead.');
        return;
      }
    }

    // Call the onConfirm callback with the amount paid and payment method
    onConfirm(paid, paymentMethod || null);
  };

  const handleClose = () => {
    setAmountPaid('');
    setPaymentMethod('');
    setError('');
    onClose();
  };

  const formatRWF = (amount) => {
    return new Intl.NumberFormat('rw-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (!isOpen || !order) return null;

  const paidAmount = parseFloat(amountPaid) || 0;
  
  // Check if this is an existing debt or new debt
  const isExistingDebt = order.debtedAmount && order.debtedAmount > 0;
  
  // Calculate based on scenario
  let currentDebt, remainingDebt, totalPaidSoFar, showCalculation;
  
  if (isExistingDebt) {
    // Existing debt scenario - customer is paying towards existing debt
    currentDebt = order.debtedAmount;
    remainingDebt = Math.max(0, currentDebt - paidAmount);
    totalPaidSoFar = order.totalAmount - currentDebt + paidAmount;
    showCalculation = amountPaid && !isNaN(paidAmount) && paidAmount > 0;
  } else {
    // New debt scenario - first time marking as debted
    currentDebt = order.totalAmount - paidAmount;
    remainingDebt = currentDebt;
    totalPaidSoFar = paidAmount;
    showCalculation = amountPaid && !isNaN(paidAmount) && paidAmount > 0;
  }

  const isFullyPaid = isExistingDebt && remainingDebt === 0;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className={`bg-gradient-to-r ${isExistingDebt ? 'from-blue-500 to-indigo-500' : 'from-orange-500 to-amber-500'} p-6 text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                {isExistingDebt ? <Wallet className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  {isExistingDebt ? 'Pay Towards Debt' : 'Mark as Credit (Debted)'}
                </h2>
                <p className="text-sm text-white/90">Order #{order.orderNumber}</p>
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
          {/* Order Summary */}
          <div className="space-y-3">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border-2 border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-600">Order Total</span>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  {formatRWF(order.totalAmount)}
                </span>
              </div>
            </div>

            {isExistingDebt && (
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border-2 border-orange-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    <span className="text-sm font-medium text-orange-700">Current Debt</span>
                  </div>
                  <span className="text-xl font-bold text-orange-600">
                    {formatRWF(order.debtedAmount)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Payment Method Selection - Only for new debt */}
          {!isExistingDebt && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Payment Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('MOMO')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'MOMO'
                      ? 'border-orange-500 bg-orange-50 shadow-md'
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                  disabled={isLoading}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    paymentMethod === 'MOMO' ? 'bg-orange-500' : 'bg-gray-200'
                  }`}>
                    <Smartphone className={`w-6 h-6 ${
                      paymentMethod === 'MOMO' ? 'text-white' : 'text-gray-600'
                    }`} />
                  </div>
                  <span className={`text-sm font-semibold ${
                    paymentMethod === 'MOMO' ? 'text-orange-700' : 'text-gray-700'
                  }`}>
                    Mobile Money
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('CASH')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'CASH'
                      ? 'border-green-500 bg-green-50 shadow-md'
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                  disabled={isLoading}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    paymentMethod === 'CASH' ? 'bg-green-500' : 'bg-gray-200'
                  }`}>
                    <Banknote className={`w-6 h-6 ${
                      paymentMethod === 'CASH' ? 'text-white' : 'text-gray-600'
                    }`} />
                  </div>
                  <span className={`text-sm font-semibold ${
                    paymentMethod === 'CASH' ? 'text-green-700' : 'text-gray-700'
                  }`}>
                    Cash
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Amount Paid Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              {isExistingDebt ? 'Amount Paying Now' : 'Amount Paid Now'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <DollarSign className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="number"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                placeholder={isExistingDebt ? 'Enter payment amount' : 'Enter amount customer paid'}
                className="w-full pl-12 pr-20 py-3.5 border-2 border-gray-300 rounded-xl text-lg font-semibold focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                min="0"
                max={isExistingDebt ? order.debtedAmount : order.totalAmount}
                step="1"
                disabled={isLoading}
                autoFocus
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <span className="text-sm font-medium text-gray-500">RWF</span>
              </div>
            </div>
            {error && (
              <div className="mt-2 flex items-start gap-2 text-sm text-red-600">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Calculation Display */}
          {showCalculation && (
            <div className="space-y-3">
              <div className={`bg-gradient-to-br ${isFullyPaid ? 'from-green-50 to-emerald-50 border-green-200' : 'from-orange-50 to-amber-50 border-orange-200'} rounded-xl p-5 border-2`}>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Order Total:</span>
                    <span className="font-bold text-gray-900 text-base">
                      {formatRWF(order.totalAmount)}
                    </span>
                  </div>
                  
                  {isExistingDebt && (
                    <>
                      <div className="flex justify-between items-center text-orange-700">
                        <span className="font-medium">Current Debt:</span>
                        <span className="font-bold text-base">
                          {formatRWF(currentDebt)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-green-700">
                        <span className="font-medium">Paying Now:</span>
                        <span className="font-bold text-base">
                          - {formatRWF(paidAmount)}
                        </span>
                      </div>
                    </>
                  )}
                  
                  {!isExistingDebt && (
                    <div className="flex justify-between items-center text-green-700">
                      <span className="font-medium">Amount Paid ({paymentMethod}):</span>
                      <span className="font-bold text-base">
                        - {formatRWF(paidAmount)}
                      </span>
                    </div>
                  )}
                  
                  <div className={`pt-3 border-t-2 ${isFullyPaid ? 'border-green-300' : 'border-orange-300'} flex justify-between items-center`}>
                    <span className="font-bold text-gray-900">
                      {isFullyPaid ? 'Status:' : 'Remaining Debt:'}
                    </span>
                    {isFullyPaid ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                        <span className="text-xl font-bold text-green-600">PAID IN FULL</span>
                      </div>
                    ) : (
                      <span className="text-2xl font-bold text-orange-600">
                        {formatRWF(remainingDebt)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {!isFullyPaid && remainingDebt > 0 && (
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                  <div className="flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-amber-800 space-y-1">
                      {isExistingDebt ? (
                        <>
                          <p className="font-semibold">
                            After this payment, debt will be <span className="text-sm font-bold">{formatRWF(remainingDebt)}</span>
                          </p>
                          <p>
                            Customer has paid <span className="font-bold">{formatRWF(totalPaidSoFar)}</span> total 
                            out of <span className="font-bold">{formatRWF(order.totalAmount)}</span>
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="font-semibold">
                            The customer will owe <span className="text-sm font-bold">{formatRWF(remainingDebt)}</span>
                          </p>
                          <p>
                            They have paid <span className="font-bold">{formatRWF(paidAmount)}</span> via {paymentMethod} now 
                            and will pay the remaining balance later.
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {isFullyPaid && (
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-green-800 space-y-1">
                      <p className="font-semibold">Debt Fully Paid!</p>
                      <p>
                        The order payment is now complete. Payment status will be updated to "SUCCESSFUL".
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Info Message */}
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <div className="flex gap-2">
              <CreditCard className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-800">
                {isExistingDebt 
                  ? 'Enter the amount the customer is paying towards their debt. The remaining balance will be updated automatically.'
                  : 'Select payment method and enter the amount the customer is paying now. The system will track the remaining debt for future payments.'
                }
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
            disabled={isLoading || !amountPaid || paidAmount <= 0 || (!isExistingDebt && !paymentMethod)}
            className={`flex-1 px-6 py-3.5 ${isFullyPaid ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600' : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600'} text-white font-bold rounded-xl disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Processing...</span>
              </div>
            ) : isFullyPaid ? (
              'Complete Payment'
            ) : isExistingDebt ? (
              'Record Payment'
            ) : (
              'Confirm & Mark as Debted'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};


// Export the button component to trigger the modal
export const DebtedButton = ({ onClick, disabled, className = '' , value = ''}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 px-5 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition ${className}`}
    >
      <AlertTriangle className="w-4 h-4" />
      {value || "Mark as Credit (Debted)" }
    </button>
  );
};

export default DebtedAmountModal;