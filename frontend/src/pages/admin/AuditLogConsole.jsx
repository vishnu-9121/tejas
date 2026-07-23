import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Activity, Terminal, ShieldAlert, 
  Search, Filter, RefreshCw, Eye, AlertTriangle, 
  CheckCircle2, XCircle, User, Clock, ChevronLeft, ChevronRight, Code
} from 'lucide-react';
import { useSocket } from '../../contexts/SocketContext';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const TABS = [
  { id: 'activity', label: 'Activity Timeline', icon: Activity, description: 'Student & faculty user journey events' },
  { id: 'audit', label: 'Audit Logs', icon: ShieldCheck, description: 'Administrative & CMS content edits' },
  { id: 'system', label: 'System Logs', icon: Terminal, description: 'Database operations & system events' },
  { id: 'security', label: 'Security Logs', icon: ShieldAlert, description: 'Logins, logouts, role & permission changes' }
];

const severityBadges = {
  info: 'bg-blue-50 text-blue-700 border-blue-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  critical: 'bg-red-50 text-red-700 border-red-200'
};

export default function AuditLogConsole() {
  const [activeTab, setActiveTab] = useState('activity');
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState(null);
  const [liveLogs, setLiveLogs] = useState([]);

  const { socket } = useSocket();

  // Fetch logs via React Query
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['audit-logs', activeTab, page, severityFilter, statusFilter, searchTerm],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        category: activeTab,
        page,
        limit: 25,
        ...(severityFilter !== 'all' && { severity: severityFilter }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm })
      });

      const res = await axios.get(`${API}/activity?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    },
    keepPreviousData: true
  });

  // Fetch log statistics summary
  const { data: statsData } = useQuery({
    queryKey: ['audit-log-stats'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API}/activity/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    },
    refetchInterval: 30000
  });

  const logs = data?.data || [];
  const pagination = data?.pagination || { page: 1, pages: 1, total: 0 };
  const stats = statsData?.data || { activityCount: 0, auditCount: 0, systemCount: 0, securityCount: 0, criticalCount: 0 };

  // Real-time WebSocket streaming of new logs
  useEffect(() => {
    if (socket) {
      const handleNewLog = (log) => {
        if (log.category === activeTab || activeTab === 'all') {
          setLiveLogs(prev => [log, ...prev]);
        }
      };
      socket.on('NEW_AUDIT_LOG', handleNewLog);
      return () => socket.off('NEW_AUDIT_LOG', handleNewLog);
    }
  }, [socket, activeTab]);

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-primary-600" /> Enterprise Audit Consoles
          </h1>
          <p className="text-gray-500 mt-1">Immutable security, administrative, system, and user activity logging.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
          <p className="text-xs font-bold text-gray-400 uppercase">Activity Events</p>
          <p className="text-2xl font-black text-gray-900 mt-1">{stats.activityCount}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
          <p className="text-xs font-bold text-gray-400 uppercase">Audit Records</p>
          <p className="text-2xl font-black text-gray-900 mt-1">{stats.auditCount}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
          <p className="text-xs font-bold text-gray-400 uppercase">System Logs</p>
          <p className="text-2xl font-black text-gray-900 mt-1">{stats.systemCount}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
          <p className="text-xs font-bold text-gray-400 uppercase">Security Events</p>
          <p className="text-2xl font-black text-gray-900 mt-1">{stats.securityCount}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-red-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
          <p className="text-xs font-bold text-red-500 uppercase flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> Critical Alerts
          </p>
          <p className="text-2xl font-black text-red-600 mt-1">{stats.criticalCount}</p>
        </div>
      </div>

      {/* Console Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setPage(1); setLiveLogs([]); }}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl font-bold text-sm transition-all whitespace-nowrap border ${
                  isActive
                    ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/10'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-primary-400' : 'text-gray-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            placeholder="Search action, user, IP, or details..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Severity Filter */}
          <select
            value={severityFilter}
            onChange={(e) => { setSeverityFilter(e.target.value); setPage(1); }}
            className="px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:outline-none"
          >
            <option value="all">All Severities</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="success">Success</option>
            <option value="failure">Failure</option>
          </select>
        </div>
      </div>

      {/* Main Log Console Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : logs.length === 0 && liveLogs.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <ShieldCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-lg font-bold text-gray-700">No logs found</p>
            <p className="text-xs text-gray-400 mt-1">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Timestamp</th>
                  <th className="py-4 px-6">Action / Event</th>
                  <th className="py-4 px-6">User / Actor</th>
                  <th className="py-4 px-6">Details</th>
                  <th className="py-4 px-6">IP Address</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {/* Real-time streaming live logs banner */}
                {liveLogs.map((log, i) => (
                  <tr key={`live_${i}`} className="bg-emerald-50/40 hover:bg-emerald-50/70 transition-colors animate-pulse">
                    <td className="py-3.5 px-6 font-mono text-xs font-bold text-emerald-700">
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-ping" />
                      {new Date(log.createdAt || Date.now()).toLocaleTimeString()}
                    </td>
                    <td className="py-3.5 px-6 font-bold text-gray-900">{log.action}</td>
                    <td className="py-3.5 px-6 text-gray-700">{log.performedBy}</td>
                    <td className="py-3.5 px-6 text-gray-600 max-w-xs truncate">{log.details}</td>
                    <td className="py-3.5 px-6 font-mono text-xs text-gray-500">{log.ipAddress || 'Internal'}</td>
                    <td className="py-3.5 px-6">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-green-100 text-green-700">LIVE</span>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <button onClick={() => setSelectedLog(log)} className="p-1 text-gray-400 hover:text-gray-700">
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}

                {/* Persistent database logs */}
                {logs.map((log) => {
                  const isSuccess = log.status !== 'failure';
                  const badgeClass = severityBadges[log.severity] || severityBadges.info;

                  return (
                    <tr key={log._id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3.5 px-6 font-mono text-xs text-gray-500 whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-6 font-bold text-gray-900 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase ${badgeClass}`}>
                            {log.severity}
                          </span>
                          <span>{log.action}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-6 text-gray-700 font-medium whitespace-nowrap">
                        {log.performedBy || 'SYSTEM'}
                      </td>
                      <td className="py-3.5 px-6 text-gray-600 max-w-xs truncate">
                        {log.details || log.entityType || '-'}
                      </td>
                      <td className="py-3.5 px-6 font-mono text-xs text-gray-500 whitespace-nowrap">
                        {log.ipAddress || '127.0.0.1'}
                      </td>
                      <td className="py-3.5 px-6 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                          isSuccess ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}>
                          {isSuccess ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                          {log.status || 'success'}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-right whitespace-nowrap">
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-900 transition-colors"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <p className="text-xs font-semibold text-gray-500">
            Showing Page <span className="font-bold text-gray-900">{pagination.page}</span> of{' '}
            <span className="font-bold text-gray-900">{pagination.pages || 1}</span> ({pagination.total} total logs)
          </p>

          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              disabled={page >= pagination.pages}
              onClick={() => setPage(prev => Math.min(prev + 1, pagination.pages))}
              className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* JSON Metadata Inspection Modal */}
      <AnimatePresence>
        {selectedLog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setSelectedLog(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-slate-900 text-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl z-10 space-y-4 border border-slate-800"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <Code className="text-primary-400" />
                  <h3 className="text-lg font-bold">Log Metadata Inspection</h3>
                </div>
                <button onClick={() => setSelectedLog(null)} className="text-slate-400 hover:text-white">
                  ✕
                </button>
              </div>

              <div className="space-y-2 text-xs font-mono text-slate-300">
                <p><span className="text-slate-500">Action:</span> {selectedLog.action}</p>
                <p><span className="text-slate-500">Category:</span> {selectedLog.category}</p>
                <p><span className="text-slate-500">Event Type:</span> {selectedLog.eventType}</p>
                <p><span className="text-slate-500">Actor:</span> {selectedLog.performedBy}</p>
                <p><span className="text-slate-500">IP Address:</span> {selectedLog.ipAddress || 'Internal'}</p>
                <p><span className="text-slate-500">User Agent:</span> {selectedLog.userAgent || 'None'}</p>
                <p><span className="text-slate-500">Timestamp:</span> {new Date(selectedLog.createdAt).toISOString()}</p>
              </div>

              <div className="mt-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Raw Metadata JSON</p>
                <pre className="bg-slate-950 p-4 rounded-xl text-green-400 text-xs overflow-x-auto max-h-64 border border-slate-800">
                  {JSON.stringify(selectedLog.metadata || selectedLog, null, 2)}
                </pre>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
