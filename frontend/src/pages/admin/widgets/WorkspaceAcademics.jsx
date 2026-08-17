import React from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, GraduationCap, BookOpen, Award, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

export const WorkspaceAcademics = ({ kpis, admissionsFunnel, popularPrograms = [] }) => {
  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

  const stats = [
    { title: 'Admissions Today', value: kpis?.admissionsToday || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', link: '/admin/admissions' },
    { title: 'Pending Apps', value: kpis?.pendingApplications || 0, icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50', link: '/admin/admissions' },
    { title: 'Total Students', value: kpis?.students || 0, icon: GraduationCap, color: 'text-indigo-600', bg: 'bg-indigo-50', link: '/admin/users' },
    { title: 'Faculty & Mentors', value: kpis?.faculty || 0, icon: Users, color: 'text-cyan-600', bg: 'bg-cyan-50', link: '/admin/users' },
    { title: 'Active Courses', value: kpis?.courses || 0, icon: BookOpen, color: 'text-orange-600', bg: 'bg-orange-50', link: '/admin/programs' },
    { title: 'Total Programs', value: kpis?.programs || 0, icon: Award, color: 'text-rose-600', bg: 'bg-rose-50', link: '/admin/programs' },
  ];

  const leadsCount = admissionsFunnel?.leads || 0;
  const appsCount = admissionsFunnel?.applications || 0;
  const admittedCount = admissionsFunnel?.accepted || 0;
  const enrolledCount = admissionsFunnel?.enrolled || 0;
  const maxFunnel = Math.max(leadsCount, appsCount, 1);

  return (
    <div className="space-y-6">
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <motion.div key={idx} variants={item}>
            <Link to={stat.link} className="block bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 flex flex-col justify-between hover:border-primary-200 hover:shadow-md transition-all group h-full">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon size={24} strokeWidth={2.5} />
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-black text-gray-900 tracking-tight">{stat.value}</h3>
                <p className="text-sm font-semibold text-gray-500 mt-1">{stat.title}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Admissions Funnel & Enrollment Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] min-h-[350px] flex flex-col justify-between">
           <div className="flex justify-between items-center mb-6">
             <div>
               <h3 className="text-lg font-bold text-gray-900">Admissions Pipeline</h3>
               <p className="text-xs text-gray-400 mt-0.5">Live inquiry-to-enrollment conversion stages</p>
             </div>
             <Filter size={18} className="text-gray-400" />
           </div>
           
           <div className="space-y-4">
             {/* Funnel Rows */}
             <div className="flex items-center gap-4">
                <div className="w-24 text-sm font-medium text-gray-600">Leads</div>
                <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.max((leadsCount / maxFunnel) * 100, leadsCount > 0 ? 5 : 0)}%` }}></div>
                </div>
                <div className="w-12 text-right font-bold">{leadsCount}</div>
             </div>
             <div className="flex items-center gap-4">
                <div className="w-24 text-sm font-medium text-gray-600">Applicants</div>
                <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.max((appsCount / maxFunnel) * 100, appsCount > 0 ? 5 : 0)}%` }}></div>
                </div>
                <div className="w-12 text-right font-bold">{appsCount}</div>
             </div>
             <div className="flex items-center gap-4">
                <div className="w-24 text-sm font-medium text-gray-600">Admitted</div>
                <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.max((admittedCount / maxFunnel) * 100, admittedCount > 0 ? 5 : 0)}%` }}></div>
                </div>
                <div className="w-12 text-right font-bold">{admittedCount}</div>
             </div>
             <div className="flex items-center gap-4">
                <div className="w-24 text-sm font-medium text-gray-600">Enrolled</div>
                <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                  <div className="bg-green-600 h-full rounded-full transition-all duration-500" style={{ width: `${Math.max((enrolledCount / maxFunnel) * 100, enrolledCount > 0 ? 5 : 0)}%` }}></div>
                </div>
                <div className="w-12 text-right font-bold">{enrolledCount}</div>
             </div>
           </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] min-h-[350px]">
           <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-gray-900">Top Performing Programs</h3>
             <Link to="/admin/programs" className="text-xs font-bold text-primary-600 hover:underline">View All Programs</Link>
           </div>
           
           <div className="space-y-4">
             {popularPrograms.length > 0 ? (
               popularPrograms.map((prog, i) => {
                 const maxApps = Math.max(...popularPrograms.map(p => p.applications || 0), 1);
                 return (
                   <div key={i} className="p-3 bg-gray-50/70 rounded-2xl border border-gray-100">
                     <div className="flex justify-between text-sm mb-2 font-medium">
                       <span className="text-gray-900 font-semibold truncate max-w-[200px]">{prog.name}</span>
                       <span className="text-primary-600 font-bold">{prog.applications} applications</span>
                     </div>
                     <div className="w-full bg-gray-200 rounded-full h-2">
                       <div className="h-2 rounded-full bg-primary-600 transition-all duration-500" style={{ width: `${Math.max((prog.applications / maxApps) * 100, 5)}%` }}></div>
                     </div>
                   </div>
                 );
               })
             ) : (
               <div className="py-12 text-center text-gray-400">
                 <p className="text-sm">No program applications recorded yet.</p>
                 <Link to="/admin/programs" className="text-xs text-primary-600 font-bold mt-2 inline-block">Manage Programs →</Link>
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};
