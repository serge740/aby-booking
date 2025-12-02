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
  Filter,
  Grid3x3,
  List,
  Wine,
  GlassWater,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import menuItemService from '../../../services/menuItemService';
import orderService from '../../../services/orderService';
import { useEmployeeAuth } from '../../../context/EmployeeAuthContext';
import Swal from 'sweetalert2';

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
  alcoholicType?: 'LIQUOR' | 'WINE' | 'BEER';
  isActive: boolean;
}

interface OrderLine {
  id: string;
  menuItemId: string;
  menuItem: MenuItem;
  displayName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  typeDrink: 'LIQUOR' | 'WINE' | null;
  typeShots: string | null;
}

// ---------------------------------------------------------------------
// Main Component – Employee Version with Custom Serving Support
// ---------------------------------------------------------------------
const EmployeeCreateOrderPage = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const { user: employee } = useEmployeeAuth();
  const navigate = useNavigate();

  // UI State
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [orderItems, setOrderItems] = useState<OrderLine[]>([]);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPurpose, setSelectedPurpose] = useState<'ALL' | 'EATING' | 'DRINKING'>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  // Serving modals
  const [showServingPrompt, setShowServingPrompt] = useState(false);
  const [showServingModal, setShowServingModal] = useState(false);
  const [pendingItem, setPendingItem] = useState<MenuItem | null>(null);
  const [servingType, setServingType] = useState('');
  const [servingPrice, setServingPrice] = useState('');

  // Data
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Submission
  const [submitting, setSubmitting] = useState(false);

  // Load menu
  useEffect(() => {
    if (!companyId) return;
    const loadMenuItems = async () => {
      setLoading(true);
      try {
        const items = await menuItemService.getMenuItemsByCompanyId(companyId);
        setMenuItems(items.filter((item: any) => item.isActive));
      } catch (err: any) {
        setFetchError(err.message || 'Failed to load menu items');
      } finally {
        setLoading(false);
      }
    };
    loadMenuItems();
  }, [companyId]);

  const filteredMenuItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPurpose = selectedPurpose === 'ALL' || item.purpose === selectedPurpose;
      return matchesSearch && matchesPurpose;
    });
  }, [menuItems, searchTerm, selectedPurpose]);

  // Handle item click
  const handleItemClick = (item: MenuItem) => {
    const isLiquorOrWine =
      item.purpose === 'DRINKING' &&
      item.drinkState === 'ALCOHOLIC' &&
      (item.alcoholicType === 'LIQUOR' || item.alcoholicType === 'WINE');

    if (isLiquorOrWine) {
      setPendingItem(item);
      setShowServingPrompt(true);
    } else {
      const price = calculatePrice(item.sellingPrice, item.discount);
      addOrderItem(item, item.name, price, null, null);
    }
  };

  const addNormally = () => {
    if (!pendingItem) return;
    const price = calculatePrice(pendingItem.sellingPrice, pendingItem.discount);
    const typeDrink = pendingItem.alcoholicType === 'LIQUOR' || pendingItem.alcoholicType === 'WINE'
      ? pendingItem.alcoholicType
      : null;
    addOrderItem(pendingItem, pendingItem.name, price, typeDrink, null);
    setShowServingPrompt(false);
    setPendingItem(null);
  };

  const proceedWithServing = () => {
    setShowServingPrompt(false);
    setShowServingModal(true);
  };

  const confirmServingAndAdd = () => {
    if (!pendingItem || !servingType || !servingPrice || Number(servingPrice) <= 0) {
      alert('Please select serving type and enter a valid price.');
      return;
    }
    const displayName = `${pendingItem.name} (${servingType})`;
    const price = Number(servingPrice);
    addOrderItem(pendingItem, displayName, price, pendingItem.alcoholicType as 'LIQUOR' | 'WINE', servingType);
    setShowServingModal(false);
    setPendingItem(null);
    setServingType('');
    setServingPrice('');
  };

  const addOrderItem = (
    menuItem: MenuItem,
    displayName: string,
    unitPrice: number,
    typeDrink: 'LIQUOR' | 'WINE' | null,
    typeShots: string | null
  ) => {
    const existing = orderItems.find(i =>
      i.menuItemId === menuItem.id &&
      i.displayName === displayName &&
      i.typeShots === typeShots
    );

    if (existing) {
      setOrderItems(prev => prev.map(i =>
        i.id === existing.id
          ? { ...i, quantity: i.quantity + 1, totalPrice: i.unitPrice * (i.quantity + 1) }
          : i
      ));
    } else {
      const newLine: OrderLine = {
        id: `local-${Date.now()}`,
        menuItemId: menuItem.id,
        menuItem,
        displayName,
        quantity: 1,
        unitPrice,
        totalPrice: unitPrice,
        typeDrink,
        typeShots,
      };
      setOrderItems(prev => [...prev, newLine]);
    }
    setShowMenuModal(false);
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      setOrderItems(prev => prev.filter(i => i.id !== id));
    } else {
      setOrderItems(prev => prev.map(i => i.id === id ? { ...i, quantity: qty, totalPrice: i.unitPrice * qty } : i));
    }
  };

  const removeOrderItem = (id: string) => {
    setOrderItems(prev => prev.filter(i => i.id !== id));
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
    if (!clientName.trim()) return alert('Please enter client name');
    if (orderItems.length === 0) return alert('Add at least one item');

    setSubmitting(true);
    try {
      const payload = {
        companyId,
        clientName: clientName.trim(),
        employeeId: employee?.id,
        clientPhone: clientPhone.trim() || undefined,
        clientEmail: clientEmail.trim() || undefined,
        notes: notes.trim() || undefined,
        items: orderItems.map(i => ({
          menuItemId: i.menuItemId,
          unitPrice: i.unitPrice,
          quantity: i.quantity,
          note: i.displayName !== i.menuItem.name ? i.displayName : undefined,
          typeDrink: i.typeDrink,
          typeShots: i.typeShots,
        })),
      };

      const result = await orderService.createOrder(payload);

      await Swal.fire({
        icon: 'success',
        title: 'Order Created!',
        html: `
          <div class="text-left">
            <p class="text-lg font-bold text-green-600">${result.orderNumber ? `Order #${result.orderNumber}` : 'Success'}</p>
            <p class="mt-2">Total: <strong>${formatCurrency(totalAmount)}</strong></p>
            <p>Items: <strong>${orderItems.length}</strong> • Qty: <strong>${orderItems.reduce((s, i) => s + i.quantity, 0)}</strong></p>
            <p class="mt-2 text-xs text-gray-600">Served by: <strong>${employee?.name || 'Employee'}</strong></p>
          </div>
        `,
        confirmButtonColor: '#16a34a',
        timer: 8000,
        timerProgressBar: true,
      });

      navigate('/employee/dashboard/order');
      resetForm();
    } catch (err: any) {
      Swal.fire('Error', err.message || 'Failed to create order', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-5"></div>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4">
        {loading && (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary-600 mb-2" />
            <p className="text-gray-600 text-sm">Loading menu items...</p>
          </div>
        )}
        {fetchError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 text-sm mb-0.5">Error Loading Menu</h3>
              <p className="text-red-700 text-sm">{fetchError}</p>
            </div>
          </div>
        )}
        {!loading && !fetchError && (
          <div className="space-y-4">
            {/* Header */}
            <div className="bg-white rounded-lg shadow border border-gray-100">
              <div className="bg-primary-600/8 h-[60px] px-4 py-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center">
                    <ClipboardList className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-sm font-bold text-gray-900">New Order (Employee)</h2>
                </div>
              </div>
            </div>

            {/* Client Info */}
            <div className="bg-white rounded-lg shadow border border-gray-100">
              <div className="bg-primary-600/8 h-[60px] px-4 py-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-sm font-bold text-gray-900">Client Information</h2>
                </div>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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
                  <div className="group">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
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

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow border border-gray-100">
              <div className="bg-primary-600/5 px-4 py-2 border-b border-gray-200">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center">
                      <ShoppingCart className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-sm font-bold text-gray-900">Order Items</h2>
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
                    {orderItems.map((line) => {
                      const isCustom = !!line.typeShots;
                      return (
                        <div key={line.id} className="bg-gray-50 border border-gray-200 rounded-lg p-3 hover:border-primary-600/30 hover:shadow transition-all">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-12 h-12 bg-primary-600/10 rounded-lg flex items-center justify-center">
                              {line.typeDrink === 'WINE' ? (
                                <Wine className="w-6 h-6 text-purple-600" />
                              ) : line.typeDrink === 'LIQUOR' ? (
                                <GlassWater className="w-6 h-6 text-blue-600" />
                              ) : (
                                <Package className="w-6 h-6 text-primary-600" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <div className="flex-1">
                                  <h3 className="font-bold text-gray-900 text-sm mb-0.5">{line.displayName}</h3>
                                  {line.menuItem.description && !isCustom && (
                                    <div className="text-xs text-gray-600 line-clamp-1" dangerouslySetInnerHTML={{ __html: line.menuItem.description }} />
                                  )}
                                  {isCustom && (
                                    <div className="flex items-center gap-2 mt-1 text-xs">
                                      {line.typeDrink === 'WINE' ? (
                                        <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-bold">WINE</span>
                                      ) : line.typeDrink === 'LIQUOR' ? (
                                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold">LIQUOR</span>
                                      ) : null}
                                      <span className="text-gray-600 font-medium">{line.typeShots}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 mb-2 text-xs">
                                <span className="font-semibold text-gray-700">
                                  {isCustom ? 'Custom Price' : `${formatCurrency(line.unitPrice)} / unit`}
                                </span>
                              </div>
                              <div className="flex items-center justify-between flex-wrap gap-2">
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-0.5 bg-white rounded-lg border border-gray-300 shadow-sm">
                                    <button onClick={() => updateQuantity(line.id, line.quantity - 1)} className="w-7 h-7 hover:bg-gray-100 rounded-l-lg transition-colors text-sm font-semibold text-gray-700">
                                      -
                                    </button>
                                    <span className="w-8 text-center text-sm font-bold text-gray-900">{line.quantity}</span>
                                    <button onClick={() => updateQuantity(line.id, line.quantity + 1)} className="w-7 h-7 hover:bg-gray-100 rounded-r-lg transition-colors text-sm font-semibold text-gray-700">
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
                                  <button onClick={() => removeOrderItem(line.id)} className="w-7 h-7 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
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
            </div>

            {/* Total Summary */}
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

            {/* Notes */}
            <div className="bg-white rounded-lg shadow border border-gray-100">
              <div className="bg-primary-600/5 px-4 py-2 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-sm font-bold text-gray-900">Order Notes</h2>
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

            {/* Actions */}
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
          </div>
        )}
      </div>

      {/* MENU MODAL */}
      {showMenuModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="bg-primary-600 px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-white">Browse Menu</h2>
                </div>
                <button onClick={() => setShowMenuModal(false)} className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-all">
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
            <div className="p-4 bg-gray-50 border-b border-gray-200 space-y-3">
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
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                  <Filter className="w-3.5 h-3.5" />
                  <span>Filter:</span>
                </div>
                <select
                  value={selectedPurpose}
                  onChange={(e) => setSelectedPurpose(e.target.value as any)}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 outline-none bg-white text-xs font-medium"
                >
                  <option value="ALL">All Items</option>
                  <option value="EATING">Food Only</option>
                  <option value="DRINKING">Drinks Only</option>
                </select>
                <div className="ml-auto flex items-center gap-1 bg-white rounded-lg border border-gray-300 p-0.5">
                  <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded transition-all ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                    <Grid3x3 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setViewMode('list')} className={`p-1.5 rounded transition-all ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="text-xs text-gray-600">
                Showing <span className="font-semibold text-gray-900">{filteredMenuItems.length}</span> item(s)
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3' : 'space-y-3'}>
                {filteredMenuItems.map((item) => {
                  const finalPrice = calculatePrice(item.sellingPrice, item.discount);
                  const isInCart = orderItems.some(i => i.menuItemId === item.id);
                  return viewMode === 'grid' ? (
                    <div
                      key={item.id}
                      onClick={() => handleItemClick(item)}
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
                          <h3 className="font-bold text-sm text-gray-900 mb-1 line-clamp-2">{item.name}</h3>
                          {item.description && (
                            <div className="text-xs text-gray-600 mb-2 line-clamp-2" dangerouslySetInnerHTML={{ __html: item.description }} />
                          )}
                        </div>
                        <div className="pt-2 border-t border-gray-100 mt-auto">
                          <div className="flex items-end justify-between mb-2">
                            <div>
                              <div className="text-lg font-bold text-primary-600">{formatCurrency(finalPrice)}</div>
                              {item.discount > 0 && (
                                <div className="text-xs text-gray-400 line-through">{formatCurrency(item.sellingPrice)}</div>
                              )}
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full font-semibold ${item.purpose === 'EATING' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                              {item.purpose === 'EATING' ? 'Food' : 'Drink'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div key={item.id} onClick={() => handleItemClick(item)} className="bg-white border border-gray-200 rounded-lg p-3 hover:border-primary-600 hover:shadow-lg transition-all cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-16 h-16 bg-primary-600/10 rounded-lg flex items-center justify-center">
                          <Package className="w-8 h-8 text-primary-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-bold text-sm text-gray-900">{item.name}</h3>
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
                            <div className="text-xs text-gray-600 mb-2 line-clamp-1" dangerouslySetInnerHTML={{ __html: item.description }} />
                          )}
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                              <div>
                                <span className="text-lg font-bold text-primary-600">{formatCurrency(finalPrice)}</span>
                                {item.discount > 0 && (
                                  <span className="text-xs text-gray-400 line-through ml-1">
                                    {formatCurrency(item.sellingPrice)}
                                  </span>
                                )}
                              </div>
                              <span className={`text-xs px-2 py-1 rounded-full font-semibold ${item.purpose === 'EATING' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                                {item.purpose === 'EATING' ? 'Food' : 'Drink'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="p-3 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-600">Click any item to add it to your order</p>
                <button onClick={() => setShowMenuModal(false)} className="px-4 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-all">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Serving Prompt Modal */}
      {showServingPrompt && pendingItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 z-[60]">
          <div className="bg-white rounded-lg shadow-2xl max-w-sm w-full p-6 text-center">
            <GlassWater className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Serve as Serving?</h3>
            <p className="text-sm text-gray-600 mb-6">
              Do you want to serve <strong>{pendingItem.name}</strong> as shots/glass/bottle with custom price?
            </p>
            <div className="flex gap-3">
              <button onClick={proceedWithServing} className="flex-1 bg-primary-600 text-white py-2.5 rounded-lg font-semibold hover:bg-primary-700 transition-all">
                Yes, Customize
              </button>
              <button onClick={addNormally} className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-lg font-semibold hover:bg-gray-300 transition-all">
                No, Add Normally
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Serving Modal */}
      {showServingModal && pendingItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 z-[70]">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Select Serving & Price</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Item</label>
                <p className="font-medium">{pendingItem.name}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Serving Type</label>
                <select
                  value={servingType}
                  onChange={(e) => setServingType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-primary-600 outline-none"
                >
                  <option value="">-- Choose --</option>
                  {pendingItem.alcoholicType === 'LIQUOR' && (
                    <>
                      <option value="Single Shot">Single Shot</option>
                      <option value="Double Shot">Double Shot</option>
                      <option value="Quarter Shot">Quarter Shot</option>
                    </>
                  )}
                  {pendingItem.alcoholicType === 'WINE' && (
                    <>
                      <option value="Glass">Glass</option>
                      <option value="Bottle">Bottle</option>
                      <option value="Carton">Carton</option>
                    </>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Price (RWF)</label>
                <input
                  type="number"
                  value={servingPrice}
                  onChange={(e) => setServingPrice(e.target.value)}
                  placeholder="5000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-primary-600 outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={confirmServingAndAdd} className="flex-1 bg-primary-600 text-white py-2.5 rounded-lg font-semibold hover:bg-primary-700 transition-all">
                Add to Order
              </button>
              <button
                onClick={() => {
                  setShowServingModal(false);
                  setPendingItem(null);
                  setServingType('');
                  setServingPrice('');
                }}
                className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeCreateOrderPage;