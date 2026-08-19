import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, MessageCircle, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
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
    address: liveSettings.physicalAddress || 'Beside L K Towers, Roy Nagar, Gannavaram, Vijayawada, Amaravathi - 521101',
    phone: liveSettings.contactPhone || '+91 83310 51327',
    email: liveSettings.contactEmail || 'support@unlocktejas.com'
  };

  const quickLinks = liveFooter.quickLinks && liveFooter.quickLinks.length > 0 ? liveFooter.quickLinks : fallbackQuickLinks;
  const legalLinks = liveFooter.legalLinks && liveFooter.legalLinks.length > 0 ? liveFooter.legalLinks : [
    { label: 'Privacy Policy', url: '/privacy' },
    { label: 'Terms of Service', url: '/terms' },
  ];
  const copyrightText = liveFooter.copyrightText || `© ${new Date().getFullYear()} Tejas Academy of Excellence. All rights reserved.`;
  const accreditationText = (liveFooter.accreditationText && !liveFooter.accreditationText.includes('UGC') && !liveFooter.accreditationText.includes('AICTE')) 
    ? liveFooter.accreditationText 
    : '';
  const socialLinks = liveSettings.socialLinks || {
    facebook: 'https://facebook.com/unlocktejas',
    twitter: 'https://twitter.com/unlocktejas',
    instagram: 'https://instagram.com/unlocktejas',
    linkedin: 'https://linkedin.com/company/unlocktejas'
  };

  return (
    <footer className="bg-[#1b2a1c] text-emerald-100 font-sans border-t border-emerald-900/60">
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
          <div className="flex flex-wrap gap-4 items-center">
            <Link to="/admissions">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-8 shadow-lg shadow-amber-500/20 border-0 rounded-full flex items-center gap-2">
                Apply for Admission <ArrowRight size={18} />
              </Button>
            </Link>
            <Link to="/programs">
              <Button size="lg" variant="outline" className="border-emerald-600 text-emerald-100 hover:bg-emerald-800/60 hover:text-white rounded-full">
                Explore Programs
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Multi-Column Footer Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          
          {/* Column 1: Brand & Bio */}
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-3 mb-6 group select-none">
              <div className="w-10 h-10 rounded-full bg-white p-1 shadow-md ring-2 ring-amber-400/80 flex items-center justify-center shrink-0">
                <img 
                  src="/logo.png" 
                  alt="Tejas Academy of Excellence Official Logo" 
                  width="40"
                  height="40"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain transition-transform group-hover:scale-105" 
                />
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
            <div className="flex flex-wrap gap-3">
              {socialLinks.facebook && (
                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 rounded-full bg-emerald-900/60 border border-emerald-700/50 flex items-center justify-center text-emerald-200 hover:bg-amber-500 hover:text-white hover:border-amber-400 transition-all duration-300">
                  <Facebook size={18} />
                </a>
              )}
              {socialLinks.twitter && (
                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="w-10 h-10 rounded-full bg-emerald-900/60 border border-emerald-700/50 flex items-center justify-center text-emerald-200 hover:bg-amber-500 hover:text-white hover:border-amber-400 transition-all duration-300">
                  <Twitter size={18} />
                </a>
              )}
              {socialLinks.instagram && (
                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-full bg-emerald-900/60 border border-emerald-700/50 flex items-center justify-center text-emerald-200 hover:bg-amber-500 hover:text-white hover:border-amber-400 transition-all duration-300">
                  <Instagram size={18} />
                </a>
              )}
              {socialLinks.linkedin && (
                <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-10 h-10 rounded-full bg-emerald-900/60 border border-emerald-700/50 flex items-center justify-center text-emerald-200 hover:bg-amber-500 hover:text-white hover:border-amber-400 transition-all duration-300">
                  <Linkedin size={18} />
                </a>
              )}
              {socialLinks.youtube && (
                <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-10 h-10 rounded-full bg-emerald-900/60 border border-emerald-700/50 flex items-center justify-center text-emerald-200 hover:bg-amber-500 hover:text-white hover:border-amber-400 transition-all duration-300">
                  <Youtube size={18} />
                </a>
              )}
              {socialLinks.whatsapp && (
                <a href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="w-10 h-10 rounded-full bg-emerald-900/60 border border-emerald-700/50 flex items-center justify-center text-emerald-200 hover:bg-amber-500 hover:text-white hover:border-amber-400 transition-all duration-300">
                  <MessageCircle size={18} />
                </a>
              )}
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
                <a href={`tel:${contactInfo.phone.replace(/[^0-9+]/g, '')}`} className="text-sm text-emerald-200/80 hover:text-white transition-colors font-medium">
                  {contactInfo.phone}
                </a>
              </li>
              <li className="flex items-center gap-3 group">
                <Mail className="w-5 h-5 text-amber-400 shrink-0" />
                <a href={`mailto:${contactInfo.email}`} className="text-sm text-emerald-200/80 hover:text-white transition-colors font-medium">
                  {contactInfo.email}
                </a>
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
            {copyrightText}{accreditationText ? ` ${accreditationText}` : ''}
          </p>
          <div className="flex items-center gap-6 text-xs text-emerald-400/80 font-medium">
            {legalLinks.map((link, idx) => (
              <Link key={idx} to={link.url} className="hover:text-white transition-colors">{link.label}</Link>
            ))}
            <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
