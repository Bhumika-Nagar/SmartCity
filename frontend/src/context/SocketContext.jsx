import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { USE_MOCK, SOCKET_URL, SOCKET_EVENTS } from '../utils/constants';
import { mockBus } from '../mock/mockServer';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user) {
      setConnected(false);
      return;
    }

    if (USE_MOCK) {
      // The mock bus is always "connected" — it's just an EventTarget.
      setConnected(true);
      return;
    }

    const token = localStorage.getItem('token');
    const socket = io(SOCKET_URL, { auth: { token } });
    socketRef.current = socket;

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user]);

  // Uniform subscribe API regardless of transport (mock EventTarget vs socket.io)
  const subscribe = (event, handler) => {
    if (USE_MOCK) {
      const listener = (e) => handler(e.detail);
      mockBus.addEventListener(event, listener);
      return () => mockBus.removeEventListener(event, listener);
    }
    const socket = socketRef.current;
    if (!socket) return () => {};
    socket.on(event, handler);
    return () => socket.off(event, handler);
  };

  return (
    <SocketContext.Provider value={{ connected, subscribe, events: SOCKET_EVENTS }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error('useSocket must be used within SocketProvider');
  return ctx;
}
