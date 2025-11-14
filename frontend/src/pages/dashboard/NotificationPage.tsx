import React, { useState, useMemo, useEffect } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Trash2, 
  Filter, 
  Search,
  Inbox,
  ExternalLink,
  Clock,
  User,
  Building2,
  Loader2
} from 'lucide-react';
import type { Notification } from '../../services/companyNotificationService';
import { useCompanyAuth } from '../../context/CompanyAuthContext';
import { useEmployeeAuth } from '../../context/EmployeeAuthContext';
import { useOutletContext } from 'react-router-dom';
import { Roles } from '../../layouts/DashboardLayout';
import { useSocket } from '../../context/SocketContext';

type FilterType = 'all' | 'unread' | 'read';

const NotificationsPage: React.FC = () => {
   
    const {role} =  useOutletContext<Roles>()
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    fetchNotifications,
    clearError,
    
  } = useNotifications();



 

  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Get current user info from your auth context or props
  const currentRecipientId = 'user-id'; // Replace with actual user ID
  const currentRecipientType: 'COMPANY' | 'EMPLOYEE' = 'EMPLOYEE'; // Replace with actual type

  // Filter and search notifications
  const filteredNotifications = useMemo(() => {
    let filtered = [...notifications];

    // Apply read/unread filter
    if (filter === 'unread') {
      filtered = filtered.filter((notif) =>
        notif.recipients.some(
          (r) => r.id === currentRecipientId && r.type === currentRecipientType && !r.read
        )
      );
    } else if (filter === 'read') {
      filtered = filtered.filter((notif) =>
        notif.recipients.some(
          (r) => r.id === currentRecipientId && r.type === currentRecipientType && r.read
        )
      );
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (notif) =>
          notif.title.toLowerCase().includes(query) ||
          notif.message.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [notifications, filter, searchQuery, currentRecipientId, currentRecipientType]);

  // Check if notification is read for current user
  const isNotificationRead = (notif: Notification): boolean => {
    const recipient = notif.recipients.find(
      (r) => r.id === currentRecipientId && r.type === currentRecipientType
    );
    return recipient?.read || false;
  };

  // Handle mark as read
  const handleMarkAsRead = async (notificationId: string) => {
    await markAsRead(notificationId);
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(notificationId);
      return newSet;
    });
  };

  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    const unreadNotifs = filteredNotifications.filter((notif) => !isNotificationRead(notif));
    await Promise.all(unreadNotifs.map((notif) => markAsRead(notif.id)));
    setSelectedIds(new Set());
  };

  // Handle selection toggle
  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Handle select all
  const toggleSelectAll = () => {
    if (selectedIds.size === filteredNotifications.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredNotifications.map((n) => n.id)));
    }
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Get sender icon
  const getSenderIcon = (senderType?: 'COMPANY' | 'EMPLOYEE') => {
    if (senderType === 'COMPANY') {
      return <Building2 className="w-4 h-4 text-blue-600" />;
    }
    return <User className="w-4 h-4 text-gray-600" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                <p className="text-sm text-gray-500">
                  {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                </p>
              </div>
            </div>
            <button
              onClick={fetchNotifications}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Refresh'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className=" mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
            <p className="text-sm text-red-800">{error}</p>
            <button
              onClick={clearError}
              className="text-red-600 hover:text-red-800 font-medium text-sm"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <div className="flex bg-gray-100 rounded-lg p-1">
                {(['all', 'unread', 'read'] as FilterType[]).map((filterType) => (
                  <button
                    key={filterType}
                    onClick={() => setFilter(filterType)}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      filter === filterType
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {filteredNotifications.length > 0 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === filteredNotifications.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    {selectedIds.size > 0 ? `${selectedIds.size} selected` : 'Select all'}
                  </span>
                </label>
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span>Mark all as read</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {isLoading && notifications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Loader2 className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-3" />
              <p className="text-gray-500">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No notifications</h3>
              <p className="text-gray-500">
                {searchQuery
                  ? 'No notifications match your search'
                  : filter === 'unread'
                  ? "You're all caught up!"
                  : 'No notifications to display'}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif) => {
              const isRead = isNotificationRead(notif);
              const isSelected = selectedIds.has(notif.id);

              return (
                <div
                  key={notif.id}
                  className={`bg-white rounded-lg shadow-sm border transition-all hover:shadow-md ${
                    isRead
                      ? 'border-gray-200'
                      : 'border-blue-200 bg-blue-50/30'
                  } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                >
                  <div className="p-4">
                    <div className="flex items-start space-x-3">
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelection(notif.id)}
                        className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {getSenderIcon(notif.senderType)}
                            <h3 className={`text-sm font-semibold ${isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                              {notif.title}
                            </h3>
                            {!isRead && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                New
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>{formatDate(notif.createdAt)}</span>
                            </div>
                          </div>
                        </div>

                        <p className={`text-sm mb-3 ${isRead ? 'text-gray-600' : 'text-gray-700'}`}>
                          {notif.message}
                        </p>

                        {/* Actions */}
                        <div className="flex items-center space-x-3">
                          {!isRead && (
                            <button
                              onClick={() => handleMarkAsRead(notif.id)}
                              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Mark as read</span>
                            </button>
                          )}
                          {notif.link && (
                            <a
                              href={notif.link}
                              onClick={() => !isRead && handleMarkAsRead(notif.id)}
                              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>View details</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;