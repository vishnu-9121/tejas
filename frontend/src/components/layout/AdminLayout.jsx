import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, BookOpen, GraduationCap, 
  Calendar, FileText, Image as ImageIcon, Settings, 
  Menu, X, LogOut, Mail, MessageSquare, 
  Globe, Bell, Search, HelpCircle, Navigation, Briefcase, Map, Shield,
  MousePointerClick, MessageCircle, BarChart3
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
      title: 'Analytics & Overview',
      items: [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
        { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
        { name: 'Faculty Analytics', path: '/admin/analytics/faculty', icon: Users },
        { name: 'Management', path: '/admin/analytics/management', icon: BarChart3 },
        { name: 'Audit Consoles', path: '/admin/audit-logs', icon: ShieldCheck },
      ]
    },
    {
      title: 'Content Management',
      items: [
        { name: 'Homepage CMS', path: '/admin/cms/homepage', icon: Globe },
        { name: 'About Page CMS', path: '/admin/cms/about', icon: FileText },
        { name: 'Campus CMS', path: '/admin/cms/campus', icon: Map },
        { name: 'Programs CMS', path: '/admin/programs', icon: BookOpen },
        { name: 'Events CMS', path: '/admin/events', icon: Calendar },
        { name: 'Insights CMS', path: '/admin/insights', icon: FileText },
        { name: 'Gallery CMS', path: '/admin/gallery', icon: ImageIcon },
        { name: 'Careers CMS', path: '/admin/cms/careers', icon: Briefcase },
        { name: 'Testimonials', path: '/admin/testimonials', icon: MessageSquare },
        { name: 'Legal Pages CMS', path: '/admin/cms/legal', icon: Shield },
      ]
    },
    {
      title: 'Global Settings',
      items: [
        { name: 'SEO Manager', path: '/admin/cms/seo', icon: Search },
        { name: 'Website Settings', path: '/admin/cms/settings', icon: Settings },
        { name: 'Notifications', path: '/admin/cms/notifications', icon: Bell },
        { name: 'Global FAQs', path: '/admin/cms/faq', icon: HelpCircle },
        { name: 'Navigation CMS', path: '/admin/cms/navigation', icon: Navigation },
        { name: 'Exit Intent', path: '/admin/cms/exit-intent', icon: MousePointerClick },
        { name: 'Social Proof', path: '/admin/cms/social-proof', icon: Users },
        { name: 'Quick Connect', path: '/admin/cms/quick-connect', icon: MessageCircle },
      ]
    },
    {
      title: 'People & Admissions',
      items: [
        { name: 'Admissions', path: '/admin/admissions', icon: GraduationCap },
        { name: 'Mentors', path: '/admin/mentors', icon: Users },
        { name: 'Newsletter', path: '/admin/newsletter', icon: Mail },
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
        <div className="flex items-center justify-between h-16 px-4 bg-slate-950">
          <span className="text-xl font-bold font-outfit tracking-wide text-primary-400">Tejas Admin</span>
          <button className="lg:hidden text-gray-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        
        <div className="p-4">
          <div className="mb-8 px-2">
            <p className="text-sm text-slate-400 font-medium">Logged in as</p>
            <p className="text-base font-semibold truncate">{user?.name || 'Admin User'}</p>
          </div>

          <nav className="space-y-6 mt-4">
            {sidebarLinks.map((section, idx) => (
              <div key={idx} className="px-2">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = location.pathname.startsWith(item.path) && (item.path !== '/admin' || location.pathname === '/admin');
                    return (
                      <Link
                        key={item.name}
                        to={item.path}
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

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
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
