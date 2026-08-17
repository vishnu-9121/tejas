import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { Button } from "../../components/ui/Button";
import { useQuery } from "@tanstack/react-query";
import { admissionService } from "../../services/admissionService";
import { eventService } from "../../services/eventService";
import { userService } from "../../services/userService";
import { 
  BookMarked, 
  Calendar, 
  FileText, 
  Settings, 
  LogOut, 
  ChevronRight 
} from "lucide-react";
import { motion } from "framer-motion";
import { NotificationDropdown } from "../../components/notifications/NotificationDropdown";

// Import Lifecycle Views
import { ApplicantView } from "./views/ApplicantView";
import { ActiveLearnerView } from "./views/ActiveLearnerView";
import { AlumniView } from "./views/AlumniView";

import api from "../../utils/api";
import { toast } from "sonner";

const mapStatusToProgress = (status) => {
  const norm = (status || '').toLowerCase().trim();
  switch (norm) {
    case "submitted":
    case "pending": 
      return { progress: 25, nextStep: "Admissions Panel Review", color: "amber" };
    case "under_review":
    case "under review": 
      return { progress: 50, nextStep: "Counselor Consultation Call", color: "blue" };
    case "interview_scheduled":
    case "interview scheduled": 
      return { progress: 75, nextStep: "Interview & Document Verification", color: "blue" };
    case "accepted": 
      return { progress: 100, nextStep: "Formal Enrollment & Onboarding", color: "green" };
    case "rejected": 
      return { progress: 100, nextStep: "Advising Consultation / Re-apply", color: "red" };
    default: 
      return { progress: 20, nextStep: "Application Under Review", color: "blue" };
  }
};

export const StudentDashboard = () => {
  const { user, logout, setCredentials, accessToken } = useAuthStore();
  const [greeting, setGreeting] = useState("Welcome");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    phoneNumber: user?.phone || user?.phoneNumber || "",
    address: user?.address || "",
    bio: user?.bio || ""
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const navigate = useNavigate();

  // --- Real-time Data Hooks ---
  const { data: appsData, refetch: refetchApps } = useQuery({
    queryKey: ['my-applications'],
    queryFn: admissionService.getMyApplications,
    refetchInterval: 15000,
    refetchOnWindowFocus: true
  });

  const { data: notifsData } = useQuery({
    queryKey: ['my-notifications'],
    queryFn: async () => {
      const res = await api.get('/notifications');
      return res.data;
    },
    refetchInterval: 15000,
    refetchOnWindowFocus: true
  });

  const { data: eventsData } = useQuery({
    queryKey: ['events'],
    queryFn: () => eventService.getEvents({ limit: 3 })
  });

  const { data: userData, refetch: refetchUser } = useQuery({
    queryKey: ['my-profile'],
    queryFn: userService.getMe
  });

  // Sync profile form when user data is loaded
  useEffect(() => {
    if (userData?.data) {
      setProfileForm({
        name: userData.data.name || "",
        phoneNumber: userData.data.phoneNumber || userData.data.phone || "",
        address: userData.data.address || "",
        bio: userData.data.bio || ""
      });
    }
  }, [userData]);

  // Data processing from real backend
  const applications = appsData?.data?.length > 0 
    ? appsData.data.map(app => {
        const { progress, nextStep, color } = mapStatusToProgress(app.status);
        return {
          id: app.applicationId || `APP-${app._id.substring(0, 8).toUpperCase()}`,
          program: app.program || app.programName || 'Academic Program',
          status: (app.status || 'submitted').replace('_', ' ').toUpperCase(),
          date: new Date(app.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
          progress,
          nextStep,
          color,
          realId: app._id,
          counselorNotes: app.counselorNotes || app.reviewNotes || ''
        };
      })
    : [];

  const realNotifications = notifsData?.data?.length > 0
    ? notifsData.data.map(n => ({
        id: n._id,
        text: n.message || n.title,
        time: new Date(n.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        type: n.type || 'info'
      }))
    : [];

  const upcomingEvents = eventsData?.data?.events?.length > 0
    ? eventsData.data.events.slice(0, 3).map(event => ({
        id: event._id,
        title: event.title,
        date: new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: event.time || "10:00 AM"
      }))
    : [];

  const currentUserData = userData?.data || user;
  const savedProgramsCount = currentUserData?.savedPrograms?.length || 0;
  const bookmarkedEventsCount = currentUserData?.bookmarkedEvents?.length || 0;
  const profileScore = currentUserData?.profileCompletionScore || 25;
  const lifecycleStage = currentUserData?.lifecycleStage || 'applicant';

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      const res = await userService.updateProfile(profileForm);
      if (res.data) {
        setCredentials({ ...user, ...res.data }, accessToken);
      }
      await refetchUser();
      toast.success("Profile updated successfully!");
      setIsSettingsOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Render correct view based on lifecycle stage
  const renderDashboardView = () => {
    switch (lifecycleStage) {
      case 'active_learner':
        return <ActiveLearnerView />;
      case 'alumni':
        return <AlumniView />;
      case 'applicant':
      case 'lead':
      case 'guest':
      case 'admitted':
      default:
        return (
          <ApplicantView 
            applications={applications}
            notifications={realNotifications}
            upcomingEvents={upcomingEvents}
            profileScore={profileScore}
          />
        );
    }
  };

  const stageLabel = lifecycleStage.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-inter selection:bg-primary-100 selection:text-primary-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          
          {/* Enhanced Sidebar */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="sticky top-28 space-y-6">
              
              {/* Profile Card */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/60 relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary-600 to-accent-500 opacity-10" />
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="relative w-24 h-24 mb-4">
                    <svg className="w-24 h-24 transform -rotate-90">
                      <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-gray-100" />
                      <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray="276.46" strokeDashoffset={276.46 - (276.46 * profileScore) / 100} className="text-primary-500 transition-all duration-1000 ease-out" />
                    </svg>
                    <div className="absolute top-1 left-1 right-1 bottom-1 bg-white rounded-full flex items-center justify-center font-bold text-3xl shadow-inner border-2 border-white text-primary-700">
                      {user?.name?.[0] || "U"}
                    </div>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 tracking-tight">{user?.name || "User"}</h2>
                  <p className="text-sm font-medium text-primary-600 capitalize mt-1 px-3 py-1 bg-primary-50 rounded-full inline-block">{stageLabel}</p>
                  
                  {/* Tracker Strip Micro-Widgets */}
                  <div className="w-full mt-6 pt-6 border-t border-gray-100 flex justify-between text-sm">
                    <div className="text-center">
                      <span className="block font-bold text-gray-900 text-lg">{applications.length}</span>
                      <span className="text-gray-500 text-[10px] uppercase tracking-wider font-semibold">Apps</span>
                    </div>
                    <div className="text-center">
                      <span className="block font-bold text-gray-900 text-lg">{savedProgramsCount}</span>
                      <span className="text-gray-500 text-[10px] uppercase tracking-wider font-semibold">Saved</span>
                    </div>
                    <div className="text-center">
                      <span className="block font-bold text-gray-900 text-lg">{bookmarkedEventsCount}</span>
                      <span className="text-gray-500 text-[10px] uppercase tracking-wider font-semibold">Events</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Navigation Menu */}
              <nav className="bg-white rounded-3xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/60 flex flex-col gap-1">
                <Link to="/dashboard" className="flex items-center justify-between px-4 py-3 rounded-2xl bg-primary-600 text-white font-medium shadow-md shadow-primary-600/20 transition-all">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 opacity-90" />
                    Dashboard
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-70" />
                </Link>
                <Link to="/programs" className="flex items-center justify-between px-4 py-3 rounded-2xl text-gray-600 hover:bg-gray-50 font-medium transition-all group">
                  <div className="flex items-center gap-3">
                    <BookMarked className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
                    Catalog
                  </div>
                  {savedProgramsCount > 0 && <span className="bg-gray-100 text-gray-600 text-xs py-0.5 px-2 rounded-full font-bold group-hover:bg-primary-100 group-hover:text-primary-700 transition-colors">{savedProgramsCount}</span>}
                </Link>
                <Link to="/events" className="flex items-center justify-between px-4 py-3 rounded-2xl text-gray-600 hover:bg-gray-50 font-medium transition-all group">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
                    Calendar
                  </div>
                  {bookmarkedEventsCount > 0 && <span className="bg-gray-100 text-gray-600 text-xs py-0.5 px-2 rounded-full font-bold group-hover:bg-primary-100 group-hover:text-primary-700 transition-colors">{bookmarkedEventsCount}</span>}
                </Link>
                <button onClick={() => setIsSettingsOpen(true)} className="flex items-center justify-between px-4 py-3 rounded-2xl text-gray-600 hover:bg-gray-50 font-medium transition-all group w-full text-left">
                  <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
                    Account Settings
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-70 transition-opacity" />
                </button>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button onClick={logout} className="flex items-center w-full px-4 py-3 rounded-2xl text-red-600 hover:bg-red-50 font-medium transition-all group">
                    <LogOut className="w-5 h-5 mr-3 text-red-400 group-hover:text-red-600 transition-colors" />
                    Sign Out
                  </button>
                </div>
              </nav>

            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                  {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-700 to-accent-600">{user?.name ? user.name.split(' ')[0] : "Student"}</span>
                </h1>
                <p className="text-gray-500 mt-2 text-lg">Here's what's happening in your journey.</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="flex items-center gap-3">
                <NotificationDropdown />
                <Button onClick={() => setIsSettingsOpen(true)} variant="outline" className="rounded-full px-4 text-xs font-semibold flex items-center gap-1.5 border-gray-200">
                  <Settings className="w-3.5 h-3.5" />
                  Edit Profile
                </Button>
                <Button onClick={() => navigate('/programs')} variant="primary" className="shadow-lg shadow-primary-600/20 rounded-full px-6 flex items-center gap-2">
                  <BookMarked className="w-4 h-4" />
                  Explore Catalog
                </Button>
              </motion.div>
            </div>

            {/* Dynamic Dashboard UI Switcher */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {renderDashboardView()}
            </motion.div>

          </main>
        </div>
      </div>

      {/* Account Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-gray-100 relative">
            <h3 className="text-2xl font-bold text-gray-900 mb-1">Update Student Profile</h3>
            <p className="text-sm text-gray-500 mb-6">Manage your contact details and account information.</p>
            
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={profileForm.phoneNumber}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Residential Address / City</label>
                <input
                  type="text"
                  placeholder="Vijayawada, Andhra Pradesh"
                  value={profileForm.address}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Career Goal / Bio</label>
                <textarea
                  rows={3}
                  placeholder="Aspiring AI Engineer looking to build foundational ML models..."
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm font-medium resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsSettingsOpen(false)} 
                  className="flex-1 rounded-xl"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={isSavingProfile} 
                  className="flex-1 rounded-xl"
                >
                  {isSavingProfile ? 'Saving...' : 'Save Profile'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
