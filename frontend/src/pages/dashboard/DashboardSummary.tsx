import React, { useState, useEffect, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  TrendingUp, ShoppingCart, DollarSign, Users, Package,
  UserCheck, AlertTriangle, Calendar, Clock, ChevronRight, Briefcase
} from 'lucide-react';
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

// Services
import orderService from '../../services/orderService';
import employeeService from '../../services/employeeService';
import stockService from '../../services/stockService';
import preSalaryService from '../../services/preSalaryService';
import riskReportService from '../../services/riskReportService';
import leaveService from '../../services/leaveService';
import { useEmployeeAuth } from '../../context/EmployeeAuthContext';

// Types
type Role = 'company' | 'employee';

interface DashboardContext {
  role: Role;
}

const DashboardSummary = () => {
  const { role } = useOutletContext<DashboardContext>();
  const { user } = useEmployeeAuth();
  const employeeId = user?.id || '';

  const [loading, setLoading] = useState(true);

  // Data states
  const [orders, setOrders] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [stocks, setStocks] = useState<any[]>([]);
  const [leaves, setLeaves] = useState<any[]>([]);
  const [preSalaries, setPreSalaries] = useState<any[]>([]);
  const [riskReports, setRiskReports] = useState<any[]>([]);

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [
          ordersRes,
          employeesRes,
          stocksRes,
          leavesRes,
          preSalariesRes,
          riskReportsRes
        ] = await Promise.all([
          orderService.getAllOrders(),
          role === 'company' ? employeeService.getAllEmployees() : [],
          stockService.getAllStock(),
          leaveService.getAllLeaves?.() || [],
          preSalaryService.getAllPreSalaries(),
          riskReportService.getAllRiskReports()
        ]);

        // For company role: show everything
        // For employee role: filter by employeeId
        if (role === 'company') {
          setOrders(ordersRes);
          setEmployees(employeesRes);
          setStocks(stocksRes);
          setLeaves(leavesRes);
          setPreSalaries(preSalariesRes);
          setRiskReports(riskReportsRes);
        } else {
          setOrders(ordersRes.filter((o: any) => o.employeeId === employeeId));
          setEmployees([]);
          setStocks(stocksRes);
          setLeaves(leavesRes.filter((l: any) => l.employeeId === employeeId));
          setPreSalaries(preSalariesRes.filter((p: any) => p.employeeId === employeeId));
          setRiskReports(riskReportsRes.filter((r: any) => r.employeeId === employeeId));
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [role, employeeId]);

  // Compute stats
  const stats = useMemo(() => {
    const completedOrders = orders.filter(o => o.status === 'COMPLETED');
    const totalRevenue = completedOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    const activeEmployees = employees.filter(e => e.status === 'ACTIVE').length;
    const lowStockItems = stocks.filter(s => s.quantity < 20).length;

    const pendingLeaves = leaves.filter(l => l.status === 'PENDING').length;
    const approvedLeaves = leaves.filter(l => l.status === 'APPROVED').length;
    const rejectedLeaves = leaves.filter(l => l.status === 'REJECTED').length;

    const pendingSalaries = preSalaries.filter(p => p.status === 'PENDING').length;
    const approvedSalaries = preSalaries.filter(p => p.status === 'APPROVED').length;
    const totalSalaryAmount = preSalaries
      .filter(p => p.status === 'APPROVED')
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    const pendingRisks = riskReports.filter(r => r.status === 'PENDING').length;
    const resolvedRisks = riskReports.filter(r => r.status === 'RESOLVED').length;
    const criticalRisks = riskReports.filter(r => r.severity === 'CRITICAL' && r.status === 'PENDING').length;
    const highRisks = riskReports.filter(r => r.severity === 'HIGH' && r.status === 'PENDING').length;

    return {
      totalOrders: orders.length,
      completedOrders: completedOrders.length,
      pendingOrders: orders.filter(o => o.status === 'PENDING').length,
      processingOrders: orders.filter(o => o.status === 'PROCESSING').length,
      totalRevenue,
      activeEmployees,
      totalEmployees: employees.length,
      inactiveEmployees: employees.filter(e => e.status !== 'ACTIVE').length,
      totalStock: stocks.length,
      lowStockItems,
      outOfStockItems: stocks.filter(s => s.quantity === 0).length,
      pendingLeaves,
      approvedLeaves,
      rejectedLeaves,
      totalLeaves: leaves.length,
      pendingSalaries,
      approvedSalaries,
      totalSalaries: preSalaries.length,
      totalSalaryAmount,
      pendingRisks,
      resolvedRisks,
      criticalRisks,
      highRisks,
      totalRisks: riskReports.length,
    };
  }, [orders, employees, stocks, leaves, preSalaries, riskReports]);

  // Chart: Last 7 Days Trend
  const orderTrend = useMemo(() => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      const dayOrders = orders.filter(o => {
        return new Date(o.createdAt).toDateString() === date.toDateString();
      });

      last7Days.push({
        date: dateStr,
        orders: dayOrders.length,
        revenue: dayOrders
          .filter((o: any) => o.status === 'COMPLETED')
          .reduce((sum: number, o: any) => sum + o.totalAmount, 0),
      });
    }
    return last7Days;
  }, [orders]);

  // Pie Chart: Order Status
  const orderStatusData = useMemo(() => {
    const counts = orders.reduce((acc: any, o: any) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).map(([status, count]) => ({
      name: status,
      value: count as number
    }));
  }, [orders]);

  // Risk Severity Distribution
  const riskSeverityData = useMemo(() => {
    const counts = riskReports.reduce((acc: any, r: any) => {
      acc[r.severity] = (acc[r.severity] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).map(([severity, count]) => ({
      name: severity,
      value: count as number
    }));
  }, [riskReports]);

  const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6', '#ec4899'];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {role === 'company' ? 'Company Dashboard' : 'My Dashboard'}
          </h1>
          <p className="text-gray-600">
            {role === 'company'
              ? 'Complete business insights and analytics across all operations'
              : 'Your personal performance dashboard'}
          </p>
        </div>

        {/* Main Stats - Company Role (Show Everything) */}
        {role === 'company' ? (
          <>
            {/* Orders & Revenue Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <StatCard
                title="Total Orders"
                value={stats.totalOrders}
                icon={<ShoppingCart className="w-6 h-6 text-primary-500" />}
                subtitle={`${stats.completedOrders} completed • ${stats.pendingOrders} pending • ${stats.processingOrders} processing`}
              />
              <StatCard
                title="Total Revenue"
                value={formatCurrency(stats.totalRevenue)}
                icon={<DollarSign className="w-6 h-6 text-green-500" />}
                subtitle="From completed orders"
              />
              <StatCard
                title="Active Employees"
                value={stats.activeEmployees}
                icon={<Users className="w-6 h-6 text-purple-500" />}
                subtitle={`${stats.totalEmployees} total • ${stats.inactiveEmployees} inactive`}
              />
              <StatCard
                title="Stock Items"
                value={stats.totalStock}
                icon={<Package className="w-6 h-6 text-indigo-500" />}
                subtitle={
                  <span>
                    <span className="text-red-600">{stats.lowStockItems} low</span>
                    {' • '}
                    <span className="text-red-800">{stats.outOfStockItems} out</span>
                  </span>
                }
              />
            </div>

            {/* Leave & Salary Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <StatCard
                title="Leave Requests"
                value={stats.totalLeaves}
                icon={<Calendar className="w-6 h-6 text-teal-500" />}
                subtitle={`${stats.pendingLeaves} pending • ${stats.approvedLeaves} approved • ${stats.rejectedLeaves} rejected`}
              />
              <StatCard
                title="Salary Requests"
                value={stats.totalSalaries}
                icon={<Briefcase className="w-6 h-6 text-cyan-500" />}
                subtitle={`${stats.pendingSalaries} pending • ${stats.approvedSalaries} approved`}
              />
              <StatCard
                title="Approved Salaries"
                value={formatCurrency(stats.totalSalaryAmount)}
                icon={<DollarSign className="w-6 h-6 text-emerald-500" />}
                subtitle="Total paid out"
              />
              <StatCard
                title="Risk Reports"
                value={stats.totalRisks}
                icon={<AlertTriangle className="w-6 h-6 text-red-500" />}
                subtitle={
                  <span>
                    <span className="text-red-600">{stats.criticalRisks} critical</span>
                    {' • '}
                    <span className="text-orange-600">{stats.highRisks} high</span>
                    {' • '}
                    <span className="text-green-600">{stats.resolvedRisks} resolved</span>
                  </span>
                }
              />
            </div>
          </>
        ) : (
          // Employee Role - Personal Stats
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <StatCard
                title="My Orders"
                value={stats.totalOrders}
                icon={<ShoppingCart className="w-6 h-6 text-primary-500" />}
                subtitle={`${stats.completedOrders} completed • ${stats.pendingOrders} pending`}
              />
              <StatCard
                title="Total Revenue"
                value={formatCurrency(stats.totalRevenue)}
                icon={<DollarSign className="w-6 h-6 text-green-500" />}
                subtitle="From my completed orders"
              />
              <StatCard
                title="Leave Requests"
                value={stats.totalLeaves}
                icon={<Calendar className="w-6 h-6 text-teal-500" />}
                subtitle={`${stats.pendingLeaves} pending • ${stats.approvedLeaves} approved`}
              />
              <StatCard
                title="Risk Reports"
                value={stats.totalRisks}
                icon={<AlertTriangle className="w-6 h-6 text-red-500" />}
                subtitle={
                  <span>
                    {stats.pendingRisks} pending
                    {stats.criticalRisks > 0 && (
                      <span className="text-red-600"> • {stats.criticalRisks} critical</span>
                    )}
                  </span>
                }
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Salary Requests"
                value={stats.totalSalaries}
                icon={<Briefcase className="w-6 h-6 text-cyan-500" />}
                subtitle={`${stats.pendingSalaries} pending • ${stats.approvedSalaries} approved`}
              />
              <StatCard
                title="Approved Salary"
                value={formatCurrency(stats.totalSalaryAmount)}
                icon={<DollarSign className="w-6 h-6 text-emerald-500" />}
                subtitle="Total approved amount"
              />
              <StatCard
                title="Order Performance"
                value={stats.completedOrders > 0 ? `${Math.round((stats.completedOrders / stats.totalOrders) * 100)}%` : '0%'}
                icon={<TrendingUp className="w-6 h-6 text-purple-500" />}
                subtitle="Completion rate"
              />
              <StatCard
                title="Pending Actions"
                value={stats.pendingOrders + stats.pendingLeaves + stats.pendingSalaries + stats.pendingRisks}
                icon={<Clock className="w-6 h-6 text-orange-500" />}
                subtitle="Items awaiting response"
              />
            </div>
          </>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Order Trend (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={orderTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(v) => (typeof v === 'number' ? (v > 1000 ? formatCurrency(v) : v) : v)} />
                <Area type="monotone" dataKey="orders" stroke="#3b82f6" fill="#dbeafe" name="Orders" />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="#d1fae5" name="Revenue" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">
              {role === 'company' ? 'Order Status Distribution' : 'My Order Status'}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {orderStatusData.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Additional Charts for Company Role */}
        {role === 'company' && riskSeverityData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Risk Severity Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={riskSeverityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {riskSeverityData.map((entry, i) => (
                      <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {role === 'company' ? (
            <>
              <ActivityCard
                title="Recent Leave Requests"
                data={leaves.slice(0, 5)}
                renderItem={(item: any) => (
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{item.type || 'Leave Request'}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(item.startDate || item.createdAt).toLocaleDateString()}
                        {item.employeeName && (
                          <span className="ml-2 text-primary-600">• {item.employeeName}</span>
                        )}
                      </p>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                )}
              />

              <ActivityCard
                title="Recent Risk Reports"
                data={riskReports.slice(0, 5)}
                renderItem={(item: any) => (
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                        {item.employeeName && (
                          <span className="ml-2 text-primary-600">• {item.employeeName}</span>
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <SeverityBadge severity={item.severity} />
                      <StatusBadge status={item.status} className="mt-1" />
                    </div>
                  </div>
                )}
              />
            </>
          ) : (
            <>
              <ActivityCard
                title="My Recent Orders"
                data={orders.slice(0, 5)}
                renderItem={(item: any) => (
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">Order #{item.id?.slice(0, 8)}</p>
                      <p className="text-sm text-gray-500">
                        {formatCurrency(item.totalAmount || 0)}
                        {' • '}
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                )}
              />

              <ActivityCard
                title="My Leave Requests"
                data={leaves.slice(0, 5)}
                renderItem={(item: any) => (
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{item.type || 'Leave Request'}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(item.startDate || item.createdAt).toLocaleDateString()}
                        {item.endDate && (
                          <span> - {new Date(item.endDate).toLocaleDateString()}</span>
                        )}
                      </p>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                )}
              />
            </>
          )}
        </div>

        {/* Additional Activity Cards */}
        {role === 'company' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <ActivityCard
              title="Recent Salary Requests"
              data={preSalaries.slice(0, 5)}
              renderItem={(item: any) => (
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{formatCurrency(item.amount || 0)}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                      {item.employeeName && (
                        <span className="ml-2 text-primary-600">• {item.employeeName}</span>
                      )}
                    </p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
              )}
            />

            <ActivityCard
              title="Recent Orders"
              data={orders.slice(0, 5)}
              renderItem={(item: any) => (
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">Order #{item.id?.slice(0, 8)}</p>
                    <p className="text-sm text-gray-500">
                      {formatCurrency(item.totalAmount || 0)}
                      {' • '}
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
              )}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <ActivityCard
              title="My Salary Requests"
              data={preSalaries.slice(0, 5)}
              renderItem={(item: any) => (
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{formatCurrency(item.amount || 0)}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                      {item.reason && (
                        <span className="block mt-1 text-xs">{item.reason}</span>
                      )}
                    </p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
              )}
            />

            <ActivityCard
              title="My Risk Reports"
              data={riskReports.slice(0, 5)}
              renderItem={(item: any) => (
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <SeverityBadge severity={item.severity} />
                    <StatusBadge status={item.status} className="mt-1" />
                  </div>
                </div>
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Helper Components
const StatCard = ({ title, value, icon, subtitle }: any) => (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-3">
      <span className="text-sm font-medium text-gray-600">{title}</span>
      {icon}
    </div>
    <p className="text-3xl font-bold text-gray-900">{value}</p>
    {subtitle && <p className="text-sm text-gray-500 mt-2">{subtitle}</p>}
  </div>
);

const StatusBadge = ({ status, className = '' }: { status: string; className?: string }) => {
  const colors: any = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
    RESOLVED: 'bg-green-100 text-green-800',
    COMPLETED: 'bg-green-100 text-green-800',
    PROCESSING: 'bg-primary-100 text-primary-800',
    CANCELLED: 'bg-gray-100 text-gray-800',
  };
  return <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[status] || 'bg-gray-100'} ${className}`}>{status}</span>;
};

const SeverityBadge = ({ severity }: { severity: string }) => {
  const colors: any = {
    CRITICAL: 'bg-red-100 text-red-800',
    HIGH: 'bg-orange-100 text-orange-800',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    LOW: 'bg-primary-100 text-primary-800',
  };
  return <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[severity] || 'bg-gray-100'}`}>{severity}</span>;
};

const ActivityCard = ({ title, data, renderItem }: any) => (
  <div className="bg-white rounded-xl shadow-sm">
    <div className="p-6 border-b border-gray-200 flex justify-between items-center">
      <h3 className="text-lg font-semibold">{title}</h3>
      <button className="text-primary-600 text-sm font-medium hover:text-primary-700 flex items-center gap-1">
        View All <ChevronRight className="w-4 h-4" />
      </button>
    </div>
    <div className="divide-y divide-gray-200">
      {data.length === 0 ? (
        <div className="p-8 text-center text-gray-500">No records found</div>
      ) : (
        data.map((item: any) => (
          <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
            {renderItem(item)}
          </div>
        ))
      )}
    </div>
  </div>
);

export default DashboardSummary;