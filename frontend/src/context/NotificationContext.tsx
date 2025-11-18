import React, { createContext, useContext, useEffect, useState, useCallback, type ReactNode, useMemo } from 'react';
import { useSocket, useSocketEvent } from './SocketContext';
import companyNotificationService, { type Notification, type Recipient } from '../services/companyNotificationService';

// ────────────────────────────────────────────────────────
// TYPE DEFINITIONS
// ────────────────────────────────────────────────────────

interface NotificationContextValue {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  recipientId: string | null;
  recipientType: 'COMPANY' | 'EMPLOYEE' | null;
  page: number;
  limit: number;
  search: string;
  totalPages: number;
  totalNotifications: number;
  setRecipient: (recipientId: string, recipientType: 'COMPANY' | 'EMPLOYEE') => void;
  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  createNotification: (data: CreateNotificationInput) => Promise<Notification | null>;
  clearError: () => void;
  getUnreadNotifications: () => Notification[];
  getReadNotifications: () => Notification[];
  updatePagination: (newPage?: number, newLimit?: number) => void;
  updateSearch: (searchTerm: string) => void;
}

interface CreateNotificationInput {
  recipients: Recipient[];
  title: string;
  message: string;
  link?: string;
}

interface NotificationProviderProps {
  children: ReactNode;
}

// ────────────────────────────────────────────────────────
// CREATE CONTEXT
// ────────────────────────────────────────────────────────

const NotificationContext = createContext<NotificationContextValue | null>(null);

// ────────────────────────────────────────────────────────
// NOTIFICATION PROVIDER COMPONENT
// ────────────────────────────────────────────────────────

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const { isConnected } = useSocket();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [recipientId, setRecipientId] = useState<string | null>(null);
  const [recipientType, setRecipientType] = useState<'COMPANY' | 'EMPLOYEE' | null>(null);
  
  // ────────────────────────────────
  // PAGINATION & SEARCH STATE
  // ────────────────────────────────
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>('');
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalNotifications, setTotalNotifications] = useState<number>(0);

  // ────────────────────────────────
  // SET RECIPIENT (Called after login/auth)
  // ────────────────────────────────

  const setRecipient = useCallback((id: string, type: 'COMPANY' | 'EMPLOYEE'): void => {
    setRecipientId(id);
    setRecipientType(type);
  }, []);

  // ────────────────────────────────
  // UPDATE PAGINATION
  // ────────────────────────────────

  const updatePagination = useCallback((newPage?: number, newLimit?: number): void => {
    if (newPage !== undefined) {
      setPage(newPage);
    }
    if (newLimit !== undefined) {
      setLimit(newLimit);
      setPage(1); // Reset to first page when limit changes
    }
  }, []);

  // ────────────────────────────────
  // UPDATE SEARCH
  // ────────────────────────────────

  const updateSearch = useCallback((searchTerm: string): void => {
    setSearch(searchTerm);
    setPage(1); // Reset to first page when search changes
  }, []);

  // ────────────────────────────────
  // COMPUTED VALUES
  // ────────────────────────────────

  const unreadCount = useMemo(() => {
    if (!recipientId || !recipientType) return 0;
    
    return notifications.filter((notif) =>
      notif.recipients.some(
        (r) => r.id === recipientId && r.type === recipientType && !r.read
      )
    ).length;
  }, [notifications, recipientId, recipientType]);

  // ────────────────────────────────
  // FETCH NOTIFICATIONS
  // ────────────────────────────────

  const fetchNotifications = useCallback(async (): Promise<void> => {
    if (!recipientId || !recipientType) {
      console.warn('Cannot fetch notifications: recipient not set');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const { notifications: data, meta } = await companyNotificationService.getNotifications(page, limit, search);
      
      // Filter notifications for current recipient
      const filtered = data.filter((notif:any) =>
        notif.recipients.some(
          (r:any) => r.id === recipientId && r.type === recipientType
        )
      );
      
      setNotifications(filtered);
      
      // Update pagination metadata
      if (meta) {
        setTotalPages(meta.totalPages || 0);
        setTotalNotifications(meta.total || 0);
      }
    } catch (err: any) {
      console.error('Failed to fetch notifications:', err);
      setError(err.message || 'Failed to fetch notifications');
    } finally {
      setIsLoading(false);
    }
  }, [recipientId, recipientType, page, limit, search]);

  // ────────────────────────────────
  // MARK AS READ
  // ────────────────────────────────

  const markAsRead = useCallback(async (notificationId: string): Promise<void> => {
    if (!recipientId || !recipientType) {
      console.warn('Cannot mark as read: recipient not set');
      return;
    }

    try {
      const updated = await companyNotificationService.markAsRead(notificationId);
      
      console.warn('SHit sdfbf ;:',updated);
      
      // Update local state optimistically
      setNotifications((prev) =>
        prev.map((notif) => {
          if (notif.id === notificationId) {
            return {
              ...notif,
              recipients: notif.recipients.map((r) => {
                if (r.id === recipientId && r.type === recipientType) {
                  return { ...r, read: true };
                }
                return r;
              }),
            };
          }
          return notif;
        })
      );
    } catch (err: any) {
      console.error('Failed to mark notification as read:', err);
      setError(err.message || 'Failed to mark notification as read');
    }
  }, [recipientId, recipientType]);

  // ────────────────────────────────
  // CREATE NOTIFICATION
  // ────────────────────────────────

  const createNotification = useCallback(async (
    data: CreateNotificationInput
  ): Promise<Notification | null> => {
    if (!recipientId || !recipientType) {
      console.warn('Cannot create notification: recipient not set');
      return null;
    }

    try {
      const newNotification = await companyNotificationService.createNotification(data);
      
      // Add to local state if current user is a recipient
      const isRecipient = newNotification.recipients.some(
        (r) => r.id === recipientId && r.type === recipientType
      );
      
      if (isRecipient) {
        setNotifications((prev) => [newNotification, ...prev]);
      }
      
      return newNotification;
    } catch (err: any) {
      console.error('Failed to create notification:', err);
      setError(err.message || 'Failed to create notification');
      return null;
    }
  }, [recipientId, recipientType]);

  // ────────────────────────────────
  // HELPER FUNCTIONS
  // ────────────────────────────────

  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  const getUnreadNotifications = useCallback((): Notification[] => {
    if (!recipientId || !recipientType) return [];
    
    return notifications.filter((notif) =>
      notif.recipients.some(
        (r) => r.id === recipientId && r.type === recipientType && !r.read
      )
    );
  }, [notifications, recipientId, recipientType]);

  const getReadNotifications = useCallback((): Notification[] => {
    if (!recipientId || !recipientType) return [];
    
    return notifications.filter((notif) =>
      notif.recipients.some(
        (r) => r.id === recipientId && r.type === recipientType && r.read
      )
    );
  }, [notifications, recipientId, recipientType]);

  // ────────────────────────────────
  // SOCKET EVENT HANDLERS
  // ────────────────────────────────

  // Listen for new notifications
  useSocketEvent('new-notification', (notification: Notification) => {
    console.log('Received new notification:', notification);
    
    if (!recipientId || !recipientType) return;
    
    // Check if current user is a recipient
    const isRecipient = notification.recipients.some(
      (r) => r.id === recipientId && r.type === recipientType
    );
    
    if (isRecipient) {
      setNotifications((prev) => {
        // Avoid duplicates
        const exists = prev.some((n) => n.id === notification.id);
        if (exists) return prev;
        return [notification, ...prev];
      });
    }
  });

  // Listen for notification read updates
  useSocketEvent('notification-read', (data: { notificationId: string; recipientId: string }) => {
    console.log('Notification marked as read:', data);
    
    if (!recipientId || !recipientType) return;
    
    if (data.recipientId === recipientId) {
      setNotifications((prev) =>
        prev.map((notif) => {
          if (notif.id === data.notificationId) {
            return {
              ...notif,
              recipients: notif.recipients.map((r) => {
                if (r.id === recipientId && r.type === recipientType) {
                  return { ...r, read: true };
                }
                return r;
              }),
            };
          }
          return notif;
        })
      );
    }
  });

  // ────────────────────────────────
  // EFFECTS
  // ────────────────────────────────

  // Fetch notifications when recipient is set and socket connects
  useEffect(() => {
    if (recipientId && recipientType && isConnected) {
      fetchNotifications();
    }
  }, [recipientId, recipientType, isConnected, fetchNotifications]);

  // ────────────────────────────────
  // CONTEXT VALUE
  // ────────────────────────────────

  const contextValue: NotificationContextValue = {
    notifications,
    unreadCount,
    isLoading,
    error,
    recipientId,
    recipientType,
    page,
    limit,
    search,
    totalPages,
    totalNotifications,
    setRecipient,
    fetchNotifications,
    markAsRead,
    createNotification,
    clearError,
    getUnreadNotifications,
    getReadNotifications,
    updatePagination,
    updateSearch,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

// ────────────────────────────────────────────────────────
// CUSTOM HOOK
// ────────────────────────────────────────────────────────

export const useNotifications = (): NotificationContextValue => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }

  return context;
};

// ────────────────────────────────────────────────────────
// EXAMPLE NOTIFICATION COMPONENT
// ────────────────────────────────────────────────────────

export const NotificationBell: React.FC = () => {
  const { unreadCount, notifications, markAsRead, isLoading } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'relative',
          padding: '10px 15px',
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        🔔 Notifications
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              background: 'red',
              color: 'white',
              borderRadius: '50%',
              padding: '2px 6px',
              fontSize: '12px',
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '10px',
            width: '350px',
            maxHeight: '400px',
            overflowY: 'auto',
            background: 'white',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            zIndex: 1000,
          }}
        >
          <div style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
            <strong>Notifications</strong>
          </div>

          {isLoading ? (
            <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
          ) : notifications.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
              No notifications
            </div>
          ) : (
            notifications.map((notif) => {
              const recipient = notif.recipients.find((r) => r.id);
              const isUnread = recipient && !recipient.read;

              return (
                <div
                  key={notif.id}
                  onClick={() => {
                    if (isUnread) markAsRead(notif.id);
                    if (notif.link) window.location.href = notif.link;
                  }}
                  style={{
                    padding: '12px',
                    borderBottom: '1px solid #eee',
                    background: isUnread ? '#f0f8ff' : 'white',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontWeight: isUnread ? 'bold' : 'normal' }}>
                    {notif.title}
                  </div>
                  <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
                    {notif.message}
                  </div>
                  <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                    {new Date(notif.createdAt).toLocaleString()}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

// ────────────────────────────────────────────────────────
// EXAMPLE USAGE WITH PAGINATION & SEARCH
// ────────────────────────────────────────────────────────

/*
import { SocketProvider } from './SocketContext';
import { NotificationProvider, NotificationBell, useNotifications } from './NotificationContext';

function App() {
  return (
    <SocketProvider serverUrl="http://localhost:3001">
      <NotificationProvider>
        <AuthenticatedApp />
      </NotificationProvider>
    </SocketProvider>
  );
}

function AuthenticatedApp() {
  const { setRecipient } = useNotifications();

  // Call this after successful login/authentication
  useEffect(() => {
    const user = getCurrentUser(); // Your auth logic
    if (user) {
      setRecipient(user.id, user.type); // Set recipient dynamically
    }
  }, [setRecipient]);

  return (
    <div className="App">
      <header>
        <NotificationBell />
      </header>
      <MainContent />
    </div>
  );
}

function MainContent() {
  const { 
    createNotification, 
    getUnreadNotifications,
    page,
    limit,
    totalPages,
    totalNotifications,
    updatePagination,
    updateSearch,
    search
  } = useNotifications();

  const sendTestNotification = async () => {
    await createNotification({
      recipients: [
        { id: 'user-123', type: 'EMPLOYEE', read: false },
      ],
      title: 'Test Notification',
      message: 'This is a test notification',
      link: '/dashboard',
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSearch(e.target.value);
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      updatePagination(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      updatePagination(page - 1);
    }
  };

  const handleLimitChange = (newLimit: number) => {
    updatePagination(undefined, newLimit);
  };

  return (
    <div>
      <button onClick={sendTestNotification}>Send Test Notification</button>
      <p>Unread: {getUnreadNotifications().length}</p>
      
      <input 
        type="text" 
        value={search} 
        onChange={handleSearchChange} 
        placeholder="Search notifications..."
      />
      
      <div>
        <button onClick={handlePrevPage} disabled={page === 1}>Previous</button>
        <span>Page {page} of {totalPages}</span>
        <button onClick={handleNextPage} disabled={page === totalPages}>Next</button>
      </div>
      
      <div>
        <label>Items per page:</label>
        <select value={limit} onChange={(e) => handleLimitChange(Number(e.target.value))}>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>
      
      <p>Total: {totalNotifications} notifications</p>
    </div>
  );
}
*/