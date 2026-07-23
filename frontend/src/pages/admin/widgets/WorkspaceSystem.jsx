import React from 'react';
import { Server, Database, MemoryStick, AlertTriangle, ShieldCheck, Terminal } from 'lucide-react';

export const WorkspaceSystem = ({ systemHealth, auditLogs }) => {
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
              <span className="text-amber-400 font-bold">{systemHealth?.memoryUsage?.toFixed(2) || '45.2'} MB</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2">
              <div className="bg-amber-400 h-2 rounded-full transition-all duration-1000" style={{ width: `${Math.min((systemHealth?.memoryUsage || 0) / 1024 * 100, 100)}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Error Logs Stream */}
        <div className="bg-white rounded-3xl p-6 border border-red-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-96 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
               <AlertTriangle className="text-red-500 w-5 h-5"/> Error Stream
             </h3>
             <span className="bg-red-50 text-red-600 font-bold text-xs px-2 py-1 rounded-md">Live Logs</span>
          </div>
          <div className="flex-1 bg-slate-900 rounded-xl p-4 overflow-y-auto font-mono text-xs text-slate-300 custom-scrollbar space-y-2">
             <p><span className="text-red-400">[ERROR]</span> 2026-07-21 14:32:10 - Failed to send welcome email to user_id 943.</p>
             <p><span className="text-amber-400">[WARN]</span> 2026-07-21 15:10:05 - API rate limit approaching for analyticsService.</p>
             <p><span className="text-slate-500">[INFO]</span> 2026-07-21 15:45:22 - Garbage collection completed (24ms).</p>
             <p><span className="text-red-400">[ERROR]</span> 2026-07-21 16:02:11 - Stripe webhook signature verification failed.</p>
          </div>
        </div>

        {/* Security & Audit Logs */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-96 flex flex-col">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
               <ShieldCheck className="text-primary-600 w-5 h-5"/> Security & Audit
             </h3>
             <button className="text-xs font-semibold text-primary-600">Export CSV</button>
          </div>
          <div className="flex-1 overflow-x-auto">
             <table className="w-full text-left text-sm">
               <thead>
                 <tr className="border-b border-gray-100 text-gray-500">
                   <th className="pb-3 font-medium">Actor</th>
                   <th className="pb-3 font-medium">Action</th>
                   <th className="pb-3 font-medium">Time</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                 {[
                   { user: 'Admin Vishnu', action: 'Approved Application #102', time: '10m ago' },
                   { user: 'System', action: 'Auto-scaled DB instances', time: '1h ago' },
                   { user: 'Editor Jane', action: 'Deleted Blog ID: 44', time: '2h ago' },
                   { user: 'Finance Ops', action: 'Exported Revenue Report', time: '5h ago' },
                 ].map((log, i) => (
                   <tr key={i} className="hover:bg-gray-50/50">
                     <td className="py-3 font-medium text-gray-900">{log.user}</td>
                     <td className="py-3 text-gray-600">{log.action}</td>
                     <td className="py-3 text-gray-400 text-xs">{log.time}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        </div>
      </div>
    </div>
  );
};
