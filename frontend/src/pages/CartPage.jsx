import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  X,
  Trash2,
  Package,
  Clock,
  AlertCircle,
  Store,
  CheckCircle,
  Plus,
  Minus,
  Percent,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import Header from '../components/header';
import MenuItemOrderModal from '../components/MenuItemOrderModal';
import menuItemService from '../services/menuItemService';
import { API_URL } from '../api/api';

// RWF Formatter
const formatRWF = (amount) => {
  return new Intl.NumberFormat('rw-RW', {
    style: 'currency',
    currency: 'RWF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [validatedGroups, setValidatedGroups] = useState({});
  const [removedItems, setRemovedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);

  const companyIdFromUrl =
    new URLSearchParams(window.location.search).get('companyId') || '1';

  const handleContinueShopping = () => window.history.back();
  const handleCheckout = () => {
    if (!selectedCompanyId) return;
    setIsOrderModalOpen(true);
  };

  // ───────────────────────────────────────────────────────
  // 1. Validate & enrich cart items (with discount)
  // ───────────────────────────────────────────────────────
  useEffect(() => {
    const validateCart = async () => {
      setLoading(true);
      const groups = {};
      const removed = [];
      const companyGroups = cartItems.reduce((acc, item) => {
        const cid = item.companyId || 'unknown';
        if (!acc[cid]) acc[cid] = [];
        acc[cid].push(item);
        return acc;
      }, {});

      for (const [companyId, items] of Object.entries(companyGroups)) {
        const validItems = [];
        for (const item of items) {
          try {
            const dbItem = await menuItemService.getOneMenuItem(item.menuItemId);
            if (dbItem && dbItem.isActive) {
              // Calculate final price after discount
              const discount = dbItem.discount || 0;
              const finalPrice = dbItem.sellingPrice - (dbItem.sellingPrice * discount / 100);

              validItems.push({
                ...item,
                name: dbItem.name,
                originalPrice: dbItem.sellingPrice, // original
                unitPrice: finalPrice,              // after discount
                discount: discount,                 // % off
                image: dbItem.mainImage ? `${API_URL}${dbItem.mainImage}` : undefined,
                companyName: dbItem.company?.name || 'Unknown Restaurant',
                companyLogo: dbItem.company?.logo
                  ? `${API_URL}${dbItem.company.logo}`
                  : undefined,
                isActive: true,
              });
            } else {
              removed.push(item.name);
              removeFromCart(item.menuItemId);
            }
          } catch (err) {
            removed.push(item.name);
            removeFromCart(item.menuItemId);
          }
        }
        if (validItems.length > 0) {
          groups[companyId] = validItems;
        }
      }

      setValidatedGroups(groups);
      setRemovedItems(removed);
      const companyIds = Object.keys(groups);
      if (companyIds.length === 1) {
        setSelectedCompanyId(companyIds[0]);
      }
      setLoading(false);
    };

    if (cartItems.length > 0) {
      validateCart();
    } else {
      setLoading(false);
    }
  }, [cartItems]);

  // ───────────────────────────────────────────────────────
  // 2. Total for selected company (with quantity)
  // ───────────────────────────────────────────────────────
  const calculateSelectedTotal = () => {
    if (!selectedCompanyId || !validatedGroups[selectedCompanyId]) return 0;
    return validatedGroups[selectedCompanyId].reduce(
      (sum, item) => sum + item.unitPrice * (item.quantity || 1),
      0
    );
  };

  // ───────────────────────────────────────────────────────
  // 3. Empty cart
  // ───────────────────────────────────────────────────────
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <Header title="Your Order" path="Order" />
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <ShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Your order is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Add items from the menu to place your order.
            </p>
            <button
              onClick={handleContinueShopping}
              className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 transition-colors"
            >
              Back to Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ───────────────────────────────────────────────────────
  // 4. Main UI – with discount display
  // ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <Header title="Your Order" path="Order" />
      <div className="menuItem mx-auto px-4 lg:px-16 py-8">
        {/* Removed items warning */}
        {removedItems.length > 0 && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-800">Some items were removed</p>
              <p className="text-sm text-yellow-700">
                The following items are no longer available:{' '}
                <strong>{removedItems.join(', ')}</strong>
              </p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT – Grouped items */}
          <div className="lg:col-span-2 space-y-8">
            {loading ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500 mx-auto" />
                <p className="mt-4 text-gray-600">Validating your order...</p>
              </div>
            ) : Object.keys(validatedGroups).length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <ShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <p className="text-gray-600">No valid items in your order.</p>
              </div>
            ) : (
              Object.entries(validatedGroups).map(([companyId, items]) => {
                const isSelected = selectedCompanyId === companyId;
                const companyTotal = items.reduce(
                  (sum, i) => sum + i.unitPrice * (i.quantity || 1),
                  0
                );
                return (
                  <div
                    key={companyId}
                    className={`bg-white rounded-lg shadow-sm overflow-hidden border-2 transition-all ${
                      isSelected
                        ? 'border-orange-500 shadow-lg'
                        : 'border-transparent'
                    }`}
                  >
                    {/* Company Header */}
                    <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="company"
                              checked={isSelected}
                              onChange={() => setSelectedCompanyId(companyId)}
                              className="w-5 h-5 text-orange-600 focus:ring-orange-500"
                            />
                            {items[0].companyLogo ? (
                              <img
                                src={items[0].companyLogo}
                                alt={items[0].companyName}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center">
                                <Store className="w-6 h-6 text-orange-600" />
                              </div>
                            )}
                            <div>
                              <h3 className="font-bold text-gray-900">
                                {items[0].companyName}
                              </h3>
                              <p className="text-xs text-gray-600">
                                {items.reduce((s, i) => s + (i.quantity || 1), 0)} item
                                {items.reduce((s, i) => s + (i.quantity || 1), 0) > 1
                                  ? 's'
                                  : ''}{' '}
                                • {formatRWF(companyTotal)}
                              </p>
                            </div>
                          </label>
                        </div>
                        {isSelected && (
                          <CheckCircle className="w-6 h-6 text-orange-600" />
                        )}
                      </div>
                    </div>

                    {/* Items */}
                    <div className="divide-y divide-gray-200">
                      {items.map((item) => {
                        const qty = item.quantity || 1;
                        const itemTotal = item.unitPrice * qty;
                        const hasDiscount = item.discount > 0;

                        return (
                          <div
                            key={item.menuItemId}
                            className="p-6 hover:bg-gray-50"
                          >
                            <div className="flex items-start gap-4">
                              {/* Remove */}
                              <button
                                onClick={() => removeFromCart(item.menuItemId)}
                                className="text-red-500 hover:text-red-700 p-1 -m-1 rounded-full hover:bg-red-50"
                                title="Remove item"
                              >
                                <X size={20} />
                              </button>

                              {/* Image */}
                              {item.image ? (
                                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                  {hasDiscount && (
                                    <div className="absolute top-1 right-1 bg-red-500 text-white px-1.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-0.5">
                                      <Percent className="w-3 h-3" />
                                      {item.discount}%
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="w-16 h-16 bg-gray-200 border-2 border-dashed rounded-lg flex-shrink-0" />
                              )}

                              {/* Details */}
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                                  {item.name}
                                </h3>
                                <div className="flex items-center gap-2 text-sm">
                                  <span className="text-orange-600 font-medium">
                                    {formatRWF(item.unitPrice)} each
                                  </span>
                                  {hasDiscount && (
                                    <span className="text-xs text-gray-500 line-through">
                                      {formatRWF(item.originalPrice)}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Quantity Controls */}
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() =>
                                    updateQuantity(item.menuItemId, qty - 1)
                                  }
                                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="w-10 text-center font-semibold">
                                  {qty}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQuantity(item.menuItemId, qty + 1)
                                  }
                                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>

                              {/* Item Total */}
                              <div className="text-right">
                                <span className="text-lg font-bold text-gray-900">
                                  {formatRWF(itemTotal)}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}

            {/* Cart actions */}
            {Object.keys(validatedGroups).length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6 border-t">
                <div className="flex justify-between items-center">
                  <button
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-800 font-medium flex items-center gap-2"
                  >
                    <Trash2 size={16} />
                    Clear All
                  </button>
                  <button
                    onClick={handleContinueShopping}
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Add More Items
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT – Checkout Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Checkout Summary
              </h2>
              {!selectedCompanyId ? (
                <div className="text-center py-8 text-gray-500">
                  <Store className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Select a restaurant to proceed</p>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      {validatedGroups[selectedCompanyId][0].companyLogo ? (
                        <img
                          src={validatedGroups[selectedCompanyId][0].companyLogo}
                          alt=""
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center">
                          <Store className="w-5 h-5 text-orange-600" />
                        </div>
                      )}
                      <span className="font-medium">
                        {validatedGroups[selectedCompanyId][0].companyName}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {validatedGroups[selectedCompanyId].reduce(
                        (s, i) => s + (i.quantity || 1),
                        0
                      )}{' '}
                      item
                      {validatedGroups[selectedCompanyId].reduce(
                        (s, i) => s + (i.quantity || 1),
                        0
                      ) > 1
                        ? 's'
                        : ''}
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-4 mb-6">
                    <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span>{formatRWF(calculateSelectedTotal())}</span>
                    </div>
                  </div>
                </>
              )}
              <button
                onClick={handleCheckout}
                disabled={!selectedCompanyId || loading}
                className="w-full py-4 rounded-md font-semibold text-white bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
              >
                <ShoppingCart size={20} />
                {selectedCompanyId ? 'Confirm Order' : 'Select a Restaurant'}
              </button>
              <div className="mt-6 pt-4 border-t border-gray-100 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock size={16} className="text-orange-500" />
                  <span>Ready in 15–25 minutes</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Package size={16} className="text-orange-500" />
                  <span>Table service or pickup</span>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 text-center">
                  You can only place one order at a time
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MenuItemOrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        companyId={selectedCompanyId || companyIdFromUrl}
      />
    </div>
  );
};

export default CartPage;