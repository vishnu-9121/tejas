import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/utils/cn';

export const Breadcrumb = ({ className }) => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  if (pathnames.length === 0) return null;

  return (
    <nav className={cn("flex py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-sm text-gray-500", className)} aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link to="/" className="inline-flex items-center hover:text-primary-600 transition-colors">
            <Home className="w-4 h-4 mr-2" />
            Home
          </Link>
        </li>
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          return (
            <li key={to}>
              <div className="flex items-center">
                <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
                {last ? (
                  <span className="text-gray-900 font-medium capitalize">{value.replace(/-/g, ' ')}</span>
                ) : (
                  <Link to={to} className="hover:text-primary-600 transition-colors capitalize">{value.replace(/-/g, ' ')}</Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
