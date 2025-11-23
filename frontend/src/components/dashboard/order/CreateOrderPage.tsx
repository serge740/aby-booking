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
  FileText,
  Loader2,
  AlertCircle,
  CheckCircle,
  Package,
  CreditCard,
  ChevronRight,
  Sparkles,
  Filter,
  Grid3x3,
  List,
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

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
        companyId,
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
    <div className="min-h-screen bg-gray-50">
      {/* Compact Header */}
      <div className=" h-5"></div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4">
        
        {/* Loading / Error States */}
        {loading && (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary-600 mb-2" />
            <p className="text-gray-600 text-sm">Loading menu data...</p>
          </div>
        )}

        {fetchError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 text-sm mb-0.5">Error Loading Data</h3>
              <p className="text-red-700 text-sm">{fetchError}</p>
            </div>
          </div>
        )}

        {/* Form Content */}
        {!loading && !fetchError && (
          <div className="space-y-4">
            
            {/* Client Information Card */}
            <div className="bg-white rounded-lg shadow border border-gray-100">
              <div className="bg-primary-600/8 h-[60px] px-4 py-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-gray-900">Client Information</h2>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {/* Name */}
                  <div className="group">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Client Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                      <input
                        type="text"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 transition-all outline-none"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="group">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                      <input
                        type="tel"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 transition-all outline-none"
                        placeholder="+250 XXX XXX XXX"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="group">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Email Address <span className="text-gray-400 text-xs font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                      <input
                        type="email"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 transition-all outline-none"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items Card */}
            <div className="bg-white rounded-lg shadow border border-gray-100">
              <div className="bg-primary-600/5 px-4 py-2 border-b border-gray-200">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center">
                      <ShoppingCart className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-gray-900">Order Items</h2>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowMenuModal(true)}
                    className="flex items-center gap-1.5 bg-primary-600 text-white px-3 py-1.5 text-sm rounded-lg hover:bg-primary-600/90 transition-all shadow"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="font-medium">Add Item</span>
                  </button>
                </div>
              </div>

              <div className="p-4">
                {orderItems.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg mb-2">
                      <Package className="w-6 h-6 text-gray-400" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">No items yet</h3>
                    <p className="text-xs text-gray-600 mb-3">Start building your order by adding items</p>
                    <button
                      onClick={() => setShowMenuModal(true)}
                      className="inline-flex items-center gap-1.5 bg-primary-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-primary-600/90 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      Browse Menu
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orderItems.map((line) => (
                      <div
                        key={line.id}
                        className="bg-gray-50 border border-gray-200 rounded-lg p-3 hover:border-primary-600/30 hover:shadow transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-12 h-12 bg-primary-600/10 rounded-lg flex items-center justify-center">
                            <Package className="w-6 h-6 text-primary-600" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <div className="flex-1">
                                <h3 className="font-bold text-gray-900 text-sm mb-0.5">{line.menuItem.name}</h3>
                                {line.menuItem.description && (
                                  <div 
                                    className="text-xs text-gray-600 line-clamp-1"
                                    dangerouslySetInnerHTML={{__html: line.menuItem.description}}
                                  />
                                )}
                              </div>
                              {line.menuItem.discount > 0 && (
                                <span className="flex-shrink-0 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                  {line.menuItem.discount}% OFF
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 mb-2 text-xs">
                              <span className="font-semibold text-gray-700">
                                {formatCurrency(line.unitPrice)} / unit
                              </span>
                              {line.menuItem.discount > 0 && (
                                <span className="line-through text-gray-400">
                                  {formatCurrency(line.menuItem.sellingPrice)}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-0.5 bg-white rounded-lg border border-gray-300 shadow-sm">
                                  <button
                                    onClick={() => updateQuantity(line.id, line.quantity - 1)}
                                    className="w-7 h-7 hover:bg-gray-100 rounded-l-lg transition-colors text-sm font-semibold text-gray-700"
                                  >
                                    -
                                  </button>
                                  <span className="w-8 text-center text-sm font-bold text-gray-900">{line.quantity}</span>
                                  <button
                                    onClick={() => updateQuantity(line.id, line.quantity + 1)}
                                    className="w-7 h-7 hover:bg-gray-100 rounded-r-lg transition-colors text-sm font-semibold text-gray-700"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <div className="text-right">
                                  <div className="text-lg font-bold text-primary-600">
                                    {formatCurrency(line.totalPrice)}
                                  </div>
                                </div>
                                <button
                                  onClick={() => removeOrderItem(line.id)}
                                  className="w-7 h-7 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Total Summary Card */}
            {orderItems.length > 0 && (
              <div className="bg-primary-600 rounded-lg shadow overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white/80 text-xs font-medium">Total Amount</p>
                        <p className="text-white text-2xl font-bold tracking-tight">
                          {formatCurrency(totalAmount)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white/80 text-xs">Items: {orderItems.length}</p>
                      <p className="text-white text-sm font-semibold">
                        Qty: {orderItems.reduce((s, i) => s + i.quantity, 0)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notes Card */}
            <div className="bg-white rounded-lg shadow border border-gray-100">
              <div className="bg-primary-600/5 px-4 py-2 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-gray-900">Order Notes</h2>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 transition-all outline-none resize-none"
                  placeholder="e.g., Table number, dietary restrictions, delivery instructions..."
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 flex-col sm:flex-row">
              <button
                onClick={submitOrder}
                disabled={submitting}
                className="flex-1 bg-primary-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-primary-600/90 transition-all shadow hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center justify-center gap-2">
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating Order...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Create Order</span>
                    </>
                  )}
                </div>
              </button>
              
              <button
                onClick={resetForm}
                disabled={submitting}
                className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-50 hover:border-gray-400 transition-all shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reset Form
              </button>
            </div>

            {/* Submit Result */}
            {submitResult && (
              <div
                className={`rounded-lg p-3 flex items-start gap-2 shadow border ${
                  submitResult === 'success'
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                {submitResult === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <h3 className={`font-bold text-sm mb-0.5 ${
                    submitResult === 'success' ? 'text-green-900' : 'text-red-900'
                  }`}>
                    {submitResult === 'success' ? 'Success!' : 'Error'}
                  </h3>
                  <p className={`text-sm ${submitResult === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                    {submitMessage}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MENU MODAL */}
      {showMenuModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="bg-primary-600 px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Browse Menu</h2>
                  </div>
                </div>
                <button
                  onClick={() => setShowMenuModal(false)}
                  className="w-8 h-8 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-lg flex items-center justify-center transition-all"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="p-4 bg-gray-50 border-b border-gray-200 space-y-3">
              {/* Search Bar */}
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 transition-all outline-none"
                  placeholder="Search menu items..."
                />
              </div>

              {/* Filters and View Toggle */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                  <Filter className="w-3.5 h-3.5" />
                  <span>Filters:</span>
                </div>
                
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 outline-none bg-white text-xs font-medium"
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
                  className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 outline-none bg-white text-xs font-medium"
                >
                  <option value="ALL">All Types</option>
                  <option value="EATING">🍽️ Food</option>
                  <option value="DRINKING">🥤 Drinks</option>
                </select>

                <div className="ml-auto flex items-center gap-1 bg-white rounded-lg border border-gray-300 p-0.5">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded transition-all ${
                      viewMode === 'grid'
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Grid3x3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded transition-all ${
                      viewMode === 'list'
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Results Count */}
              <div className="text-xs text-gray-600">
                Showing <span className="font-semibold text-gray-900">{filteredMenuItems.length}</span> item(s)
              </div>
            </div>

            {/* Menu Items List */}
            <div className="flex-1 overflow-y-auto p-4">
              {filteredMenuItems.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-lg mb-3">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">No items found</h3>
                  <p className="text-xs text-gray-600">Try adjusting your search or filters</p>
                </div>
              ) : (
                <div className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'
                    : 'space-y-3'
                }>
                  {filteredMenuItems.map((item) => {
                    const finalPrice = calculatePrice(item.sellingPrice, item.discount);
                    const isInCart = orderItems.some((i) => i.menuItemId === item.id);
                    
                    return viewMode === 'grid' ? (
                      // Grid View
                      <div
                        key={item.id}
                        onClick={() => addOrderItem(item)}
                        className="bg-white border border-gray-200 rounded-lg p-3 hover:border-primary-600 hover:shadow-lg transition-all cursor-pointer relative"
                      >
                        {item.discount > 0 && (
                          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full z-10">
                            {item.discount}% OFF
                          </div>
                        )}

                        {isInCart && (
                          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full z-10 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            In Cart
                          </div>
                        )}

                        <div className="flex flex-col h-full">
                          <div className="w-full h-24 bg-primary-600/10 rounded-lg mb-3 flex items-center justify-center">
                            <Package className="w-8 h-8 text-primary-600" />
                          </div>

                          <div className="flex-1">
                            <h3 className="font-bold text-sm text-gray-900 mb-1 line-clamp-2">
                              {item.name}
                            </h3>

                            {item.description && (
                              <div 
                                className="text-xs text-gray-600 mb-2 line-clamp-2"
                                dangerouslySetInnerHTML={{__html: item.description}}
                              />
                            )}
                          </div>

                          <div className="pt-2 border-t border-gray-100 mt-auto">
                            <div className="flex items-end justify-between mb-2">
                              <div>
                                <div className="text-lg font-bold text-primary-600">
                                  {formatCurrency(finalPrice)}
                                </div>
                                {item.discount > 0 && (
                                  <div className="text-xs text-gray-400 line-through">
                                    {formatCurrency(item.sellingPrice)}
                                  </div>
                                )}
                              </div>
                              <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                                item.purpose === 'EATING'
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-blue-100 text-blue-700'
                              }`}>
                                {item.purpose === 'EATING' ? '🍽️' : '🥤'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // List View
                      <div
                        key={item.id}
                        onClick={() => addOrderItem(item)}
                        className="bg-white border border-gray-200 rounded-lg p-3 hover:border-primary-600 hover:shadow-lg transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-16 h-16 bg-primary-600/10 rounded-lg flex items-center justify-center">
                            <Package className="w-8 h-8 text-primary-600" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h3 className="font-bold text-sm text-gray-900">
                                {item.name}
                              </h3>
                              <div className="flex items-center gap-1 flex-shrink-0">
                                {item.discount > 0 && (
                                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                    {item.discount}% OFF
                                  </span>
                                )}
                                {isInCart && (
                                  <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" />
                                  </span>
                                )}
                              </div>
                            </div>

                            {item.description && (
                              <div 
                                className="text-xs text-gray-600 mb-2 line-clamp-1"
                                dangerouslySetInnerHTML={{__html: item.description}}
                              />
                            )}

                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <div className="flex items-center gap-2">
                                <div>
                                  <span className="text-lg font-bold text-primary-600">
                                    {formatCurrency(finalPrice)}
                                  </span>
                                  {item.discount > 0 && (
                                    <span className="text-xs text-gray-400 line-through ml-1">
                                      {formatCurrency(item.sellingPrice)}
                                    </span>
                                  )}
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                                  item.purpose === 'EATING'
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'bg-blue-100 text-blue-700'
                                }`}>
                                  {item.purpose === 'EATING' ? '🍽️' : '🥤'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-600">
                  Click any item to add it to your order
                </p>
                <button
                  onClick={() => setShowMenuModal(false)}
                  className="px-4 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateOrderPage;