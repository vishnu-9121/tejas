import React from "react";
import { Activity, CheckCircle2, FileText, Bell } from "lucide-react";

export const ActivityTimelineWidget = ({ auditLogs = [] }) => {
  
  // Use mock if none provided
  const logs = auditLogs.length > 0 ? auditLogs : [
    { id: 1, action: 'ASSIGNMENT_SUBMITTED', details: 'Submitted ML Project Phase 1', date: 'Just now', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 2, action: 'COURSE_COMPLETED', details: 'Finished Python for Data Science Module 3', date: '2 hours ago', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50' },
    { id: 3, action: 'EVENT_BOOKMARKED', details: 'Saved AI Summit 2026', date: 'Yesterday', icon: Bell, color: 'text-amber-500', bg: 'bg-amber-50' }
  ];

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full">
      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
        <Activity className="w-5 h-5 text-primary-600" /> Recent Activity
      </h3>
      
      <div className="relative border-l-2 border-gray-100 ml-3 space-y-8 pb-4">
        {logs.map((log) => (
          <div key={log.id} className="relative pl-6">
            <div className={`absolute -left-[11px] top-0 w-5 h-5 rounded-full ${log.bg} border-2 border-white flex items-center justify-center`}>
               <log.icon className={`w-3 h-3 ${log.color}`} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{log.details}</p>
              <p className="text-xs text-gray-500 mt-1 font-medium">{log.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
