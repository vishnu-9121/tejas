import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../../services/analyticsService';
import { motion } from 'framer-motion';
import { Users, BookOpen, BarChart3, Activity } from 'lucide-react';

export default function FacultyAnalytics() {
  const { data, isLoading } = useQuery({
    queryKey: ['faculty-analytics'],
    queryFn: analyticsService.getFacultyAnalytics,
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

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
          <BarChart3 className="text-primary-600" /> Faculty Analytics
        </h1>
        <p className="text-gray-500 mt-1">Academic performance and program metrics.</p>
      </div>

      {/* KPI Snapshot */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center"><Users size={18} className="text-blue-600" /></div>
            <h3 className="text-sm font-bold text-gray-500 uppercase">Total Students</h3>
          </div>
          <p className="text-4xl font-black text-gray-900">{d.totalStudents || 0}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center"><BookOpen size={18} className="text-purple-600" /></div>
            <h3 className="text-sm font-bold text-gray-500 uppercase">Programs</h3>
          </div>
          <p className="text-4xl font-black text-gray-900">{d.totalPrograms || 0}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center"><Activity size={18} className="text-green-600" /></div>
            <h3 className="text-sm font-bold text-gray-500 uppercase">Courses</h3>
          </div>
          <p className="text-4xl font-black text-gray-900">{d.totalCourses || 0}</p>
        </motion.div>
      </div>

      {/* Popular Programs Table */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Top Performing Programs</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-bold text-gray-500 uppercase pb-3 tracking-wider">Rank</th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase pb-3 tracking-wider">Program Name</th>
                <th className="text-right text-xs font-bold text-gray-500 uppercase pb-3 tracking-wider">Applications</th>
              </tr>
            </thead>
            <tbody>
              {(d.popularPrograms || []).map((p, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 text-sm font-bold text-gray-400">#{i + 1}</td>
                  <td className="py-3 text-sm font-semibold text-gray-900">{p.name}</td>
                  <td className="py-3 text-sm font-black text-primary-600 text-right">{p.applications}</td>
                </tr>
              ))}
              {(!d.popularPrograms || d.popularPrograms.length === 0) && (
                <tr><td colSpan={3} className="py-8 text-center text-sm text-gray-400">No program data yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
