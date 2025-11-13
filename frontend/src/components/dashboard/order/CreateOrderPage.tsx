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

import menuCategoryService from '../../../services/menuCategoryService';
import menuItemService from '../../../services/menuItemService';
import orderService from '../../../services/orderService';

// ---------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------
const formatCurrency = (amount: number, currency = 'RWF') =>
  new Intl.NumberFormat('en-RW', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

const calculatePrice = (price: number, discount: number) =>
  discount ? price - price * discount / 100 : price;

// ---------------------------------------------------------------------
// Types (match the real API)
// ---------------------------------------------------------------------
interface MenuCategory {
  id: string;
  name: string;
  image?: string;
}

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  sellingPrice: number;
  discount: number;
  purpose: 'EATING' | 'DRINKING';
  drinkState?: 'ALCOHOLIC' | 'NON_ALCOHOLIC';
  alcoholicType?: string;
  categoryId: string;
  isActive: boolean;
  // image fields are optional – backend may return URLs
  mainImage?: string;
  otherImages?: string[];
}

interface OrderLine {
  id: string;               // local only
  menuItemId: string;
  menuItem: MenuItem;
  quantity: number;
  unitPrice: number;        // price after discount
  totalPrice: number;
}

// ---------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------
const CreateOrderPage = () => {
  const { companyId } = useParams<{ companyId: string }>();

  // ── UI state ───────────────────────────────────────────────────────
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [orderItems, setOrderItems] = useState<OrderLine[]>([]);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedPurpose, setSelectedPurpose] = useState('ALL');

  // ── Data fetching ─────────────────────────────────────────────────
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // ── Submission state ──────────────────────────────────────────────
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<'success' | 'error' | null>(null);
  const [submitMessage, setSubmitMessage] = useState('');

  // -----------------------------------------------------------------
  // Load categories + menu items (once per companyId)
  // -----------------------------------------------------------------
  useEffect(() => {
    if (!companyId) return;

    const loadData = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const [catRes, itemRes] = await Promise.all([
          menuCategoryService.getCategoriesByCompany(companyId),
          menuItemService.getMenuItemsByCompanyId(companyId),
        ]);

        setCategories(catRes);
        setMenuItems(itemRes);
      } catch (err: any) {
        setFetchError(err.message || 'Failed to load menu data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [companyId]);

  // -----------------------------------------------------------------
  // Filter menu items (search + category + purpose)
  // -----------------------------------------------------------------
  const filteredMenuItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description || '').toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === 'ALL' || item.categoryId === selectedCategory;
      const matchesPurpose = selectedPurpose === 'ALL' || item.purpose === selectedPurpose;

      return matchesSearch && matchesCategory && matchesPurpose && item.isActive;
    });
  }, [menuItems, searchTerm, selectedCategory, selectedPurpose]);

  // -----------------------------------------------------------------
  // Order line helpers
  // -----------------------------------------------------------------
  const addOrderItem = (menuItem: MenuItem) => {
    const existingIdx = orderItems.findIndex((i) => i.menuItemId === menuItem.id);

    if (existingIdx >= 0) {
      const updated = [...orderItems];
      const line = updated[existingIdx];
      line.quantity += 1;
      line.totalPrice = line.unitPrice * line.quantity;
      setOrderItems(updated);
    } else {
      const unit = calculatePrice(menuItem.sellingPrice, menuItem.discount);
      const newLine: OrderLine = {
        id: `local-${Date.now()}`,
        menuItemId: menuItem.id,
        menuItem,
        quantity: 1,
        unitPrice: unit,
        totalPrice: unit,
      };
      setOrderItems([...orderItems, newLine]);
    }
    setShowMenuModal(false);
  };

  const updateQuantity = (localId: string, newQty: number) => {
    if (newQty <= 0) {
      removeOrderItem(localId);
      return;
    }
    setOrderItems((prev) =>
      prev.map((i) =>
        i.id === localId
          ? { ...i, quantity: newQty, totalPrice: i.unitPrice * newQty }
          : i
      )
    );
  };

  const removeOrderItem = (localId: string) => {
    setOrderItems((prev) => prev.filter((i) => i.id !== localId));
  };

  // -----------------------------------------------------------------
  // Totals
  // -----------------------------------------------------------------
  const totalAmount = orderItems.reduce((s, i) => s + i.totalPrice, 0);

  // -----------------------------------------------------------------
  // Reset form
  // -----------------------------------------------------------------
  const resetForm = () => {
    setClientName('');
    setClientPhone('');
    setClientEmail('');
    setNotes('');
    setOrderItems([]);
    setSubmitResult(null);
    setSubmitMessage('');
  };

  // -----------------------------------------------------------------
  // Submit order to backend
  // -----------------------------------------------------------------
  const submitOrder = async () => {
    if (!clientName.trim()) {
      alert('Please enter client name');
      return;
    }
    if (orderItems.length === 0) {
      alert('Add at least one item');
      return;
    }

    setSubmitting(true);
    setSubmitResult(null);
    setSubmitMessage('');

    try {
      const payload = {
        companyId, // <-- needed on the backend
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim() || undefined,
        clientEmail: clientEmail.trim() || undefined,
        notes: notes.trim() || undefined,
        items: orderItems.map((i) => ({
          menuItemId: i.menuItemId,
          unitPrice: i.unitPrice,
          quantity: i.quantity,
        })),
      };

      const result = await orderService.createOrder(payload);
      setSubmitResult('success');
      setSubmitMessage(`Order ${result.orderNumber || ''} created!`);
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
    <div className="min-h-screen bg-gradient-to-br  from-orange-50 to-amber-100 p-4 md:p-16">
      <div className=" mx-auto">

        {/* ── Header ── */}
        <div className="bg-white rounded-t-2xl shadow-lg p-6 border-b-4 border-orange-500">
          <div className="flex items-center gap-3">
            <ClipboardList className="w-8 h-8 text-orange-600" />
            <h1 className="text-3xl font-bold text-gray-800">New Order</h1>
          </div>
        </div>

        {/* ── Loading / Error ── */}
        {loading && (
          <div className="bg-white p-8 text-center">
            <Loader2 className="w-10 h-10 mx-auto animate-spin text-orange-600" />
            <p className="mt-2 text-gray-600">Loading menu…</p>
          </div>
        )}

        {fetchError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <p className="text-red-800">{fetchError}</p>
          </div>
        )}

        {/* ── Form (only when data ready) ── */}
        {!loading && !fetchError && (
          <div className="bg-white shadow-lg p-6">

            {/* ── Client Info ── */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Client Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter client name"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client Phone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client Email <span className="text-gray-400 text-xs">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter email address"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Order Items ── */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Order Items
                </h2>
                <button
                  onClick={() => setShowMenuModal(true)}
                  className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  Add Item
                </button>
              </div>

              {orderItems.length === 0 ? (
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">
                    No items added yet. Click “Add Item” to start.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orderItems.map((line) => (
                    <div
                      key={line.id}
                      className="bg-gray-50 rounded-lg p-4 flex items-center gap-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-800">{line.menuItem.name}</h3>
                          {line.menuItem.discount > 0 && (
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded flex items-center gap-1">
                              <Percent className="w-3 h-3" />
                              {line.menuItem.discount}% OFF
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600" dangerouslySetInnerHTML={{__html:line.menuItem.description}}></div>

                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span className="text-gray-600">
                            Unit: {formatCurrency(line.unitPrice)}
                            {line.menuItem.discount > 0 && (
                              <span className="line-through text-gray-400 ml-2">
                                {formatCurrency(line.menuItem.sellingPrice)}
                              </span>
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Qty controls */}
                        <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-300">
                          <button
                            onClick={() => updateQuantity(line.id, line.quantity - 1)}
                            className="px-3 py-1 hover:bg-gray-100 rounded-l-lg"
                          >
                            -
                          </button>
                          <span className="px-3 font-semibold">{line.quantity}</span>
                          <button
                            onClick={() => updateQuantity(line.id, line.quantity + 1)}
                            className="px-3 py-1 hover:bg-gray-100 rounded-r-lg"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right min-w-[80px]">
                          <p className="font-bold text-lg text-gray-800">
                            {formatCurrency(line.totalPrice)}
                          </p>
                        </div>

                        <button
                          onClick={() => removeOrderItem(line.id)}
                          className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Total ── */}
            <div className="border-t-2 border-gray-200 pt-4 mb-6">
              <div className="flex items-center justify-between text-2xl font-bold">
                <span className="text-gray-700">Total Amount:</span>
                <span className="text-orange-600">{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            {/* ── Notes ── */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Order Notes <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 resize-none"
                placeholder="Special instructions, table number, etc."
              />
            </div>

            {/* ── Submit / Reset ── */}
            <div className="flex gap-3">
              <button
                onClick={submitOrder}
                disabled={submitting}
                className="flex-1 bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition shadow-md disabled:opacity-70"
              >
                {submitting ? (
                  <>
                    <Loader2 className="inline w-5 h-5 mr-2 animate-spin" />
                    Creating…
                  </>
                ) : (
                  'Create Order'
                )}
              </button>
              <button
                onClick={resetForm}
                disabled={submitting}
                className="px-6 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
              >
                Reset
              </button>
            </div>

            {/* ── Submit feedback ── */}
            {submitResult && (
              <div
                className={`mt-4 p-4 rounded-lg flex items-center gap-2 ${
                  submitResult === 'success'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {submitResult === 'success' ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                <span>{submitMessage}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── MENU MODAL ── */}
      {showMenuModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full my-8 flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="bg-orange-600 text-white p-4 md:p-6 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-xl md:text-2xl font-bold">Select Menu Item</h2>
              <button
                onClick={() => setShowMenuModal(false)}
                className="hover:bg-orange-700 p-2 rounded-lg transition"
              >
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>

            {/* Search + Filters */}
            <div className="p-3 md:p-4 border-b bg-orange-50">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-3 w-4 h-4 md:w-5 md:h-5 text-orange-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 md:pl-10 pr-4 py-2 text-sm md:text-base border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="Search menu items..."
                />
              </div>

              <div className="flex gap-2 md:gap-3 flex-wrap">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="flex-1 min-w-[140px] px-3 md:px-4 py-2 text-sm md:text-base border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 bg-white"
                >
                  <option value="ALL">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedPurpose}
                  onChange={(e) => setSelectedPurpose(e.target.value)}
                  className="flex-1 min-w-[140px] px-3 md:px-4 py-2 text-sm md:text-base border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 bg-white"
                >
                  <option value="ALL">All Types</option>
                  <option value="EATING">Food</option>
                  <option value="DRINKING">Drinks</option>
                </select>
              </div>
            </div>

            {/* Items list */}
            <div className="flex-1 overflow-y-auto p-3 md:p-4" style={{ maxHeight: 'calc(85vh - 200px)' }}>
              {filteredMenuItems.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p>No items match your filters</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredMenuItems.map((item) => {
                    const final = calculatePrice(item.sellingPrice, item.discount);
                    return (
                      <div
                        key={item.id}
                        onClick={() => addOrderItem(item)}
                        className="bg-white border-2 border-orange-100 rounded-lg p-4 hover:shadow-lg hover:border-orange-300 transition cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-lg text-gray-800">{item.name}</h3>
                          {item.discount > 0 && (
                            <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded flex items-center gap-1">
                              <Percent className="w-3 h-3" />
                              {item.discount}%
                            </span>
                          )}
                        </div>

                        <div className="text-sm text-gray-600 mb-3" dangerouslySetInnerHTML={{__html:item.description || ''}}></div>

                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-lg font-bold text-orange-600">
                              {formatCurrency(final)}
                            </span>
                            {item.discount > 0 && (
                              <span className="text-sm text-gray-400 line-through ml-2">
                                {formatCurrency(item.sellingPrice)}
                              </span>
                            )}
                          </div>

                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              item.purpose === 'EATING'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-orange-100 text-orange-700'
                            }`}
                          >
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
    </div>
  );
};

export default CreateOrderPage;