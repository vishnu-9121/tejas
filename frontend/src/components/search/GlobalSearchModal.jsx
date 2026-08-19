import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, X, BookOpen, Users, Calendar, FileText, 
  ImageIcon, GraduationCap, LayoutTemplate, Sparkles, 
  Clock, ArrowRight, CornerDownLeft, Filter
} from 'lucide-react';
import { searchService } from '../../services/searchService';
import { useAuthStore } from '../../store/useAuthStore';

const CATEGORIES = [
  { id: 'all', label: 'All Results', icon: Sparkles },
  { id: 'programs', label: 'Programs', icon: BookOpen },
  { id: 'courses', label: 'Courses', icon: BookOpen },
  { id: 'faculty', label: 'Faculty', icon: Users },
  { id: 'mentors', label: 'Mentors', icon: Users },
  { id: 'blogs', label: 'Insights & Blogs', icon: FileText },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'gallery', label: 'Gallery', icon: ImageIcon },
  { id: 'students', label: 'Students', adminOnly: true, icon: GraduationCap },
  { id: 'applications', label: 'Applications', adminOnly: true, icon: GraduationCap },
  { id: 'cms', label: 'CMS Pages', adminOnly: true, icon: LayoutTemplate }
];

export const GlobalSearchModal = ({ isOpen, onClose }) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState({ popular: [], recent: [] });
  const [recentLocalSearches, setRecentLocalSearches] = useState([]);

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const availableCategories = CATEGORIES.filter(cat => !cat.adminOnly || isAdmin);

  // Load recent local searches from localStorage
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('_ta_recent_searches') || '[]');
      setRecentLocalSearches(stored);
    } catch (e) {
      setRecentLocalSearches([]);
    }
  }, []);

  // Fetch suggestions when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      searchService.getSuggestions()
        .then(res => setSuggestions(res.data || { popular: [], recent: [] }))
        .catch(() => {});
    } else {
      setQuery('');
      setResults(null);
    }
  }, [isOpen]);

  // Debounced search trigger
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await searchService.search(query, selectedCategory, 5);
        setResults(res);
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, selectedCategory]);

  // Keyboard shortcuts (Cmd+K / Ctrl+K, Escape)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open trigger handled outside, or toggle
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const saveRecentSearch = (term) => {
    const updated = [term, ...recentLocalSearches.filter(t => t !== term)].slice(0, 5);
    setRecentLocalSearches(updated);
    localStorage.setItem('_ta_recent_searches', JSON.stringify(updated));
  };

  const handleSelectResult = (item, type) => {
    saveRecentSearch(query || item.title || item.name);
    onClose();

    switch (type) {
      case 'programs':
        navigate(`/programs/${item.slug || item._id}`);
        break;
      case 'courses':
        navigate(`/programs`);
        break;
      case 'blogs':
        navigate(`/insights/${item.slug || item._id}`);
        break;
      case 'events':
        navigate(`/events`);
        break;
      case 'faculty':
      case 'mentors':
        navigate(`/mentors`);
        break;
      case 'gallery':
        navigate(`/gallery`);
        break;
      case 'students':
        navigate(`/admin/students/${item._id}`);
        break;
      case 'applications':
        navigate(`/admin/admissions/${item._id}`);
        break;
      case 'cms':
        navigate(`/admin/cms/pages/${item.slug}`);
        break;
      default:
        break;
    }
  };

  const handleSuggestionClick = (term) => {
    setQuery(term);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-10 flex flex-col max-h-[80vh]"
        >
          {/* Top Search Bar */}
          <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center gap-3 bg-white">
            <Search className="w-6 h-6 text-primary-600 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search programs, faculty, blogs, events, students..."
              className="flex-1 bg-transparent text-gray-900 text-lg font-medium placeholder-gray-400 focus:outline-none"
            />
            {query && (
              <button onClick={() => setQuery('')} className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            )}
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 border border-gray-200 rounded-lg text-xs font-mono text-gray-500">
              ESC
            </kbd>
          </div>

          {/* Category Filter Pills */}
          <div className="px-4 sm:px-6 py-3 bg-gray-50/70 border-b border-gray-100 flex items-center gap-2 overflow-x-auto scrollbar-none">
            <Filter className="w-3.5 h-3.5 text-gray-400 shrink-0 mr-1" />
            {availableCategories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Results / Suggestions Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            )}

            {/* Default State: Suggestions & Recent Searches */}
            {!loading && !query && (
              <div className="space-y-6">
                {/* Recent Searches */}
                {recentLocalSearches.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-400" /> Recent Searches
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {recentLocalSearches.map((term, i) => (
                        <button
                          key={i}
                          onClick={() => handleSuggestionClick(term)}
                          className="px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition-all flex items-center gap-2 group"
                        >
                          {term}
                          <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-primary-600" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Searches */}
                {suggestions.popular?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Popular Searches
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {suggestions.popular.map((item, i) => (
                        <button
                          key={i}
                          onClick={() => handleSuggestionClick(item.query)}
                          className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                        >
                          <span className="text-sm font-semibold text-gray-800">{item.query}</span>
                          <span className="text-xs font-bold text-gray-400 bg-white px-2 py-0.5 rounded-full border border-gray-200">
                            {item.count} searches
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Results State */}
            {!loading && query && results && (
              <div className="space-y-6">
                {results.totalResults === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-base font-semibold text-gray-700">No matching results found for "{query}"</p>
                    <p className="text-xs text-gray-400 mt-1">Try adjusting your keywords or category filter.</p>
                  </div>
                ) : (
                  Object.entries(results.data || {}).map(([catKey, items]) => {
                    if (!items || items.length === 0) return null;
                    const catObj = CATEGORIES.find(c => c.id === catKey) || { label: catKey, icon: Sparkles };
                    const Icon = catObj.icon;

                    return (
                      <div key={catKey} className="space-y-2">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 px-2">
                          <Icon className="w-3.5 h-3.5 text-primary-600" /> {catObj.label} ({items.length})
                        </h4>
                        <div className="space-y-1">
                          {items.map((item, idx) => (
                            <div
                              key={item._id || idx}
                              onClick={() => handleSelectResult(item, catKey)}
                              className="group flex items-center justify-between p-3 rounded-2xl hover:bg-primary-50/70 border border-transparent hover:border-primary-100 transition-all cursor-pointer"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                {item.thumbnail || item.avatar || item.imageUrl ? (
                                  <img
                                    src={item.thumbnail || item.avatar || item.imageUrl}
                                    alt=""
                                    className="w-10 h-10 rounded-xl object-cover shrink-0 border border-gray-100"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm shrink-0">
                                    {(item.title || item.name || item.studentName || 'T')[0]}
                                  </div>
                                )}
                                <div className="min-w-0">
                                  <p className="text-sm font-bold text-gray-900 group-hover:text-primary-700 truncate">
                                    {item.title || item.name || item.studentName}
                                  </p>
                                  <p className="text-xs text-gray-500 truncate">
                                    {item.description || item.excerpt || item.programName || item.email || item.company || catObj.label}
                                  </p>
                                </div>
                              </div>
                              <CornerDownLeft className="w-4 h-4 text-gray-300 group-hover:text-primary-600 opacity-0 group-hover:opacity-100 transition-all shrink-0" />
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* Footer Shortcuts */}
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 font-medium">
                <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px]">↵</kbd> Select
              </span>
              <span className="flex items-center gap-1 font-medium">
                <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px]">ESC</kbd> Close
              </span>
            </div>
            <span className="font-semibold text-gray-500">Tejas Global Search OS</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
