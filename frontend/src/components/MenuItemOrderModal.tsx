import React, { useState, useEffect } from 'react';
import {
  X,
  ShoppingCart,
  User,
  FileCheck,
  Loader2,
  AlertCircle,
  CheckCircle,
  Trash2,
  Store,
  Plus,
  Minus,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import orderService from '../services/orderService';
import { API_URL } from '../api/api';

// ----------------------------------------------------
// RWF Formatter
// ----------------------------------------------------
const formatRWF = (amount: number) => {
  return new Intl.NumberFormat('rw-RW', {
    style: 'currency',
    currency: 'RWF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const MenuItemOrderModal = ({ isOpen, onClose, companyId }: { isOpen: boolean; onClose: () => void; companyId: string }) => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();

  // Filter items for THIS company only
  const companyItems = cartItems.filter((item) => item.companyId === companyId);

  // Calculate total: (unitPrice * quantity)
  const companyTotal = companyItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  // Load company info for header
  const [companyInfo, setCompanyInfo] = useState({ name: 'Loading...', logo: null });
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Customer Info
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [notes, setNotes] = useState('');

  // ----------------------------------------------------
  // Load company name/logo once
  // ----------------------------------------------------
  useEffect(() => {
    if (isOpen && companyId && companyItems.length > 0) {
      const firstItem = companyItems[0];
      setCompanyInfo({
        name: firstItem.companyName || 'Restaurant',
        logo: firstItem.companyLogo || null,
      });
    }
  }, [isOpen, companyId, companyItems]);

  // ----------------------------------------------------
  // Reset on open/close
  // ----------------------------------------------------
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setError('');
      setSuccess(false);
      setLoading(false);
      setSubmitting(false);
      setClientName('');
      setClientPhone('');
      setClientEmail('');
      setNotes('');
    }
  }, [isOpen]);

  // ----------------------------------------------------
  // Quantity Controls
  // ----------------------------------------------------
  const handleIncrease = (menuItemId: string) => {
    const item = companyItems.find(i => i.menuItemId === menuItemId);
    if (item) {
      updateQuantity(menuItemId, item.quantity + 1);
    }
  };

  const handleDecrease = (menuItemId: string) => {
    const item = companyItems.find(i => i.menuItemId === menuItemId);
    if (item && item.quantity > 1) {
      updateQuantity(menuItemId, item.quantity - 1);
    } else {
      removeFromCart(menuItemId); // Remove if quantity becomes 0
    }
  };

  const handleRemoveItem = (menuItemId: string) => {
    removeFromCart(menuItemId);
  };

  // ----------------------------------------------------
  // Navigation & Validation
  // ----------------------------------------------------
  const canProceedToStep2 = () => companyItems.length > 0;
  const canProceedToStep3 = () => clientName.trim() !== '';
  const canSubmit = () => companyItems.length > 0 && clientName.trim() !== '';

  const handleSubmit = async () => {
    if (!canSubmit()) return;
    setSubmitting(true);
    setError('');
    setSuccess(false);

    try {
      const orderData = {
        companyId,
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim() || undefined,
        clientEmail: clientEmail.trim() || undefined,
        notes: notes.trim() || undefined,
        items: companyItems.map((item) => ({
          menuItemId: item.menuItemId,
          unitPrice: item.unitPrice,
          quantity: item.quantity, // Use actual quantity
        })),
      };

      await orderService.createOrder(orderData);
      setSuccess(true);
      setTimeout(() => {
        clearCart(); // Or keep other company items
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col transform transition-all duration-300">
        {/* Enhanced Header with Gradient */}
        <div className="px-6 py-5 bg-gradient-to-r from-orange-500 via-orange-400 to-amber-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              {companyInfo.logo ? (
                <div className="relative">
                  <div className="absolute inset-0 bg-white/30 rounded-full blur-md"></div>
                  <img
                    src={companyInfo.logo}
                    alt={companyInfo.name}
                    className="relative w-14 h-14 rounded-full object-cover border-3 border-white shadow-lg"
                  />
                </div>
              ) : (
                <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                  <Store className="w-7 h-7 text-orange-600" />
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold text-white drop-shadow-md">
                  {companyInfo.name}
                </h2>
                <p className="text-sm text-white/90 mt-0.5 font-medium">Step {step} of 3</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={submitting}
              className="p-2.5 hover:bg-white/20 rounded-full transition-all duration-200 disabled:opacity-50 group"
            >
              <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Enhanced Progress Bar */}
        <div className="px-6 py-4 bg-gradient-to-b from-orange-50 to-white border-b border-orange-100">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            <div className="flex items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-md transition-all duration-300 ${
                  step >= 1 ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white scale-110' : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step > 1 ? <CheckCircle className="w-5 h-5" /> : '1'}
              </div>
              <span className={`text-sm font-semibold transition-colors ${step >= 1 ? 'text-orange-600' : 'text-gray-400'}`}>
                Items
              </span>
            </div>
            <div className="flex-1 h-2 bg-gray-200 mx-3 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-500 ease-out ${
                  step >= 2 ? 'w-full' : 'w-0'
                }`}
              />
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-md transition-all duration-300 ${
                  step >= 2 ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white scale-110' : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step > 2 ? <CheckCircle className="w-5 h-5" /> : '2'}
              </div>
              <span className={`text-sm font-semibold transition-colors ${step >= 2 ? 'text-orange-600' : 'text-gray-400'}`}>
                Your Info
              </span>
            </div>
            <div className="flex-1 h-2 bg-gray-200 mx-3 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-500 ease-out ${
                  step >= 3 ? 'w-full' : 'w-0'
                }`}
              />
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-md transition-all duration-300 ${
                  step >= 3 ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white scale-110' : 'bg-gray-200 text-gray-500'
                }`}
              >
                3
              </div>
              <span className={`text-sm font-semibold transition-colors ${step >= 3 ? 'text-orange-600' : 'text-gray-400'}`}>
                Review
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 bg-gradient-to-b from-white to-gray-50">
          {/* Step 1: Items + Notes */}
          {step === 1 && (
            <div className="space-y-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                  <span className="ml-3 text-gray-600">Validating items...</span>
                </div>
              ) : companyItems.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No items for this restaurant</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {companyItems.map((item) => (
                      <div
                        key={item.menuItemId}
                        className="bg-white border-2 border-gray-100 rounded-2xl p-5 flex gap-4 hover:border-orange-200 hover:shadow-lg transition-all duration-300"
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-xl flex-shrink-0 shadow-md ring-2 ring-orange-100"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-dashed border-gray-300 rounded-xl flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 text-lg">{item.name}</h4>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-4">
                              {/* Quantity Controls */}
                              <div className="flex items-center gap-1 bg-gray-50 border-2 border-gray-200 rounded-xl shadow-sm">
                                <button
                                  onClick={() => handleDecrease(item.menuItemId)}
                                  className="p-2 hover:bg-orange-100 rounded-l-xl transition-colors duration-200 disabled:opacity-40"
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="w-4 h-4 text-orange-600" />
                                </button>
                                <span className="px-4 py-1.5 font-bold text-base min-w-10 text-center text-orange-600">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleIncrease(item.menuItemId)}
                                  className="p-2 hover:bg-orange-100 rounded-r-xl transition-colors duration-200"
                                >
                                  <Plus className="w-4 h-4 text-orange-600" />
                                </button>
                              </div>

                              <span className="text-sm text-gray-500 font-medium">
                                × {formatRWF(item.unitPrice)} ea
                              </span>
                            </div>

                            <div className="flex items-center gap-4">
                              <span className="font-bold text-orange-600 text-lg">
                                {formatRWF(item.unitPrice * item.quantity)}
                              </span>
                              <button
                                onClick={() => handleRemoveItem(item.menuItemId)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all duration-200"
                              >
                                <Trash2 className="w-4 h-4" />
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Notes */}
                  <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border-2 border-blue-100 shadow-sm">
                    <label className="block text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
                      <FileCheck className="w-4 h-4" />
                      Order Notes (Optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. No onions, extra spicy, deliver to table 5..."
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 resize-none bg-white shadow-sm transition-all duration-200"
                    />
                    <p className="text-xs text-blue-600 mt-2 font-medium">
                      Let the restaurant know any special requests
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 2: Customer Info */}
          {step === 2 && (
            <div className="space-y-6 max-w-md mx-auto">
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border-2 border-orange-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-orange-900">Your Information</h3>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 shadow-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="+250 78X XXX XXX"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 shadow-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="space-y-6">
              {error && (
                <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-5 flex items-start gap-3 shadow-lg">
                  <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-800 font-medium">{error}</p>
                </div>
              )}
              {success && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-5 flex items-center gap-3 shadow-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <p className="text-green-800 font-bold">
                    Order placed successfully!
                  </p>
                </div>
              )}

              {/* Customer Info */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 rounded-2xl p-6 shadow-md">
                <h3 className="font-bold text-orange-900 mb-4 text-lg flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Customer Information
                </h3>
                <div className="space-y-2 text-sm bg-white rounded-xl p-4">
                  <p className="flex justify-between">
                    <span className="font-semibold text-gray-600">Name:</span>
                    <span className="font-bold text-gray-900">{clientName}</span>
                  </p>
                  {clientPhone && (
                    <p className="flex justify-between">
                      <span className="font-semibold text-gray-600">Phone:</span>
                      <span className="font-bold text-gray-900">{clientPhone}</span>
                    </p>
                  )}
                  {clientEmail && (
                    <p className="flex justify-between">
                      <span className="font-semibold text-gray-600">Email:</span>
                      <span className="font-bold text-gray-900">{clientEmail}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Order Notes */}
              {notes && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 shadow-md">
                  <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                    <FileCheck className="w-5 h-5" />
                    Order Notes
                  </h3>
                  <p className="text-sm text-blue-800 whitespace-pre-wrap bg-white rounded-xl p-4 italic">
                    "{notes}"
                  </p>
                </div>
              )}

              {/* Order Summary */}
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-md">
                <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Order Summary
                </h3>
                <div className="space-y-4">
                  {companyItems.map((item) => (
                    <div
                      key={item.menuItemId}
                      className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0"
                    >
                      <div>
                        <span className="text-gray-900 font-semibold">{item.name}</span>
                        <span className="text-xs text-gray-500 ml-2 font-medium">
                          ({item.quantity} × {formatRWF(item.unitPrice)})
                        </span>
                      </div>
                      <span className="font-bold text-orange-600 text-lg">
                        {formatRWF(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-6 shadow-xl">
                <div className="flex justify-between items-center text-white">
                  <span className="text-xl font-bold">Total Amount</span>
                  <span className="text-3xl font-black">
                    {formatRWF(companyTotal)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Footer */}
        <div className="px-6 py-5 border-t-2 border-gray-100 bg-gradient-to-b from-gray-50 to-white flex justify-between gap-4">
          <button
            onClick={() => {
              if (step === 1) handleClose();
              else setStep(step - 1);
            }}
            disabled={submitting}
            className="px-8 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 font-semibold text-gray-700 shadow-sm hover:shadow-md"
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>
          <button
            onClick={() => {
              if (step === 1 && canProceedToStep2()) setStep(2);
              else if (step === 2 && canProceedToStep3()) setStep(3);
              else if (step === 3) handleSubmit();
            }}
            disabled={
              (step === 1 && !canProceedToStep2()) ||
              (step === 2 && !canProceedToStep3()) ||
              submitting ||
              success
            }
            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-bold flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 disabled:hover:scale-100"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Placing Order...
              </>
            ) : success ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Order Placed!
              </>
            ) : step === 3 ? (
              'Place Order'
            ) : (
              'Next'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItemOrderModal;