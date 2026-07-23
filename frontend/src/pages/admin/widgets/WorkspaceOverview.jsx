import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DollarSign, Activity, TrendingUp, Users, GraduationCap, Mail, Calendar, AlertTriangle, Shield, Zap } from 'lucide-react';
import { useSocket } from '../../../contexts/SocketContext';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const formatCurrency = (value) => {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
  return `₹${value}`;
};

const severityColors = {
  info: { bg: 'bg-blue-100', text: 'text-blue-600', icon: Activity },
  warning: { bg: 'bg-amber-100', text: 'text-amber-600', icon: AlertTriangle },
  critical: { bg: 'bg-red-100', text: 'text-red-600', icon: Shield },
  success: { bg: 'bg-green-100', text: 'text-green-600', icon: Zap }
};

const actionIcons = {
  ApplicationSubmitted: { bg: 'bg-blue-100', text: 'text-blue-600', icon: GraduationCap },
  PaymentCompleted: { bg: 'bg-green-100', text: 'text-green-600', icon: DollarSign },
  StudentCreated: { bg: 'bg-emerald-100', text: 'text-emerald-600', icon: Users },
  SystemError: { bg: 'bg-red-100', text: 'text-red-600', icon: AlertTriangle },
  CourseUpdated: { bg: 'bg-purple-100', text: 'text-purple-600', icon: Calendar },
  BlogPublished: { bg: 'bg-amber-100', text: 'text-amber-600', icon: Mail },
};

const getActivityStyle = (log) => {
  return actionIcons[log.action] || severityColors[log.severity] || severityColors.info;
};

const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(date).toLocaleDateString();
};

export const WorkspaceOverview = ({ kpis, recentActivities }) => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  const [liveActivities, setLiveActivities] = useState([]);

  // Fetch real AuditLog data from the centralized Activity Timeline API
  const { data: activityData } = useQuery({
    queryKey: ['admin-activity-timeline'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API}/activity?limit=30`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    },
    refetchInterval: 30000 // Fallback poll every 30s
  });

  // Merge API data into local state on load
  useEffect(() => {
    if (activityData?.data) {
      setLiveActivities(activityData.data);
    }
  }, [activityData]);

  // Listen for real-time NEW_ACTIVITY_LOG events via WebSocket
  useEffect(() => {
    if (socket) {
      const handleNewLog = (log) => {
        setLiveActivities(prev => [log, ...prev].slice(0, 50)); // Prepend and cap at 50
      };
      socket.on('NEW_ACTIVITY_LOG', handleNewLog);
      return () => socket.off('NEW_ACTIVITY_LOG', handleNewLog);
    }
  }, [socket]);

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="space-y-6">
      {/* Top Priority KPIs */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div variants={item} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform"><DollarSign size={80} /></div>
           <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Est. Revenue</h3>
           <p className="text-4xl font-black text-gray-900">{formatCurrency(kpis?.revenue || 0)}</p>
           <span className="inline-block mt-3 px-2 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-md">+14% this month</span>
        </motion.div>
        
        <motion.div variants={item} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform"><Activity size={80} /></div>
           <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Live Traffic</h3>
           <p className="text-4xl font-black text-gray-900">{kpis?.websiteVisitors || 0}</p>
           <span className="inline-block mt-3 px-2 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-md">842 Active Now</span>
        </motion.div>

        <motion.div variants={item} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform"><TrendingUp size={80} /></div>
           <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Conversions</h3>
           <p className="text-4xl font-black text-gray-900">4.2%</p>
           <span className="inline-block mt-3 px-2 py-1 bg-amber-50 text-amber-600 text-xs font-bold rounded-md">Lead to Applicant</span>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Analytics Chart Placeholder */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-96 flex flex-col justify-between">
           <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-gray-900">Revenue & Enrollment Velocity</h3>
             <span className="flex items-center gap-2 text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">Live Sync</span>
           </div>
           {/* Mock Stripe Chart */}
           <div className="flex-1 flex items-end gap-2 mt-4">
              {[40, 55, 45, 75, 65, 90, 85, 110, 95, 120, 105, 130].map((h, i) => (
                <div key={i} className="flex-1 bg-gray-100 rounded-t-sm hover:bg-primary-100 transition-colors cursor-pointer group relative flex flex-col justify-end h-full">
                  <div className="w-full rounded-t-sm transition-all duration-500 bg-primary-500/80 group-hover:bg-primary-600" style={{ height: `${(h/130)*100}%` }}></div>
                </div>
              ))}
           </div>
           <div className="flex justify-between text-xs text-gray-400 font-semibold mt-4">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
           </div>
        </div>

        {/* Real-Time Activity Stream — Now wired to AuditLog API + WebSocket */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-96 flex flex-col">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-gray-900">Activity Stream</h3>
             <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
             </span>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {liveActivities.length > 0 ? liveActivities.map((log, idx) => {
              const style = getActivityStyle(log);
              const Icon = style.icon;
              return (
                <motion.div 
                  key={log._id || idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="group flex items-start gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${style.bg} ${style.text}`}>
                    <Icon size={14} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-gray-900 truncate">{log.action?.replace(/([A-Z])/g, ' $1').trim()}</p>
                    <p className="text-[10px] text-gray-500 truncate mt-0.5">{log.details || log.entityType}</p>
                    <p className="text-[9px] uppercase font-bold text-gray-400 mt-1">{timeAgo(log.createdAt)}</p>
                  </div>
                  {log.severity === 'critical' && (
                    <span className="shrink-0 w-2 h-2 rounded-full bg-red-500 mt-2 animate-pulse" />
                  )}
                </motion.div>
              );
            }) : (
              <p className="text-sm text-gray-500 text-center mt-10">No recent activity.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
