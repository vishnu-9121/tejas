import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { cmsService } from '@/services/cmsService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const footerLinks = [
  {
    group: 'Explore',
    links: [
      { label: 'Home', url: '/' },
      { label: 'Programs', url: '/programs' },
      { label: 'Admissions', url: '/admissions' },
      { label: 'Tejas Insights', url: '/insights' },
    ]
  },
  {
    group: 'Opportunities',
    links: [
      { label: 'Careers', url: '/career' },
      { label: 'Join Our Community', url: '/join-us' },
      { label: 'Alumni Network', url: '#' },
      { label: 'Partner with Us', url: '/contact' },
    ]
  }
];

export const Footer = () => {
  const { data: footerData } = useQuery({
    queryKey: ['cms', 'footer'],
    queryFn: () => cmsService.getCMSData('footer'),
    staleTime: 60 * 1000,
  });

  const { data: settingsData } = useQuery({
    queryKey: ['cms', 'site_settings'],
    queryFn: () => cmsService.getCMSData('site_settings'),
    staleTime: 60 * 1000,
  });

  const liveFooter = footerData?.data?.data || {};
  const liveSettings = settingsData?.data?.data || {};

  const contactInfo = {
    address: liveSettings.physicalAddress || 'Beside L.K Towers,Roy Nagar,Gannavaram,Vijayawada,Andhra Pradesh,India,521101 - 521101',
    phone: liveSettings.contactPhone || '+91 8331051327',
    email: liveSettings.contactEmail || 'tejasacademyofexcellence@gmail.com'
  };

  const socialLinks = liveSettings.socialLinks || {
    linkedin: 'https://linkedin.com/school/tejas-academy',
    twitter: 'https://twitter.com/tejas_academy',
    instagram: 'https://instagram.com/tejas_academy',
    youtube: 'https://youtube.com/c/tejasacademy'
  };

  return (
    <footer className="bg-[#0a0f1c] text-slate-300 font-sans border-t border-slate-800">
      {/* Top Pre-Footer Call to Action */}
      <div className="border-b border-slate-800/60 bg-gradient-to-r from-[#0a0f1c] via-slate-900 to-[#0a0f1c]">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-3">
              Ready to redefine your future?
            </h2>
            <p className="text-slate-400 text-sm md:text-base">
              Join a community of ambitious leaders, innovators, and entrepreneurs building the world of tomorrow.
            </p>
          </div>
          <div className="flex shrink-0 gap-4 w-full md:w-auto">
            <Button variant="gold" size="lg" as={Link} to="/admissions" rightIcon={<ArrowRight size={18} />} className="w-full md:w-auto text-sm">
              Apply Now
            </Button>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Column 1: Brand & Bio */}
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-3 mb-6 group inline-flex">
              <img src="/logo.png" alt="Tejas Academy Logo" className="w-10 h-10 object-contain group-hover:scale-105 transition-transform" />
              <h3 className="text-white text-xl font-bold tracking-tight">Tejas Academy</h3>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-8 max-w-sm">
              Empowering the next generation of global leaders through world-class education, deep-tech innovation, and holistic human development.
            </p>
            
            <div className="flex gap-3">
              {Object.entries(socialLinks).map(([platform, url]) => {
                if (!url || url === '#') return null; // Skip if no valid URL (for demo, we'll render placeholders below if empty)
                return null;
              })}
              {/* Force render socials for premium look */}
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:bg-primary-600 hover:text-white hover:border-primary-500 transition-all duration-300"><Facebook size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:bg-primary-600 hover:text-white hover:border-primary-500 transition-all duration-300"><Twitter size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:bg-primary-600 hover:text-white hover:border-primary-500 transition-all duration-300"><Instagram size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:bg-primary-600 hover:text-white hover:border-primary-500 transition-all duration-300"><Linkedin size={18} /></a>
            </div>
          </div>

          {/* Columns 2 & 3: Links */}
          {footerLinks.map((group, idx) => (
            <div key={idx} className="lg:col-span-2">
              <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-6 opacity-90">{group.group}</h4>
              <ul className="space-y-3.5">
                {group.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <Link 
                      to={link.url} 
                      className="text-sm text-slate-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Column 4: Contact & Newsletter */}
          <div className="lg:col-span-4">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-6 opacity-90">Get in Touch</h4>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3 group">
                <MapPin className="w-5 h-5 text-primary-500 shrink-0 mt-0.5 group-hover:text-primary-400 transition-colors" />
                <span className="text-sm text-slate-400 leading-relaxed">{contactInfo.address}</span>
              </li>
              <li className="flex items-center gap-3 group">
                <Phone className="w-5 h-5 text-primary-500 shrink-0 group-hover:text-primary-400 transition-colors" />
                <span className="text-sm text-slate-400">{contactInfo.phone}</span>
              </li>
              <li className="flex items-center gap-3 group">
                <Mail className="w-5 h-5 text-primary-500 shrink-0 group-hover:text-primary-400 transition-colors" />
                <span className="text-sm text-slate-400">{contactInfo.email}</span>
              </li>
            </ul>

            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5 backdrop-blur-sm">
              <h5 className="text-white text-sm font-medium mb-2">Subscribe to our newsletter</h5>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Email address" 
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                  required
                />
                <button type="submit" className="bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Join
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800/80 bg-[#060913]">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs">
            &copy; {new Date().getFullYear()} Tejas Academy of Excellence. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-slate-500">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
