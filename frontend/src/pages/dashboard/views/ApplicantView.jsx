import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { Briefcase, CheckCircle2, AlertCircle, Clock, Calendar, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../../../utils/cn";

const StatusBadge = ({ status, color }) => {
  const styles = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-green-50 text-green-700 border-green-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    red: "bg-red-50 text-red-700 border-red-200",
  };
  
  return (
    <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border", styles[color] || styles.blue)}>
      {status}
    </span>
  );
};

export const ApplicantView = ({ applications, mockNotifications, upcomingEvents, profileScore }) => {
  const navigate = useNavigate();
  const currentApp = applications?.[0];

  const handlePrintApplication = (app) => {
    const printWindow = window.open('', '_blank', 'width=800,height=700');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Tejas Academy - Application ${app.id}</title>
            <style>
              body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #1f2937; line-height: 1.6; }
              .header { border-bottom: 3px solid #0284c7; padding-bottom: 20px; margin-bottom: 28px; }
              h1 { color: #0f172a; margin: 0 0 6px 0; font-size: 24px; }
              .sub { color: #64748b; font-size: 14px; margin: 0; }
              .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 20px; }
              .row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; }
              .label { font-weight: 600; color: #475569; }
              .val { font-weight: 700; color: #0f172a; }
              .badge { background: #e0f2fe; color: #0369a1; padding: 4px 14px; border-radius: 9999px; font-weight: 700; font-size: 12px; text-transform: uppercase; }
              .footer { margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 12px; color: #94a3b8; text-align: center; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>TEJAS ACADEMY OF EXCELLENCE</h1>
              <p class="sub">Official Admission Application Summary & Receipt</p>
            </div>
            <div class="card">
              <div class="row"><span class="label">Application Reference ID:</span><span class="val">${app.id}</span></div>
              <div class="row"><span class="label">Program of Study:</span><span class="val">${app.program}</span></div>
              <div class="row"><span class="label">Submission Date:</span><span class="val">${app.date}</span></div>
              <div class="row"><span class="label">Application Status:</span><span class="badge">${app.status}</span></div>
              <div class="row"><span class="label">Admissions Stage:</span><span class="val">${app.nextStep} (${app.progress}% Complete)</span></div>
              ${app.counselorNotes ? `<div class="row"><span class="label">Admissions Note:</span><span class="val">${app.counselorNotes}</span></div>` : ''}
            </div>
            <div class="footer">
              <p>Tejas Academy of Excellence • Official Admissions Record • https://unlocktejas.com</p>
            </div>
            <script>
              window.onload = function() { window.print(); };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="space-y-8">
      {/* Bento Box Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div variants={item} className="col-span-1 md:col-span-2 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-gray-900/10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-500 rounded-full blur-[80px] opacity-20 -mr-20 -mt-20 pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 text-gray-300 mb-2 font-medium">
              <GraduationCap className="w-5 h-5 text-accent-400" /> Current Application
            </div>
            <h3 className="text-2xl font-bold mb-4">{currentApp?.program || 'No Application Started'}</h3>
            {currentApp ? (
              <div className="flex items-end justify-between flex-wrap gap-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    <span className="flex h-3 w-3 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-500"></span>
                    </span>
                    <span className="font-semibold text-accent-400">{currentApp.status}</span>
                  </div>
                </div>
                <Button onClick={() => handlePrintApplication(currentApp)} variant="gold" size="sm" className="rounded-full shadow-lg shadow-accent-500/20">
                  Print Summary Receipt
                </Button>
              </div>
            ) : (
              <div className="flex items-end justify-between">
                  <p className="text-gray-400 text-sm max-w-sm">Ready to take the next step in your career? Browse our programs and apply today.</p>
                  <Button onClick={() => navigate('/programs')} variant="gold" size="sm" className="rounded-full">Apply Now</Button>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div variants={item} className="bg-white rounded-3xl p-8 border border-gray-100/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-gray-500 font-medium">Profile Completion</h3>
          </div>
          <div className="mt-4">
            <span className="text-4xl font-black text-gray-900">{profileScore}%</span>
            <div className="w-full bg-gray-100 rounded-full h-1.5 mt-4">
              <div className="bg-primary-600 h-1.5 rounded-full transition-all duration-1000 ease-out" style={{ width: `${profileScore}%` }}></div>
            </div>
            {profileScore < 100 && (
              <p onClick={() => navigate('/dashboard')} className="text-xs text-primary-600 font-medium mt-3 hover:underline cursor-pointer">Complete profile details &rarr;</p>
            )}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div variants={item} className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary-600" />
              Application Tracker
            </h2>
          </div>
          
          <div className="bg-white rounded-3xl border border-gray-100/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-2">
            {applications.length > 0 ? applications.map(app => (
              <div key={app.id} className="p-6 border-b border-gray-100 last:border-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-bold tracking-wider text-gray-400 uppercase">{app.id}</span>
                      <StatusBadge status={app.status} color={app.color} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{app.program}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 font-medium">Submitted on</p>
                    <p className="text-sm font-semibold text-gray-900">{app.date}</p>
                  </div>
                </div>

                <div className="relative pt-1 mt-8 mb-4">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary-600 bg-primary-50 border border-primary-100">
                        Next: {app.nextStep}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-primary-600 font-bold">
                        {app.progress}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-gray-100">
                    <div style={{ width: `${app.progress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-600 transition-all duration-1000 ease-out"></div>
                  </div>
                </div>

                {app.counselorNotes && (
                  <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4 my-4 text-xs text-blue-900">
                    <span className="font-bold">Reviewer Note:</span> {app.counselorNotes}
                  </div>
                )}
                
                <div className="flex gap-3 mt-6">
                  <Button onClick={() => handlePrintApplication(app)} variant="outline" className="flex-1 rounded-xl">
                    Download Slip / PDF
                  </Button>
                  <Button onClick={() => navigate('/programs')} variant="primary" className="flex-1 rounded-xl">
                    Explore Catalog
                  </Button>
                </div>
              </div>
            )) : (
              <div className="p-12 text-center text-gray-500">
                <p className="font-semibold text-gray-700">No applications submitted yet.</p>
                <p className="text-xs text-gray-400 mt-1 mb-4">Select an academic program from our catalog to begin your admission application.</p>
                <Button onClick={() => navigate('/programs')} variant="primary" size="sm" className="rounded-full">
                  Browse Programs
                </Button>
              </div>
            )}
          </div>
        </motion.div>

        <div className="space-y-8">
          <motion.div variants={item} className="bg-white rounded-3xl border border-gray-100/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
              <Calendar className="w-5 h-5 text-primary-600" />
              Upcoming Events
            </h3>
            <div className="space-y-4">
              {upcomingEvents.length > 0 ? upcomingEvents.map(event => (
                <div onClick={() => navigate(`/events`)} key={event.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-primary-200 transition-colors group cursor-pointer">
                  <h4 className="font-semibold text-gray-900 text-sm group-hover:text-primary-700">{event.title}</h4>
                  <div className="flex items-center gap-4 mt-3 text-xs font-medium text-gray-500">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {event.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {event.time}</span>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-gray-400 text-center py-4">No upcoming events scheduled.</p>
              )}
            </div>
            <Button onClick={() => navigate('/events')} variant="ghost" className="w-full mt-4 text-primary-600 text-sm font-semibold">
              View Calendar
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
