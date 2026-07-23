import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { Award, Briefcase, Download, Network, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

export const AlumniView = () => {
  const navigate = useNavigate();

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <motion.div variants={item} className="bg-gradient-to-r from-accent-600 to-primary-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-accent-900/10">
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 text-white/80 mb-2 font-medium">
                <GraduationCap className="w-5 h-5" /> Tejas Academy Alumni
              </div>
              <h2 className="text-3xl font-bold mb-2">Welcome to the Alumni Network!</h2>
              <p className="text-white/90 max-w-xl">Stay connected with your peers, access exclusive career opportunities, and download your verified certificates.</p>
            </div>
            <Button variant="outline" className="text-white border-white hover:bg-white hover:text-accent-600 rounded-full bg-white/10 backdrop-blur-sm">
              Update Alumni Profile
            </Button>
         </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Certificates */}
        <motion.div variants={item} className="bg-white rounded-3xl p-6 border border-gray-100/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-accent-500" /> My Certificates
            </h3>
          </div>
          <div className="space-y-4">
             <div className="flex items-center justify-between p-4 rounded-2xl bg-accent-50 border border-accent-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center text-accent-600">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Post Graduate Diploma in Advanced Tech</h4>
                    <p className="text-sm text-gray-500 mt-0.5">Issued: June 2026</p>
                  </div>
                </div>
                <Button variant="primary" size="sm" className="rounded-xl shadow-md shadow-primary-600/20 flex items-center gap-2">
                  <Download className="w-4 h-4" /> Download PDF
                </Button>
             </div>
          </div>
        </motion.div>

        {/* Career & Networking */}
        <motion.div variants={item} className="bg-white rounded-3xl p-6 border border-gray-100/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-6">
           <div>
             <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                <Network className="w-5 h-5 text-primary-600" /> Networking Events
             </h3>
             <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-primary-200 transition-colors cursor-pointer group">
                <h4 className="font-semibold text-gray-900 text-sm group-hover:text-primary-700">Annual Alumni Meetup 2026</h4>
                <p className="text-xs text-gray-500 mt-1">Aug 15, 2026 • Virtual</p>
             </div>
           </div>
           
           <div>
             <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                <Briefcase className="w-5 h-5 text-primary-600" /> Exclusive Job Board
             </h3>
             <Button variant="outline" className="w-full rounded-xl flex items-center justify-center gap-2">
                Browse Opportunities
             </Button>
           </div>
        </motion.div>
      </div>
    </div>
  );
};
