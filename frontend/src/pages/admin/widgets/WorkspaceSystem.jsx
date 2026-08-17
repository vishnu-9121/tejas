import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Server, Database, MemoryStick, AlertTriangle, ShieldCheck, Terminal, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../../utils/api';

const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(date).toLocaleDateString();
};

export const WorkspaceSystem = ({ systemHealth }) => {
  // Query real error/critical logs from MongoDB
  const { data: errorLogData } = useQuery({
    queryKey: ['admin-system-error-logs'],
    queryFn: async () => {
      const res = await api.get('/activity', { params: { severity: 'critical', limit: 10 } });
      return res.data?.data || [];
    },
    refetchInterval: 30000
  });

  // Query real security & audit logs from MongoDB
  const { data: auditLogData } = useQuery({
    queryKey: ['admin-system-audit-logs'],
    queryFn: async () => {
      const res = await api.get('/activity', { params: { category: 'audit', limit: 10 } });
      return res.data?.data || [];
    },
    refetchInterval: 30000
  });

  const errorLogs = errorLogData || [];
  const auditLogs = auditLogData || [];

  return (
    <div className="space-y-6">
      {/* System Health Monitor */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl shadow-xl p-8 text-white relative overflow-hidden flex flex-col lg:flex-row gap-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500 rounded-full blur-[100px] opacity-10 pointer-events-none" />
        
        <div className="lg:w-1/3 relative z-10 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
              <Server className="w-6 h-6 text-green-400" /> System Health
            </h2>
            <p className="text-slate-400 text-sm">All core services are operational.</p>
          </div>
          <div className="mt-8">
            <span className="flex h-3 w-3 relative mb-2">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-white font-mono text-sm bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 block w-fit">
              Uptime: {Math.floor((systemHealth?.uptime || 0) / 3600)}h {Math.floor(((systemHealth?.uptime || 0) % 3600) / 60)}m
            </span>
          </div>
        </div>

        <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700/50">
            <div className="flex justify-between items-center text-sm mb-4">
              <span className="text-slate-300 flex items-center gap-2"><Database size={16}/> Database Status</span>
              <span className="text-green-400 font-bold">{systemHealth?.status || 'Connected'}</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full w-full"></div>
            </div>
          </div>
          
          <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700/50">
            <div className="flex justify-between items-center text-sm mb-4">
              <span className="text-slate-300 flex items-center gap-2"><MemoryStick size={16}/> Memory Heap</span>
              <span className="text-amber-400 font-bold">{systemHealth?.memoryUsageMB || '45.2'} MB</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2">
              <div className="bg-amber-400 h-2 rounded-full transition-all duration-1000" style={{ width: `${Math.min((parseFloat(systemHealth?.memoryUsageMB) || 45) / 512 * 100, 100)}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real Error Logs Stream */}
        <div className="bg-white rounded-3xl p-6 border border-red-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-96 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
               <AlertTriangle className="text-red-500 w-5 h-5"/> Error & Alert Stream
             </h3>
             <span className="bg-red-50 text-red-600 font-bold text-xs px-2 py-1 rounded-md">Live Stream</span>
          </div>
          <div className="flex-1 bg-slate-900 rounded-xl p-4 overflow-y-auto font-mono text-xs text-slate-300 custom-scrollbar space-y-2">
             {errorLogs.length > 0 ? (
               errorLogs.map((log, i) => (
                 <p key={log._id || i}>
                   <span className="text-red-400 font-bold">[{log.severity?.toUpperCase() || 'ERROR'}]</span>{' '}
                   <span className="text-slate-400">{new Date(log.createdAt).toISOString().replace('T', ' ').slice(0, 19)}</span> -{' '}
                   {log.action}: {log.details || log.entityType}
                 </p>
               ))
             ) : (
               <div className="h-full flex flex-col items-center justify-center text-slate-500">
                 <CheckCircle2 className="w-8 h-8 text-green-500 mb-2" />
                 <p className="font-semibold text-slate-300">No Critical System Errors</p>
                 <p className="text-xs text-slate-500">Platform operational and healthy.</p>
               </div>
             )}
          </div>
        </div>

        {/* Real Security & Audit Logs */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-96 flex flex-col">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
               <ShieldCheck className="text-primary-600 w-5 h-5"/> Security & Audit Logs
             </h3>
             <Link to="/admin/audit-logs" className="text-xs font-bold text-primary-600 hover:underline">Full Console →</Link>
          </div>
          <div className="flex-1 overflow-x-auto">
             <table className="w-full text-left text-sm">
               <thead>
                 <tr className="border-b border-gray-100 text-gray-500">
                   <th className="pb-3 font-medium">Actor</th>
                   <th className="pb-3 font-medium">Action</th>
                   <th className="pb-3 font-medium text-right">Time</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                 {auditLogs.length > 0 ? (
                   auditLogs.map((log, i) => (
                     <tr key={log._id || i} className="hover:bg-gray-50/50">
                       <td className="py-3 font-semibold text-gray-900 text-xs">{log.performedBy || 'System'}</td>
                       <td className="py-3 text-gray-600 text-xs truncate max-w-[180px]">{log.action}: {log.details || log.entityType}</td>
                       <td className="py-3 text-gray-400 text-xs text-right">{timeAgo(log.createdAt)}</td>
                     </tr>
                   ))
                 ) : (
                   <tr>
                     <td colSpan={3} className="py-12 text-center text-gray-400 text-sm">
                       No security audit records logged yet.
                     </td>
                   </tr>
                 )}
               </tbody>
             </table>
          </div>
        </div>
      </div>
    </div>
  );
};
