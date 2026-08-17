import React from "react";
import { BookOpen, PlayCircle, Trophy, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../ui/Button";

export const ProgressWidget = ({ courses = [], gpa = '3.8' }) => {
  const activeCourses = Array.isArray(courses) ? courses : [];

  return (
    <div className="space-y-6">
      {/* Hero OS Header */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-3xl p-8 text-white shadow-lg shadow-primary-900/10 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
         <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="text-primary-100 font-medium mb-1 tracking-wide uppercase text-sm">Academic Journey</h3>
              <h2 className="text-4xl font-extrabold mb-4">Academic Overview</h2>
              <div className="flex items-center gap-4 text-sm font-medium">
                <span className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-full"><BookOpen className="w-4 h-4"/> {activeCourses.length} Active Modules</span>
                <span className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-full"><Trophy className="w-4 h-4 text-yellow-400"/> Enrolled Learner</span>
              </div>
            </div>
            
            {activeCourses.length > 0 && (
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl w-full md:w-72">
                 <div className="text-white/80 font-medium text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
                   <PlayCircle className="w-4 h-4 text-accent-400" /> Continue Learning
                 </div>
                 <h4 className="font-bold text-lg leading-tight mb-3 truncate">{activeCourses[0]?.title || activeCourses[0]?.name}</h4>
                 <div className="w-full bg-white/20 rounded-full h-1.5 mb-4">
                   <div className="bg-accent-400 h-1.5 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)]" style={{ width: `${activeCourses[0]?.progress || 50}%` }}></div>
                 </div>
                 <Button variant="gold" className="w-full rounded-xl py-2 shadow-lg shadow-accent-500/20 text-sm h-10">Resume Learning</Button>
              </div>
            )}
         </div>
      </div>

      {/* Course List */}
      <div className="bg-white rounded-3xl border border-gray-100/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary-600" /> My Enrolled Courses
          </h2>
          <Link to="/programs" className="text-xs font-bold text-primary-600 hover:underline">Explore Programs</Link>
        </div>
        
        <div className="space-y-4">
          {activeCourses.length > 0 ? (
            activeCourses.map((course, idx) => (
              <div key={course._id || idx} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-primary-200 transition-colors cursor-pointer group">
                 <div className="flex-1">
                   <h4 className="font-bold text-gray-900 group-hover:text-primary-700 transition-colors text-lg">{course.title || course.name}</h4>
                   <p className="text-sm text-gray-500 mt-1">{course.instructor || course.category || 'Tejas Faculty'}</p>
                 </div>
                 <div className="flex-1 mt-4 md:mt-0 flex items-center gap-6 justify-end">
                    <div className="w-32">
                      <div className="flex justify-between text-xs mb-1.5 font-semibold text-gray-500">
                        <span>Progress</span>
                        <span className="text-primary-600">{course.progress || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                         <div className="bg-primary-600 h-2 rounded-full" style={{ width: `${course.progress || 0}%` }}></div>
                      </div>
                    </div>
                 </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-gray-400">
              <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="font-semibold text-gray-700">No active course enrollments yet.</p>
              <p className="text-xs text-gray-400 mt-1 mb-4">Explore our academic programs to enroll in world-class courses.</p>
              <Link to="/programs" className="px-5 py-2.5 bg-primary-600 text-white font-bold rounded-xl text-xs inline-block">Browse Programs</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
