import React from "react";
import { BookOpen, PlayCircle, Trophy, CheckCircle2 } from "lucide-react";
import { Button } from "../../ui/Button";

const mockCourses = [
  { name: "Machine Learning Fundamentals", progress: 60, grade: "A-", instructor: "Dr. Sarah Chen" },
  { name: "Advanced AI Ethics", progress: 85, grade: "A", instructor: "Prof. James Miller" },
  { name: "Data Structures & Algorithms", progress: 45, grade: "B+", instructor: "Dr. Alan Turing" }
];

export const ProgressWidget = () => {
  return (
    <div className="space-y-6">
      {/* Hero OS Header */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-3xl p-8 text-white shadow-lg shadow-primary-900/10 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
         <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="text-primary-100 font-medium mb-1 tracking-wide uppercase text-sm">Fall Semester 2026</h3>
              <h2 className="text-4xl font-extrabold mb-4">Academic Overview</h2>
              <div className="flex items-center gap-4 text-sm font-medium">
                <span className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-full"><BookOpen className="w-4 h-4"/> 4 Active Courses</span>
                <span className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-full"><Trophy className="w-4 h-4 text-yellow-400"/> 3.8 Cumulative GPA</span>
              </div>
            </div>
            
            {/* Coursera Style Continue Module */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl w-full md:w-72">
               <div className="text-white/80 font-medium text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
                 <PlayCircle className="w-4 h-4 text-accent-400" /> Continue Learning
               </div>
               <h4 className="font-bold text-lg leading-tight mb-3">Machine Learning Fundamentals</h4>
               <div className="w-full bg-white/20 rounded-full h-1.5 mb-4">
                 <div className="bg-accent-400 h-1.5 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)]" style={{ width: '60%' }}></div>
               </div>
               <Button variant="gold" className="w-full rounded-xl py-2 shadow-lg shadow-accent-500/20 text-sm h-10">Resume Module 4</Button>
            </div>
         </div>
      </div>

      {/* Course List */}
      <div className="bg-white rounded-3xl border border-gray-100/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary-600" /> My Courses
          </h2>
          <Button variant="ghost" className="text-primary-600">View Transcript</Button>
        </div>
        
        <div className="space-y-4">
          {mockCourses.map((course, idx) => (
            <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-primary-200 transition-colors cursor-pointer group">
               <div className="flex-1">
                 <h4 className="font-bold text-gray-900 group-hover:text-primary-700 transition-colors text-lg">{course.name}</h4>
                 <p className="text-sm text-gray-500 mt-1">{course.instructor}</p>
               </div>
               <div className="flex-1 mt-4 md:mt-0 flex items-center gap-6 justify-end">
                  <div className="w-32">
                    <div className="flex justify-between text-xs mb-1.5 font-semibold text-gray-500">
                      <span>Progress</span>
                      <span className="text-primary-600">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                       <div className="bg-primary-600 h-2 rounded-full" style={{ width: `${course.progress}%` }}></div>
                    </div>
                  </div>
                  <div className="text-right border-l border-gray-200 pl-6">
                    <span className="block text-xs text-gray-400 font-bold uppercase tracking-wider">Est. Grade</span>
                    <span className="font-black text-gray-900 text-lg">{course.grade}</span>
                  </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
