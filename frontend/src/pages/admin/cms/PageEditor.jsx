import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Save, 
  Eye, 
  Send, 
  History, 
  Plus, 
  GripVertical, 
  Trash2, 
  ArrowLeft, 
  ExternalLink,
  Layers,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { toast } from 'sonner';
import { cmsService } from '@/services/cmsService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';

export const PageEditor = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showHistory, setShowHistory] = useState(false);
  const [activeTab, setActiveTab] = useState('blocks');

  const pageKey = String(slug || 'home').toLowerCase().trim();

  // Fetch page CMS entry from database
  const { data: cmsResponse, isLoading } = useQuery({
    queryKey: ['cms', pageKey, 'DRAFT'],
    queryFn: () => cmsService.getCmsData(pageKey, 'DRAFT'),
  });

  // Fetch version history
  const { data: versionHistory } = useQuery({
    queryKey: ['cms', pageKey, 'versions'],
    queryFn: () => cmsService.getVersionHistory(pageKey),
    enabled: showHistory
  });

  const entry = cmsResponse?.data;
  const isDraft = entry?.status === 'DRAFT';
  const liveVersion = entry?.publishedVersionNumber || 1;

  // Local state for editing fields
  const [pageTitle, setPageTitle] = useState('');
  const [pageSubtitle, setPageSubtitle] = useState('');
  const [sections, setSections] = useState([]);
  const [jsonMode, setJsonMode] = useState(false);
  const [rawJson, setRawJson] = useState('{}');

  useEffect(() => {
    const data = entry?.data && Object.keys(entry.data).length > 0 ? entry.data : entry?.publishedData;
    if (data) {
      setPageTitle(data.title || data.hero?.title || `${slug?.toUpperCase()} Page`);
      setPageSubtitle(data.subtitle || data.hero?.subtitle || data.description || '');
      
      if (Array.isArray(data.sections)) {
        setSections(data.sections);
      } else if (data.hero) {
        setSections([
          { id: 'hero', name: 'Hero Section', data: data.hero },
          ...(data.stats ? [{ id: 'stats', name: 'Key Statistics', data: data.stats }] : []),
          ...(data.partners ? [{ id: 'partners', name: 'Partners & Recruiters', data: data.partners }] : []),
          ...(data.overview ? [{ id: 'overview', name: 'Overview & Mission', data: { overview: data.overview } }] : []),
          ...(data.facilities ? [{ id: 'facilities', name: 'Facilities Gallery', data: data.facilities }] : [])
        ]);
      } else {
        setSections([
          { id: 'main_content', name: 'Main Content Block', data: data }
        ]);
      }

      setRawJson(JSON.stringify(data, null, 2));
    }
  }, [entry, slug]);

  // Mutation: Save Draft
  const saveDraftMutation = useMutation({
    mutationFn: (updatedPayload) => cmsService.updateCmsData(pageKey, updatedPayload),
    onSuccess: () => {
      toast.success('Draft changes saved successfully to database');
      queryClient.invalidateQueries(['cms', pageKey]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to save draft');
    }
  });

  // Mutation: Publish Live
  const publishMutation = useMutation({
    mutationFn: () => cmsService.publishCmsData(pageKey, `Published ${pageKey} via Admin Page Editor`),
    onSuccess: () => {
      toast.success(`'${pageKey}' page published live! All visitors now see these updates.`);
      queryClient.invalidateQueries(['cms', pageKey]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to publish changes');
    }
  });

  const handleSaveDraft = () => {
    let payload = {};
    if (jsonMode) {
      try {
        payload = JSON.parse(rawJson);
      } catch (e) {
        toast.error('Invalid JSON format: ' + e.message);
        return;
      }
    } else {
      payload = {
        title: pageTitle,
        subtitle: pageSubtitle,
        sections: sections,
        lastUpdated: new Date().toISOString()
      };
    }
    saveDraftMutation.mutate(payload);
  };

  const handleAddSection = () => {
    const newId = `section_${Date.now()}`;
    setSections([
      ...sections,
      {
        id: newId,
        name: `Custom Section ${sections.length + 1}`,
        data: {
          heading: 'New Section Heading',
          description: 'Add your section content here.'
        }
      }
    ]);
    toast.success('Added new section block');
  };

  const handleRemoveSection = (index) => {
    const updated = sections.filter((_, i) => i !== index);
    setSections(updated);
    toast.info('Section removed');
  };

  const handleSectionTextChange = (index, field, value) => {
    const updated = [...sections];
    updated[index] = {
      ...updated[index],
      data: {
        ...updated[index].data,
        [field]: value
      }
    };
    setSections(updated);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-24 font-inter">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <Link 
          to="/admin/cms/pages" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Pages Catalog
        </Link>
        <div className="flex items-center gap-2">
          <Badge variant={isDraft ? "warning" : "success"} className="text-xs">
            {isDraft ? "Draft (Unsaved to Live)" : `Live Version v${liveVersion}`}
          </Badge>
        </div>
      </div>

      {/* Editor Header Bar */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-primary-600" />
            <h1 className="text-2xl font-bold text-gray-900 capitalize font-outfit">
              Editing: {slug || 'Homepage'}
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Real-time page editor synchronized with MongoDB Atlas & Sanity CMS.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowHistory(!showHistory)} 
            className="text-xs flex items-center gap-1.5"
          >
            <History className="w-3.5 h-3.5" /> Version History
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            as="a" 
            href={slug === 'home' ? '/' : `/${slug}`} 
            target="_blank" 
            className="text-xs flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" /> View Live Page
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSaveDraft} 
            disabled={saveDraftMutation.isPending}
            className="text-xs flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" /> Save Draft
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => publishMutation.mutate()} 
            disabled={publishMutation.isPending}
            className="text-xs flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Send className="w-3.5 h-3.5" /> Publish Live
          </Button>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <button
          type="button"
          onClick={() => setJsonMode(false)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            !jsonMode ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Visual Blocks Editor
        </button>
        <button
          type="button"
          onClick={() => {
            setRawJson(JSON.stringify({ title: pageTitle, subtitle: pageSubtitle, sections }, null, 2));
            setJsonMode(true);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            jsonMode ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Raw JSON Config Mode
        </button>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="p-16 text-center text-gray-500 bg-white rounded-2xl border border-gray-100">
          Loading page sections...
        </div>
      ) : jsonMode ? (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
            Raw Schema & Layout JSON
          </label>
          <textarea
            value={rawJson}
            onChange={(e) => setRawJson(e.target.value)}
            rows={20}
            className="w-full font-mono text-xs p-4 bg-gray-900 text-emerald-400 rounded-xl border border-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Page Meta Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Page Header Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Page Main Title"
                value={pageTitle}
                onChange={(e) => setPageTitle(e.target.value)}
                placeholder="e.g. Programs Catalog"
              />
              <Input
                label="Page Subtitle / Tagline"
                value={pageSubtitle}
                onChange={(e) => setPageSubtitle(e.target.value)}
                placeholder="e.g. Industry-ready executive education"
              />
            </div>
          </div>

          {/* Sections List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                Page Content Sections ({sections.length})
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddSection}
                className="text-xs flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Add Section Block
              </Button>
            </div>

            {sections.map((section, idx) => (
              <div 
                key={section.id || idx} 
                className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden transition-all hover:border-primary-200"
              >
                <div className="bg-gray-50/80 border-b border-gray-200 px-5 py-3.5 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                    <span className="font-bold text-xs uppercase tracking-wider text-gray-800">
                      {section.name || `Section ${idx + 1}`}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">#{section.id || idx}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSection(idx)}
                    className="text-gray-400 hover:text-red-600 transition-colors p-1"
                    title="Remove Section"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  {section.data?.heading !== undefined ? (
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Section Title</label>
                      <Input
                        value={section.data.heading || section.data.title || ''}
                        onChange={(e) => handleSectionTextChange(idx, 'heading', e.target.value)}
                        placeholder="Section Heading"
                      />
                    </div>
                  ) : null}

                  {section.data?.description !== undefined || section.data?.content !== undefined ? (
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Section Body / Description</label>
                      <Textarea
                        rows={3}
                        value={section.data.description || section.data.content || ''}
                        onChange={(e) => handleSectionTextChange(idx, 'description', e.target.value)}
                        placeholder="Section content..."
                      />
                    </div>
                  ) : null}

                  {/* Section Raw Preview */}
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
                      Section Configuration Data:
                    </span>
                    <pre className="text-[11px] font-mono text-gray-700 overflow-x-auto max-h-32">
                      {JSON.stringify(section.data, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Version History Drawer / Modal */}
      {showHistory && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <History className="w-4 h-4 text-primary-600" />
              Published Version Audit Ledger
            </h3>
            <button 
              onClick={() => setShowHistory(false)}
              className="text-xs font-bold text-gray-500 hover:text-gray-900"
            >
              Close
            </button>
          </div>

          <div className="space-y-3">
            {entry?.versions && entry.versions.length > 0 ? (
              entry.versions.map((ver) => (
                <div key={ver.versionNumber} className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-200/80">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-gray-900">Version {ver.versionNumber}</span>
                      <span className="text-[10px] text-gray-500 font-medium">
                        {new Date(ver.publishedAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{ver.commitMessage || 'Published update'}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      cmsService.rollbackCmsData(pageKey, ver.versionNumber).then(() => {
                        toast.success(`Rolled back to version ${ver.versionNumber}`);
                        queryClient.invalidateQueries(['cms', pageKey]);
                      });
                    }}
                    className="text-xs flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> Rollback
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500">No previous version snapshots found for this page.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PageEditor;
