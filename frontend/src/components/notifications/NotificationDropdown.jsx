import React, { useEffect, useState, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Bell, Check, CheckCheck, X, ExternalLink,
  GraduationCap, DollarSign, Users, AlertTriangle, Zap, 
  Mail, Calendar, Shield, Activity
} from 'lucide-react';
import { useSocket } from '../../contexts/SocketContext';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const typeConfig = {
  info:            { bg: 'bg-blue-50',   border: 'border-blue-100',   icon: Activity,       iconBg: 'bg-blue-100',   iconColor: 'text-blue-600' },
  success:         { bg: 'bg-green-50',  border: 'border-green-100',  icon: Zap,            iconBg: 'bg-green-100',  iconColor: 'text-green-600' },
  warning:         { bg: 'bg-amber-50',  border: 'border-amber-100',  icon: AlertTriangle,  iconBg: 'bg-amber-100',  iconColor: 'text-amber-600' },
  error:           { bg: 'bg-red-50',    border: 'border-red-100',    icon: Shield,         iconBg: 'bg-red-100',    iconColor: 'text-red-600' },
  action_required: { bg: 'bg-purple-50', border: 'border-purple-100', icon: Mail,           iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
};

const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const queryClient = useQueryClient();
  const { socket } = useSocket();

  // Fetch notifications from the API
  const { data, refetch } = useQuery({
    queryKey: ['my-notifications'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API}/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    },
    refetchInterval: 60000 // Fallback poll every 60s
  });

  const notifications = data?.data || [];
  const unreadCount = data?.unreadCount || 0;

  // Listen for real-time notifications via WebSocket
  useEffect(() => {
    if (socket) {
      const handleNew = () => {
        refetch(); // Re-fetch from server on new notification
      };
      socket.on('NEW_NOTIFICATION', handleNew);
      return () => socket.off('NEW_NOTIFICATION', handleNew);
    }
  }, [socket, refetch]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API}/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      refetch();
    } catch (err) {
      console.error('Failed to mark as read', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API}/notifications/read-all`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      refetch();
    } catch (err) {
      console.error('Failed to mark all as read', err);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors group"
        aria-label="Open notifications"
      >
        <Bell size={20} className="text-gray-600 group-hover:text-gray-900 transition-colors" />
        
        {/* Unread Badge */}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-black shadow-lg shadow-red-500/30"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-12 w-96 bg-white rounded-2xl shadow-2xl shadow-gray-900/10 border border-gray-200 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
                <p className="text-xs text-gray-500">{unreadCount} unread</p>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button 
                    onClick={handleMarkAllAsRead}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <CheckCheck size={14} /> Mark all read
                  </button>
                )}
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                  <X size={16} className="text-gray-400" />
                </button>
              </div>
            </div>

            {/* Notification List */}
            <div className="max-h-[420px] overflow-y-auto custom-scrollbar">
              {notifications.length > 0 ? notifications.map((notif) => {
                const config = typeConfig[notif.type] || typeConfig.info;
                const Icon = config.icon;
                return (
                  <motion.div
                    key={notif._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`flex items-start gap-3 px-5 py-4 border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer ${
                      !notif.isRead ? 'bg-primary-50/30' : ''
                    }`}
                    onClick={() => !notif.isRead && handleMarkAsRead(notif._id)}
                  >
                    {/* Icon */}
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${config.iconBg} ${config.iconColor}`}>
                      <Icon size={16} />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className={`text-xs font-bold truncate ${!notif.isRead ? 'text-gray-900' : 'text-gray-600'}`}>
                          {notif.title}
                        </p>
                        {!notif.isRead && (
                          <span className="w-2 h-2 rounded-full bg-primary-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 line-clamp-2">{notif.message}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">{timeAgo(notif.createdAt)}</span>
                        {notif.actionLink && (
                          <Link 
                            to={notif.actionLink} 
                            onClick={(e) => e.stopPropagation()}
                            className="text-[10px] font-bold text-primary-600 hover:text-primary-700 flex items-center gap-0.5"
                          >
                            View <ExternalLink size={10} />
                          </Link>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              }) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <Bell size={24} className="text-gray-300" />
                  </div>
                  <p className="text-sm font-semibold text-gray-400">All caught up!</p>
                  <p className="text-xs text-gray-400 mt-1">No notifications yet.</p>
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-5 py-3 border-t border-gray-100 text-center">
                <Link 
                  to="/dashboard/notifications" 
                  className="text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  View All Notifications →
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
