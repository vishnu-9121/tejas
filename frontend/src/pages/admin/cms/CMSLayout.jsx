import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutTemplate, Settings, Image, History, ArrowLeft, Share2 } from 'lucide-react';

export const CMSLayout = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Pages', path: '/admin/cms/pages', icon: LayoutTemplate },
    { name: 'Social Media Links', path: '/admin/cms/social-links', icon: Share2 },
    { name: 'Global Settings', path: '/admin/cms/settings', icon: Settings },
    { name: 'Media Library', path: '/admin/cms/media', icon: Image },
    { name: 'Audit History', path: '/admin/cms/history', icon: History }
  ];

  return (
    <div className="flex h-[calc(100vh-100px)] bg-gray-50 rounded-3xl overflow-hidden border border-gray-200">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
        <Link to="/admin" className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 mb-8">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <h2 className="text-xl font-black text-gray-900 mb-6">CMS Engine</h2>
        <nav className="space-y-2 flex-1">
          {navItems.map(item => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors ${
                  isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon size={18} /> {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      
      {/* Main CMS Workspace */}
      <div className="flex-1 overflow-y-auto bg-[#FAFAFA] p-8">
        <Outlet />
      </div>
    </div>
  );
};
