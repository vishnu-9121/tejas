import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../../services/analyticsService';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Users, DollarSign, Eye, Globe, Search, 
  BarChart3, ArrowUpRight, ArrowDownRight, Activity,
  GraduationCap, BookOpen, Calendar, FileText
} from 'lucide-react';

const formatCurrency = (value) => {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
  return `₹${value}`;
};

const KPICard = ({ title, value, icon: Icon, change, changeType = 'positive', color = 'primary' }) => {
  const colors = {
    primary: 'from-primary-500 to-primary-600',
    green: 'from-emerald-500 to-emerald-600',
    blue: 'from-blue-500 to-blue-600',
    amber: 'from-amber-500 to-amber-600',
    purple: 'from-purple-500 to-purple-600',
    red: 'from-red-500 to-red-600'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] group hover:shadow-lg transition-shadow"
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center shadow-lg`}>
          <Icon size={18} className="text-white" />
        </div>
        {change && (
          <span className={`flex items-center gap-0.5 text-xs font-bold ${changeType === 'positive' ? 'text-green-600' : 'text-red-500'}`}>
            {changeType === 'positive' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {change}
          </span>
        )}
      </div>
      <p className="text-2xl font-black text-gray-900 tracking-tight">{value}</p>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">{title}</p>
    </motion.div>
  );
};

const FunnelBar = ({ label, value, max, color }) => {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold text-gray-600">{label}</span>
        <span className="text-xs font-black text-gray-900">{value}</span>
      </div>
      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  );
};

export default function AnalyticsDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-analytics-full'],
    queryFn: analyticsService.getAdminAnalytics,
    refetchInterval: 30000
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const d = data?.data || {};
  const traffic = d.traffic || {};
  const funnel = d.admissionsFunnel || {};
  const growth = d.growth || {};
  const revenue = d.revenue || {};
  const trend = d.admissionsTrend || [];
  const sources = d.trafficSources || [];
  const topPages = d.popularPages || [];
  const topSearches = d.searchAnalytics || [];
  const topPrograms = d.popularPrograms || [];

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <BarChart3 className="text-primary-600" /> Analytics Command Center
          </h1>
          <p className="text-gray-500 mt-1">Real-time platform intelligence. All reports auto-synchronize.</p>
        </div>
        <span className="flex items-center gap-2 text-xs font-semibold text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
          <Activity size={14} /> Live Sync
        </span>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KPICard title="Total Students" value={growth.totalStudents || 0} icon={Users} change={growth.studentGrowth} color="primary" />
        <KPICard title="Est. Revenue" value={formatCurrency(revenue.estimatedRevenue || 0)} icon={DollarSign} color="green" />
        <KPICard title="Visitors" value={traffic.totalVisitors || 0} icon={Eye} color="blue" />
        <KPICard title="Bounce Rate" value={`${traffic.bounceRate || 0}%`} icon={Globe} changeType={parseFloat(traffic.bounceRate) > 50 ? 'negative' : 'positive'} color="amber" />
        <KPICard title="Conversion" value={`${funnel.conversionRate || 0}%`} icon={TrendingUp} color="purple" />
        <KPICard title="Programs" value={growth.totalPrograms || 0} icon={BookOpen} color="primary" />
      </div>

      {/* Row 2: Funnel + Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Admissions Funnel */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <GraduationCap size={18} className="text-primary-600" /> Admissions Funnel
          </h3>
          <div className="space-y-4">
            <FunnelBar label="Leads (Inquiries)" value={funnel.leads || 0} max={funnel.leads || 1} color="bg-blue-400" />
            <FunnelBar label="Applications" value={funnel.applications || 0} max={funnel.leads || 1} color="bg-indigo-500" />
            <FunnelBar label="Under Review" value={funnel.underReview || 0} max={funnel.leads || 1} color="bg-amber-500" />
            <FunnelBar label="Accepted" value={funnel.accepted || 0} max={funnel.leads || 1} color="bg-emerald-500" />
            <FunnelBar label="Enrolled" value={funnel.enrolled || 0} max={funnel.leads || 1} color="bg-green-600" />
          </div>
        </div>

        {/* Admissions Trend Chart */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Calendar size={18} className="text-primary-600" /> Admissions Trend (6 Months)
          </h3>
          <div className="flex items-end gap-3 h-48">
            {trend.map((t, i) => {
              const maxCount = Math.max(...trend.map(x => x.count), 1);
              const heightPct = (t.count / maxCount) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs font-bold text-gray-900">{t.count}</span>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPct}%` }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className="w-full bg-primary-500 rounded-t-lg hover:bg-primary-600 transition-colors cursor-pointer"
                  />
                  <span className="text-[10px] font-bold text-gray-400">{t.month}</span>
                </div>
              );
            })}
            {trend.length === 0 && <p className="text-sm text-gray-400 m-auto">No data yet</p>}
          </div>
        </div>
      </div>

      {/* Row 3: Traffic Sources + Popular Programs + Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Traffic Sources */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
          <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Traffic Sources</h3>
          <div className="space-y-3">
            {sources.length > 0 ? sources.map((s, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700 capitalize">{s.source}</span>
                <span className="text-sm font-black text-gray-900">{s.count}</span>
              </div>
            )) : (
              <p className="text-sm text-gray-400">Tracking will populate as visitors arrive.</p>
            )}
          </div>
        </div>

        {/* Popular Programs */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
          <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Top Programs</h3>
          <div className="space-y-3">
            {topPrograms.length > 0 ? topPrograms.map((p, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700 truncate max-w-[180px]">{p.name}</span>
                <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">{p.applications} apps</span>
              </div>
            )) : (
              <p className="text-sm text-gray-400">No application data yet.</p>
            )}
          </div>
        </div>

        {/* Search Analytics */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
          <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider flex items-center gap-2">
            <Search size={14} /> Search Analytics
          </h3>
          <div className="space-y-3">
            {topSearches.length > 0 ? topSearches.slice(0, 8).map((s, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">"{s.term}"</span>
                <span className="text-xs font-bold text-gray-500">{s.count}×</span>
              </div>
            )) : (
              <p className="text-sm text-gray-400">Search tracking will populate.</p>
            )}
          </div>
        </div>
      </div>

      {/* Row 4: Growth Snapshot */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="Faculty" value={growth.totalFaculty || 0} icon={Users} color="blue" />
        <KPICard title="Courses" value={growth.totalCourses || 0} icon={BookOpen} color="purple" />
        <KPICard title="Events" value={growth.totalEvents || 0} icon={Calendar} color="amber" />
        <KPICard title="Blog Posts" value={growth.totalBlogs || 0} icon={FileText} color="green" />
      </div>
    </div>
  );
}
