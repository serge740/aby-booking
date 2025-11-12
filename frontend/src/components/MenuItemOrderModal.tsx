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
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header with Company */}
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            {companyInfo.logo ? (
              <img
                src={companyInfo.logo}
                alt={companyInfo.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center">
                <Store className="w-6 h-6 text-orange-600" />
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Order at {companyInfo.name}
              </h2>
              <p className="text-sm text-gray-500 mt-1">Step {step} of 3</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={submitting}
            className="p-2 hover:bg-gray-100 rounded-full transition disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-3 bg-gray-50 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  step >= 1 ? 'bg-orange-500 text-white' : 'bg-gray-300'
                }`}
              >
                1
              </div>
              <span className="text-sm font-medium">Items</span>
            </div>
            <div className="flex-1 h-1 bg-gray-300 mx-4">
              <div
                className={`h-full transition-all ${
                  step >= 2 ? 'bg-orange-500 w-full' : 'w-0'
                }`}
              />
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  step >= 2 ? 'bg-orange-500 text-white' : 'bg-gray-300'
                }`}
              >
                2
              </div>
              <span className="text-sm font-medium">Your Info</span>
            </div>
            <div className="flex-1 h-1 bg-gray-300 mx-4">
              <div
                className={`h-full transition-all ${
                  step >= 3 ? 'bg-orange-500 w-full' : 'w-0'
                }`}
              />
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  step >= 3 ? 'bg-orange-500 text-white' : 'bg-gray-300'
                }`}
              >
                3
              </div>
              <span className="text-sm font-medium">Review</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
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
                        className="border border-gray-200 rounded-lg p-4 flex gap-4 hover:bg-gray-50"
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 border-2 border-dashed rounded-lg flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-3">
                              {/* Quantity Controls */}
                              <div className="flex items-center gap-1 border border-gray-300 rounded-lg">
                                <button
                                  onClick={() => handleDecrease(item.menuItemId)}
                                  className="p-1.5 hover:bg-gray-100 transition"
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="px-3 py-1 font-medium text-sm min-w-8 text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleIncrease(item.menuItemId)}
                                  className="p-1.5 hover:bg-gray-100 transition"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>

                              <span className="text-sm text-gray-600">
                                × {formatRWF(item.unitPrice)} ea
                              </span>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="font-bold text-orange-600">
                                {formatRWF(item.unitPrice * item.quantity)}
                              </span>
                              <button
                                onClick={() => handleRemoveItem(item.menuItemId)}
                                className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
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
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Order Notes (Optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. No onions, extra spicy, deliver to table 5..."
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Let the restaurant know any special requests
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 2: Customer Info */}
          {step === 2 && (
            <div className="space-y-5 max-w-md mx-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="+250 78X XXX XXX"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap- verification">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-800">{error}</p>
                </div>
              )}
              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-green-800 font-medium">
                    Order placed successfully!
                  </p>
                </div>
              )}

              {/* Customer Info */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="font-medium text-orange-900 mb-3">Customer</h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium">Name:</span> {clientName}
                  </p>
                  {clientPhone && (
                    <p>
                      <span className="font-medium">Phone:</span> {clientPhone}
                    </p>
                  )}
                  {clientEmail && (
                    <p>
                      <span className="font-medium">Email:</span> {clientEmail}
                    </p>
                  )}
                </div>
              </div>

              {/* Order Notes */}
              {notes && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-2">Order Notes</h3>
                  <p className="text-sm text-blue-800 whitespace-pre-wrap">{notes}</p>
                </div>
              )}

              {/* Order Summary */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Order Items</h3>
                <div className="space-y-3">
                  {companyItems.map((item) => (
                    <div
                      key={item.menuItemId}
                      className="flex justify-between items-center py-2 border-b"
                    >
                      <div>
                        <span className="text-gray-700">{item.name}</span>
                        <span className="text-xs text-gray-500 ml-2">
                          ({item.quantity} × {formatRWF(item.unitPrice)})
                        </span>
                      </div>
                      <span className="font-medium text-orange-600">
                        {formatRWF(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-orange-600">
                    {formatRWF(companyTotal)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-between">
          <button
            onClick={() => {
              if (step === 1) handleClose();
              else setStep(step - 1);
            }}
            disabled={submitting}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition disabled:opacity-50"
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
            className="px-6 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white rounded-lg font-medium flex items-center gap-2 transition"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Placing Order...
              </>
            ) : success ? (
              <>
                <CheckCircle className="w-4 h-4" />
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