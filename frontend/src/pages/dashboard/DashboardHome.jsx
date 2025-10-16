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
  Download
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
      color: 'bg-primary-500',
      trend: 'up'
    },
    {
      label: 'Total Expenses',
      value: dashboardData.stats.totalExpenses,
      change: '+8%',
      icon: FileText,
      color: 'bg-primary-500',
      trend: 'up'
    },
    {
      label: 'Total Amount',
      value: `$${dashboardData.stats.totalAmount.toFixed(2)}`,
      change: '+15%',
      icon: DollarSign,
      color: 'bg-primary-500',
      trend: 'up'
    },
    {
      label: 'Recent Activity',
      value: dashboardData.stats.recentActivity,
      change: '-5%',
      icon: Clock,
      color: 'bg-primary-500',
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
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-5 h-5 text-primary-500 animate-spin" />
          <span className="text-base text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Financial Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">Welcome back! Here's your financial overview.</p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Search className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors relative">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                  <p className="text-xl font-semibold text-gray-900 mt-2">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    {stat.trend === 'up' ? (
                      <ArrowUpRight className="w-4 h-4 text-green-500" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`text-sm font-medium ml-1 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">vs last month</span>
                  </div>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center shadow-sm`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Reports */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">Recent Reports</h3>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {dashboardData.reports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{report.title}</p>
                        <p className="text-sm text-gray-500">{report.admin.adminName}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePreviewReport(handleReportUrl(report.reportUrl))}
                        className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="Preview Report"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <a
                        href={handleReportUrl(report.reportUrl)}
                        download
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Download Report"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                      <p className="text-sm text-gray-600">{new Date(report.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button className="w-full text-primary-600 hover:text-primary-700 font-medium text-sm py-2">
                  View All Reports →
                </button>
              </div>
            </div>
          </div>

          {/* Recent Expenses */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">Recent Expenses</h3>
                <div className="flex items-center space-x-1 bg-yellow-100 px-2 py-1 rounded-lg">
                  <DollarSign className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-700">
                    ${dashboardData.expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {dashboardData.expenses.map((expense) => (
                  <div key={expense.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                          <DollarSign className="w-4 h-4 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{expense.title}</p>
                          <p className="text-sm text-gray-500">{expense.description || 'N/A'}</p>
                          <p className="text-sm text-gray-400">{expense.admin.adminName}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-semibold text-gray-900">${expense.amount.toFixed(2)}</span>
                        <span className="text-sm text-gray-500 mt-1">
                          {new Date(expense.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button className="w-full text-primary-600 hover:text-primary-700 font-medium text-sm py-2">
                  View All Expenses →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Admin Overview */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">Admin Overview</h3>
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View Details
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...new Set([...dashboardData.reports, ...dashboardData.expenses].map(item => item.admin.id))]
                  .map((adminId) => {
                    const admin = dashboardData.reports.find(r => r.admin.id === adminId)?.admin ||
                                  dashboardData.expenses.find(e => e.admin.id === adminId)?.admin;
                    const adminReports = dashboardData.reports.filter(r => r.admin.id === adminId).length;
                    const adminExpenses = dashboardData.expenses.filter(e => e.admin.id === adminId).length;
                    return {
                      id: adminId,
                      name: admin?.adminName || 'Unknown',
                      totalItems: adminReports + adminExpenses
                    };
                  })
                  .map((admin, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all duration-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-primary-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{admin.name}</p>
                            <p className="text-sm text-gray-500">{admin.totalItems} items</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-base font-semibold text-gray-900">Key Metrics</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {dashboardData.keyMetrics.map((metric) => (
                  <div key={metric.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{metric.title}</p>
                      <p className="text-sm text-gray-500">{metric.adminName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">${metric.amount.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">{new Date(metric.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button className="w-full text-primary-600 hover:text-primary-700 font-medium text-sm py-2">
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