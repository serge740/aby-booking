import React, { createContext, useContext, useEffect, useRef, useState, useCallback, type ReactNode } from 'react';
import { io, Socket, type ManagerOptions, type SocketOptions } from 'socket.io-client';

// Type definitions
interface SocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
  connectionError: string | null;
  reconnectAttempts: number;
  connect: () => void;
  disconnect: () => void;
  emit: <T = any>(event: string, data?: T, callback?: (response: any) => void) => void;
  on: (event: string, handler: (...args: any[]) => void) => (() => void) | undefined;
  off: (event: string, handler: (...args: any[]) => void) => void;
}

interface SocketProviderProps {
  children: ReactNode;
  serverUrl?: string;
  options?: Partial<ManagerOptions & SocketOptions>;
}

// Create the Socket Context
const SocketContext = createContext<SocketContextValue | null>(null);

// Socket Context Provider Component
export const SocketProvider: React.FC<SocketProviderProps> = ({ 
  children, 
  serverUrl = 'http://localhost:3001',
  options = {}
}) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttemptsRef = useRef<number>(0);
  const maxReconnectAttempts = 5;

  // Default socket options with auto reconnection
  const defaultOptions: Partial<ManagerOptions & SocketOptions> = {
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: maxReconnectAttempts,
    timeout: 20000,
    forceNew: true,
    ...options
  };

  // Initialize socket connection
  const initializeSocket = useCallback((): Socket => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    let socket = io(serverUrl, defaultOptions);

    if (!socket) {
      socket = io(serverUrl, defaultOptions);
    }

    socketRef.current = socket;
    
    // Connection event handlers
    socketRef.current.on('connect', () => {
      console.log('Socket connected:', socketRef.current?.id);
      setIsConnected(true);
      setConnectionError(null);
      reconnectAttemptsRef.current = 0;
    });

    socketRef.current.on('disconnect', (reason: string) => {
      console.log('Socket disconnected:', reason);
      setIsConnected(false);
      
      // Handle different disconnect reasons
      if (reason === 'io server disconnect') {
        // Server initiated disconnect, try to reconnect
        handleReconnection();
      }
    });

    socketRef.current.on('connect_error', (error: Error) => {
      console.error('Socket connection error:', error);
      setConnectionError(error.message);
      setIsConnected(false);
      handleReconnection();
    });

    socketRef.current.on('reconnect', (attemptNumber: number) => {
      console.log('Socket reconnected after', attemptNumber, 'attempts');
      setIsConnected(true);
      setConnectionError(null);
      reconnectAttemptsRef.current = 0;
    });

    socketRef.current.on('reconnect_attempt', (attemptNumber: number) => {
      console.log('Reconnection attempt:', attemptNumber);
      reconnectAttemptsRef.current = attemptNumber;
    });

    socketRef.current.on('reconnect_error', (error: Error) => {
      console.error('Reconnection error:', error);
      setConnectionError(error.message);
    });

    socketRef.current.on('reconnect_failed', () => {
      console.error('Failed to reconnect after maximum attempts');
      setConnectionError('Failed to reconnect to server');
    });

    return socketRef.current;
  }, [serverUrl, JSON.stringify(defaultOptions)]);

  // Manual reconnection handler
  const handleReconnection = useCallback((): void => {
    if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
      console.log('Max reconnection attempts reached');
      return;
    }

    // Clear existing timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    // Exponential backoff for reconnection
    const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
    
    reconnectTimeoutRef.current = setTimeout(() => {
      if (!socketRef.current?.connected) {
        console.log('Attempting manual reconnection...');
        socketRef.current?.connect();
      }
    }, delay);
  }, [maxReconnectAttempts]);

  // Manual connect function
  const connect = useCallback((): void => {
    if (!socketRef.current) {
      initializeSocket();
    } else if (!socketRef.current.connected) {
      socketRef.current.connect();
    }
  }, [initializeSocket]);

  // Manual disconnect function
  const disconnect = useCallback((): void => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (socketRef.current) {
      socketRef.current.disconnect();
      setIsConnected(false);
    }
  }, []);

  // Emit event function
  const emit = useCallback(<T = any>(
    event: string, 
    data?: T, 
    callback?: (response: any) => void
  ): void => {
    if (socketRef.current?.connected) {
      if (callback) {
        socketRef.current.emit(event, data, callback);
      } else {
        socketRef.current.emit(event, data);
      }
    } else {
      console.warn('Socket not connected. Cannot emit event:', event);
    }
  }, []);

  // Listen to event function
  const on = useCallback((
    event: string, 
    handler: (...args: any[]) => void
  ): (() => void) | undefined => {
    if (socketRef.current) {
      socketRef.current.on(event, handler);
      
      // Return cleanup function
      return () => {
        socketRef.current?.off(event, handler);
      };
    }
  }, []);

  // Remove event listener function
  const off = useCallback((
    event: string, 
    handler: (...args: any[]) => void
  ): void => {
    if (socketRef.current) {
      socketRef.current.off(event, handler);
    }
  }, []);

  // Initialize socket on mount
  useEffect(() => {
    const socket = initializeSocket();
    
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socket) {
        socket.disconnect();
      }
    };
  }, [initializeSocket]);

  const contextValue: SocketContextValue = {
    socket: socketRef.current,
    isConnected,
    connectionError,
    reconnectAttempts: reconnectAttemptsRef.current,
    connect,
    disconnect,
    emit,
    on,
    off
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to use the Socket Context
export const useSocket = (): SocketContextValue => {
  const context = useContext(SocketContext);
  
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  
  return context;
};

// Custom hook for socket event listeners with automatic cleanup
export const useSocketEvent = (
  event: string, 
  handler: (...args: any[]) => void, 
  dependencies: React.DependencyList = []
): void => {
  const { on,socket } = useSocket();
  
  useEffect(() => {
    if (!event || !handler) return;
    
    const cleanup = on(event, handler);
    return cleanup;
  }, [event,socket, handler, on, ...dependencies]);
};

// Example usage component
export const SocketStatus: React.FC = () => {
  const { isConnected, connectionError, reconnectAttempts, connect, disconnect } = useSocket();
  
  return (
    <div style={{ 
      padding: '10px', 
      border: '1px solid #ccc', 
      borderRadius: '4px',
      margin: '10px 0'
    }}>
      <h3>Socket Status</h3>
      <p>Status: <span style={{ color: isConnected ? 'green' : 'red' }}>
        {isConnected ? 'Connected' : 'Disconnected'}
      </span></p>
      
      {connectionError && (
        <p style={{ color: 'red' }}>Error: {connectionError}</p>
      )}
      
      {reconnectAttempts > 0 && (
        <p>Reconnection attempts: {reconnectAttempts}</p>
      )}
      
      <div>
        <button onClick={connect} disabled={isConnected}>
          Connect
        </button>
        <button onClick={disconnect} disabled={!isConnected} style={{ marginLeft: '10px' }}>
          Disconnect
        </button>
      </div>
    </div>
  );
};

// Example usage in your app:
/*
import { SocketProvider, useSocket, useSocketEvent } from './SocketContext';

interface Message {
  text: string;
  timestamp: number;
}

function App(): JSX.Element {
  return (
    <SocketProvider serverUrl="http://localhost:3001">
      <div className="App">
        <SocketStatus />
        <ChatComponent />
      </div>
    </SocketProvider>
  );
}

function ChatComponent(): JSX.Element {
  const { emit, isConnected } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);

  // Listen for incoming messages
  useSocketEvent('message', (data: Message) => {
    setMessages(prev => [...prev, data]);
  });

  const sendMessage = (message: string): void => {
    if (isConnected) {
      emit<Message>('message', { text: message, timestamp: Date.now() });
    }
  };

  return (
    <div>
      // Your chat UI here
    </div>
  );
}
*/