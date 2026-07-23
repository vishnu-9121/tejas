import React from "react";
import { TrendingUp, Target, CheckCircle2 } from "lucide-react";

export const AnalyticsWidget = ({ profileScore = 85 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
      {/* Stripe-style Analytics Card */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full flex flex-col justify-between">
        <div>
          <div className="text-gray-500 font-medium mb-1 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-500" /> Study Hours (This Week)
          </div>
          <div className="flex items-end gap-3">
            <h3 className="text-4xl font-black text-gray-900">24.5<span className="text-xl text-gray-400 font-bold">h</span></h3>
            <span className="text-green-500 text-sm font-bold bg-green-50 px-2 py-1 rounded-md mb-1">+12%</span>
          </div>
        </div>

        {/* Mock Chart Area */}
        <div className="mt-6 flex items-end justify-between h-24 gap-2">
          {/* Bar Chart Representation */}
          {[40, 70, 45, 90, 65, 80, 50].map((height, i) => (
            <div key={i} className="w-full bg-gray-100 rounded-t-sm hover:bg-primary-100 transition-colors cursor-pointer group relative flex flex-col justify-end h-full">
              <div 
                className={`w-full rounded-t-sm transition-all duration-500 ${i === 3 ? 'bg-primary-500' : 'bg-primary-200 group-hover:bg-primary-400'}`} 
                style={{ height: `${height}%` }}
              ></div>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-400 font-semibold mt-2 uppercase">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>
      </div>

      {/* Goals & Profile */}
      <div className="space-y-6 flex flex-col h-full">
        <div className="bg-white rounded-3xl p-6 border border-gray-100/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex-1">
           <div className="text-gray-500 font-medium mb-4 flex items-center gap-2"><Target className="w-5 h-5 text-accent-500" /> Weekly Goals</div>
           <div className="space-y-3">
             <div className="flex items-center gap-3">
               <div className="w-5 h-5 rounded-full border-2 border-green-500 bg-green-500 flex items-center justify-center text-white"><CheckCircle2 className="w-3 h-3" /></div>
               <span className="text-gray-500 line-through text-sm font-medium">Complete Chapter 3 Quiz</span>
             </div>
             <div className="flex items-center gap-3">
               <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
               <span className="text-gray-900 text-sm font-medium">Read AI Ethics Case Study</span>
             </div>
             <div className="flex items-center gap-3">
               <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
               <span className="text-gray-900 text-sm font-medium">Attend Lab Session</span>
             </div>
           </div>
        </div>

        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500 rounded-full blur-[50px] opacity-20 -mr-10 -mt-10 pointer-events-none" />
          <div className="relative z-10">
            <h3 className="text-gray-300 font-medium text-sm mb-1">Profile Strength</h3>
            <div className="flex items-end gap-3 mb-3">
              <span className="text-3xl font-black text-white">{profileScore}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1.5">
              <div className="bg-accent-400 h-1.5 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)]" style={{ width: `${profileScore}%` }}></div>
            </div>
            <p className="text-xs text-gray-400 font-medium mt-3">Add your LinkedIn URL to reach 100%</p>
          </div>
        </div>
      </div>
    </div>
  );
};
