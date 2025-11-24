import React, { useState, useMemo, useEffect } from 'react';
import {
  ClipboardList,
  Plus,
  Trash2,
  Search,
  X,
  ShoppingCart,
  User,
  Phone,
  Mail,
  Percent,
  FileText,
  Loader2,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { useParams } from 'react-router-dom';

import menuItemService from '../../../services/menuItemService';
import orderService from '../../../services/orderService';
import { useEmployeeAuth } from '../../../context/EmployeeAuthContext';

// ---------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------
const formatCurrency = (amount: number, currency = 'RWF') =>
  new Intl.NumberFormat('rw-RW', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

const calculatePrice = (price: number, discount: number) =>
  discount ? price - price * discount / 100 : price;

// ---------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------
interface MenuItem {
  id: string;
  name: string;
  description?: string;
  sellingPrice: number;
  discount: number;
  purpose: 'EATING' | 'DRINKING';
  drinkState?: 'ALCOHOLIC' | 'NON_ALCOHOLIC';
  alcoholicType?: string;
  isActive: boolean;
  mainImage?: string;
  otherImages?: string[];
}

interface OrderLine {
  id: string;
  menuItemId: string;
  menuItem: MenuItem;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// ---------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------
const EmployeeCreateOrderPage = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const { user } = useEmployeeAuth();

  // ── UI state ───────────────────────────────────────────────────────
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [orderItems, setOrderItems] = useState<OrderLine[]>([]);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPurpose, setSelectedPurpose] = useState<'ALL' | 'EATING' | 'DRINKING'>('ALL');

  // ── Data fetching ─────────────────────────────────────────────────
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // ── Submission state ──────────────────────────────────────────────
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<'success' | 'error' | null>(null);
  const [submitMessage, setSubmitMessage] = useState('');

  // -----------------------------------------------------------------
  // Load menu items only (no categories)
  // -----------------------------------------------------------------
  useEffect(() => {
    if (!companyId) return;

    const loadData = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const items = await menuItemService.getMenuItemsByCompanyId(companyId);
        setMenuItems(items);
      } catch (err: any) {
        setFetchError(err.message || 'Failed to load menu');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [companyId]);

  // Auto-hide success/error banner
  useEffect(() => {
    if (submitResult) {
      const timer = setTimeout(() => {
        setSubmitResult(null);
        setSubmitMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submitResult]);

  // -----------------------------------------------------------------
  // Filter items: search + purpose (Food/Drinks) only
  // -----------------------------------------------------------------
  const filteredMenuItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description || '').toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPurpose = selectedPurpose === 'ALL' || item.purpose === selectedPurpose;

      return matchesSearch && matchesPurpose && item.isActive;
    });
  }, [menuItems, searchTerm, selectedPurpose]);

  // -----------------------------------------------------------------
  // Order line helpers
  // -----------------------------------------------------------------
  const addOrderItem = (menuItem: MenuItem) => {
    const existing = orderItems.find(i => i.menuItemId === menuItem.id);
    if (existing) {
      setShowMenuModal(false);
      return;
    }

    const unit = calculatePrice(menuItem.sellingPrice, menuItem.discount);
    const newLine: OrderLine = {
      id: `local-${Date.now()}`,
      menuItemId: menuItem.id,
      menuItem,
      quantity: 1,
      unitPrice: unit,
      totalPrice: unit,
    };
    setOrderItems(prev => [...prev, newLine]);
    setShowMenuModal(false);
  };

  const updateQuantity = (localId: string, newQty: number) => {
    if (newQty <= 0) {
      removeOrderItem(localId);
      return;
    }
    setOrderItems(prev =>
      prev.map(i =>
        i.id === localId
          ? { ...i, quantity: newQty, totalPrice: i.unitPrice * newQty }
          : i
      )
    );
  };

  const removeOrderItem = (localId: string) => {
    setOrderItems(prev => prev.filter(i => i.id !== localId));
  };

  const totalAmount = orderItems.reduce((sum, i) => sum + i.totalPrice, 0);

  const resetForm = () => {
    setClientName('');
    setClientPhone('');
    setClientEmail('');
    setNotes('');
    setOrderItems([]);
  };

  const submitOrder = async () => {
    if (!clientName.trim()) return alert('Client name is required');
    if (orderItems.length === 0) return alert('Add at least one item');

    setSubmitting(true);
    try {
      const payload = {
        companyId,
        clientName: clientName.trim(),
        employeeId: user?.id,
        clientPhone: clientPhone.trim() || undefined,
        clientEmail: clientEmail.trim() || undefined,
        notes: notes.trim() || undefined,
        items: orderItems.map(i => ({
          menuItemId: i.menuItemId,
          unitPrice: i.unitPrice,
          quantity: i.quantity,
        })),
      };

      const result = await orderService.createOrder(payload);

      setSubmitResult('success');
      setSubmitMessage(`Order ${result.orderNumber || ''} created successfully!`);
      resetForm();
    } catch (err: any) {
      setSubmitResult('error');
      setSubmitMessage(err.message || 'Failed to create order');
    } finally {
      setSubmitting(false);
    }
  };

  // -----------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 p-4 md:p-8">
      <div className=" mx-auto">

        {/* Status Banner */}
        {submitResult && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-slideDown">
            <div className={`p-4 rounded-lg shadow-2xl flex items-center gap-3 text-white ${submitResult === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
              {submitResult === 'success' ? <CheckCircle className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
              <div>
                <p className="font-bold">{submitResult === 'success' ? 'Success!' : 'Oops!'}</p>
                <p className="text-sm">{submitMessage}</p>
              </div>
              <button onClick={() => setSubmitResult(null)} className="ml-4 hover:bg-white/20 p-1 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-white rounded-t-2xl shadow-lg p-6 border-b-4 border-orange-600">
          <div className="flex items-center gap-3">
            <ClipboardList className="w-9 h-9 text-orange-600" />
            <h1 className="text-3xl font-bold text-gray-800">Create New Order</h1>
          </div>
        </div>

        {/* Loading / Error */}
        {loading && (
          <div className="bg-white p-12 text-center rounded-b-2xl shadow-lg">
            <Loader2 className="w-12 h-12 mx-auto animate-spin text-orange-600" />
            <p className="mt-4 text-gray-600">Loading menu items...</p>
          </div>
        )}

        {fetchError && (
          <div className="bg-red-50 border border-red-300 rounded-lg p-6 mb-6 flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <p className="text-red-800 font-medium">{fetchError}</p>
          </div>
        )}

        {/* Main Form */}
        {!loading && !fetchError && (
          <div className="bg-white rounded-b-2xl shadow-lg p-6 space-y-8">

            {/* Client Info */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-5 flex items-center gap-3">
                <User className="w-6 h-6 text-orange-600" />
                Client Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <input type="text" value={clientName} onChange={e => setClientName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input type="tel" value={clientPhone} onChange={e => setClientPhone(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="+250 78..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email (Optional)</label>
                  <input type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="john@example.com" />
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <ShoppingCart className="w-6 h-6 text-orange-600" />
                  Order Items
                </h2>
                <button
                  onClick={() => setShowMenuModal(true)}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-3 rounded-lg flex items-center gap-2 shadow-md transition"
                >
                  <Plus className="w-5 h-5" /> Add Item
                </button>
              </div>

              {orderItems.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                  <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No items in order yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orderItems.map(line => (
                    <div key={line.id} className="bg-gray-50 rounded-xl p-5 flex items-center gap-5">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-800">{line.menuItem.name}</h3>
                        {line.menuItem.discount > 0 && (
                          <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full mt-1">
                            <Percent className="w-3 h-3" /> {line.menuItem.discount}% OFF
                          </span>
                        )}
                        <p className="text-sm text-gray-600 mt-1" dangerouslySetInnerHTML={{ __html: line.menuItem.description || '' }} />
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center bg-white rounded-lg border">
                          <button onClick={() => updateQuantity(line.id, line.quantity - 1)} className="px-4 py-2 hover:bg-gray-100">-</button>
                          <span className="px-5 font-bold text-lg">{line.quantity}</span>
                          <button onClick={() => updateQuantity(line.id, line.quantity + 1)} className="px-4 py-2 hover:bg-gray-100">+</button>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-xl text-orange-600">{formatCurrency(line.totalPrice)}</p>
                        </div>
                        <button onClick={() => removeOrderItem(line.id)} className="text-red-600 hover:bg-red-50 p-2 rounded-lg">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Total */}
            <div className="border-t-4 border-orange-200 pt-6">
              <div className="flex justify-between items-center text-3xl font-bold">
                <span className="text-gray-700">Total:</span>
                <span className="text-orange-600">{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">Order Notes (Optional)</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
                className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 resize-none"
                placeholder="Table 5 • No onions • Extra spicy..."
              />
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={submitOrder}
                disabled={submitting || orderItems.length === 0}
                className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-bold text-xl py-5 rounded-xl transition shadow-lg"
              >
                {submitting ? <>Creating Order...</> : 'Create Order'}
              </button>
              <button
                onClick={resetForm}
                className="px-8 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-5 rounded-xl transition"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MENU MODAL – No Categories */}
      {showMenuModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="bg-orange-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
              <h2 className="text-2xl font-bold">Add Menu Item</h2>
              <button onClick={() => setShowMenuModal(false)} className="hover:bg-orange-700 p-2 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-5 border-b bg-orange-50 space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-orange-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search items..."
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-orange-200 focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <select
                value={selectedPurpose}
                onChange={e => setSelectedPurpose(e.target.value as any)}
                className="w-full px-5 py-3 rounded-lg border border-orange-200 bg-white focus:ring-2 focus:ring-orange-500"
              >
                <option value="ALL">All Items</option>
                <option value="EATING">Food Only</option>
                <option value="DRINKING">Drinks Only</option>
              </select>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {filteredMenuItems.length === 0 ? (
                <p className="text-center text-gray-500 py-12 text-lg">No items found</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {filteredMenuItems.map(item => {
                    const final = calculatePrice(item.sellingPrice, item.discount);
                    return (
                      <div
                        key={item.id}
                        onClick={() => addOrderItem(item)}
                        className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 rounded-xl p-5 hover:shadow-xl hover:scale-105 transition cursor-pointer"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                          {item.discount > 0 && (
                            <span className="bg-red-600 text-white text-xs px-3 py-1 rounded-full font-bold">
                              -{item.discount}%
                            </span>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2" dangerouslySetInnerHTML={{ __html: item.description }} />
                        )}
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-2xl font-bold text-orange-600">{formatCurrency(final)}</p>
                            {item.discount > 0 && (
                              <p className="text-sm text-gray-500 line-through">{formatCurrency(item.sellingPrice)}</p>
                            )}
                          </div>
                          <span className={`px-4 py-2 rounded-full text-sm font-bold ${item.purpose === 'EATING' ? 'bg-amber-200 text-amber-800' : 'bg-orange-200 text-orange-800'}`}>
                            {item.purpose === 'EATING' ? 'Food' : 'Drink'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slideDown { animation: slideDown 0.4s ease-out; }
      `}</style>
    </div>
  );
};

export default EmployeeCreateOrderPage;