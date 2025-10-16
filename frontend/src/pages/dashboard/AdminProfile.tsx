import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { User, Lock, Bell, Link } from 'lucide-react';
import ProfileSettings from '../../components/dashboard/profile/admin/ProfileSettings';


const AdminProfilePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const validTabs = ['profile', 'security', 'notifications', 'connected-apps'] as const;
  const initialTab = validTabs.includes(searchParams.get('tab') as any)
    ? (searchParams.get('tab') as 'profile' | 'security' | 'notifications' | 'connected-apps')
    : 'profile';
  const [activeTab, setActiveTab] = useState<
    'profile' | 'security' | 'notifications' | 'connected-apps'
  >(initialTab);

  // Sync activeTab with URL params
  useEffect(() => {
    setSearchParams({ tab: activeTab });
  }, [activeTab, setSearchParams]);

  return (
    <div className=" bg-gray-50 overflow-y-auto h-[90vh]">
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
             
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="h-full overflow-y-auto flex-1 p-4">
          <div className="mx-auto">
            <div className="bg-white rounded border border-gray-200">
              <div className="px-4 py-3 border-b border-gray-200">
                <h1 className="text-lg font-semibold text-gray-900">
                  {activeTab === 'profile'
                    ? 'Profile Settings'
                    : activeTab === 'security'
                    ? 'Security Settings'
                    : activeTab === 'notifications'
                    ? 'Notifications'
                    : 'Connected Apps'}
                </h1>
              </div>
              <div className="p-4">
                {activeTab === 'profile' && <ProfileSettings />}
               
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;