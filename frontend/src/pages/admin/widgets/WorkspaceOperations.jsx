import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Calendar, Image as ImageIcon, CheckCircle, Clock } from 'lucide-react';

export const WorkspaceOperations = ({ kpis }) => {
  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="space-y-6">
      {/* Content KPIs */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div variants={item} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group flex flex-col justify-between h-48">
           <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform"><FileText size={100} /></div>
           <div>
             <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Live Blogs</h3>
             <p className="text-5xl font-black text-gray-900">{kpis?.blogs || 0}</p>
           </div>
           <p className="text-sm font-semibold text-blue-600">3 Drafts Pending Review</p>
        </motion.div>
        
        <motion.div variants={item} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group flex flex-col justify-between h-48">
           <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform"><Calendar size={100} /></div>
           <div>
             <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Upcoming Events</h3>
             <p className="text-5xl font-black text-gray-900">{kpis?.events || 0}</p>
           </div>
           <p className="text-sm font-semibold text-teal-600">Next event in 2 days</p>
        </motion.div>

        <motion.div variants={item} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group flex flex-col justify-between h-48">
           <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform"><ImageIcon size={100} /></div>
           <div>
             <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Gallery Assets</h3>
             <p className="text-5xl font-black text-gray-900">42</p>
           </div>
           <p className="text-sm font-semibold text-purple-600">12 new uploads this week</p>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Tasks Queue */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-96 flex flex-col">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
               <Clock className="text-amber-500 w-5 h-5"/> Action Required
             </h3>
             <span className="bg-amber-100 text-amber-700 font-bold text-xs px-2 py-1 rounded-full">5 Tasks</span>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-2">
            {[
              { type: 'Application Review', title: 'John Doe - B.Tech CS', time: '2 hours ago' },
              { type: 'Support Ticket', title: 'Payment Failed Issue #1042', time: '5 hours ago' },
              { type: 'Content Approval', title: 'New Faculty Profile: Dr. Smith', time: '1 day ago' },
            ].map((task, i) => (
              <div key={i} className="p-4 border border-gray-100 rounded-2xl flex justify-between items-center hover:border-amber-200 transition-colors">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400">{task.type}</span>
                  <p className="font-semibold text-sm text-gray-900">{task.title}</p>
                </div>
                <button className="bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">Review</button>
              </div>
            ))}
          </div>
        </div>

        {/* Approvals Manager */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-96 flex flex-col">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
               <CheckCircle className="text-green-500 w-5 h-5"/> Recent Approvals
             </h3>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-2">
            {[
              { type: 'Application', title: 'Sarah Jenkins - Admitted', admin: 'Admin Vishnu' },
              { type: 'Blog Publish', title: '"Future of AI" is now live', admin: 'Editor Jane' },
              { type: 'Refund', title: 'Processed INR 5,000 to Ticket #992', admin: 'Finance Ops' },
            ].map((task, i) => (
              <div key={i} className="p-4 border border-gray-100 rounded-2xl flex justify-between items-center bg-gray-50/50">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400">{task.type}</span>
                  <p className="font-semibold text-sm text-gray-900">{task.title}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-green-600 block">Approved by</span>
                  <span className="text-xs font-semibold text-gray-600">{task.admin}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
