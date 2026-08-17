import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { FileText, Calendar, Image as ImageIcon, CheckCircle, Clock, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../../utils/api';

const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(date).toLocaleDateString();
};

export const WorkspaceOperations = ({ kpis }) => {
  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

  // Fetch real pending applications requiring review
  const { data: pendingData, isLoading: isPendingLoading } = useQuery({
    queryKey: ['admin-pending-ops'],
    queryFn: async () => {
      const res = await api.get('/admissions', { params: { status: 'submitted', limit: 5 } });
      return res.data?.data?.admissions || [];
    },
    refetchInterval: 30000
  });

  // Fetch real accepted admissions (Recent Approvals)
  const { data: approvedData, isLoading: isApprovedLoading } = useQuery({
    queryKey: ['admin-approved-ops'],
    queryFn: async () => {
      const res = await api.get('/admissions', { params: { status: 'accepted', limit: 5 } });
      return res.data?.data?.admissions || [];
    },
    refetchInterval: 30000
  });

  // Fetch real gallery count
  const { data: galleryData } = useQuery({
    queryKey: ['admin-gallery-count'],
    queryFn: async () => {
      const res = await api.get('/gallery');
      return res.data?.data?.length || 0;
    },
    refetchInterval: 60000
  });

  const pendingApps = pendingData || [];
  const approvedApps = approvedData || [];
  const galleryCount = galleryData !== undefined ? galleryData : 0;

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
           <Link to="/admin/insights" className="text-sm font-semibold text-primary-600 hover:underline">Manage Articles →</Link>
        </motion.div>
        
        <motion.div variants={item} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group flex flex-col justify-between h-48">
           <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform"><Calendar size={100} /></div>
           <div>
             <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Upcoming Events</h3>
             <p className="text-5xl font-black text-gray-900">{kpis?.events || 0}</p>
           </div>
           <Link to="/admin/events" className="text-sm font-semibold text-teal-600 hover:underline">Manage Calendar →</Link>
        </motion.div>

        <motion.div variants={item} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group flex flex-col justify-between h-48">
           <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform"><ImageIcon size={100} /></div>
           <div>
             <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Gallery Assets</h3>
             <p className="text-5xl font-black text-gray-900">{galleryCount}</p>
           </div>
           <Link to="/admin/gallery" className="text-sm font-semibold text-purple-600 hover:underline">Media Vault →</Link>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real Pending Tasks Queue */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-96 flex flex-col">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
               <Clock className="text-amber-500 w-5 h-5"/> Action Required (Review Queue)
             </h3>
             <span className="bg-amber-100 text-amber-700 font-bold text-xs px-2.5 py-1 rounded-full">{pendingApps.length} Pending</span>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-2">
            {pendingApps.length > 0 ? (
              pendingApps.map((app) => (
                <div key={app._id} className="p-4 border border-gray-100 rounded-2xl flex justify-between items-center hover:border-amber-200 transition-colors">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-600 block">Admission Application</span>
                    <p className="font-semibold text-sm text-gray-900">{app.applicant?.name || app.applicantName || 'Applicant'}</p>
                    <p className="text-xs text-gray-500">{app.program || app.programName} • {timeAgo(app.createdAt)}</p>
                  </div>
                  <Link to="/admin/admissions" className="bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
                    Review
                  </Link>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
                <p className="text-sm font-semibold">All caught up!</p>
                <p className="text-xs text-gray-400">No applications currently pending review.</p>
              </div>
            )}
          </div>
        </div>

        {/* Real Approvals Manager */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-96 flex flex-col">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
               <CheckCircle className="text-green-500 w-5 h-5"/> Recent Approvals
             </h3>
             <Link to="/admin/admissions" className="text-xs font-bold text-primary-600 hover:underline">View Pipeline</Link>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-2">
            {approvedApps.length > 0 ? (
              approvedApps.map((app) => (
                <div key={app._id} className="p-4 border border-gray-100 rounded-2xl flex justify-between items-center bg-gray-50/50">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-green-600 block">Accepted Applicant</span>
                    <p className="font-semibold text-sm text-gray-900">{app.applicant?.name || app.applicantName || 'Applicant'}</p>
                    <p className="text-xs text-gray-500">{app.program || app.programName} • {timeAgo(app.updatedAt || app.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-green-600 block">Status</span>
                    <span className="text-xs font-semibold text-gray-600 capitalize">{app.status || 'Accepted'}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <p className="text-sm">No approved admissions recorded yet.</p>
                <Link to="/admin/admissions" className="text-xs text-primary-600 font-bold mt-2">Open Pipeline →</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
