import React,{ useState } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '../../../context/NotificationContext';
import { useNavigate, useOutletContext } from 'react-router-dom';


export default function NotificationBell() {
  const { unreadCount, notifications, markAsRead, isLoading } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const {role} =  useOutletContext()

  // Get only the first 5 notifications
  const recentNotifications = notifications.slice(0, 3);
  const hasMoreNotifications = notifications.length > 3;

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
            {unreadCount > 3 ? '3+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[500px] overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
            </div>

            <div className="overflow-y-auto flex-1">
              {isLoading ? (
                <div className="py-12 text-center text-gray-500">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="py-12 text-center text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No notifications</p>
                </div>
              ) : (
                <>
                  {recentNotifications.map((notif) => {
                    const recipient = notif.recipients.find((r) => r.id);
                    const isUnread = recipient && !recipient.read;

                    return (
                      <div
                        key={notif.id}
                        onClick={() => {
                          if (isUnread) markAsRead(notif.id);
                          if (notif.link) window.open(notif.link, '_blank', 'noopener,noreferrer');
                          setIsOpen(!isOpen)
                        }}
                        className={`px-4 py-3 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 ${
                          isUnread ? 'bg-primary-50' : 'bg-white'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {isUnread && (
                            <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm ${isUnread ? 'font-semibold text-gray-900' : 'text-gray-900'}`}>
                              {notif.title}
                            </p>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {notif.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(notif.createdAt).toLocaleString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {hasMoreNotifications && (
                    <div className=" border-t hover:bg-neutral-200 cursor-pointer border-gray-200">
                      <button
                        onClick={() => {
                          window.open(`/${role}/dashboard/notifications`,'_blank');
                          setIsOpen(!isOpen)
                          // Add your navigation logic here
                          // For example:  or window.location.href = '/notifications'
                          console.log('Navigate to all notifications page');
                        }}
                        className="w-full text-center px-4 py-3 text-sm font-medium cursor-pointer text-primary-600 hover:text-primary-700 transition-colors"
                      >
                        See more notifications
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}