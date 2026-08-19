import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, BookOpen, GraduationCap, 
  Calendar, FileText, Image as ImageIcon, Settings, 
  Menu, X, LogOut, Mail, MessageSquare, 
  Globe, Bell, Search, HelpCircle, Navigation, Briefcase, Map, Shield, ShieldCheck,
  MousePointerClick, MessageCircle, BarChart3, UserCheck, HardDrive, Database, Share2
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../ui/Button';
import { NotificationDropdown } from '../notifications/NotificationDropdown';
import { GlobalSearchModal } from '../search/GlobalSearchModal';

export const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const sidebarLinks = [
    {
      title: 'Command & Analytics',
      items: [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
        { name: 'Live Analytics', path: '/admin/analytics', icon: BarChart3 },
        { name: 'Faculty Metrics', path: '/admin/analytics/faculty', icon: Users },
        { name: 'Management Insights', path: '/admin/analytics/management', icon: BarChart3 },
        { name: 'Audit Logs & History', path: '/admin/audit-logs', icon: ShieldCheck },
      ]
    },
    {
      title: 'Academics & Content',
      items: [
        { name: 'Programmes CMS', path: '/admin/programs', icon: BookOpen },
        { name: 'Courses CMS', path: '/admin/courses', icon: BookOpen },
        { name: 'Workshops CMS', path: '/admin/workshops', icon: GraduationCap },
        { name: 'Industry Mentors', path: '/admin/mentors', icon: Users },
        { name: 'Events Calendar', path: '/admin/events', icon: Calendar },
        { name: 'Blogs & Insights', path: '/admin/blogs', icon: FileText },
        { name: 'Campus Gallery', path: '/admin/gallery', icon: ImageIcon },
        { name: 'Student Reviews', path: '/admin/testimonials', icon: MessageSquare },
      ]
    },
    {
      title: 'Admissions & CRM',
      items: [
        { name: 'Admissions Portal', path: '/admin/admissions', icon: GraduationCap },
        { name: 'CRM Leads Pipeline', path: '/admin/leads', icon: UserCheck },
        { name: 'Users & Students', path: '/admin/students', icon: Users },
        { name: 'Inquiries & Helpdesk', path: '/admin/inquiries', icon: MessageSquare },
        { name: 'Email Broadcasts', path: '/admin/campaigns', icon: Mail },
        { name: 'Newsletter', path: '/admin/newsletter', icon: Mail },
      ]
    },
    {
      title: 'Website CMS & Settings',
      items: [
        { name: 'Pages & CMS Catalog', path: '/admin/cms/pages', icon: Globe },
        { name: 'Media Library', path: '/admin/cms/media', icon: ImageIcon },
        { name: 'Homepage CMS', path: '/admin/cms/homepage', icon: Globe },
        { name: 'About Page CMS', path: '/admin/cms/about', icon: FileText },
        { name: 'Campus Facilities CMS', path: '/admin/cms/campus', icon: Map },
        { name: 'Careers & Hiring CMS', path: '/admin/cms/careers', icon: Briefcase },
        { name: 'Legal Policies CMS', path: '/admin/cms/legal', icon: Shield },
        { name: 'Support FAQs (30 FAQs)', path: '/admin/cms/faq', icon: HelpCircle },
        { name: 'Exit Intent Modals', path: '/admin/cms/exit-intent', icon: MousePointerClick },
        { name: 'Social Proof Toasts', path: '/admin/cms/social-proof', icon: Users },
        { name: 'Quick Connect Widget', path: '/admin/cms/quick-connect', icon: MessageCircle },
        { name: 'Navigation Menus', path: '/admin/cms/navigation', icon: Navigation },
        { name: 'SEO & Meta Config', path: '/admin/cms/seo', icon: Search },
        { name: 'Social Media Links', path: '/admin/cms/social-links', icon: Share2 },
        { name: 'Website Settings', path: '/admin/cms/settings', icon: Settings },
        { name: 'Roles & Permissions', path: '/admin/roles', icon: ShieldCheck },
        { name: 'Database Backups', path: '/admin/backups', icon: Database },
      ]
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0`}
      >
        <div className="flex items-center justify-between h-16 px-4 bg-slate-950 border-b border-slate-800/80">
          <Link to="/admin" className="flex items-center gap-2.5 select-none">
            <div className="w-8 h-8 rounded-full bg-white p-0.5 shadow-sm ring-1 ring-amber-400 flex items-center justify-center shrink-0">
              <img 
                src="/logo.png" 
                alt="Tejas Academy Official Logo" 
                width="32"
                height="32"
                className="w-full h-full object-contain" 
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold font-sans tracking-tight text-white">Tejas Admin</span>
              <span className="text-[9px] font-bold text-amber-400 uppercase tracking-widest -mt-0.5">Control Center</span>
            </div>
          </Link>
          <button className="lg:hidden text-gray-400 hover:text-white" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">
            <X size={22} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 pb-20">
          <div className="mb-6 px-2">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Logged in as</p>
            <p className="text-base font-semibold truncate text-white">{user?.name || 'Admin User'}</p>
          </div>

          <nav className="space-y-6">
            {sidebarLinks.map((section, idx) => (
              <div key={idx} className="px-2">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = location.pathname.startsWith(item.path) && (item.path !== '/admin' || location.pathname === '/admin');
                    return (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                          isActive
                            ? 'bg-primary-600 text-white shadow-sm'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950/80">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5 text-slate-400" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white shadow-sm h-16 flex items-center px-4 lg:px-8 border-b border-gray-200">
          <button
            className="lg:hidden mr-4 text-gray-500 hover:text-gray-700"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          <div className="flex-1 flex items-center justify-end gap-3">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200/70 border border-gray-200 text-gray-500 rounded-xl text-xs font-medium transition-colors"
            >
              <Search className="w-4 h-4 text-gray-500" />
              <span>Search platform...</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-mono text-gray-400">
                ⌘K
              </kbd>
            </button>
            <NotificationDropdown />
            <Button variant="outline" size="sm" onClick={() => navigate('/')}>
              View Live Site
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 lg:p-8 bg-gray-50">
          <Outlet />
        </main>
      </div>

      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
};
