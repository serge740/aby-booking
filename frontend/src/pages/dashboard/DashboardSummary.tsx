import React, { useState, useEffect, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  TrendingUp, ShoppingCart, DollarSign, Users, Package,
  UserCheck, AlertTriangle, Calendar, Clock, ChevronRight, Briefcase,
  Activity, BarChart3, PieChart as PieChartIcon, ArrowUpRight, ArrowDownRight,
  Banknote,
  Smartphone
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
import { useCompanyAuth } from '../../context/CompanyAuthContext';

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
  const {company} = useCompanyAuth() as any;


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
          orderService.getOrdersByCompany(company?.id || user?.companyId),
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

// Add these new calculations
const momoOrders = orders.filter(o => o.paymentMethod === "MOMO");
const cashOrders = orders.filter(o => o.paymentMethod === "CASH");

const momoTotal = momoOrders.reduce((sum, order) => sum + order.totalAmount, 0);
const cashTotal = cashOrders.reduce((sum, order) => sum + order.totalAmount, 0);


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
      cashTotal,
      cashOrders,
      momoTotal,
      momoOrders,
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

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-600 border-t-transparent"></div>
          <p className="text-sm font-medium text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-primary-50">
      <div className="p-4 space-y-4">
        {/* Compact Header */}
        <div className="mb-2">
          <h1 className="text-xl font-bold text-slate-900">
            {role === 'company' ? 'Company Overview' : 'My Dashboard'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {role === 'company'
              ? 'Complete business insights and analytics'
              : 'Your personal performance metrics'}
          </p>
        </div>

        {/* Main Stats - Company Role */}
        {role === 'company' ? (
          <>
            {/* Orders & Revenue Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <StatCard
                title="Total Orders"
                value={stats.totalOrders}
                icon={ShoppingCart}
                gradient="from-primary-500 to-primary-600"
                bgLight="bg-primary-50"
                textColor="text-primary-600"
                subtitle={
                  <div className="flex items-center gap-1.5 flex-wrap text-xs">
                    <span className="text-emerald-600">{stats.completedOrders} done</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-amber-600">{stats.pendingOrders} pending</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-primary-600">{stats.processingOrders} active</span>
                  </div>
                }
                trend="up"
                change="+12%"
              />
              <StatCard
                title="Total Revenue"
                value={formatCurrency(stats.totalRevenue)}
                icon={DollarSign}
                gradient="from-emerald-500 to-emerald-600"
                bgLight="bg-emerald-50"
                textColor="text-emerald-600"
                subtitle="From completed orders"
                trend="up"
                change="+8%"
              />
              <StatCard
                title="Active Staff"
                value={stats.activeEmployees}
                icon={Users}
                gradient="from-purple-500 to-purple-600"
                bgLight="bg-purple-50"
                textColor="text-purple-600"
                subtitle={
                  <div className="flex items-center gap-1.5 text-xs">
                    <span>{stats.totalEmployees} total</span>
                    {stats.inactiveEmployees > 0 && (
                      <>
                        <span className="text-slate-300">•</span>
                        <span className="text-red-600">{stats.inactiveEmployees} inactive</span>
                      </>
                    )}
                  </div>
                }
                trend="up"
                change="+3%"
              />
              <StatCard
    title="Mobile Money"
    value={formatCurrency(stats.momoTotal)}
    icon={Smartphone}
    gradient="from-purple-500 to-purple-600"
    bgLight="bg-purple-50"
    textColor="text-purple-600"
    subtitle={`${stats.momoOrders.length} transactions`}
  />
  
  <StatCard
    title="Cash Payments"
    value={formatCurrency(stats.cashTotal)}
    icon={Banknote}
    gradient="from-green-500 to-green-600"
    bgLight="bg-green-50"
    textColor="text-green-600"
    subtitle={`${stats.cashOrders.length} transactions`}
  />
              <StatCard
                title="Stock Items"
                value={stats.totalStock}
                icon={Package}
                gradient="from-indigo-500 to-indigo-600"
                bgLight="bg-indigo-50"
                textColor="text-indigo-600"
                subtitle={
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-orange-600">{stats.lowStockItems} low</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-red-600">{stats.outOfStockItems} out</span>
                  </div>
                }
                trend={stats.lowStockItems > 5 ? 'down' : 'up'}
                change={stats.lowStockItems > 5 ? '-5%' : '+2%'}
              />
            </div>

            {/* Leave & Salary Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <StatCard
                title="Leave Requests"
                value={stats.totalLeaves}
                icon={Calendar}
                gradient="from-teal-500 to-teal-600"
                bgLight="bg-teal-50"
                textColor="text-teal-600"
                subtitle={
                  <div className="flex items-center gap-1.5 flex-wrap text-xs">
                    <span className="text-amber-600">{stats.pendingLeaves} pending</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-emerald-600">{stats.approvedLeaves} approved</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-red-600">{stats.rejectedLeaves} rejected</span>
                  </div>
                }
                trend="up"
                change="+5%"
              />
              <StatCard
                title="Salary Requests"
                value={stats.totalSalaries}
                icon={Briefcase}
                gradient="from-cyan-500 to-cyan-600"
                bgLight="bg-cyan-50"
                textColor="text-cyan-600"
                subtitle={
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-amber-600">{stats.pendingSalaries} pending</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-emerald-600">{stats.approvedSalaries} approved</span>
                  </div>
                }
                trend="up"
                change="+7%"
              />
              <StatCard
                title="Approved Salaries"
                value={formatCurrency(stats.totalSalaryAmount)}
                icon={DollarSign}
                gradient="from-emerald-500 to-emerald-600"
                bgLight="bg-emerald-50"
                textColor="text-emerald-600"
                subtitle="Total paid out"
                trend="up"
                change="+15%"
              />
              <StatCard
                title="Risk Reports"
                value={stats.totalRisks}
                icon={AlertTriangle}
                gradient="from-red-500 to-red-600"
                bgLight="bg-red-50"
                textColor="text-red-600"
                subtitle={
                  <div className="flex items-center gap-1.5 flex-wrap text-xs">
                    <span className="text-red-600">{stats.criticalRisks} critical</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-orange-600">{stats.highRisks} high</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-emerald-600">{stats.resolvedRisks} resolved</span>
                  </div>
                }
                trend={stats.criticalRisks > 0 ? 'down' : 'up'}
                change={stats.criticalRisks > 0 ? '+3 critical' : 'All clear'}
              />
            </div>
          </>
        ) : (
          // Employee Role - Personal Stats
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <StatCard
                title="My Orders"
                value={stats.totalOrders}
                icon={ShoppingCart}
                gradient="from-primary-500 to-primary-600"
                bgLight="bg-primary-50"
                textColor="text-primary-600"
                subtitle={
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-emerald-600">{stats.completedOrders} done</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-amber-600">{stats.pendingOrders} pending</span>
                  </div>
                }
                trend="up"
                change="+10%"
              />
              <StatCard
                title="My Revenue"
                value={formatCurrency(stats.totalRevenue)}
                icon={DollarSign}
                gradient="from-emerald-500 to-emerald-600"
                bgLight="bg-emerald-50"
                textColor="text-emerald-600"
                subtitle="From completed orders"
                trend="up"
                change="+12%"
              />
              <StatCard
                title="Leave Requests"
                value={stats.totalLeaves}
                icon={Calendar}
                gradient="from-teal-500 to-teal-600"
                bgLight="bg-teal-50"
                textColor="text-teal-600"
                subtitle={
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-amber-600">{stats.pendingLeaves} pending</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-emerald-600">{stats.approvedLeaves} approved</span>
                  </div>
                }
                trend="up"
                change="+2"
              />
              <StatCard
                title="Risk Reports"
                value={stats.totalRisks}
                icon={AlertTriangle}
                gradient="from-red-500 to-red-600"
                bgLight="bg-red-50"
                textColor="text-red-600"
                subtitle={
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-amber-600">{stats.pendingRisks} pending</span>
                    {stats.criticalRisks > 0 && (
                      <>
                        <span className="text-slate-300">•</span>
                        <span className="text-red-600">{stats.criticalRisks} critical</span>
                      </>
                    )}
                  </div>
                }
                trend={stats.criticalRisks > 0 ? 'down' : 'up'}
                change={stats.criticalRisks > 0 ? 'Action needed' : 'On track'}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <StatCard
                title="Salary Requests"
                value={stats.totalSalaries}
                icon={Briefcase}
                gradient="from-cyan-500 to-cyan-600"
                bgLight="bg-cyan-50"
                textColor="text-cyan-600"
                subtitle={
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-amber-600">{stats.pendingSalaries} pending</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-emerald-600">{stats.approvedSalaries} approved</span>
                  </div>
                }
                trend="up"
                change="+1"
              />
              <StatCard
                title="Approved Salary"
                value={formatCurrency(stats.totalSalaryAmount)}
                icon={DollarSign}
                gradient="from-emerald-500 to-emerald-600"
                bgLight="bg-emerald-50"
                textColor="text-emerald-600"
                subtitle="Total approved amount"
                trend="up"
                change="+20%"
              />
              <StatCard
                title="Completion Rate"
                value={stats.completedOrders > 0 ? `${Math.round((stats.completedOrders / stats.totalOrders) * 100)}%` : '0%'}
                icon={TrendingUp}
                gradient="from-purple-500 to-purple-600"
                bgLight="bg-purple-50"
                textColor="text-purple-600"
                subtitle="Order success rate"
                trend="up"
                change="+5%"
              />
              <StatCard
                title="Pending Actions"
                value={stats.pendingOrders + stats.pendingLeaves + stats.pendingSalaries + stats.pendingRisks}
                icon={Clock}
                gradient="from-orange-500 to-orange-600"
                bgLight="bg-orange-50"
                textColor="text-orange-600"
                subtitle="Items awaiting response"
                trend="down"
                change="-3"
              />
            </div>
          </>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-slate-600" />
                <h3 className="text-sm font-semibold text-slate-900">7-Day Trend</h3>
              </div>
            </div>
            <div className="p-4">
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={orderTrend}>
                  <defs>
                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 11 }} 
                    stroke="#94a3b8"
                  />
                  <YAxis 
                    tick={{ fontSize: 11 }} 
                    stroke="#94a3b8"
                  />
                  <Tooltip 
                    contentStyle={{ 
                      fontSize: 12, 
                      borderRadius: 8, 
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                    formatter={(v) => (typeof v === 'number' ? (v > 1000 ? formatCurrency(v) : v) : v)} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="orders" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorOrders)" 
                    name="Orders" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRevenue)" 
                    name="Revenue" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-slate-600" />
                <h3 className="text-sm font-semibold text-slate-900">
                  {role === 'company' ? 'Order Distribution' : 'My Order Status'}
                </h3>
              </div>
            </div>
            <div className="p-4">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelStyle={{ fontSize: 10, fontWeight: 600 }}
                  >
                    {orderStatusData.map((entry, i) => (
                      <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      fontSize: 12, 
                      borderRadius: 8, 
                      border: '1px solid #e2e8f0' 
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Additional Chart for Company Role */}
        {role === 'company' && riskSeverityData.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-slate-600" />
                <h3 className="text-sm font-semibold text-slate-900">Risk Severity Distribution</h3>
              </div>
            </div>
            <div className="p-4">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={riskSeverityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelStyle={{ fontSize: 10, fontWeight: 600 }}
                  >
                    {riskSeverityData.map((entry, i) => (
                      <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      fontSize: 12, 
                      borderRadius: 8, 
                      border: '1px solid #e2e8f0' 
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {role === 'company' ? (
            <>
              <ActivityCard
                title="Recent Leave Requests"
                icon={Calendar}
                data={leaves.slice(0, 5)}
                renderItem={(item: any) => (
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{item.type || 'Leave Request'}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {new Date(item.startDate || item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        {item.employeeName && (
                          <span className="ml-1.5 text-primary-600">• {item.employeeName}</span>
                        )}
                      </p>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                )}
              />

              <ActivityCard
                title="Recent Risk Reports"
                icon={AlertTriangle}
                data={riskReports.slice(0, 5)}
                renderItem={(item: any) => (
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{item.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        {item.employeeName && (
                          <span className="ml-1.5 text-primary-600">• {item.employeeName}</span>
                        )}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                      <SeverityBadge severity={item.severity} />
                      <StatusBadge status={item.status} />
                    </div>
                  </div>
                )}
              />
            </>
          ) : (
            <>
              <ActivityCard
                title="My Recent Orders"
                icon={ShoppingCart}
                data={orders.slice(0, 5)}
                renderItem={(item: any) => (
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900">Order #{item.id?.slice(0, 8)}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {formatCurrency(item.totalAmount || 0)}
                        {' • '}
                        {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                )}
              />

              <ActivityCard
                title="My Leave Requests"
                icon={Calendar}
                data={leaves.slice(0, 5)}
                renderItem={(item: any) => (
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{item.type || 'Leave Request'}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {new Date(item.startDate || item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        {item.endDate && (
                          <span> - {new Date(item.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ActivityCard
              title="Recent Salary Requests"
              icon={Briefcase}
              data={preSalaries.slice(0, 5)}
              renderItem={(item: any) => (
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900">{formatCurrency(item.amount || 0)}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      {item.employeeName && (
                        <span className="ml-1.5 text-primary-600">• {item.employeeName}</span>
                      )}
                    </p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
              )}
            />

            <ActivityCard
              title="Recent Orders"
              icon={ShoppingCart}
              data={orders.slice(0, 5)}
              renderItem={(item: any) => (
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900">Order #{item.id?.slice(0, 8)}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {formatCurrency(item.totalAmount || 0)}
                      {' • '}
                      {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
              )}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ActivityCard
              title="My Salary Requests"
              icon={Briefcase}
              data={preSalaries.slice(0, 5)}
              renderItem={(item: any) => (
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900">{formatCurrency(item.amount || 0)}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      {item.reason && (
                        <span className="block mt-1 text-xs text-slate-400 truncate">{item.reason}</span>
                      )}
                    </p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
              )}
            />

            <ActivityCard
              title="My Risk Reports"
              icon={AlertTriangle}
              data={riskReports.slice(0, 5)}
              renderItem={(item: any) => (
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{item.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    <SeverityBadge severity={item.severity} />
                    <StatusBadge status={item.status} />
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
const StatCard = ({ title, value, icon: Icon, gradient, bgLight, textColor, subtitle, trend, change }: any) => (
  <div className="group bg-white rounded-xl p-3.5 border border-slate-200/60 shadow-sm hover:shadow-md hover:border-slate-300/60 transition-all duration-300">
    <div className="flex items-start justify-between mb-2">
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 ${bgLight} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
          <Icon className={`w-4 h-4 ${textColor}`} />
        </div>
        <span className="text-xs font-medium text-slate-600">{title}</span>
      </div>
    </div>
    <p className="text-xl font-bold text-slate-900 mb-1.5">{value}</p>
    <div className="flex items-center justify-between">
      <div className="text-xs text-slate-500 flex-1 min-w-0">{subtitle}</div>
      {change && (
        <div className="flex items-center gap-0.5 ml-2">
          {trend === 'up' ? (
            <ArrowUpRight className="w-3 h-3 text-emerald-500 flex-shrink-0" />
          ) : (
            <ArrowDownRight className="w-3 h-3 text-red-500 flex-shrink-0" />
          )}
          <span className={`text-xs font-semibold whitespace-nowrap ${trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
            {change}
          </span>
        </div>
      )}
    </div>
  </div>
);

const StatusBadge = ({ status, className = '' }: { status: string; className?: string }) => {
  const colors: any = {
    PENDING: 'bg-amber-100 text-amber-700',
    APPROVED: 'bg-emerald-100 text-emerald-700',
    REJECTED: 'bg-red-100 text-red-700',
    RESOLVED: 'bg-emerald-100 text-emerald-700',
    COMPLETED: 'bg-emerald-100 text-emerald-700',
    PROCESSING: 'bg-primary-100 text-primary-700',
    CANCELLED: 'bg-slate-100 text-slate-700',
  };
  return (
    <span className={`px-2 py-0.5 text-xs font-semibold rounded-md ${colors[status] || 'bg-slate-100 text-slate-700'} ${className}`}>
      {status}
    </span>
  );
};

const SeverityBadge = ({ severity }: { severity: string }) => {
  const colors: any = {
    CRITICAL: 'bg-red-100 text-red-700 ring-1 ring-red-200',
    HIGH: 'bg-orange-100 text-orange-700 ring-1 ring-orange-200',
    MEDIUM: 'bg-amber-100 text-amber-700 ring-1 ring-amber-200',
    LOW: 'bg-primary-100 text-primary-700 ring-1 ring-primary-200',
  };
  return (
    <span className={`px-2 py-0.5 text-xs font-semibold rounded-md ${colors[severity] || 'bg-slate-100 text-slate-700'}`}>
      {severity}
    </span>
  );
};

const ActivityCard = ({ title, icon: Icon, data, renderItem }: any) => (
  <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
    <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-slate-600" />
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        </div>
        <button className="text-primary-600 text-xs font-medium hover:text-primary-700 flex items-center gap-0.5 hover:bg-primary-50 px-2 py-1 rounded-lg transition-all">
          View All <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
    <div className="divide-y divide-slate-100">
      {data.length === 0 ? (
        <div className="p-8 text-center">
          <Activity className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs text-slate-500">No records found</p>
        </div>
      ) : (
        data.map((item: any) => (
          <div key={item.id} className="p-3 hover:bg-slate-50 transition-colors">
            {renderItem(item)}
          </div>
        ))
      )}
    </div>
  </div>
);

export default DashboardSummary;