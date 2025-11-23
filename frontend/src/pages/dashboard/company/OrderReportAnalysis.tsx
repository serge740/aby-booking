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

const OrderReportAnalysis = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'7' | '30' | '90' | '365'>('30');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

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
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(dateRange));

      const dateMatch = orderDate >= daysAgo;
      const statusMatch = statusFilter === 'ALL' || order.status === statusFilter;

      return dateMatch && statusMatch;
    });
  }, [orders, dateRange, statusFilter]);

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
    const uniqueClients = new Set(filteredOrders.map(o => o.clientName)).size;

    const statusCounts = filteredOrders.reduce((acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    }, {} as Record<OrderStatus, number>);

    // Calculate growth
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

  // Chart Data
  const revenueByDay = useMemo(() => {
    const map = new Map<string, { date: string; revenue: number; orders: number }>();
    filteredOrders.forEach(order => {
      const dateKey = new Date(order.createdAt).toLocaleDateString('en-CA');
      const existing = map.get(dateKey) || { date: dateKey, revenue: 0, orders: 0 };
      existing.revenue += order.totalAmount;
      existing.orders += 1;
      map.set(dateKey, existing);
    });
    return Array.from(map.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(d => ({ 
        ...d, 
        displayDate: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      }));
  }, [filteredOrders]);

  const statusData = Object.entries(metrics.statusCounts).map(([status, count]) => ({
    name: status,
    value: count
  }));

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
      .slice(0, 5);
  }, [filteredOrders]);

  const hourlyData = useMemo(() => {
    const hourMap = new Map<number, number>();
    filteredOrders.forEach(order => {
      const hour = new Date(order.createdAt).getHours();
      hourMap.set(hour, (hourMap.get(hour) || 0) + 1);
    });
    return Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}:00`,
      orders: hourMap.get(i) || 0
    }));
  }, [filteredOrders]);

  const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444'];
  const GRADIENT_COLORS = ['#8b5cf6', '#ec4899', '#f59e0b'];

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-3 text-sm text-gray-600">Loading analytics...</p>
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

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* Revenue Trend */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-4">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" />
              Revenue Trend
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={revenueByDay}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="displayDate" tick={{ fontSize: 10 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 10 }} stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ fontSize: '12px', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                  formatter={(value) => formatCurrency(Number(value))} 
                />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Order Status */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-4">
            <h3 className="text-sm font-semibold mb-3">Order Status</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {statusData.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Orders Per Day */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-4">
            <h3 className="text-sm font-semibold mb-3">Daily Orders</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={revenueByDay}>
                <defs>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="displayDate" tick={{ fontSize: 10 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 10 }} stroke="#9ca3af" />
                <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="orders" fill="url(#colorOrders)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Clients */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-4">
            <h3 className="text-sm font-semibold mb-3">Top Clients</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topClients} layout="vertical">
                <defs>
                  <linearGradient id="colorClient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" tick={{ fontSize: 10 }} stroke="#9ca3af" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 10 }} stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ fontSize: '12px', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                  formatter={(value) => formatCurrency(Number(value))} 
                />
                <Bar dataKey="total" fill="url(#colorClient)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Hourly Distribution */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-4 lg:col-span-2">
            <h3 className="text-sm font-semibold mb-3">24-Hour Order Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={hourlyData}>
                <defs>
                  <linearGradient id="colorHourly" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="hour" tick={{ fontSize: 10 }} stroke="#9ca3af" interval={2} />
                <YAxis tick={{ fontSize: 10 }} stroke="#9ca3af" />
                <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="orders" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorHourly)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Compact Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md overflow-hidden">
          <div className="p-3 border-b border-gray-200">
            <h3 className="text-sm font-semibold">Recent Orders</h3>
          </div>
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
            <div className="px-3 py-2 border-t flex items-center justify-between text-xs text-gray-700">
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
      </div>
    </div>
  );
};

export default OrderReportAnalysis;