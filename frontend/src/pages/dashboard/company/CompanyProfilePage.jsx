
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { User, Lock, Bell, Link } from 'lucide-react';
import CompanyProfileSettings from '../../../components/dashboard/profile/company/CompanyProfileSettings';
import ConnectedApps from '../../../components/dashboard/profile/company/ConnectedApps';
import NotificationsSettings from '../../../components/dashboard/profile/company/NotificationsSettings';
import SecuritySettings from '../../../components/dashboard/profile/company/SecuritySettings';
import PushNotificationPage from '../PushNotificationPage';

const CompanyProfilePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const validTabs = ['profile', 'security', 'notifications', 'connected-apps'];
  const initialTab = validTabs.includes(searchParams.get('tab'))
    ? searchParams.get('tab')
    : 'profile';
  const [activeTab, setActiveTab] = useState(initialTab);

  // Sync activeTab with URL params
  // useEffect(() => {
  //   setSearchParams({ tab: activeTab });
  // }, [activeTab, setSearchParams]);

  return (
    <div className="bg-gray-50 overflow-y-auto h-[90vh]">
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r h-full border-gray-200">
          <div className="p-4 flex-1">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center px-3 py-2 text-xs font-medium rounded transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-primary-50 text-primary-600 border-r-4 border-primary-500'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <User className="w-4 h-4 mr-2" />
                Profile Settings
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center px-3 py-2 text-xs font-medium rounded transition-colors ${
                  activeTab === 'security'
                    ? 'bg-primary-50 text-primary-600 border-r-4 border-primary-500'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Lock className="w-4 h-4 mr-2" />
                Security Settings
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center px-3 py-2 text-xs font-medium rounded transition-colors ${
                  activeTab === 'notifications'
                    ? 'bg-primary-50 text-primary-600 border-r-4 border-primary-500'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </button>
              <button
                onClick={() => setActiveTab('connected-apps')}
                className={`w-full flex items-center px-3 py-2 text-xs font-medium rounded transition-colors ${
                  activeTab === 'connected-apps'
                    ? 'bg-primary-50 text-primary-600 border-r-4 border-primary-500'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Link className="w-4 h-4 mr-2" />
                Connected Apps
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="h-full overflow-y-auto flex-1 p-4">
          <div className="mx-auto">
            <div className="bg-white rounded border border-gray-200">
              <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <h1 className="text-lg font-semibold text-gray-900">
                  {activeTab === 'profile'
                    ? 'Profile Settings'
                    : activeTab === 'security'
                    ? 'Security Settings'
                    : activeTab === 'notifications'
                    ? 'Notifications'
                    : 'Connected Apps'}
                </h1>
                <button
                  onClick={() => navigate('/company/dashboard')}
                  className="text-sm text-primary-600 hover:text-primary-700 font-semibold"
                >
                  Back to Dashboard
                </button>
              </div>
              <div className="p-4">
                {activeTab === 'profile' && <CompanyProfileSettings />}
                {activeTab === 'security' && <SecuritySettings />}
                {activeTab === 'notifications' &&  <PushNotificationPage />}
                {activeTab === 'connected-apps' && <ConnectedApps />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfilePage;
