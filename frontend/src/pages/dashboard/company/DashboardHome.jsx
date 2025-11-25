import React, { useState, useEffect } from 'react';
import {
  Users,
  FileText,
  DollarSign,
  Calendar,
  Clock,
  TrendingUp,
  Bell,
  Settings,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Building2,
  Eye,
  Download,
  MoreVertical,
  Activity
} from 'lucide-react';
import { API_URL } from '../../api/api';
import reportService from '../../services/reportService';
import expenseService from '../../services/expenseService';

const DashboardHome = ({ role }) => {
  const [dashboardData, setDashboardData] = useState({
    reports: [],
    expenses: [],
    keyMetrics: [],
    stats: {
      totalReports: 0,
      totalExpenses: 0,
      totalAmount: 0,
      recentActivity: 0,
      uniqueAdmins: 0
    }
  });
  const [loading, setLoading] = useState(true);

  // Fetch reports and expenses
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [reportData, expenseData] = await Promise.all([
          reportService.getAllReports(),
          expenseService.getAllExpenses(),
        ]);

        // Sort by createdAt descending to get most recent
        const sortedReports = reportData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        const sortedExpenses = expenseData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Get recent activity (reports and expenses from last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentActivity = [...reportData, ...expenseData].filter(
          item => new Date(item.createdAt) >= thirtyDaysAgo
        ).length;

        // Get key metrics (e.g., top 3 expenses by amount)
        const keyMetrics = expenseData
          .sort((a, b) => b.amount - a.amount)
          .slice(0, 3)
          .map(expense => ({
            id: expense.id,
            title: expense.title,
            amount: expense.amount,
            adminName: expense.admin.adminName,
            createdAt: expense.createdAt
          }));

        setDashboardData({
          reports: sortedReports.slice(0, 3), // Limit to 3 recent reports
          expenses: sortedExpenses.slice(0, 3), // Limit to 3 recent expenses
          keyMetrics,
          stats: {
            totalReports: reportData.length,
            totalExpenses: expenseData.length,
            totalAmount: expenseData.reduce((sum, expense) => sum + expense.amount, 0),
            recentActivity,
            uniqueAdmins: new Set([...reportData, ...expenseData].map(item => item.admin.id)).size
          }
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statsCards = [
    {
      label: 'Total Reports',
      value: dashboardData.stats.totalReports,
      change: '+10%',
      icon: FileText,
      gradient: 'from-blue-500 to-blue-600',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-600',
      trend: 'up'
    },
    {
      label: 'Total Expense',
      value: dashboardData.stats.totalExpenses,
      change: '+8%',
      icon: Activity,
      gradient: 'from-purple-500 to-purple-600',
      bgLight: 'bg-purple-50',
      textColor: 'text-purple-600',
      trend: 'up'
    },
    {
      label: 'Total Amount',
      value: `$${dashboardData.stats.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: '+15%',
      icon: DollarSign,
      gradient: 'from-emerald-500 to-emerald-600',
      bgLight: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      trend: 'up'
    },
    {
      label: 'Recent Activity',
      value: dashboardData.stats.recentActivity,
      change: '-5%',
      icon: Clock,
      gradient: 'from-orange-500 to-orange-600',
      bgLight: 'bg-orange-50',
      textColor: 'text-orange-600',
      trend: 'down'
    }
  ];

  const handleReportUrl = (url) => {
    if (!url) return null;
    if (url.includes('http')) return url;
    return `${API_URL}${url}`;
  };

  const handlePreviewReport = (reportUrl) => {
    window.open(reportUrl, '_blank', 'width=900,height=700');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
          <span className="text-sm font-medium text-slate-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50">
      {/* Compact Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-slate-200/60 sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-slate-900">Financial Dashboard</h1>
              <p className="text-xs text-slate-500 mt-0.5">Real-time financial overview</p>
            </div>
            <div className="flex items-center gap-1.5">
              <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                <Search className="w-4 h-4" />
              </button>
              <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all relative">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full ring-2 ring-white"></span>
              </button>
              <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Compact Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {statsCards.map((stat, index) => (
            <div key={index} className="group bg-white rounded-xl p-3.5 border border-slate-200/60 shadow-sm hover:shadow-md hover:border-slate-300/60 transition-all duration-300">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-8 h-8 ${stat.bgLight} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <stat.icon className={`w-4 h-4 ${stat.textColor}`} />
                    </div>
                    <p className="text-xs font-medium text-slate-600 truncate">{stat.label}</p>
                  </div>
                  <p className="text-xl font-bold text-slate-900 mb-1.5">{stat.value}</p>
                  <div className="flex items-center gap-1">
                    {stat.trend === 'up' ? (
                      <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <ArrowDownRight className="w-3.5 h-3.5 text-red-500" />
                    )}
                    <span className={`text-xs font-semibold ${stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span>
                    <span className="text-xs text-slate-400">30d</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Recent Reports */}
          <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-600" />
                  <h3 className="text-sm font-semibold text-slate-900">Recent Reports</h3>
                </div>
                <button className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-3">
              <div className="space-y-2">
                {dashboardData.reports.map((report) => (
                  <div key={report.id} className="group flex items-center justify-between p-2.5 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all">
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{report.title}</p>
                        <p className="text-xs text-slate-500">{report.admin.adminName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 ml-2">
                      <button
                        onClick={() => handlePreviewReport(handleReportUrl(report.reportUrl))}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        title="Preview"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <a
                        href={handleReportUrl(report.reportUrl)}
                        download
                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        title="Download"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                      <span className="text-xs text-slate-500 whitespace-nowrap">
                        {new Date(report.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100">
                <button className="w-full text-blue-600 hover:text-blue-700 font-medium text-xs py-1.5 hover:bg-blue-50 rounded-lg transition-all">
                  View All Reports →
                </button>
              </div>
            </div>
          </div>

          {/* Recent Expenses */}
          <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-slate-600" />
                  <h3 className="text-sm font-semibold text-slate-900">Recent Expenses</h3>
                </div>
                <div className="flex items-center gap-1 bg-emerald-100 px-2 py-0.5 rounded-md">
                  <DollarSign className="w-3 h-3 text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-700">
                    {dashboardData.expenses.reduce((sum, exp) => sum + exp.amount, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-3">
              <div className="space-y-2">
                {dashboardData.expenses.map((expense) => (
                  <div key={expense.id} className="p-2.5 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2.5 flex-1 min-w-0">
                        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                          <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">{expense.title}</p>
                          <p className="text-xs text-slate-500 truncate">{expense.description || 'No description'}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{expense.admin.adminName}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end ml-2">
                        <span className="text-sm font-bold text-slate-900 whitespace-nowrap">
                          ${expense.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <span className="text-xs text-slate-500 mt-0.5 whitespace-nowrap">
                          {new Date(expense.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100">
                <button className="w-full text-blue-600 hover:text-blue-700 font-medium text-xs py-1.5 hover:bg-blue-50 rounded-lg transition-all">
                  View All Expenses →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Admin Overview */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-600" />
                  <h3 className="text-sm font-semibold text-slate-900">Admin Overview</h3>
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-xs font-medium hover:bg-blue-50 px-2 py-1 rounded-lg transition-all">
                  View Details
                </button>
              </div>
            </div>
            <div className="p-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {[...new Set([...dashboardData.reports, ...dashboardData.expenses].map(item => item.admin.id))]
                  .map((adminId) => {
                    const admin = dashboardData.reports.find(r => r.admin.id === adminId)?.admin ||
                                  dashboardData.expenses.find(e => e.admin.id === adminId)?.admin;
                    const adminReports = dashboardData.reports.filter(r => r.admin.id === adminId).length;
                    const adminExpenses = dashboardData.expenses.filter(e => e.admin.id === adminId).length;
                    return {
                      id: adminId,
                      name: admin?.adminName || 'Unknown',
                      totalItems: adminReports + adminExpenses,
                      reports: adminReports,
                      expenses: adminExpenses
                    };
                  })
                  .map((admin, index) => (
                    <div key={index} className="group p-3 border border-slate-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 bg-gradient-to-br from-white to-slate-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                            <span className="text-white text-xs font-bold">
                              {admin.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{admin.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-slate-500">{admin.reports} reports</span>
                              <span className="text-xs text-slate-300">•</span>
                              <span className="text-xs text-slate-500">{admin.expenses} expenses</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold text-blue-600">{admin.totalItems}</span>
                          <p className="text-xs text-slate-400">total</p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-slate-600" />
                <h3 className="text-sm font-semibold text-slate-900">Top Expenses</h3>
              </div>
            </div>
            <div className="p-3">
              <div className="space-y-2">
                {dashboardData.keyMetrics.map((metric, idx) => (
                  <div key={metric.id} className="flex items-center gap-2.5 p-2.5 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all">
                    <div className="w-7 h-7 bg-gradient-to-br from-amber-400 to-amber-500 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                      <span className="text-white text-xs font-bold">#{idx + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{metric.title}</p>
                      <p className="text-xs text-slate-500 truncate">{metric.adminName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900 whitespace-nowrap">
                        ${metric.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-slate-400">
                        {new Date(metric.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100">
                <button className="w-full text-blue-600 hover:text-blue-700 font-medium text-xs py-1.5 hover:bg-blue-50 rounded-lg transition-all">
                  View All Metrics →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;