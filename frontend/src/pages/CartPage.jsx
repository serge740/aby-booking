import React, { useState } from 'react';
import { 
  ShoppingCart, 
  X, 
  ChevronUp, 
  ChevronDown, 
  Trash2,
  CreditCard,
  Package,
  Truck
} from 'lucide-react';
import { useCart } from '../context/CartContext'; // Adjust path as needed
import Header from '../components/header';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const taxRate = 0.08; // 8% tax rate (adjust as needed)
  const tax = subtotal * taxRate;
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + tax + shipping;

  // Handle quantity updates
  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  // Handle checkout
  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      // Simulate checkout process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart after successful checkout
      clearCart();
      alert('Order placed successfully! Thank you for your purchase.');
    } catch (error) {
      alert('Checkout failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Continue shopping button
  const handleContinueShopping = () => {
    // Navigate to shop page (implement with your router)
    window.history.back();
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <Header title="Shopping Cart" path="Cart" />
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <ShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">
              You have no items in your shopping cart. Start shopping to add items to your cart.
            </p>
            <button
              onClick={handleContinueShopping}
              className="px-6 py-3 bg-primary-500 text-white font-semibold rounded-md hover:bg-[#b8946f] transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Shopping Cart" path="Cart" />
      
      <div className=" mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
                <p className="text-gray-600 mt-1">
                  Review your items and proceed to checkout
                </p>
              </div>

              <div className="divide-y divide-gray-200">
                {cart.map((item) => (
                  <div key={item.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start gap-4">
                      {/* Remove Item Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 transition-colors p-1 -m-1 rounded-full hover:bg-red-50"
                        title="Remove item"
                      >
                        <X size={20} />
                      </button>

                      {/* Product Image */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                      />

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                          {item.name}
                        </h3>
                        
                        {/* Product Meta */}
                        {item.categories && (
                          <div className="flex flex-wrap gap-2 mb-2">
                            {item.categories.slice(0, 2).map((cat) => (
                              <span
                                key={cat}
                                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                              >
                                {cat}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Price */}
                        <div className="flex items-center gap-3 mb-3">
                          {item.originalPrice && item.onSale && (
                            <span className="text-sm text-gray-500 line-through">
                              ${item.originalPrice.toFixed(2)}
                            </span>
                          )}
                          <span className="text-xl font-bold text-primary-500">
                            ${item.price.toFixed(2)}
                          </span>
                        </div>

                        {/* Quantity Selector */}
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-700">Qty:</span>
                          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="px-3 py-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={item.quantity <= 1}
                            >
                              <ChevronDown size={16} />
                            </button>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                              min="1"
                              className="w-16 text-center py-2 border-0 focus:outline-none focus:ring-1 focus:ring-primary-500"
                            />
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="px-3 py-2 hover:bg-gray-100 transition-colors"
                              disabled={item.stock && item.quantity >= item.stock}
                            >
                              <ChevronUp size={16} />
                            </button>
                          </div>
                          
                          {item.stock && item.quantity >= item.stock && (
                            <span className="text-sm text-yellow-600">
                              Max stock reached
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Item Total */}
                      <div className="text-right flex flex-col items-end">
                        <span className="text-lg font-bold text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        {item.stock && (
                          <span className="text-xs text-gray-500">
                            {item.stock - item.quantity} left
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Actions */}
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <button
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-800 font-medium flex items-center gap-2"
                  >
                    <Trash2 size={16} />
                    Clear Cart
                  </button>
                  <button
                    onClick={handleContinueShopping}
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-700">Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Tax ({taxRate * 100}%)</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600' : 'font-semibold'}>
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isProcessing || cart.length === 0}
                className={`w-full py-4 rounded-md font-semibold text-white flex items-center justify-center gap-2 transition-all ${
                  isProcessing || cart.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-primary-500 hover:bg-[#b8946f]'
                }`}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard size={20} />
                    Proceed to Checkout
                  </>
                )}
              </button>

              {/* Shipping Info */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Truck size={16} className="text-primary-500" />
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Package size={16} className="text-primary-500" />
                  <span>Estimated delivery: 3-5 business days</span>
                </div>
              </div>

              {/* Secure Payment */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 text-center">
                  Secure checkout with SSL encryption
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;