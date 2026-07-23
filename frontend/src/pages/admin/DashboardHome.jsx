import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../../services/analyticsService';
import { useAuthStore } from '../../store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, GraduationCap, Settings, ShieldCheck, Activity } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Link } from 'react-router-dom';

// Import Workspaces
import { WorkspaceOverview } from './widgets/WorkspaceOverview';
import { WorkspaceAcademics } from './widgets/WorkspaceAcademics';
import { WorkspaceOperations } from './widgets/WorkspaceOperations';
import { WorkspaceSystem } from './widgets/WorkspaceSystem';

export default function DashboardHome() {
  const { user } = useAuthStore();
  const [greeting, setGreeting] = useState("Welcome back");
  const [activeTab, setActiveTab] = useState("overview");

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: analyticsService.getOverview,
    refetchOnWindowFocus: true
  });

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-500 bg-red-50 rounded-xl border border-red-100">Failed to load command center data. Please check connection.</div>;
  }

  const { kpis, recentActivities, systemHealth } = data?.data || {};

  const tabs = [
    { id: "overview", label: "Global Overview", icon: LayoutDashboard },
    { id: "academics", label: "Academics & People", icon: GraduationCap },
    { id: "operations", label: "Operations & Content", icon: Settings },
    { id: "system", label: "System & Security", icon: ShieldCheck },
  ];

  return (
    <div className="space-y-8 pb-10 max-w-[1600px] mx-auto min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            {greeting}, <span className="text-primary-700">{user?.name?.split(' ')[0] || 'Admin'}</span>
          </h1>
          <p className="text-gray-500 mt-2 flex items-center gap-2 text-lg">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            Command Center is <strong className="text-green-600 font-bold ml-1">Live & Syncing</strong>
          </p>
        </div>
        <div className="flex items-center gap-3 relative z-10">
          <Link to="/admin/cms/homepage" className="px-6 py-3 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-100 transition-colors">
            CMS Editor
          </Link>
          <Link to="/admin/admissions" className="px-6 py-3 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-colors shadow-lg shadow-gray-900/20 flex items-center gap-2">
            <Activity className="w-4 h-4" /> CRM Pipeline
          </Link>
        </div>
      </div>

      {/* Datadog / AWS Style Sub-navigation Tabs */}
      <div className="sticky top-0 z-20 bg-[#FAFAFA]/80 backdrop-blur-xl py-4 border-b border-gray-200/50">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all whitespace-nowrap border",
                activeTab === tab.id
                  ? "bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-600/20"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
              )}
            >
              <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "text-primary-100" : "text-gray-400")} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Workspace Container */}
      <div className="relative min-h-[600px]">
        <AnimatePresence mode="wait">
          
          {activeTab === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
              <WorkspaceOverview kpis={kpis} recentActivities={recentActivities} />
            </motion.div>
          )}

          {activeTab === "academics" && (
            <motion.div key="academics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
              <WorkspaceAcademics kpis={kpis} />
            </motion.div>
          )}

          {activeTab === "operations" && (
            <motion.div key="operations" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
              <WorkspaceOperations kpis={kpis} />
            </motion.div>
          )}

          {activeTab === "system" && (
            <motion.div key="system" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
              <WorkspaceSystem systemHealth={systemHealth} />
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
