/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect } from "react";
import {
  Search,
  ChevronDown,
  Eye,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  ShoppingCart,
  RefreshCw,
  Filter,
  Grid3X3,
  List,
  Download,
  Store,
  FileText,
  Percent,
  Clock,
  Check,
} from "lucide-react";
import jsPDF from 'jspdf';
import orderService from "../../../services/orderService";
import { useCompanyAuth } from "../../../context/CompanyAuthContext";
import { useNavigate } from "react-router-dom";

type ViewMode = "table" | "grid" | "list";
interface OperationStatus {
  type: "success" | "error" | "info";
  message: string;
}

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
  };
}

interface Order {
  id: string;
  orderNumber: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED";
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
    maximumFractionDigits: 0,
  }).format(amount);
};

const OrderDashboard: React.FC = () => {
  const { company, isAuthenticated, isLoading: authLoading } = useCompanyAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<keyof Order>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(8);
  const [operationStatus, setOperationStatus] = useState<OperationStatus | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [generatingPDF, setGeneratingPDF] = useState<string | null>(null);

  // Redirect if not company
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !company)) {
      navigate("/company/login");
    }
  }, [authLoading, isAuthenticated, company, navigate]);

  // Load orders for current company
  useEffect(() => {
    if (company?.id) {
      loadData();
    }
  }, [company?.id]);

  useEffect(() => {
    handleFilterAndSort();
  }, [searchTerm, sortBy, sortOrder, allOrders]);

  const loadData = async () => {
    if (!company?.id) return;
    try {
      setLoading(true);
      const response = await orderService.getOrdersByCompany(company.id);
      setAllOrders(Array.isArray(response) ? response : []);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load orders");
      setAllOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const showOperationStatus = (type: OperationStatus["type"], message: string, duration: number = 3000) => {
    setOperationStatus({ type, message });
    setTimeout(() => setOperationStatus(null), duration);
  };

  const handleFilterAndSort = () => {
    let filtered = [...allOrders];
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (order) =>
          order.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.clientEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.clientPhone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (sortBy === "createdAt" || sortBy === "updatedAt") {
        const aDate = new Date(aValue).getTime();
        const bDate = new Date(bValue).getTime();
        return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
      }

      if (sortBy === "totalAmount") {
        const aNum = Number(aValue) || 0;
        const bNum = Number(bValue) || 0;
        return sortOrder === "asc" ? aNum - bNum : bNum - aNum;
      }

      const aStr = aValue ? aValue.toString().toLowerCase() : "";
      const bStr = bValue ? bValue.toString().toLowerCase() : "";
      return sortOrder === "asc" ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
    });

    setOrders(filtered);
    setCurrentPage(1);
  };

  const totalOrders = allOrders.length;
  const pendingOrders = allOrders.filter(o => o.status === "PENDING").length;
  const processingOrders = allOrders.filter(o => o.status === "PROCESSING").length;
  const completedOrders = allOrders.filter(o => o.status === "COMPLETED").length;
  const cancelledOrders = allOrders.filter(o => o.status === "CANCELLED").length;

  const handleViewOrder = (order: Order) => {
    navigate(`/company/dashboard/orders/${order.id}`);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDownloadPDF = async (order: Order) => {
    if (!order?.id) return;
    setGeneratingPDF(order.id);
    showOperationStatus('info', 'Generating PDF...');

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 15;
      let yPos = margin;

      const addText = (text: string, x: number, y: number, maxWidth: number, fontSize = 10, isBold = false) => {
        pdf.setFontSize(fontSize);
        pdf.setFont('helsinki', isBold ? 'bold' : 'normal');
        const lines = pdf.splitTextToSize(text, maxWidth);
        pdf.text(lines, x, y);
        return y + (lines.length * fontSize * 0.4);
      };

      // Header
      pdf.setFillColor(251, 146, 60);
      pdf.rect(0, 0, pageWidth, 25, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(20);
      pdf.setFont('helsinki', 'bold');
      pdf.text('ORDER RECEIPT', pageWidth / 2, 15, { align: 'center' });

      yPos = 35;
      pdf.setTextColor(0, 0, 0);

      // Order Info
      pdf.setFontSize(14);
      pdf.setFont('helsinki', 'bold');
      pdf.text('Order Information', margin, yPos);
      yPos += 8;
      pdf.setFontSize(10);
      pdf.setFont('helsinki', 'normal');
      pdf.text(`Order #: ${order.orderNumber}`, margin, yPos); yPos += 6;
      pdf.text(`Date: ${formatDate(order.createdAt)}`, margin, yPos); yPos += 6;
      pdf.text(`Status: ${order.status}`, margin, yPos); yPos += 6;
      pdf.text(`Total: ${formatRWF(order.totalAmount)}`, margin, yPos); yPos += 10;

      // Client Info
      pdf.setFontSize(14);
      pdf.setFont('helsinki', 'bold');
      pdf.text('Customer', margin, yPos);
      yPos += 8;
      pdf.setFontSize(10);
      pdf.text(`Name: ${order.clientName}`, margin, yPos); yPos += 6;
      if (order.clientPhone) { pdf.text(`Phone: ${order.clientPhone}`, margin, yPos); yPos += 6; }
      if (order.clientEmail) { pdf.text(`Email: ${order.clientEmail}`, margin, yPos); yPos += 10; }

      // Notes
      if (order.notes) {
        pdf.setFontSize(14);
        pdf.setFont('helsinki', 'bold');
        pdf.text('Notes', margin, yPos);
        yPos += 8;
        pdf.setFontSize(10);
        pdf.setFont('helsinki', 'normal');
        yPos = addText(order.notes, margin, yPos, pageWidth - 2 * margin);
        yPos += 5;
      }

      // Items Table
      pdf.setFontSize(14);
      pdf.setFont('helsinki', 'bold');
      pdf.text('Order Items', margin, yPos);
      yPos += 8;

      pdf.setFillColor(240, 240, 240);
      pdf.rect(margin, yPos - 5, pageWidth - 2 * margin, 8, 'F');
      pdf.setFontSize(9);
      pdf.setFont('helsinki', 'bold');
      pdf.text('Item', margin + 2, yPos);
      pdf.text('Qty', pageWidth - margin - 55, yPos);
      pdf.text('Price', pageWidth - margin - 30, yPos);
      yPos += 8;

      pdf.setFont('helsinki', 'normal');
      order.items.forEach((item, i) => {
        if (yPos > 270) {
          pdf.addPage();
          yPos = margin;
        }
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
      pdf.setFont('helsinki', 'bold');
      pdf.text('TOTAL:', pageWidth - margin - 60, yPos);
      pdf.text(formatRWF(order.totalAmount), pageWidth - margin - 30, yPos, { align: 'right' });

      // Footer
      yPos = 280;
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      pdf.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, yPos, { align: 'center' });
      pdf.text('Thank you for your order!', pageWidth / 2, yPos + 5, { align: 'center' });

      pdf.save(`Order_${order.orderNumber}.pdf`);
      showOperationStatus('success', 'PDF downloaded!');
    } catch (error) {
      console.error(error);
      showOperationStatus('error', 'Failed to generate PDF');
    } finally {
      setGeneratingPDF(null);
    }
  };

  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = orders.slice(startIndex, endIndex);

  const renderTableView = () => (
    <div className="bg-white rounded border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-2 px-2 text-gray-600 font-medium">#</th>
              <th className="text-left py-2 px-2 text-gray-600 font-medium cursor-pointer hover:bg-gray-100"
                onClick={() => { setSortBy("orderNumber"); setSortOrder(sortBy === "orderNumber" ? (sortOrder === "asc" ? "desc" : "asc") : "asc"); }}>
                <div className="flex items-center space-x-1">
                  <span>Order #</span>
                  <ChevronDown className={`w-3 h-3 ${sortBy === "orderNumber" ? "text-orange-600" : "text-gray-400"}`} />
                </div>
              </th>
              <th className="text-left py-2 px-2 text-gray-600 font-medium">Customer</th>
              <th className="text-left py-2 px-2 text-gray-600 font-medium hidden lg:table-cell">Items</th>
              <th className="text-left py-2 px-2 text-gray-600 font-medium cursor-pointer hover:bg-gray-100"
                onClick={() => { setSortBy("totalAmount"); setSortOrder(sortBy === "totalAmount" ? (sortOrder === "asc" ? "desc" : "asc") : "asc"); }}>
                <div className="flex items-center space-x-1">
                  <span>Total</span>
                  <ChevronDown className={`w-3 h-3 ${sortBy === "totalAmount" ? "text-orange-600" : "text-gray-400"}`} />
                </div>
              </th>
              <th className="text-left py-2 px-2 text-gray-600 font-medium cursor-pointer hover:bg-gray-100 hidden sm:table-cell"
                onClick={() => { setSortBy("status"); setSortOrder(sortBy === "status" ? (sortOrder === "asc" ? "desc" : "asc") : "asc"); }}>
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  <ChevronDown className={`w-3 h-3 ${sortBy === "status" ? "text-orange-600" : "text-gray-400"}`} />
                </div>
              </th>
              <th className="text-left py-2 px-2 text-gray-600 font-medium cursor-pointer hover:bg-gray-100 hidden md:table-cell"
                onClick={() => { setSortBy("createdAt"); setSortOrder(sortBy === "createdAt" ? (sortOrder === "asc" ? "desc" : "asc") : "desc"); }}>
                <div className="flex items-center space-x-1">
                  <span>Date</span>
                  <ChevronDown className={`w-3 h-3 ${sortBy === "createdAt" ? "text-orange-600" : "text-gray-400"}`} />
                </div>
              </th>
              <th className="text-right py-2 px-2 text-gray-600 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentOrders.map((order, index) => (
              <tr key={order.id} className="hover:bg-gray-25">
                <td className="py-2 px-2 text-gray-700">{startIndex + index + 1}</td>
                <td className="py-2 px-2 font-medium text-orange-600">{order.orderNumber}</td>
                <td className="py-2 px-2">
                  <div>
                    <div className="font-medium text-gray-900 text-xs">{order.clientName}</div>
                    <div className="text-gray-500 text-xs">{order.clientPhone || order.clientEmail || "—"}</div>
                  </div>
                </td>
                <td className="py-2 px-2 text-gray-700 hidden lg:table-cell">{order.items.length}</td>
                <td className="py-2 px-2 font-medium text-gray-900">{formatRWF(order.totalAmount)}</td>
                <td className="py-2 px-2 hidden sm:table-cell">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                    order.status === "PROCESSING" ? "bg-blue-100 text-blue-800" :
                    order.status === "COMPLETED" ? "bg-green-100 text-green-800" :
                    "bg-red-100 text-red-800"
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="py-2 px-2 text-gray-700 hidden md:table-cell">{formatDate(order.createdAt)}</td>
                <td className="py-2 px-2 text-right">
                  <div className="flex items-center justify-end space-x-1">
                    <button onClick={() => handleViewOrder(order)} className="text-gray-400 hover:text-green-600 p-1" title="View">
                      <Eye className="w-3 h-3" />
                    </button>
                    <button onClick={() => handleDownloadPDF(order)} disabled={generatingPDF === order.id} className="text-gray-400 hover:text-blue-600 p-1 disabled:opacity-50" title="PDF">
                      {generatingPDF === order.id ? <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div> : <Download className="w-3 h-3" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {currentOrders.map((order) => (
        <div key={order.id} className="bg-white rounded border border-gray-200 p-3 hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-orange-600 text-xs">{order.orderNumber}</span>
            <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
              order.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
              order.status === "PROCESSING" ? "bg-blue-100 text-blue-800" :
              order.status === "COMPLETED" ? "bg-green-100 text-green-800" :
              "bg-red-100 text-red-800"
            }`}>{order.status}</span>
          </div>
          <div className="mb-3">
            <div className="font-medium text-gray-900 text-xs">{order.clientName}</div>
            <div className="text-gray-500 text-xs">{order.clientPhone || order.clientEmail || "—"}</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="font-semibold text-orange-600 text-sm">{formatRWF(order.totalAmount)}</div>
            <div className="text-xs text-gray-500">{order.items.length} items</div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-2">
            <button onClick={() => handleViewOrder(order)} className="text-gray-400 hover:text-green-600 p-1" title="View">
              <Eye className="w-3 h-3" />
            </button>
            <button onClick={() => handleDownloadPDF(order)} disabled={generatingPDF === order.id} className="text-gray-400 hover:text-blue-600 p-1 disabled:opacity-50" title="PDF">
              {generatingPDF === order.id ? <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div> : <Download className="w-3 h-3" />}
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="bg-white rounded border border-gray-200 divide-y divide-gray-100">
      {currentOrders.map((order) => (
        <div key={order.id} className="px-4 py-3 hover:bg-gray-25">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                <ShoppingCart className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-orange-600 text-sm">{order.orderNumber}</span>
                  <span className="text-gray-400 text-xs">• {order.items.length} items</span>
                </div>
                <div className="font-medium text-gray-900 text-sm truncate">{order.clientName}</div>
                <div className="text-gray-500 text-xs">{order.clientPhone || order.clientEmail || "—"}</div>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4 text-xs text-gray-600">
              <span className={`px-2 py-1 rounded-full font-medium ${
                order.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                order.status === "PROCESSING" ? "bg-blue-100 text-blue-800" :
                order.status === "COMPLETED" ? "bg-green-100 text-green-800" :
                "bg-red-100 text-red-800"
              }`}>{order.status}</span>
              <span className="font-semibold">{formatRWF(order.totalAmount)}</span>
              <span>{formatDate(order.createdAt)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <button onClick={() => handleViewOrder(order)} className="text-gray-400 hover:text-green-600 p-1.5 rounded-full hover:bg-green-50" title="View">
                <Eye className="w-4 h-4" />
              </button>
              <button onClick={() => handleDownloadPDF(order)} disabled={generatingPDF === order.id} className="text-gray-400 hover:text-blue-600 p-1.5 rounded-full hover:bg-blue-50 disabled:opacity-50" title="PDF">
                {generatingPDF === order.id ? <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div> : <Download className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderPagination = () => {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    return (
      <div className="flex items-center justify-between bg-white px-3 py-2 border-t border-gray-200">
        <div className="text-xs text-gray-600">
          Showing {startIndex + 1}-{Math.min(endIndex, orders.length)} of {orders.length}
        </div>
        <div className="flex items-center space-x-1">
          <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}
            className="px-2 py-1 text-xs text-gray-500 bg-white border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50">
            <ChevronLeft className="w-3 h-3" />
          </button>
          {pages.map(p => (
            <button key={p} onClick={() => setCurrentPage(p)}
              className={`px-2 py-1 text-xs rounded ${currentPage === p ? "bg-orange-500 text-white" : "text-gray-700 bg-white border border-gray-200 hover:bg-gray-50"}`}>
              {p}
            </button>
          ))}
          <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}
            className="px-2 py-1 text-xs text-gray-500 bg-white border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50">
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-xs">
      <div className="bg-white shadow-md">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Order Management</h1>
                <p className="text-xs text-gray-500 mt-0.5">Manage your restaurant orders</p>
              </div>
            </div>
            <button onClick={loadData} disabled={loading}
              className="flex items-center space-x-1 px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50">
              <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="bg-white rounded shadow p-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-orange-100 rounded-full">
                <ShoppingCart className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Total</p>
                <p className="text-lg font-semibold text-gray-900">{totalOrders}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded shadow p-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Pending</p>
                <p className="text-lg font-semibold text-gray-900">{pendingOrders}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded shadow p-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-full">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Processing</p>
                <p className="text-lg font-semibold text-gray-900">{processingOrders}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded shadow p-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-full">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Completed</p>
                <p className="text-lg font-semibold text-gray-900">{completedOrders}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded shadow p-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Cancelled</p>
                <p className="text-lg font-semibold text-gray-900">{cancelledOrders}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded border border-gray-200 p-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="w-3 h-3 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by name, phone, order #..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-48 pl-7 pr-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split("-") as [keyof Order, "asc" | "desc"];
                  setSortBy(field);
                  setSortOrder(order);
                }}
                className="text-xs border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-orange-500"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="totalAmount-desc">Highest Amount</option>
                <option value="totalAmount-asc">Lowest Amount</option>
                <option value="status-asc">Status (A-Z)</option>
                <option value="status-desc">Status (Z-A)</option>
              </select>
              <div className="flex items-center border border-gray-200 rounded">
                <button onClick={() => setViewMode("table")} className={`p-1.5 ${viewMode === "table" ? "bg-orange-50 text-orange-600" : "text-gray-400 hover:text-gray-600"}`} title="Table">
                  <List className="w-3 h-3" />
                </button>
                <button onClick={() => setViewMode("grid")} className={`p-1.5 ${viewMode === "grid" ? "bg-orange-50 text-orange-600" : "text-gray-400 hover:text-gray-600"}`} title="Grid">
                  <Grid3X3 className="w-3 h-3" />
                </button>
                <button onClick={() => setViewMode("list")} className={`p-1.5 ${viewMode === "list" ? "bg-orange-50 text-orange-600" : "text-gray-400 hover:text-gray-600"}`} title="List">
                  <Store className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {error && <div className="bg-red-50 border border-red-200 rounded p-3 text-red-700 text-xs">{error}</div>}

        {currentOrders.length === 0 ? (
          <div className="bg-white rounded border border-gray-200 p-8 text-center text-gray-500 text-xs">
            {searchTerm ? "No orders match your search" : "No orders yet"}
          </div>
        ) : (
          <div>
            {viewMode === "table" && renderTableView()}
            {viewMode === "grid" && renderGridView()}
            {viewMode === "list" && renderListView()}
            {renderPagination()}
          </div>
        )}

        {operationStatus && (
          <div className="fixed top-4 right-4 z-50">
            <div className={`flex items-center space-x-2 px-3 py-2 rounded shadow-lg text-xs ${
              operationStatus.type === "success" ? "bg-green-50 border border-green-200 text-green-800" :
              operationStatus.type === "error" ? "bg-red-50 border border-red-200 text-red-800" :
              "bg-blue-50 border border-blue-200 text-blue-800"
            }`}>
              <AlertCircle className="w-4 h-4" />
              <span className="font-medium">{operationStatus.message}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDashboard;