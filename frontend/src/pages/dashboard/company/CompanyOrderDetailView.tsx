import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Package,
  User,
  Mail,
  Phone,
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Hash,
  Download,
  ShoppingCart,
  Percent,
  PlayCircle,
  X,
  Check,
  RefreshCw,
  Receipt,
} from 'lucide-react';
import jsPDF from 'jspdf';
import orderService from '../../../services/orderService';
import { useCompanyAuth } from '../../../context/CompanyAuthContext';

interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  menuItem: {
    id: string;
    name: string;
    sellingPrice: number;
    discount?: number;
    image?: string;
    description?: string;
    purpose: 'EATING' | 'DRINKING';
  };
}

interface Order {
  id: string;
  orderNumber: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  totalAmount: number;
  notes?: string;
  clientName: string;
  clientPhone?: string;
  clientEmail?: string;
  companyId: string;
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

export default function CompanyOrderDetailView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { company, isAuthenticated, isLoading: authLoading } = useCompanyAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [operationStatus, setOperationStatus] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [showFoodReceipt, setShowFoodReceipt] = useState(false);
  const [showDrinkReceipt, setShowDrinkReceipt] = useState(false);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !company)) {
      navigate('/company/login');
    }
  }, [authLoading, isAuthenticated, company, navigate]);

  useEffect(() => {
    if (company?.id && id) {
      loadOrder();
    }
  }, [company?.id, id]);

  const loadOrder = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await orderService.getOrderById(id);
      if (data.companyId !== company?.id) {
        setError('Unauthorized access');
        return;
      }
      setOrder(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    setOperationStatus({ type, message });
    setTimeout(() => setOperationStatus(null), 3000);
  };

  const updateOrderStatus = async (newStatus: 'PROCESSING' | 'CANCELLED' | 'COMPLETED') => {
    if (!order || updatingStatus) return;
    setUpdatingStatus(true);
    try {
      const updated = await orderService.updateStatus(order.id, newStatus);
      setOrder(updated);
      showToast('success', `Order marked as ${newStatus}!`);
    } catch (err: any) {
      showToast('error', err.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-5 h-5" />, message: 'Order completed!', bg: 'bg-green-50' };
      case 'PROCESSING':
        return { color: 'bg-primary-100 text-primary-800', icon: <PlayCircle className="w-5 h-5" />, message: 'Order is being prepared', bg: 'bg-primary-50' };
      case 'PENDING':
        return { color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="w-5 h-5" />, message: 'Order received', bg: 'bg-yellow-50' };
      case 'CANCELLED':
        return { color: 'bg-red-100 text-red-800', icon: <XCircle className="w-5 h-5" />, message: 'Order has been cancelled', bg: 'bg-red-50' };
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: <Package className="w-5 h-5" />, message: 'Unknown status', bg: 'bg-gray-50' };
    }
  };

  const handleDownloadPDF = async () => {
    if (!order) return;
    setGeneratingPDF(true);
    showToast('info', 'Generating receipt...');
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 15;
      let yPos = margin;

      const addText = (text: string, x: number, y: number, maxWidth: number, fontSize = 10, bold = false) => {
        pdf.setFontSize(fontSize);
        pdf.setFont('helvetica', bold ? 'bold' : 'normal');
        const lines = pdf.splitTextToSize(text, maxWidth);
        pdf.text(lines, x, y);
        return y + (lines.length * fontSize * 0.4);
      };

      // Header
      pdf.setFillColor(251, 146, 60);
      pdf.rect(0, 0, pageWidth, 25, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('ORDER RECEIPT', pageWidth / 2, 15, { align: 'center' });
      yPos = 35;
      pdf.setTextColor(0, 0, 0);

      // Order Info
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Order Information', margin, yPos); yPos += 8;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Order #: ${order.orderNumber}`, margin, yPos); yPos += 6;
      pdf.text(`Date: ${formatDate(order.createdAt)}`, margin, yPos); yPos += 6;
      pdf.text(`Status: ${order.status}`, margin, yPos); yPos += 6;
      pdf.text(`Total: ${formatRWF(order.totalAmount)}`, margin, yPos); yPos += 10;

      // Client Info
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Customer', margin, yPos); yPos += 8;
      pdf.setFontSize(10);
      pdf.text(`Name: ${order.clientName}`, margin, yPos); yPos += 6;
      if (order.clientPhone) pdf.text(`Phone: ${order.clientPhone}`, margin, yPos), yPos += 6;
      if (order.clientEmail) pdf.text(`Email: ${order.clientEmail}`, margin, yPos), yPos += 10;

      // Notes
      if (order.notes) {
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Notes', margin, yPos); yPos += 8;
        pdf.setFontSize(10);
        yPos = addText(order.notes, margin, yPos, pageWidth - 2 * margin);
        yPos += 5;
      }

      // Items Table
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Order Items', margin, yPos); yPos += 8;
      pdf.setFillColor(240, 240, 240);
      pdf.rect(margin, yPos - 5, pageWidth - 2 * margin, 8, 'F');
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Item', margin + 2, yPos);
      pdf.text('Qty', pageWidth - margin - 55, yPos);
      pdf.text('Price', pageWidth - margin - 30, yPos);
      yPos += 8;
      pdf.setFont('helvetica', 'normal');

      order.items.forEach((item, i) => {
        if (yPos > 270) { pdf.addPage(); yPos = margin; }
        const name = item.menuItem.name;
        const price = item.menuItem.discount
          ? `${formatRWF(item.unitPrice)} (was ${formatRWF(item.menuItem.sellingPrice)})`
          : formatRWF(item.unitPrice);
        pdf.text(name.substring(0, 45), margin + 2, yPos);
        pdf.text(item.quantity.toString(), pageWidth - margin - 55, yPos);
        pdf.text(price, pageWidth - margin - 30, yPos);
        yPos += 7;
        if (i < order.items.length - 1) {
          pdf.setDrawColor(220, 220, 220);
          pdf.line(margin, yPos - 2, pageWidth - margin, yPos - 2);
        }
      });

      yPos += 5;
      pdf.setDrawColor(0);
      pdf.setLineWidth(0.5);
      pdf.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 8;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('TOTAL:', pageWidth - margin - 60, yPos);
      pdf.text(formatRWF(order.totalAmount), pageWidth - margin - 30, yPos, { align: 'right' });

      // Footer
      yPos = 280;
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      pdf.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, yPos, { align: 'center' });
      pdf.text('Thank you for your order!', pageWidth / 2, yPos + 5, { align: 'center' });

      pdf.save(`Order_${order.orderNumber}.pdf`);
      showToast('success', 'Receipt downloaded!');
    } catch (err) {
      showToast('error', 'Failed to generate PDF');
    } finally {
      setGeneratingPDF(false);
    }
  };

  // Receipt Modal Component
  const ReceiptModal = ({ isOpen, onClose, items, type, total }: {
  isOpen: boolean;
  onClose: () => void;
  items: OrderItem[];
  type: 'food' | 'drinks';
  total: number;
}) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto receipt-print-container">

        {/* Header with Close button (hidden on print) */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-gray-700" />
            <h2 className="text-xl font-bold text-gray-800">
              {type === 'food' ? 'Food' : 'Drinks'} Receipt
            </h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition print:hidden">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Receipt Content – this is what gets printed */}
        <div className="p-6 pt-8">
          <div className="text-center mb-6 pb-4 border-b border-dashed border-gray-400">
            <h3 className="font-bold text-lg">{company?.name || 'Your Restaurant'}</h3>
            <p className="text-sm text-gray-600">Official Receipt</p>
            <div className="mt-3 text-sm">
              <p><span className="font-semibold">Order #:</span> {order.orderNumber}</p>
              <p><span className="font-semibold">Date:</span> {new Date(order.createdAt).toLocaleDateString('en-GB')}</p>
              <p><span className="font-semibold">Time:</span> {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
            </div>
          </div>

          <div className="mb-6 pb-4 border-b border-dashed border-gray-400">
            <p className="font-semibold text-sm mb-2">Customer</p>
            <p className="text-sm">{order.clientName}</p>
            {order.clientPhone && <p className="text-sm text-gray-600">{order.clientPhone}</p>}
          </div>

          <table className="w-full text-sm mb-6">
            <thead>
              <tr className="border-b border-gray-400">
                <th className="text-left py-2 font-semibold">Item</th>
                <th className="text-center py-2 font-semibold">Qty</th>
                <th className="text-right py-2 font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-gray-200">
                  <td className="py-2">
                    <p className="font-medium">{item.menuItem.name}</p>
                    {item.menuItem.description && (
                      <div className="text-xs text-gray-500" dangerouslySetInnerHTML={{__html: item.menuItem.description}}></div>
                    )}
                  </td>
                  <td className="text-center py-2">{item.quantity}</td>
                  <td className="text-right py-2 font-medium">{formatRWF(item.totalPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="border-t-2 border-double border-gray-800 pt-4 text-right">
            <div className="text-xl font-bold">
              {type === 'food' ? 'FOOD' : 'DRINKS'} TOTAL: {formatRWF(total)}
            </div>
          </div>

          <div className="text-center mt-8 text-xs text-gray-600">
            <p>*** Thank you for your order! ***</p>
            <p>Come again!</p>
          </div>
        </div>

        {/* Action Buttons – hidden when printing */}
        <div className="border-t px-6 py-4 bg-gray-50 flex gap-3 print:hidden">
          <button
            onClick={() => window.print()}
            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-lg font-semibold transition shadow-md"
          >
            Print Receipt
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-lg font-medium transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading order...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700 text-sm">
          {error || 'Order not found'}
        </div>
      </div>
    );
  }

  const status = getStatusInfo(order.status);

  // Separate items by type
  const foodItems = order.items.filter(item => item.menuItem.purpose === 'EATING');
  const drinkItems = order.items.filter(item => item.menuItem.purpose === 'DRINKING');

  // Calculate totals
  const foodTotal = foodItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const drinkTotal = drinkItems.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6 text-sm">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Status Banner */}
          <div className={`${status.bg} rounded-lg p-6 border-2 ${status.color.split(' ')[2]}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${status.color}`}>
                  {status.icon}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{status.message}</h1>
                  <p className="text-gray-600 mt-1">Placed on {formatDate(order.createdAt)}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleDownloadPDF}
                  disabled={generatingPDF}
                  className="p-2 bg-white rounded-lg hover:bg-gray-50 border border-gray-200 disabled:opacity-50"
                  title="Download Full Receipt"
                >
                  {generatingPDF ? (
                    <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Download className="w-5 h-5 text-gray-700" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Receipt Buttons */}

           {order.status !== 'PENDING' && (
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">View Receipts by Category</h3>
            <div className="flex gap-4">
              <button
                onClick={() => setShowFoodReceipt(true)}
                disabled={foodItems.length === 0}
                className={`py-3 px-6 rounded-lg font-semibold transition flex items-center gap-2 ${
                  foodItems.length === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-orange-600 text-white hover:bg-orange-700 shadow-md hover:shadow-lg'
                }`}
              >
                <Receipt className="w-5 h-5" />
                Food Receipt ({foodItems.length} items)
              </button>
              <button
                onClick={() => setShowDrinkReceipt(true)}
                disabled={drinkItems.length === 0}
                className={`py-3 px-6 rounded-lg font-semibold transition flex items-center gap-2 ${
                  drinkItems.length === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-primary-600 text-white hover:bg-primary-700 shadow-md hover:shadow-lg'
                }`}
              >
                <Receipt className="w-5 h-5" />
                Drinks Receipt ({drinkItems.length} items)
              </button>
            </div>
          </div>

              )}

          {/* Action Buttons */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Order Status</h3>
            <div className="flex flex-wrap gap-3">
              {order.status === 'PENDING' && (
                <>
                  <button
                    onClick={() => updateOrderStatus('PROCESSING')}
                    disabled={updatingStatus}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
                  >
                    {updatingStatus ? <RefreshCw className="w-4 h-4 animate-spin" /> : <PlayCircle className="w-4 h-4" />}
                    <span>Approve & Start Processing</span>
                  </button>
                  <button
                    onClick={() => updateOrderStatus('CANCELLED')}
                    disabled={updatingStatus}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                  >
                    {updatingStatus ? <RefreshCw className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                    <span>Cancel Order</span>
                  </button>
                </>
              )}
              {order.status === 'PROCESSING' && (
                <button
                  onClick={() => updateOrderStatus('COMPLETED')}
                  disabled={updatingStatus}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  {updatingStatus ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>Mark as Completed</span>
                </button>
              )}
              {(order.status === 'COMPLETED' || order.status === 'CANCELLED') && (
                <div className="flex items-center text-gray-500 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  <span>No further actions available</span>
                </div>
              )}
            </div>
          </div>

          {/* Order Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
                <p className="text-gray-500">ID: {order.id}</p>
              </div>
              <div className={`px-4 py-2 rounded-full border flex items-center gap-2 ${status.color}`}>
                {status.icon}
                <span className="font-semibold">{order.status}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Order Date</p>
                  <p className="font-medium">{formatDate(order.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Last Updated</p>
                  <p className="font-medium">{formatDate(order.updatedAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Total Amount</p>
                  <p className="font-medium text-lg">{formatRWF(order.totalAmount)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Client Info */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Customer Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="font-medium">{order.clientName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="font-medium">{order.clientPhone || '—'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium">{order.clientEmail || '—'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Customer Notes
              </h2>
              <p className="text-gray-700 italic">"{order.notes}"</p>
            </div>
          )}

          {/* Order Items Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Order Items ({order.items.length})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Qty</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Discount</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {order.items.map((item) => {
                    const discount = item.menuItem.discount || 0;
                    const original = item.menuItem.sellingPrice;
                    const discounted = item.unitPrice;
                    const subtotal = item.totalPrice;

                    return (
                      <tr key={item.id} className="hover:bg-gray-25">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {item.menuItem.image ? (
                              <img src={item.menuItem.image} alt={item.menuItem.name} className="w-12 h-12 rounded-lg object-cover" />
                            ) : (
                              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                <Package className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-gray-900">{item.menuItem.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right font-medium">{item.quantity}</td>
                        <td className="px-6 py-4 text-right">
                          {discount > 0 ? (
                            <div>
                              <p className="text-sm font-medium text-orange-600">{formatRWF(discounted)}</p>
                              <p className="text-xs text-gray-500 line-through">{formatRWF(original)}</p>
                            </div>
                          ) : (
                            <p className="font-medium">{formatRWF(discounted)}</p>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {discount > 0 ? (
                            <div className="flex items-center justify-end gap-1">
                              <Percent className="w-3 h-3 text-orange-600" />
                              <span className="text-sm font-medium text-orange-600">{discount}%</span>
                            </div>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-gray-900">
                          {formatRWF(subtotal)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-gray-50 font-bold">
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-right text-gray-900">TOTAL</td>
                    <td className="px-6 py-4 text-right text-lg text-gray-900">
                      {formatRWF(order.totalAmount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Toast */}
          {operationStatus && (
            <div className="fixed top-4 right-4 z-50">
              <div className={`flex items-center space-x-2 px-3 py-2 rounded shadow-lg text-sm ${
                operationStatus.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' :
                operationStatus.type === 'error' ? 'bg-red-50 border border-red-200 text-red-800' :
                'bg-primary-50 border border-primary-200 text-primary-800'
              }`}>
                <AlertCircle className="w-4 h-4" />
                <span className="font-medium">{operationStatus.message}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ReceiptModal isOpen={showFoodReceipt} onClose={() => setShowFoodReceipt(false)} items={foodItems} type="food" total={foodTotal} />
      <ReceiptModal isOpen={showDrinkReceipt} onClose={() => setShowDrinkReceipt(false)} items={drinkItems} type="drinks" total={drinkTotal} />
    </>
  );
}