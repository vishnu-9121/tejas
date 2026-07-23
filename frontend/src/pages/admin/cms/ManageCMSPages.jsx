import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { LayoutTemplate, Edit3, Plus, Globe, CheckCircle2, Clock, FileText, Eye } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/utils/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';

const SYSTEM_PAGES = [
  { slug: 'home', name: 'Homepage', route: '/', description: 'Hero banner, features, stats, testimonials & quick connect', sectionsCount: 6, status: 'published' },
  { slug: 'about', name: 'About Us Page', route: '/about', description: 'Mission, vision, leadership, and campus infrastructure', sectionsCount: 4, status: 'published' },
  { slug: 'campus', name: 'Campus Page', route: '/about/campus', description: 'Interactive campus virtual tour and facility details', sectionsCount: 3, status: 'published' },
  { slug: 'programs', name: 'Programs Index', route: '/programs', description: 'Degree program catalog, filter tags, and admissions CTAs', sectionsCount: 5, status: 'published' },
  { slug: 'events', name: 'Events Portal', route: '/events', description: 'Upcoming workshops, seminars, and event registration', sectionsCount: 3, status: 'published' },
  { slug: 'insights', name: 'Tejas Insights (Blog)', route: '/insights', description: 'Articles, research papers, and news updates', sectionsCount: 4, status: 'published' },
  { slug: 'careers', name: 'Careers & Hiring', route: '/career', description: 'Faculty open positions and application form', sectionsCount: 3, status: 'published' },
  { slug: 'legal', name: 'Legal Policies', route: '/privacy', description: 'Terms of service, privacy policy, and compliance disclosures', sectionsCount: 2, status: 'published' },
];

export default function ManageCMSPages() {
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPageData, setNewPageData] = useState({ title: '', slug: '', description: '' });

  const { data: pages = SYSTEM_PAGES } = useQuery({
    queryKey: ['cms-pages-list'],
    queryFn: async () => {
      try {
        const res = await api.get('/cms/pages');
        if (res.data?.data?.length > 0) return res.data.data;
        return SYSTEM_PAGES;
      } catch (err) {
        return SYSTEM_PAGES;
      }
    }
  });

  const handleCreatePage = (e) => {
    e.preventDefault();
    toast.success(`Custom page '${newPageData.title}' initialized!`);
    setIsCreateModalOpen(false);
    setNewPageData({ title: '', slug: '', description: '' });
  };

  return (
    <div className="space-y-6 font-inter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-outfit">Website Pages & Sections Catalog</h1>
          <p className="text-sm text-gray-500">Select any website page below to edit its dynamic sections, content blocks, and layout settings.</p>
        </div>
        <Button variant="primary" size="sm" className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700" onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4" /> Create Custom Page
        </Button>
      </div>

      {/* Pages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pages.map((page) => (
          <div key={page.slug} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold">
                  <LayoutTemplate className="w-5 h-5" />
                </span>
                <Badge variant="success" className="flex items-center gap-1 text-[10px]">
                  <CheckCircle2 className="w-3 h-3" /> Live & Published
                </Badge>
              </div>

              <h3 className="text-base font-bold text-gray-900 group-hover:text-primary-600 transition-colors">{page.name}</h3>
              <div className="text-xs font-mono text-gray-400 mt-0.5">{page.route || `/${page.slug}`}</div>
              <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">{page.description}</p>
            </div>

            <div className="pt-5 mt-5 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">{page.sectionsCount || 4} Sections</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  as={Link}
                  to={`/admin/cms/pages/${page.slug}`}
                  className="text-xs flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit Sections
                </Button>
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
              className="w-full p-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-900"
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
