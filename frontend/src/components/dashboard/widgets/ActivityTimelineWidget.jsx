import React from "react";
import { Activity, CheckCircle2, FileText, Bell } from "lucide-react";

export const ActivityTimelineWidget = ({ auditLogs = [] }) => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full">
      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
        <Activity className="w-5 h-5 text-primary-600" /> Recent Activity
      </h3>
      
      {auditLogs.length > 0 ? (
        <div className="relative border-l-2 border-gray-100 ml-3 space-y-8 pb-4">
          {auditLogs.map((log, idx) => (
            <div key={log._id || log.id || idx} className="relative pl-6">
              <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-primary-50 text-primary-600 border-2 border-white flex items-center justify-center">
                 <Activity className="w-3 h-3 text-primary-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{log.details || log.action}</p>
                <p className="text-xs text-gray-500 mt-1 font-medium">{log.date || new Date(log.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-10 text-center text-gray-400">
          <Activity className="w-6 h-6 mx-auto mb-1 opacity-40" />
          <p className="text-xs">No recent activity recorded yet.</p>
        </div>
      )}
    </div>
  );
};
