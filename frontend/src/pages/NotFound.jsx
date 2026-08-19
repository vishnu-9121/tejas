import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Home, BookOpen, Search, Mail } from 'lucide-react';
import { SEO } from '@/components/ui/SEO';

export const NotFound = () => {
  return (
    <div className="py-20 flex flex-col items-center justify-center text-center px-4 min-h-[70vh]">
      <SEO 
        title="404 - Page Not Found" 
        description="The page you requested could not be found. Explore our academic programs, admissions, or return to the homepage."
        url="https://unlocktejas.com/404"
      />
      <div className="relative">
        <h1 className="text-9xl md:text-[150px] font-black text-primary-50 select-none">404</h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900">Page Not Found</h2>
        </div>
      </div>
      
      <p className="text-gray-600 mt-6 max-w-md text-lg">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>

      <div className="mt-12 w-full max-w-2xl bg-white border border-gray-100 shadow-sm rounded-2xl p-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Here are some helpful links instead:</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link to="/" className="flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors group border border-gray-100">
            <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-colors">
              <Home size={20} />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900">Homepage</p>
              <p className="text-sm text-gray-500">Return to the main page</p>
            </div>
          </Link>

          <Link to="/programs" className="flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors group border border-gray-100">
            <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-colors">
              <BookOpen size={20} />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900">Programs</p>
              <p className="text-sm text-gray-500">Explore our academic offerings</p>
            </div>
          </Link>

          <Link to="/insights" className="flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors group border border-gray-100">
            <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-colors">
              <Search size={20} />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900">Insights & Blog</p>
              <p className="text-sm text-gray-500">Read our latest articles</p>
            </div>
          </Link>

          <Link to="/contact" className="flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors group border border-gray-100">
            <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-colors">
              <Mail size={20} />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900">Contact Us</p>
              <p className="text-sm text-gray-500">Get in touch with our team</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
