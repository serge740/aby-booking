import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  PlayCircle,
  Search,
  Loader2,
  AlertCircle,
  User,
  Phone,
  Mail,
  FileText,
  ShoppingCart,
  Calendar,
  Hash,
} from 'lucide-react';
import orderService from '../../services/orderService';

interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  menuItem: {
    id: string;
    name: string;
    image?: string;
  };
}

interface Order {
  id: string;
  orderNumber: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  totalAmount: number;
  clientName: string;
  clientPhone?: string;
  clientEmail?: string;
  notes?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

const formatRWF = (amount: number) => {
  return new Intl.NumberFormat('rw-RW', {
    style: 'currency',
    currency: 'RWF',
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('en-RW', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getStatusInfo = (status: string) => {
  switch (status) {
    case 'COMPLETED':
      return { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-5 h-5" />, message: 'Order Completed', bg: 'bg-green-50' };
    case 'PROCESSING':
      return { color: 'bg-blue-100 text-blue-800', icon: <PlayCircle className="w-5 h-5" />, message: 'In Kitchen', bg: 'bg-blue-50' };
    case 'PENDING':
      return { color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="w-5 h-5" />, message: 'Order Received', bg: 'bg-yellow-50' };
    case 'CANCELLED':
      return { color: 'bg-red-100 text-red-800', icon: <XCircle className="w-5 h-5" />, message: 'Order Cancelled', bg: 'bg-red-50' };
    default:
      return { color: 'bg-gray-100 text-gray-800', icon: <Package className="w-5 h-5" />, message: 'Unknown', bg: 'bg-gray-50' };
  }
};

export default function OrderTrackingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');

  // On mount: Check URL for ?order=...
  useEffect(() => {
    const orderFromUrl = searchParams.get('order');
    if (orderFromUrl) {
      setOrderNumber(orderFromUrl);
      setInputValue(orderFromUrl);
      fetchOrder(orderFromUrl);
    }
  }, [searchParams]);

  const fetchOrder = async (number: string) => {
    if (!number.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await orderService.getOrdersByOrderNumber(number.trim().toUpperCase());
      setOrder(data);
      // Update URL
      setSearchParams({ order: number.trim().toUpperCase() });
    } catch (err: any) {
      setError(err.message || 'Order not found. Please check your order number.');
      setOrder(null);
      // Remove invalid order from URL
      setSearchParams({});
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim().toUpperCase();
    if (trimmed && trimmed !== orderNumber) {
      fetchOrder(trimmed);
    }
  };

  const status = order ? getStatusInfo(order.status) : null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Order</h1>
          <p className="text-gray-600">Enter your order number to see real-time updates</p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="e.g. ORD123"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg font-medium"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !inputValue.trim()}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white rounded-lg font-medium flex items-center gap-2 transition"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Track Order
                </>
              )}
            </button>
          </div>
        </form>

        {/* Error State */}
        {error && !order && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700 flex items-start gap-3">
            <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold">Order Not Found</h3>
              <p className="mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Order Details */}
        {order && (
          <>
            {/* Status Banner */}
            <div className={`${status?.bg} rounded-xl p-6 border-2 ${status?.color.split(' ')[2]}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${status?.color}`}>
                    {status?.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{status?.message}</h2>
                    <p className="text-gray-600 mt-1">Order #{order.orderNumber}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Placed on</p>
                  <p className="font-medium">{formatDate(order.createdAt)}</p>
                </div>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Progress</h3>
              <div className="flex items-center justify-between">
                {['PENDING', 'PROCESSING', 'COMPLETED'].map((step, idx) => {
                  const isActive = order.status === step || 
                    (order.status === 'PROCESSING' && step === 'PENDING') ||
                    (order.status === 'COMPLETED' && ['PENDING', 'PROCESSING'].includes(step));
                  const isCurrent = order.status === step;
                  const isCancelled = order.status === 'CANCELLED';

                  return (
                    <div key={step} className="flex-1 relative">
                      {idx > 0 && (
                        <div className="absolute left-0 top-6 w-full h-1 bg-gray-200 -z-10">
                          <div
                            className={`h-full transition-all ${isActive ? 'bg-orange-500' : 'bg-gray-200'}`}
                            style={{ width: isActive ? '100%' : '0%' }}
                          />
                        </div>
                      )}
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                            isCurrent ? 'bg-orange-500 text-white scale-110' :
                            isActive ? 'bg-orange-100 text-orange-600' :
                            'bg-gray-100 text-gray-400'
                          }`}
                        >
                          {step === 'PENDING' && <Clock className="w-6 h-6" />}
                          {step === 'PROCESSING' && <PlayCircle className="w-6 h-6" />}
                          {step === 'COMPLETED' && <CheckCircle className="w-6 h-6" />}
                        </div>
                        <p className={`mt-2 text-sm font-medium ${
                          isCurrent ? 'text-orange-600' :
                          isActive ? 'text-gray-700' :
                          'text-gray-400'
                        }`}>
                          {step === 'PENDING' ? 'Received' :
                           step === 'PROCESSING' ? 'Preparing' :
                           'Ready'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              {order.status === 'CANCELLED' && (
                <div className="mt-4 text-center text-red-600 font-medium">
                  Order was cancelled
                </div>
              )}
            </div>

            {/* Order Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Info */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Customer Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{order.clientName}</span>
                  </div>
                  {order.clientPhone && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 flex items-center gap-1">
                        <Phone className="w-4 h-4" /> Phone:
                      </span>
                      <span className="font-medium">{order.clientPhone}</span>
                    </div>
                  )}
                  {order.clientEmail && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 flex items-center gap-1">
                        <Mail className="w-4 h-4" /> Email:
                      </span>
                      <span className="font-medium">{order.clientEmail}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Order Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-mono text-sm">{order.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Items:</span>
                    <span className="font-medium">{order.items.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-bold text-lg text-orange-600">
                      {formatRWF(order.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {order.notes && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Special Requests
                </h3>
                <p className="text-blue-800 italic">"{order.notes}"</p>
              </div>
            )}

            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Your Items ({order.items.length})
                </h3>
              </div>
              <div className="divide-y divide-gray-200">
                {order.items.map((item) => (
                  <div key={item.id} className="p-6 flex gap-4 hover:bg-gray-25">
                    {item.menuItem.image ? (
                      <img
                        src={item.menuItem.image}
                        alt={item.menuItem.name}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Package className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.menuItem.name}</h4>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-600">
                          {item.quantity} × {formatRWF(item.unitPrice)}
                        </span>
                        <span className="font-semibold text-orange-600">
                          {formatRWF(item.totalPrice)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span className="text-orange-600">{formatRWF(order.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Last Updated */}
            <div className="text-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 inline mr-1" />
              Last updated: {formatDate(order.updatedAt)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}