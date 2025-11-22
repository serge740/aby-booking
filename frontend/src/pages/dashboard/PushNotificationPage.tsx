import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Bell, BellOff, Smartphone, Trash2, RefreshCw, AlertCircle, CheckCircle, X } from 'lucide-react';
import { useEmployeeAuth } from '../../context/EmployeeAuthContext';
import { useCompanyAuth } from '../../context/CompanyAuthContext';
import { getClientDescription } from '../../stores/detectDevice';

interface OutletContext {
  role: 'employee' | 'company';
}

interface Subscription {
  id: string;
  endpoint: string;
  label?: string;
  createdAt: string;
}

interface NotificationState {
  type: 'success' | 'error';
  message: string;
}

const PushNotificationPage: React.FC = () => {
  const { role } = useOutletContext<OutletContext>();
  
  // Get the appropriate auth context based on role
  const employeeAuth = role === 'employee' ? useEmployeeAuth() : null;
  const companyAuth = role === 'company' ? useCompanyAuth() : null;

  // Use the correct context based on role
  const auth = role === 'employee' ? employeeAuth : companyAuth;

  const {
    isAuthenticated,
    isSubscribedToNotifications,
    subscribeToNotifications,
    unsubscribeFromNotifications,
    unsubscribeAllDevices,
    getSubscriptions,
    user,
    company,
  } = auth!;

  const client  = getClientDescription()

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<NotificationState | null>(null);
  const [deviceLabel, setDeviceLabel] = useState<string>( client.description || '');
  const [showLabelInput, setShowLabelInput] = useState<boolean>(false);

  useEffect(()=>{
    setDeviceLabel( client.description || '');

  },[])

  // Get user name based on role
  const getUserName = () => {
    if (role === 'employee' && user) {
      return `${user.first_name} ${user.last_name}`;
    } else if (role === 'company' && company) {
      return company.name;
    }
    return 'User';
  };

  // Fetch subscriptions on mount and when subscription status changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchSubscriptions();
    }
  }, [isAuthenticated, isSubscribedToNotifications]);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const subs = await getSubscriptions();
      setSubscriptions(subs);
    } catch (error: any) {
      showNotification('error', error.message || 'Failed to fetch subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleSubscribe = async () => {
    setActionLoading(true);
    try {
      const label = deviceLabel.trim() || undefined;
      const result = await subscribeToNotifications(label);
      showNotification('success', result.message);
      setShowLabelInput(false);
      setDeviceLabel('');
      await fetchSubscriptions();
    } catch (error: any) {
      showNotification('error', error.message || 'Failed to subscribe');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    if (!confirm('Are you sure you want to unsubscribe this device from notifications?')) {
      return;
    }

    setActionLoading(true);
    try {
      const result = await unsubscribeFromNotifications();
      showNotification('success', result.message);
      await fetchSubscriptions();
    } catch (error: any) {
      showNotification('error', error.message || 'Failed to unsubscribe');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnsubscribeAll = async () => {
    if (!confirm('Are you sure you want to unsubscribe ALL devices? This cannot be undone.')) {
      return;
    }

    setActionLoading(true);
    try {
      const result = await unsubscribeAllDevices();
      showNotification('success', result.message);
      await fetchSubscriptions();
    } catch (error: any) {
      showNotification('error', error.message || 'Failed to unsubscribe all devices');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCurrentDeviceEndpoint = async (): Promise<string | null> => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      return subscription?.endpoint || null;
    } catch {
      return null;
    }
  };

  const [currentEndpoint, setCurrentEndpoint] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentEndpoint = async () => {
      const endpoint = await getCurrentDeviceEndpoint();
      setCurrentEndpoint(endpoint);
    };
    fetchCurrentEndpoint();
  }, [isSubscribedToNotifications]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Authentication Required</h2>
          <p className="text-gray-600">Please log in to manage push notifications.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-2">
      <div className=" mx-auto">
        {/* Notification Toast */}
        {notification && (
          <div
            className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg transition-all ${
              notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            } text-white`}
            style={{
              animation: 'slideIn 0.3s ease-out',
            }}
          >
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>{notification.message}</span>
            <button onClick={() => setNotification(null)} className="ml-2 hover:opacity-80">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-primary-100 p-3 rounded-full">
              <Bell className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Push Notifications</h1>
              <p className="text-gray-600">
                Manage notification preferences for {getUserName()} ({role.toLowerCase()})
              </p>
            </div>
          </div>
        </div>

        {/* Current Status Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Current Device Status</h2>
            <div
              className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                isSubscribedToNotifications
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {isSubscribedToNotifications ? (
                <>
                  <Bell className="w-4 h-4" />
                  <span className="text-sm font-medium">Active</span>
                </>
              ) : (
                <>
                  <BellOff className="w-4 h-4" />
                  <span className="text-sm font-medium">Inactive</span>
                </>
              )}
            </div>
          </div>

          <p className="text-gray-600 mb-4">
            {isSubscribedToNotifications
              ? 'This device is currently subscribed to push notifications. You will receive updates and alerts.'
              : 'This device is not subscribed. Enable notifications to stay updated.'}
          </p>

          {/* Subscribe/Unsubscribe Actions */}
          {!isSubscribedToNotifications ? (
            <div>
              {showLabelInput ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={deviceLabel}
                    onChange={(e) => setDeviceLabel(e.target.value)}
                    placeholder="Device label (optional, e.g., 'Work Laptop')"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={handleSubscribe}
                      disabled={actionLoading}
                      className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {actionLoading ? (
                        <RefreshCw className="w-5 h-5 animate-spin" />
                      ) : (
                        <Bell className="w-5 h-5" />
                      )}
                      Confirm Subscription
                    </button>
                    <button
                      onClick={() => {
                        setShowLabelInput(false);
                        setDeviceLabel('');
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowLabelInput(true)}
                  disabled={actionLoading}
                  className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Bell className="w-5 h-5" />
                  Enable Notifications
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={handleUnsubscribe}
              disabled={actionLoading}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {actionLoading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <BellOff className="w-5 h-5" />
              )}
              Disable Notifications
            </button>
          )}
        </div>

        {/* Subscribed Devices */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Subscribed Devices ({subscriptions.length})
            </h2>
            <div className="flex gap-2">
              <button
                onClick={fetchSubscriptions}
                disabled={loading}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
                title="Refresh"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
              {subscriptions.length > 0 && (
                <button
                  onClick={handleUnsubscribeAll}
                  disabled={actionLoading}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50 flex items-center gap-2"
                  title="Unsubscribe all devices"
                >
                  <Trash2 className="w-4 h-4" />
                  Unsubscribe All
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 text-primary-600 animate-spin" />
            </div>
          ) : subscriptions.length === 0 ? (
            <div className="text-center py-12">
              <Smartphone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No devices subscribed</p>
              <p className="text-gray-500 text-sm mt-2">
                Enable notifications on your devices to see them here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {subscriptions.map((sub) => {
                const isCurrentDevice = currentEndpoint === sub.endpoint;
                return (
                  <div
                    key={sub.id}
                    className={`flex items-center justify-between p-4 border rounded-lg transition ${
                      isCurrentDevice
                        ? 'border-primary-300 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          isCurrentDevice ? 'bg-primary-100' : 'bg-gray-100'
                        }`}
                      >
                        <Smartphone
                          className={`w-5 h-5 ${
                            isCurrentDevice ? 'text-primary-600' : 'text-gray-600'
                          }`}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {sub.label || 'Unnamed Device'}
                        </p>
                        <p className="text-sm text-gray-500">
                          Subscribed: {formatDate(sub.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isCurrentDevice && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-medium">
                          This Device
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-primary-50 border border-primary-200 rounded-lg p-4">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-primary-800">
              <p className="font-medium mb-1">About Push Notifications</p>
              <p>
                You can manage notifications separately for each device. Changes made here will
                only affect the selected device unless you choose to unsubscribe all devices.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default PushNotificationPage;