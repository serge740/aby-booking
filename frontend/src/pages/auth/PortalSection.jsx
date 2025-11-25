import { Users, Building2, ArrowRight, BarChart3, Shield, Zap } from 'lucide-react';

export default function PortalSection() {
  const handlePortalClick = (portal) => {
    if(portal === 'Employee') {
        window.location.href = '/auth/employee/login';
    } else if(portal === 'Company') {
        window.location.href = '/auth/company/login';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white border-b border-orange-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Aby Dash</h1>
          </div>
          <div className="flex items-center gap-4 text-gray-600 text-sm">
            <Shield size={18} className="text-orange-500" />
            <span>Secure</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Smart Management Dashboard
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A clean and powerful management platform designed to help companies handle their daily operations in one central place. 
            Manage data, track activities, monitor performance, and communicate across teams—all in one dashboard.
          </p>
        </div>

        {/* Portal Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {/* Employee Portal */}
          <div 
            onClick={() => handlePortalClick('Employee')}
            className="group bg-white rounded-2xl p-8 border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 cursor-pointer hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-200"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="text-white" size={32} />
              </div>
              <ArrowRight className="text-gray-400 group-hover:text-orange-500 group-hover:translate-x-2 transition-all" size={28} />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Employee Portal</h3>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Access your workspace, manage tasks, track time, submit requests, and collaborate with your team.
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                Personal dashboard & analytics
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                Time tracking & task management
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                Leave requests & approvals
              </li>
            </ul>
          </div>

          {/* Company Portal */}
          <div 
            onClick={() => handlePortalClick('Company')}
            className="group bg-white rounded-2xl p-8 border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 cursor-pointer hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-200"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Building2 className="text-white" size={32} />
              </div>
              <ArrowRight className="text-gray-400 group-hover:text-orange-500 group-hover:translate-x-2 transition-all" size={28} />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Company Portal</h3>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Manage your entire organization, oversee operations, control finances, and monitor business performance.
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                Client & employee management
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                Financial tracking & reporting
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                System settings & configuration
              </li>
            </ul>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-orange-50 rounded-2xl p-8 border border-orange-200">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Zap className="text-orange-500" size={24} />
            <h4 className="text-2xl font-semibold text-gray-900">Why Choose Aby Dash?</h4>
          </div>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <h5 className="text-lg font-semibold text-gray-900 mb-2">All-in-One Platform</h5>
              <p className="text-gray-600 text-sm">No more switching between multiple tools</p>
            </div>
            <div>
              <h5 className="text-lg font-semibold text-gray-900 mb-2">Fast & Organized</h5>
              <p className="text-gray-600 text-sm">Everything you need in one central place</p>
            </div>
            <div>
              <h5 className="text-lg font-semibold text-gray-900 mb-2">Easy to Use</h5>
              <p className="text-gray-600 text-sm">Intuitive interface for everyone</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-500 text-sm">
        <p>&copy; 2024 Aby Dash. All rights reserved.</p>
      </footer>
    </div>
  );
}