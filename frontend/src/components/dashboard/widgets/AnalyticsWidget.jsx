import React from "react";
import { TrendingUp, Target, CheckCircle2, UserCheck } from "lucide-react";
import { Link } from "react-router-dom";

export const AnalyticsWidget = ({ profileScore = 100, applicationsCount = 0 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
      {/* Learning Status Card */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full flex flex-col justify-between">
        <div>
          <div className="text-gray-500 font-medium mb-1 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-500" /> Platform Engagement
          </div>
          <div className="flex items-end gap-3 mt-2">
            <h3 className="text-4xl font-black text-gray-900">{profileScore}<span className="text-xl text-primary-600 font-bold">%</span></h3>
            <span className="text-green-600 text-xs font-bold bg-green-50 px-2.5 py-1 rounded-full mb-1">Profile Health</span>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
          <p className="text-xs text-gray-500">
            {profileScore === 100 ? 'Your profile is fully complete and verified for program admissions.' : 'Complete your personal and contact details in Account Settings to maximize your admission priority.'}
          </p>
        </div>
      </div>

      {/* Goals & Profile */}
      <div className="space-y-6 flex flex-col h-full">
        <div className="bg-white rounded-3xl p-6 border border-gray-100/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex-1">
           <div className="text-gray-500 font-medium mb-4 flex items-center gap-2"><Target className="w-5 h-5 text-accent-500" /> Admission Checklist</div>
           <div className="space-y-3">
             <div className="flex items-center gap-3">
               <div className="w-5 h-5 rounded-full border-2 border-green-500 bg-green-500 flex items-center justify-center text-white"><CheckCircle2 className="w-3 h-3" /></div>
               <span className="text-gray-700 text-sm font-medium">Register Student Account</span>
             </div>
             <div className="flex items-center gap-3">
               <div className={`w-5 h-5 rounded-full border-2 ${applicationsCount > 0 ? 'border-green-500 bg-green-500 text-white' : 'border-gray-300'} flex items-center justify-center`}>
                 {applicationsCount > 0 && <CheckCircle2 className="w-3 h-3" />}
               </div>
               <span className="text-gray-900 text-sm font-medium">Submit Program Application</span>
             </div>
             <div className="flex items-center gap-3">
               <div className={`w-5 h-5 rounded-full border-2 ${profileScore >= 90 ? 'border-green-500 bg-green-500 text-white' : 'border-gray-300'} flex items-center justify-center`}>
                 {profileScore >= 90 && <CheckCircle2 className="w-3 h-3" />}
               </div>
               <span className="text-gray-900 text-sm font-medium">Complete Student Profile</span>
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
          </div>
        </div>
      </div>
    </div>
  );
};
