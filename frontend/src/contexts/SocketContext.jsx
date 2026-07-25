import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/useAuthStore';
import { toast } from 'sonner';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Only connect if user is logged in
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL?.replace('/api/v1', '') || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5000');
    
    const newSocket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket']
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      // console.log('Connected to WebSocket server');
      
      // Join specific rooms based on user role
      if (user.role === 'admin' || user.role === 'super_admin' || user.role === 'operations_manager') {
        newSocket.emit('join_admin_room');
      } else {
        newSocket.emit('join_user_room', user.id || user._id);
      }
    });

    // Listen for generic notifications and refresh data
    newSocket.on('notification', (data) => {
      if (data.type === 'success') toast.success(data.message, { title: data.title });
      else if (data.type === 'error') toast.error(data.message, { title: data.title });
      else toast(data.message, { title: data.title });
      
      // Instantly synchronize data!
      queryClient.invalidateQueries();
    });

    // Listen for admin notifications
    newSocket.on('admin_notification', (data) => {
      toast.info(data.message, { title: `Admin Alert: ${data.title}`, icon: '🔔' });
      // Synchronize dashboard
      queryClient.invalidateQueries();
    });

    // Listen for Admin Command Center Analytics Updates
    newSocket.on('ADMIN_ANALYTICS_UPDATED', (data) => {
      // Invalidate specifically the admin analytics cache
      queryClient.invalidateQueries(['admin-analytics']);
      // We could optionally toast this, but it might be noisy for every change
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
