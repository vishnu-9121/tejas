import React from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, GraduationCap, BookOpen, Award, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

export const WorkspaceAcademics = ({ kpis }) => {
  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

  const stats = [
    { title: 'Admissions Today', value: kpis?.admissionsToday || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', link: '/admin/admissions' },
    { title: 'Pending Apps', value: kpis?.pendingApplications || 0, icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50', link: '/admin/admissions' },
    { title: 'Total Students', value: kpis?.students || 0, icon: GraduationCap, color: 'text-indigo-600', bg: 'bg-indigo-50', link: '/admin/users' },
    { title: 'Faculty & Mentors', value: kpis?.faculty || 0, icon: Users, color: 'text-cyan-600', bg: 'bg-cyan-50', link: '/admin/users' },
    { title: 'Active Courses', value: kpis?.courses || 0, icon: BookOpen, color: 'text-orange-600', bg: 'bg-orange-50', link: '/admin/programs' },
    { title: 'Certificates Issued', value: kpis?.certificates || 0, icon: Award, color: 'text-rose-600', bg: 'bg-rose-50', link: '/admin/programs' },
  ];

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
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-[350px]">
           <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-gray-900">Admissions Funnel (MTD)</h3>
             <Filter size={18} className="text-gray-400" />
           </div>
           
           <div className="space-y-4">
             {/* Funnel Rows */}
             <div className="flex items-center gap-4">
                <div className="w-24 text-sm font-medium text-gray-600">Leads</div>
                <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden"><div className="bg-blue-400 h-full w-[100%] rounded-full"></div></div>
                <div className="w-12 text-right font-bold">1,240</div>
             </div>
             <div className="flex items-center gap-4">
                <div className="w-24 text-sm font-medium text-gray-600">Applicants</div>
                <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden"><div className="bg-indigo-400 h-full w-[65%] rounded-full"></div></div>
                <div className="w-12 text-right font-bold">810</div>
             </div>
             <div className="flex items-center gap-4">
                <div className="w-24 text-sm font-medium text-gray-600">Admitted</div>
                <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden"><div className="bg-primary-500 h-full w-[45%] rounded-full"></div></div>
                <div className="w-12 text-right font-bold">560</div>
             </div>
             <div className="flex items-center gap-4">
                <div className="w-24 text-sm font-medium text-gray-600">Enrolled</div>
                <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden"><div className="bg-green-500 h-full w-[35%] rounded-full"></div></div>
                <div className="w-12 text-right font-bold">430</div>
             </div>
           </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-[350px]">
           <h3 className="text-lg font-bold text-gray-900 mb-6">Top Performing Programs</h3>
           <div className="space-y-4">
             {/* Mock Program List */}
             {[
               { name: "M.Tech Artificial Intelligence", enrollments: 145, capacity: 150 },
               { name: "B.Tech Computer Science", enrollments: 280, capacity: 300 },
               { name: "MBA Digital Marketing", enrollments: 95, capacity: 120 }
             ].map((prog, i) => (
               <div key={i}>
                 <div className="flex justify-between text-sm mb-2 font-medium">
                   <span className="text-gray-900">{prog.name}</span>
                   <span className="text-primary-600">{prog.enrollments} / {prog.capacity}</span>
                 </div>
                 <div className="w-full bg-gray-100 rounded-full h-2">
                   <div className={`h-2 rounded-full ${prog.enrollments/prog.capacity > 0.9 ? 'bg-amber-500' : 'bg-primary-500'}`} style={{ width: `${(prog.enrollments/prog.capacity)*100}%` }}></div>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};
