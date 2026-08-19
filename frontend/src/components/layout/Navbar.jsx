import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, User, LogOut, GraduationCap, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';
import { useAuthStore } from '@/store/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import { cmsService } from '@/services/cmsService';
import { getDashboardRoute, getDashboardLabel } from '@/utils/navigation';

const fallbackNavLinks = [
  { name: 'Home', path: '/' },
  { name: 'Admissions', path: '/admissions' },
  { name: 'Programs', path: '/programs' },
  { name: 'For Institutions', path: '/for-institutions' },
  { name: 'Recognitions', path: '/recognitions' },
  { name: 'Tejas Insights', path: '/insights' },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const { data: navData } = useQuery({
    queryKey: ['cms', 'navigation'],
    queryFn: () => cmsService.getCMSData('navigation'),
    staleTime: 60 * 1000,
  });

  const rawLinks = navData?.data?.data?.links || fallbackNavLinks;
  const headerLinks = rawLinks.filter(link => {
    const name = (link.name || link.label || '').toLowerCase().trim();
    const path = (link.url || link.path || '').toLowerCase().trim();
    return name !== 'mentors' && path !== '/mentors';
  });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 15);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  // Click outside listener for user dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isCurrentActive = (linkPath) => {
    if (linkPath === '/') return location.pathname === '/';
    return location.pathname.startsWith(linkPath);
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled 
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-neutral-200/80 py-2.5" 
          : "bg-white border-b border-neutral-100 py-3.5"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-11 sm:h-12">
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-2.5 sm:gap-3 shrink-0 group py-1 select-none">
          <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-white p-1 shadow-xs ring-2 ring-amber-400/80 flex items-center justify-center shrink-0">
            <img 
              src="/logo.png" 
              alt="Tejas Academy of Excellence Official Logo" 
              width="44"
              height="44"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="w-full h-full object-contain transition-transform group-hover:scale-105" 
            />
          </div>
          <div className="flex flex-col justify-center leading-tight">
            <span className="text-sm sm:text-base md:text-lg font-serif font-extrabold tracking-tight text-neutral-900 whitespace-nowrap">
              Tejas Academy
            </span>
            <span className="text-[9px] sm:text-[10px] md:text-[11px] font-bold text-amber-600 uppercase tracking-widest -mt-0.5 whitespace-nowrap">
              of Excellence
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links (>= lg: 1024px) */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-6 2xl:gap-7">
          {headerLinks.map((link) => {
            const path = link.url || link.path;
            const label = link.label || link.name;
            const isActive = isCurrentActive(path);
            return (
              <Link 
                key={label} 
                to={path} 
                className={cn(
                  "text-[13px] xl:text-sm font-semibold transition-colors duration-150 py-1.5 px-1 relative whitespace-nowrap",
                  isActive 
                    ? "text-primary-700 font-bold" 
                    : "text-neutral-600 hover:text-primary-600"
                )}
              >
                {label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions / Auth Area (>= lg: 1024px) */}
        <div className="hidden lg:flex items-center gap-3.5 xl:gap-4 shrink-0 pl-2">
          <div className="h-5 w-px bg-neutral-200" />
          
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button 
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 cursor-pointer bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/80 rounded-full pl-1.5 pr-3 py-1 transition-all duration-150 text-left focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                aria-expanded={userDropdownOpen}
                aria-haspopup="true"
              >
                <div className="w-7 h-7 rounded-full bg-primary-700 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                  {user.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="text-xs font-semibold text-neutral-800 max-w-[100px] truncate">
                  {user.name ? user.name.split(' ')[0] : 'Account'}
                </span>
                <ChevronDown className={cn("w-3.5 h-3.5 text-neutral-500 transition-transform duration-200", userDropdownOpen && "rotate-180")} />
              </button>

              {userDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-52 bg-white shadow-xl rounded-2xl border border-neutral-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-4 py-2.5 border-b border-neutral-100">
                    <p className="text-xs font-bold text-neutral-900 truncate">{user.name}</p>
                    <p className="text-[11px] text-neutral-500 truncate">{user.email}</p>
                  </div>
                  <Link 
                    to={getDashboardRoute(user.role)} 
                    onClick={() => setUserDropdownOpen(false)}
                    className="px-4 py-2.5 hover:bg-neutral-50 text-neutral-700 hover:text-primary-700 text-xs font-semibold flex items-center gap-2.5 transition-colors"
                  >
                    {['admin', 'super_admin'].includes(user.role) ? (
                      <LayoutDashboard className="w-4 h-4 text-primary-600" />
                    ) : (
                      <User className="w-4 h-4 text-primary-600" />
                    )}
                    {getDashboardLabel(user.role)}
                  </Link>
                  <button 
                    type="button"
                    onClick={logout} 
                    className="px-4 py-2.5 hover:bg-red-50 text-red-600 hover:text-red-700 text-xs font-semibold flex items-center gap-2.5 transition-colors w-full text-left"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Button 
                variant="ghost" 
                size="sm" 
                as={Link} 
                to="/login" 
                className="text-xs font-bold uppercase tracking-wider text-neutral-700 hover:text-primary-700 px-3 py-1.5 h-9"
              >
                Log In
              </Button>
              <Button 
                variant="primary" 
                size="sm" 
                as={Link} 
                to="/admissions" 
                className="text-xs font-bold uppercase tracking-wider px-4 py-1.5 h-9 shadow-xs"
              >
                Apply Now
              </Button>
            </div>
          )}
        </div>

        {/* Mobile / Tablet Menu Button (< lg: 1024px) */}
        <div className="flex items-center gap-2 lg:hidden">
          {user && (
            <Link 
              to={getDashboardRoute(user.role)}
              className="w-8 h-8 rounded-full bg-primary-700 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0 mr-1"
              aria-label="My Dashboard"
            >
              {user.name?.[0]?.toUpperCase() || 'U'}
            </Link>
          )}
          <button 
            type="button"
            className="p-2 text-neutral-700 hover:text-primary-700 hover:bg-neutral-100 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/20 cursor-pointer" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile / Tablet Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white/98 backdrop-blur-xl border-t border-neutral-200/80 shadow-2xl px-5 py-5 flex flex-col gap-1 max-h-[85vh] overflow-y-auto animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-1 mb-3">
            {headerLinks.map(link => {
              const path = link.url || link.path;
              const label = link.label || link.name;
              const isActive = isCurrentActive(path);
              return (
                <Link 
                  key={label} 
                  to={path} 
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors duration-150 min-h-[44px]",
                    isActive 
                      ? "bg-primary-50 text-primary-700 font-bold" 
                      : "text-neutral-800 hover:bg-neutral-50 hover:text-primary-600"
                  )}
                >
                  <span>{label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-primary-600" />}
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-neutral-100 flex flex-col gap-2.5">
            {user ? (
              <>
                <Link 
                  to={getDashboardRoute(user.role)} 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-sm font-bold text-primary-700 bg-primary-50/70 hover:bg-primary-50 transition-colors min-h-[44px]"
                >
                  <GraduationCap className="w-4 h-4 text-primary-600" />
                  {getDashboardLabel(user.role)}
                </Link>
                <button 
                  type="button"
                  onClick={logout} 
                  className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-colors text-left min-h-[44px]"
                >
                  <LogOut className="w-4 h-4" /> Sign Out ({user.name ? user.name.split(' ')[0] : 'User'})
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <Button 
                  variant="outline" 
                  className="w-full h-11 text-xs font-bold uppercase tracking-wider" 
                  as={Link} 
                  to="/login"
                >
                  Log In
                </Button>
                <Button 
                  variant="primary" 
                  className="w-full h-11 text-xs font-bold uppercase tracking-wider" 
                  as={Link} 
                  to="/admissions"
                >
                  Apply Now
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
