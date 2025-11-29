import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import {
  TrendingUp, ShoppingCart, DollarSign, Users, Calendar, Filter,
  ChevronLeft, ChevronRight, Package, ArrowUp, ArrowDown, Activity
} from 'lucide-react';
import orderService from '../../../services/orderService';
import { useSocketEvent } from '../../../context/SocketContext';
import { useCompanyAuth } from '../../../context/CompanyAuthContext';

// Types based on your Prisma schema
type OrderStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';

type Order = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: number;
  clientName: string;
  clientPhone?: string;
  clientEmail?: string;
  createdAt: string;
  items: {
    quantity: number;
    unitPrice: number;
    menuItem: { name: string };
  }[];
};

type TimePeriod = 'today' | 'week' | 'month' | 'year';

const OrderReportAnalysis = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'7' | '30' | '90' | '365'>('30');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [activeTab, setActiveTab] = useState<'overview' | 'clients' | 'orders'>('overview');
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('today');

  const {company} = useCompanyAuth();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (err: any) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useSocketEvent('order_created', (newOrder: Order) => {
    if (newOrder.companyId === company?.id) {
      setOrders(prev => {
        if (prev.some(o => o.id === newOrder.id)) return prev;
        return [newOrder, ...prev];
      });
    }
  }, [company?.id]);

  useSocketEvent('order_status_updated', (updatedOrder: Order) => {
    if (updatedOrder.companyId === company?.id) {
      setOrders(prev => prev.map(order =>
        order.id === updatedOrder.id ? updatedOrder : order
      ));
    }
  }, [company?.id]);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      let dateMatch = false;

      // Check if filtering by selected period
      if (selectedPeriod) {
        const now = new Date();
        switch (selectedPeriod) {
          case 'today':
            dateMatch = orderDate.toDateString() === now.toDateString();
            break;
          case 'week':
            const weekAgo = new Date(now);
            weekAgo.setDate(weekAgo.getDate() - 7);
            dateMatch = orderDate >= weekAgo;
            break;
          case 'month':
            const monthAgo = new Date(now);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            dateMatch = orderDate >= monthAgo;
            break;
          case 'year':
            const yearAgo = new Date(now);
            yearAgo.setFullYear(yearAgo.getFullYear() - 1);
            dateMatch = orderDate >= yearAgo;
            break;
        }
      } else {
        // Fallback to dateRange filter
        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - parseInt(dateRange));
        dateMatch = orderDate >= daysAgo;
      }

      const statusMatch = statusFilter === 'ALL' || order.status === statusFilter;

      return dateMatch && statusMatch;
    });
  }, [orders, dateRange, statusFilter, selectedPeriod]);

  const getOrdersByPeriod = (period: TimePeriod) => {
    const now = new Date();
    return orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      switch (period) {
        case 'today':
          return orderDate.toDateString() === now.toDateString();
        case 'week':
          const weekAgo = new Date(now);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return orderDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(now);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return orderDate >= monthAgo;
        case 'year':
          const yearAgo = new Date(now);
          yearAgo.setFullYear(yearAgo.getFullYear() - 1);
          return orderDate >= yearAgo;
      }
    });
  };

  const periodMetrics = useMemo(() => {
    const periods: TimePeriod[] = ['today', 'week', 'month', 'year'];
    return periods.map(period => {
      const periodOrders = getOrdersByPeriod(period);
      const total = periodOrders.length;
      const revenue = periodOrders.reduce((sum, o) => sum + o.totalAmount, 0);
      return { period, total, revenue };
    });
  }, [orders]);

  useEffect(() => {
    setCurrentPage(1);
  }, [dateRange, statusFilter]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const metrics = useMemo(() => {
    const total = filteredOrders.length;
    const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const avgOrderValue = total > 0 ? totalRevenue / total : 0;
    const uniqueClients = new Set(
      filteredOrders.map(o => o.clientPhone || o.clientEmail || o.clientName)
    ).size;

    const statusCounts = filteredOrders.reduce((acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    }, {} as Record<OrderStatus, number>);

    const halfwayPoint = Math.floor(filteredOrders.length / 2);
    const recentHalf = filteredOrders.slice(0, halfwayPoint);
    const olderHalf = filteredOrders.slice(halfwayPoint);
    
    const recentRevenue = recentHalf.reduce((sum, o) => sum + o.totalAmount, 0);
    const olderRevenue = olderHalf.reduce((sum, o) => sum + o.totalAmount, 0);
    const revenueGrowth = olderRevenue > 0 ? ((recentRevenue - olderRevenue) / olderRevenue) * 100 : 0;

    const recentOrders = recentHalf.length;
    const olderOrders = olderHalf.length;
    const orderGrowth = olderOrders > 0 ? ((recentOrders - olderOrders) / olderOrders) * 100 : 0;

    return { total, totalRevenue, avgOrderValue, uniqueClients, statusCounts, revenueGrowth, orderGrowth };
  }, [filteredOrders]);

  const topClients = useMemo(() => {
    const clientMap = new Map<string, { name: string; total: number; orders: number }>();
    filteredOrders.forEach(order => {
      const current = clientMap.get(order.clientName) || { name: order.clientName, total: 0, orders: 0 };
      current.total += order.totalAmount;
      current.orders += 1;
      clientMap.set(order.clientName, current);
    });
    return Array.from(clientMap.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);
  }, [filteredOrders]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF', minimumFractionDigits: 0 }).format(amount);
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSING': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
    }
  };

  const getPeriodLabel = (period: TimePeriod) => {
    switch (period) {
      case 'today': return 'Today';
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      case 'year': return 'This Year';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-3 text-xs text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-4">
      <div className="mx-auto">
        {/* Compact Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Order Analytics</h1>
          <p className="text-xs text-gray-600">Real-time performance insights</p>
        </div>

        {/* Period Selection Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {periodMetrics.map(({ period, total, revenue }) => (
            <div
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`cursor-pointer rounded-lg shadow-sm p-3 transition-all ${
                selectedPeriod === period
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                  : 'bg-white/80 backdrop-blur-sm hover:shadow-md'
              }`}
            >
              <p className={`text-xs mb-1 ${selectedPeriod === period ? 'text-white opacity-90' : 'text-gray-600'}`}>
                {getPeriodLabel(period)}
              </p>
              <p className={`text-2xl font-bold mb-0.5 ${selectedPeriod === period ? 'text-white' : 'text-gray-900'}`}>
                {total}
              </p>
              <p className={`text-xs ${selectedPeriod === period ? 'text-white opacity-80' : 'text-gray-500'}`}>
                {formatCurrency(revenue)}
              </p>
            </div>
          ))}
        </div>

        {/* Compact Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm p-3 mb-4 flex flex-wrap gap-2 items-center">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="text-xs border border-gray-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="7">7 days</option>
              <option value="30">30 days</option>
              <option value="90">90 days</option>
              <option value="365">1 year</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="text-xs border border-gray-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Compact Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md p-3 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-1">
                <ShoppingCart className="w-5 h-5 opacity-80" />
                <div className={`flex items-center gap-1 text-xs ${metrics.orderGrowth >= 0 ? 'text-green-200' : 'text-red-200'}`}>
                  {metrics.orderGrowth >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                  <span>{Math.abs(metrics.orderGrowth).toFixed(1)}%</span>
                </div>
              </div>
              <p className="text-xs opacity-90 mb-1">Total Orders</p>
              <p className="text-2xl font-bold">{metrics.total}</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md p-3 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-1">
                <DollarSign className="w-5 h-5 opacity-80" />
                <div className={`flex items-center gap-1 text-xs ${metrics.revenueGrowth >= 0 ? 'text-green-200' : 'text-red-200'}`}>
                  {metrics.revenueGrowth >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                  <span>{Math.abs(metrics.revenueGrowth).toFixed(1)}%</span>
                </div>
              </div>
              <p className="text-xs opacity-90 mb-1">Revenue</p>
              <p className="text-lg font-bold">{formatCurrency(metrics.totalRevenue)}</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-md p-3 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <div className="relative">
              <TrendingUp className="w-5 h-5 opacity-80 mb-1" />
              <p className="text-xs opacity-90 mb-1">Avg Order</p>
              <p className="text-lg font-bold">{formatCurrency(metrics.avgOrderValue)}</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-md p-3 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <div className="relative">
              <Users className="w-5 h-5 opacity-80 mb-1" />
              <p className="text-xs opacity-90 mb-1">Clients</p>
              <p className="text-2xl font-bold">{metrics.uniqueClients}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm mb-4">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('clients')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'clients'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Top Clients
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'orders'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Recent Orders
            </button>
          </div>

          <div className="p-4">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <h3 className="text-sm font-semibold mb-3">Order Status Breakdown</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(metrics.statusCounts).map(([status, count]) => (
                    <div key={status} className="bg-gray-50 rounded-lg p-3 text-center">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 ${getStatusColor(status as OrderStatus)}`}>
                        {status}
                      </span>
                      <p className="text-2xl font-bold text-gray-900">{count}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        {metrics.total > 0 ? ((count / metrics.total) * 100).toFixed(1) : 0}% of total
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top Clients Tab */}
            {activeTab === 'clients' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Rank</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Client Name</th>
                      <th className="px-4 py-2 text-right text-xs font-semibold text-gray-700">Orders</th>
                      <th className="px-4 py-2 text-right text-xs font-semibold text-gray-700">Total Spent</th>
                      <th className="px-4 py-2 text-right text-xs font-semibold text-gray-700">Avg Order</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {topClients.map((client, index) => (
                      <tr key={client.phone || client.email || client.name} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-semibold text-xs">
                            {index + 1}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-xs font-medium text-gray-900">{client.name}</div>
                          <div className="text-xs text-gray-500">{client.phone || client.email || '-'}</div>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-700 text-right">{client.orders}</td>
                        <td className="px-4 py-3 text-xs font-semibold text-gray-900 text-right">{formatCurrency(client.total)}</td>
                        <td className="px-4 py-3 text-xs text-gray-700 text-right">{formatCurrency(client.total / client.orders)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Recent Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {currentOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50 transition">
                          <td className="px-3 py-2 text-xs font-medium text-gray-900">{order.orderNumber}</td>
                          <td className="px-3 py-2 text-xs text-gray-700">{order.clientName}</td>
                          <td className="px-3 py-2 text-xs text-gray-600">{order.items.length} item{order.items.length > 1 ? 's' : ''}</td>
                          <td className="px-3 py-2">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-xs font-medium text-gray-900">{formatCurrency(order.totalAmount)}</td>
                          <td className="px-3 py-2 text-xs text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <div className="px-3 py-2 mt-3 border-t flex items-center justify-between text-xs text-gray-700">
                    <div>
                      {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length}
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-2 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        <ChevronLeft className="w-3 h-3" />
                      </button>
                      <span className="px-2 py-1 text-xs">
                        {currentPage}/{totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-2 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderReportAnalysis;