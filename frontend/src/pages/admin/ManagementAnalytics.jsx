import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../../services/analyticsService';
import { motion } from 'framer-motion';
import { 
  DollarSign, TrendingUp, Users, GraduationCap, Eye, 
  BarChart3, ArrowUpRight, Calendar 
} from 'lucide-react';

const formatCurrency = (value) => {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
  return `₹${value}`;
};

export default function ManagementAnalytics() {
  const { data, isLoading } = useQuery({
    queryKey: ['management-analytics'],
    queryFn: analyticsService.getManagementAnalytics,
    refetchInterval: 60000
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const d = data?.data || {};
  const revenue = d.revenue || {};
  const funnel = d.admissionsFunnel || {};
  const growth = d.growth || {};
  const traffic = d.traffic || {};
  const trend = d.admissionsTrend || [];

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
          <BarChart3 className="text-primary-600" /> Management Dashboard
        </h1>
        <p className="text-gray-500 mt-1">Board-level strategic KPIs and revenue intelligence.</p>
      </div>

      {/* Revenue Hero */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-3xl p-8 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 opacity-10"><DollarSign size={160} /></div>
          <p className="text-sm font-bold uppercase tracking-wider text-emerald-100 mb-2">Estimated Revenue</p>
          <p className="text-5xl font-black tracking-tight">{formatCurrency(revenue.estimatedRevenue || 0)}</p>
          <p className="text-sm text-emerald-100 mt-3">{revenue.enrolledStudents || 0} enrolled students × ₹{((revenue.avgRevenuePerStudent || 0) / 1000).toFixed(0)}K avg.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl p-8 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 opacity-10"><TrendingUp size={160} /></div>
          <p className="text-sm font-bold uppercase tracking-wider text-blue-100 mb-2">Projected Revenue</p>
          <p className="text-5xl font-black tracking-tight">{formatCurrency(revenue.projectedRevenue || 0)}</p>
          <p className="text-sm text-blue-100 mt-3">Including {funnel.accepted || 0} accepted, pending enrollment.</p>
        </motion.div>
      </div>

      {/* Strategic KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
          <Users size={18} className="text-primary-600 mb-2" />
          <p className="text-2xl font-black text-gray-900">{growth.totalStudents || 0}</p>
          <p className="text-xs font-bold text-gray-500 uppercase">Total Students</p>
          <span className="text-xs font-bold text-green-600 flex items-center gap-0.5 mt-1"><ArrowUpRight size={12} />{growth.studentGrowth}</span>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
          <GraduationCap size={18} className="text-blue-600 mb-2" />
          <p className="text-2xl font-black text-gray-900">{funnel.conversionRate || 0}%</p>
          <p className="text-xs font-bold text-gray-500 uppercase">Conversion Rate</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
          <Eye size={18} className="text-amber-600 mb-2" />
          <p className="text-2xl font-black text-gray-900">{traffic.uniqueVisitors || 0}</p>
          <p className="text-xs font-bold text-gray-500 uppercase">Unique Visitors</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
          <Calendar size={18} className="text-purple-600 mb-2" />
          <p className="text-2xl font-black text-gray-900">{growth.totalPrograms || 0}</p>
          <p className="text-xs font-bold text-gray-500 uppercase">Active Programs</p>
        </div>
      </div>

      {/* 12-Month Trend */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Admissions Trend (12 Months)</h3>
        <div className="flex items-end gap-2 h-56">
          {trend.map((t, i) => {
            const maxCount = Math.max(...trend.map(x => x.count), 1);
            const heightPct = (t.count / maxCount) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[10px] font-bold text-gray-900">{t.count}</span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPct}%` }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                  className="w-full bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-lg hover:from-primary-700 hover:to-primary-500 transition-colors cursor-pointer"
                />
                <span className="text-[9px] font-bold text-gray-400">{t.month}</span>
              </div>
            );
          })}
          {trend.length === 0 && <p className="text-sm text-gray-400 m-auto">No data yet</p>}
        </div>
      </div>
    </div>
  );
}
