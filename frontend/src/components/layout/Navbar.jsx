import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, User, LogOut, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';
import { useAuthStore } from '@/store/useAuthStore';

import { useQuery } from '@tanstack/react-query';
import { cmsService } from '@/services/cmsService';

const fallbackNavLinks = [
  { name: 'Home', path: '/' },
  { name: 'Admissions', path: '/admissions' },
  { name: 'Programs', path: '/programs' },
  { name: 'For Institutions', path: '/for-institutions' },
  { name: 'Recognitions', path: '/recognitions' },
  { name: 'Mentors', path: '/mentors' },
  { name: 'Tejas Insights', path: '/insights' },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const { data: navData } = useQuery({
    queryKey: ['cms', 'navigation'],
    queryFn: () => cmsService.getCMSData('navigation'),
    staleTime: 60 * 1000,
  });

  const headerLinks = navData?.data?.data?.links || fallbackNavLinks;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className={cn("fixed top-0 left-0 right-0 z-40 transition-all duration-300", isScrolled ? "bg-white/95 backdrop-blur-md shadow-md py-2.5" : "bg-white py-3.5 border-b border-gray-100")}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Brand Logo & Always-Visible Name */}
        <Link to="/" className="flex items-center gap-3 shrink-0 group">
          <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-white p-1 shadow-sm ring-2 ring-amber-400/80 flex items-center justify-center shrink-0">
            <img src="/logo.png" alt="Tejas Academy of Excellence Logo" className="w-full h-full object-contain transition-transform group-hover:scale-105" />
          </div>
          <div className="flex flex-col justify-center leading-tight">
            <span className="text-base sm:text-lg md:text-xl font-serif font-extrabold tracking-tight text-gray-900 whitespace-nowrap">
              Tejas Academy
            </span>
            <span className="text-[10px] sm:text-[11px] font-bold text-amber-600 uppercase tracking-widest -mt-0.5 whitespace-nowrap">
              of Excellence
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {headerLinks.map((link) => (
            <div key={link.label || link.name} className="relative group">
              <Link to={link.url || link.path} className={cn("text-sm font-semibold text-gray-700 hover:text-primary-600 py-2 transition-colors", location.pathname === (link.url || link.path) && "text-primary-600 font-bold")}>
                {link.label || link.name}
              </Link>
            </div>
          ))}

          {user ? (
            <div className="relative group">
              <div className="flex items-center gap-2 cursor-pointer bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full pl-2 pr-4 py-1 transition-colors">
                <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm">
                  {user.name?.[0] || 'U'}
                </div>
                <span className="text-sm font-medium text-gray-700">{user.name ? user.name.split(' ')[0] : 'Student'}</span>
                <ChevronDown className="w-4 h-4 text-gray-500 transition-transform group-hover:rotate-180" />
              </div>
              <div className="absolute top-full right-0 mt-2 w-48 bg-white shadow-xl rounded-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col py-2">
                <Link to={['admin', 'super_admin'].includes(user.role) ? '/admin' : '/dashboard'} className="px-4 py-2 hover:bg-gray-50 text-gray-700 hover:text-primary-600 text-sm font-medium flex items-center gap-2">
                  <User className="w-4 h-4" /> My Dashboard
                </Link>
                <button onClick={logout} className="px-4 py-2 hover:bg-gray-50 text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-2 text-left w-full">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" as={Link} to="/login" className="hidden lg:inline-flex text-xs font-bold uppercase tracking-wider">Log In</Button>
              <Button variant="primary" size="sm" as={Link} to="/admissions" className="text-xs font-bold uppercase tracking-wider">Apply Now</Button>
            </div>
          )}
        </nav>

        {/* Mobile Action Controls */}
        <div className="flex items-center gap-2 md:hidden">
          <button 
            className="p-2 text-gray-700 hover:text-primary-600 rounded-lg border border-gray-200" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/98 backdrop-blur-xl border-t border-gray-100 shadow-2xl px-5 py-6 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-200">
          {headerLinks.map(link => (
             <Link key={link.label || link.name} to={link.url || link.path} className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3 hover:text-primary-600 transition-colors">{link.label || link.name}</Link>
          ))}
          {user ? (
            <>
              <Link to={['admin', 'super_admin'].includes(user.role) ? '/admin' : '/dashboard'} className="text-base font-bold text-primary-600 border-b border-gray-100 pb-3">My Dashboard</Link>
              <button onClick={logout} className="text-base font-bold text-red-600 text-left pb-3 border-b border-gray-100">Sign Out</button>
            </>
          ) : (
            <div className="flex flex-col gap-3 pt-2">
              <Button variant="outline" className="w-full h-11 text-sm font-bold" as={Link} to="/login">Log In</Button>
              <Button variant="primary" className="w-full h-11 text-sm font-bold" as={Link} to="/admissions">Apply for Admissions</Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
