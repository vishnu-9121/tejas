import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { cmsService } from '@/services/cmsService';
import { Button } from '@/components/ui/Button';
import { NewsletterForm } from '@/components/forms/NewsletterForm';

const fallbackQuickLinks = [
  { label: 'Home', url: '/' },
  { label: 'Academic Programs', url: '/programs' },
  { label: 'Admissions & Scholarships', url: '/admissions' },
  { label: 'Free Learning Programs', url: '/free-programs' },
  { label: 'For Institutions', url: '/for-institutions' },
  { label: 'Recognitions & Awards', url: '/recognitions' },
  { label: 'Faculty & Mentors', url: '/mentors' },
  { label: 'Our Community', url: '/about' },
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

  const liveSettings = settingsData?.data?.data || settingsData?.data || settingsData || {};
  const liveFooter = footerData?.data?.data || footerData?.data || footerData || {};

  const contactInfo = {
    address: liveSettings.physicalAddress || 'Beside L K Towers, Roy Nagar, Gannavaram - 521101',
    phone: liveSettings.contactPhone || '+91 98765 43210',
    email: liveSettings.contactEmail || 'info@unlocktejas.com'
  };

  const quickLinks = liveFooter.quickLinks && liveFooter.quickLinks.length > 0 ? liveFooter.quickLinks : fallbackQuickLinks;
  const legalLinks = liveFooter.legalLinks && liveFooter.legalLinks.length > 0 ? liveFooter.legalLinks : [
    { label: 'Privacy Policy', url: '/privacy' },
    { label: 'Terms of Service', url: '/terms' },
  ];
  const copyrightText = liveFooter.copyrightText || `© ${new Date().getFullYear()} Tejas Academy of Excellence. All rights reserved.`;
  const accreditationText = liveFooter.accreditationText || 'Approved by UGC & AICTE, Govt. of India.';

  return (
    <footer className="bg-[#1b2a1c] text-emerald-100 font-sans border-t border-emerald-900/60 select-none">
      {/* Top Pre-Footer Call to Action Banner */}
      <div className="border-b border-emerald-800/40 bg-gradient-to-r from-[#172418] via-[#1f3120] to-[#172418]">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left max-w-2xl">
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-white mb-2 tracking-tight">
              Ready to redefine your future with Tejas?
            </h2>
            <p className="text-emerald-200/80 text-sm md:text-base">
              Join a community of ambitious leaders, innovators, and entrepreneurs building the world of tomorrow.
            </p>
          </div>
          <div className="flex shrink-0 gap-4 w-full md:w-auto">
            <Button variant="gold" size="lg" as={Link} to="/admissions" rightIcon={<ArrowRight size={18} />} className="w-full md:w-auto text-sm font-bold shadow-xl shadow-amber-500/20">
              Apply for Admissions
            </Button>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Column 1: Brand & Bio */}
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-3 mb-5 group inline-flex">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white p-1 shadow-md ring-2 ring-amber-400/80 flex items-center justify-center shrink-0">
                <img src="/logo.png" alt="Tejas Academy Logo" className="w-full h-full object-contain transition-transform group-hover:scale-105" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-white text-xl font-serif font-extrabold tracking-tight">Tejas Academy</span>
                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest -mt-0.5">of Excellence</span>
              </div>
            </Link>
            <p className="text-sm text-emerald-200/75 leading-relaxed mb-8 max-w-sm">
              Empowering the next generation of global leaders through world-class education, deep-tech innovation, and holistic human development.
            </p>
            
            {/* Social Media Links */}
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-emerald-900/60 border border-emerald-700/50 flex items-center justify-center text-emerald-200 hover:bg-amber-500 hover:text-white hover:border-amber-400 transition-all duration-300"><Facebook size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-emerald-900/60 border border-emerald-700/50 flex items-center justify-center text-emerald-200 hover:bg-amber-500 hover:text-white hover:border-amber-400 transition-all duration-300"><Twitter size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-emerald-900/60 border border-emerald-700/50 flex items-center justify-center text-emerald-200 hover:bg-amber-500 hover:text-white hover:border-amber-400 transition-all duration-300"><Instagram size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-emerald-900/60 border border-emerald-700/50 flex items-center justify-center text-emerald-200 hover:bg-amber-500 hover:text-white hover:border-amber-400 transition-all duration-300"><Linkedin size={18} /></a>
            </div>
          </div>

          {/* Columns 2 & 3: Quick Navigation from CMS */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold text-xs tracking-widest uppercase mb-5 text-amber-400">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.slice(0, Math.ceil(quickLinks.length / 2)).map((link, lIdx) => (
                <li key={lIdx}>
                  <Link 
                    to={link.url} 
                    className="text-sm text-emerald-200/80 hover:text-white hover:translate-x-1 inline-block transition-all duration-200 font-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold text-xs tracking-widest uppercase mb-5 text-amber-400">More Links</h4>
            <ul className="space-y-3">
              {quickLinks.slice(Math.ceil(quickLinks.length / 2)).map((link, lIdx) => (
                <li key={lIdx}>
                  <Link 
                    to={link.url} 
                    className="text-sm text-emerald-200/80 hover:text-white hover:translate-x-1 inline-block transition-all duration-200 font-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Newsletter */}
          <div className="lg:col-span-4">
            <h4 className="text-white font-bold text-xs tracking-widest uppercase mb-5 text-amber-400">Get in Touch</h4>
            <ul className="space-y-3.5 mb-8">
              <li className="flex items-start gap-3 group">
                <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-sm text-emerald-200/80 leading-relaxed">{contactInfo.address}</span>
              </li>
              <li className="flex items-center gap-3 group">
                <Phone className="w-5 h-5 text-amber-400 shrink-0" />
                <span className="text-sm text-emerald-200/80 font-medium">{contactInfo.phone}</span>
              </li>
              <li className="flex items-center gap-3 group">
                <Mail className="w-5 h-5 text-amber-400 shrink-0" />
                <span className="text-sm text-emerald-200/80 font-medium">{contactInfo.email}</span>
              </li>
            </ul>

            <div className="bg-emerald-950/60 border border-emerald-800/60 rounded-2xl p-5 backdrop-blur-sm">
              <h5 className="text-white text-sm font-bold mb-2">Subscribe to Tejas Insights</h5>
              <p className="text-xs text-emerald-300/80 mb-3">Get monthly perspectives on leadership & tech innovation.</p>
              <NewsletterForm />
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Legal Bar */}
      <div className="border-t border-emerald-900/80 bg-[#121c13]">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-emerald-400/80 text-xs">
            {copyrightText} {accreditationText}
          </p>
          <div className="flex items-center gap-6 text-xs text-emerald-400/80 font-medium">
            {legalLinks.map((link, idx) => (
              <Link key={idx} to={link.url} className="hover:text-white transition-colors">{link.label}</Link>
            ))}
            <Link to="/sitemap.xml" className="hover:text-white transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
