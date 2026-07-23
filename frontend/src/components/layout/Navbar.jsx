import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, User, LogOut, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';
import { useAuthStore } from '@/store/useAuthStore';
import { GlobalSearchModal } from '@/components/search/GlobalSearchModal';

import { useQuery } from '@tanstack/react-query';
import { cmsService } from '@/services/cmsService';

const fallbackNavLinks = [
  { name: 'Home', path: '/' },
  { name: 'Admissions', path: '/admissions' },
  { name: 'Programs', path: '/programs' },
  { name: 'Join Us', path: '/join-us' },
  { name: 'Tejas Insights', path: '/insights' },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const { data: navData } = useQuery({
    queryKey: ['cms', 'global_navigation'],
    queryFn: () => cmsService.getCmsData('global_navigation'),
    staleTime: 5 * 60 * 1000, // Cache for 5 mins
  });

  const headerLinks = fallbackNavLinks; // Force using the updated working links

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className={cn("fixed top-0 left-0 right-0 z-40 transition-all duration-300", isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-3" : "bg-white py-5")}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="Tejas Academy of Excellence Logo" className="w-10 h-10 object-contain" />
          <span className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-accent-600 hidden sm:block">Tejas Academy of Excellence</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {headerLinks.map((link) => (
            <div key={link.label || link.name} className="relative group">
              <Link to={link.url || link.path} className={cn("text-gray-700 hover:text-primary-600 font-medium py-2 transition-colors", location.pathname === (link.url || link.path) && "text-primary-600 font-bold")}>
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
              <Button variant="ghost" size="sm" as={Link} to="/login" className="hidden lg:inline-flex">Log In</Button>
              <Button variant="primary" size="sm" as={Link} to="/join-us">Join Us</Button>
            </div>
          )}
        </nav>

        {/* Mobile Toggle */}
        <button className="md:hidden p-2 text-gray-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-lg px-4 py-6 flex flex-col gap-4">
          {headerLinks.map(link => (
             <Link key={link.label || link.name} to={link.url || link.path} className="text-lg font-medium text-gray-900 border-b border-gray-50 pb-2">{link.label || link.name}</Link>
          ))}
          {user ? (
            <>
              <Link to={['admin', 'super_admin'].includes(user.role) ? '/admin' : '/dashboard'} className="text-lg font-medium text-primary-600 border-b border-gray-50 pb-2">My Dashboard</Link>
              <button onClick={logout} className="text-lg font-medium text-red-600 text-left pb-2 border-b border-gray-50">Sign Out</button>
            </>
          ) : (
            <div className="flex flex-col gap-3 mt-2">
              <Button variant="outline" className="w-full" as={Link} to="/login">Log In</Button>
              <Button variant="primary" className="w-full" as={Link} to="/join-us">Join Us</Button>
            </div>
          )}
        </div>
      )}
      {/* Global Search Modal */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
};
