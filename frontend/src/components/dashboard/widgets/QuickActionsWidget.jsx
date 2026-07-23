import React from "react";
import { Link } from "react-router-dom";
import { Download, BookMarked, Settings, MessageSquare, Star, Headphones } from "lucide-react";

export const QuickActionsWidget = () => {
  const actions = [
    { name: 'Downloads', icon: Download, color: 'text-blue-600', bg: 'bg-blue-50', link: '#' },
    { name: 'Wishlist', icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-50', link: '#' },
    { name: 'Bookmarks', icon: BookMarked, color: 'text-purple-600', bg: 'bg-purple-50', link: '#' },
    { name: 'Support', icon: Headphones, color: 'text-emerald-600', bg: 'bg-emerald-50', link: '#' },
    { name: 'Messages', icon: MessageSquare, color: 'text-pink-600', bg: 'bg-pink-50', link: '#' },
    { name: 'Settings', icon: Settings, color: 'text-gray-600', bg: 'bg-gray-100', link: '#' }
  ];

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {actions.map((action, i) => (
          <Link key={i} to={action.link} className="flex flex-col items-center justify-center p-4 rounded-2xl border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all group">
             <div className={`w-12 h-12 rounded-full ${action.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
               <action.icon className={`w-5 h-5 ${action.color}`} />
             </div>
             <span className="text-xs font-semibold text-gray-700">{action.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};
