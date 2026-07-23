import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { Button } from "../../components/ui/Button";
import { 
  Calendar, Users, BookOpen, Clock, Activity, Settings, LogOut, 
  ChevronRight, CheckCircle2, TrendingUp, Award, FileEdit, ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";
import { Link, useNavigate } from "react-router-dom";

// Premium Mock Data
const mockClasses = [
  { id: 1, title: "Advanced Data Science", time: "10:00 AM - 11:30 AM", room: "Virtual Room A", students: 45 },
  { id: 2, title: "Product Management 101", time: "02:00 PM - 03:30 PM", room: "Room 402", students: 32 }
];

const mockAssignments = [
  { id: 1, title: "Data Visualization Project", course: "Data Science", submitted: 42, total: 45, pendingGrades: 12 },
  { id: 2, title: "Market Research Report", course: "Product Mgmt", submitted: 30, total: 32, pendingGrades: 5 },
];

const mockActivities = [
  { id: 1, action: "You published a new assignment: Neural Networks", time: "2 hours ago" },
  { id: 2, action: "Graded 15 submissions for Product Mgmt", time: "Yesterday" },
];

export const FacultyDashboard = () => {
  const { user, logout } = useAuthStore();
  const [greeting, setGreeting] = useState("Welcome");
  const navigate = useNavigate();

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } };

  return (
    <div className="min-h-screen bg-[#F3F4F6] font-inter selection:bg-primary-100 selection:text-primary-900 pb-20">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <div className="flex flex-col xl:flex-row gap-8">
          
          {/* Enhanced Sidebar */}
          <aside className="w-full xl:w-72 shrink-0">
            <div className="sticky top-28 space-y-6">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary-600 to-accent-500 opacity-10" />
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-24 h-24 mb-4 bg-white rounded-full flex items-center justify-center font-bold text-3xl shadow-inner border-4 border-primary-50 text-primary-700">
                    {user?.name?.[0] || "F"}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 tracking-tight">{user?.name || "Professor"}</h2>
                  <p className="text-sm font-medium text-primary-600 capitalize mt-1 px-3 py-1 bg-primary-50 rounded-full inline-block">Faculty Member</p>
                </div>
              </motion.div>

              <nav className="bg-white rounded-3xl p-4 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 flex flex-col gap-1">
                <Link to="/faculty" className="flex items-center justify-between px-4 py-3 rounded-2xl bg-primary-600 text-white font-medium shadow-md shadow-primary-600/20 transition-all">
                  <div className="flex items-center gap-3"><Activity className="w-5 h-5 opacity-90" /> Command Center</div>
                  <ChevronRight className="w-4 h-4 opacity-70" />
                </Link>
                <Link to="#" onClick={(e) => { e.preventDefault(); alert("Courses module coming soon") }} className="flex items-center justify-between px-4 py-3 rounded-2xl text-gray-600 hover:bg-gray-50 font-medium transition-all group">
                  <div className="flex items-center gap-3"><BookOpen className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" /> My Courses</div>
                </Link>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button onClick={logout} className="flex items-center w-full px-4 py-3 rounded-2xl text-red-600 hover:bg-red-50 font-medium transition-all group">
                    <LogOut className="w-5 h-5 mr-3 text-red-400 group-hover:text-red-600 transition-colors" /> Sign Out
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* Main Content Area (Bento Box) */}
          <main className="flex-1 min-w-0">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                  {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-700 to-accent-600">{user?.name ? user.name.split(' ')[0] : "Professor"}</span>
                </h1>
                <p className="text-gray-500 mt-2 text-lg font-medium">Your teaching command center.</p>
              </motion.div>
            </div>

            <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              
              {/* Active Classes Today (Spans 2 cols) */}
              <motion.div variants={item} className="col-span-1 md:col-span-2 xl:col-span-2 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-[0_20px_40px_rgba(15,17,20,0.1)]">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500 rounded-full blur-[80px] opacity-20 -mr-20 -mt-20 pointer-events-none" />
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2"><Calendar className="w-5 h-5 text-primary-400" /> Today's Schedule</h3>
                    <span className="text-sm font-semibold bg-white/10 px-3 py-1 rounded-full border border-white/20">{mockClasses.length} Classes</span>
                  </div>
                  <div className="space-y-4">
                    {mockClasses.map(cls => (
                      <div key={cls.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-colors cursor-pointer group">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-white group-hover:text-primary-300 transition-colors">{cls.title}</h4>
                            <p className="text-sm text-gray-400 mt-1 flex items-center gap-2"><Clock className="w-4 h-4"/> {cls.time}</p>
                          </div>
                          <span className="bg-primary-500/20 text-primary-300 text-xs font-bold px-2 py-1 rounded-lg">{cls.room}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Assignment Grading (Spans 2 cols) */}
              <motion.div variants={item} className="col-span-1 md:col-span-2 xl:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <FileEdit className="w-5 h-5 text-amber-500" /> Need Grading
                  </h3>
                  <Button variant="ghost" size="sm" className="text-primary-600">View All</Button>
                </div>
                <div className="space-y-4">
                  {mockAssignments.map(task => (
                    <div key={task.id} className="border border-gray-100 rounded-2xl p-4 hover:border-amber-200 hover:bg-amber-50/30 transition-all group">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-bold text-gray-900">{task.title}</h4>
                          <p className="text-xs font-medium text-gray-500 mt-0.5">{task.course}</p>
                        </div>
                        <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">{task.pendingGrades} Left</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2">
                        <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${(task.submitted - task.pendingGrades)/task.submitted * 100}%` }}></div>
                      </div>
                      <p className="text-xs text-gray-500 font-medium">{task.submitted - task.pendingGrades} of {task.submitted} graded</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Course Analytics (Spans 1 col) */}
              <motion.div variants={item} className="col-span-1 xl:col-span-1 bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col justify-between group hover:border-primary-200 transition-colors">
                <div>
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-4">
                    <Users className="w-5 h-5" />
                  </div>
                  <h3 className="text-gray-500 font-medium text-sm">Total Students</h3>
                  <div className="mt-1">
                    <span className="text-3xl font-black text-gray-900 tracking-tight">142</span>
                  </div>
                  <p className="text-sm text-green-600 font-medium mt-2 flex items-center gap-1"><TrendingUp className="w-4 h-4"/> +12 this semester</p>
                </div>
                <Button variant="outline" className="w-full mt-6 rounded-xl border-gray-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200">View Roster</Button>
              </motion.div>

              {/* Recent Activity Timeline (Spans 2 cols) */}
              <motion.div variants={item} className="col-span-1 md:col-span-2 xl:col-span-3 bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary-600" /> Recent Actions
                  </h3>
                </div>
                <div className="relative border-l-2 border-gray-100 ml-3 space-y-6">
                  {mockActivities.map((act, i) => (
                    <div key={act.id} className="relative pl-6">
                      <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-4 border-primary-100" />
                      <p className="text-sm font-semibold text-gray-900">{act.action}</p>
                      <p className="text-xs text-gray-500 mt-1">{act.time}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
};
