import React, { useState } from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useQuery } from '@tanstack/react-query';
import { galleryService } from '@/services/galleryService';
import { SEO } from '@/components/ui/SEO';
import { Image as ImageIcon } from 'lucide-react';

const FALLBACK_GALLERY = [
  { _id: 'g1', title: 'Advanced Robotics & AI Research Lab', category: 'Infrastructure', imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800' },
  { _id: 'g2', title: 'Campus Amphitheatre & Masterclass Hub', category: 'Campus', imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800' },
  { _id: 'g3', title: 'Collaborative Innovation Commons', category: 'Academics', imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800' },
  { _id: 'g4', title: 'Executive Seminar Hall', category: 'Events', imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=800' },
  { _id: 'g5', title: 'Central Digital Knowledge Library', category: 'Infrastructure', imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800' },
  { _id: 'g6', title: 'Student Hackathon & Design Sprint', category: 'Events', imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800' }
];

export const Gallery = () => {
  const { data: galleryData, isLoading } = useQuery({
    queryKey: ['gallery'],
    queryFn: () => galleryService.getGallery(),
    staleTime: 5 * 60 * 1000,
  });

  const rawItems = galleryData?.data?.gallery || galleryData?.data?.data || galleryData?.data || [];
  const galleryItems = Array.isArray(rawItems) && rawItems.length > 0 ? rawItems : FALLBACK_GALLERY;

  const categories = ['All', ...new Set(galleryItems.map(item => item.category || 'Campus'))];
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredItems = activeCategory === 'All' 
    ? galleryItems 
    : galleryItems.filter(item => (item.category || 'Campus') === activeCategory);

  return (
    <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
      <SEO 
        title="Campus Gallery & Life at Tejas" 
        description="Explore visual glimpses of our academic laboratories, lecture halls, campus facilities, and student community events."
        url="https://unlocktejas.com/gallery"
      />
      <SectionHeader 
        title="Campus Gallery" 
        description="Glimpses of life, learning, innovation, and campus culture at Tejas Academy of Excellence." 
      />

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2.5 mt-10 mb-8 justify-center">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
              activeCategory === cat 
                ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredItems.map((item, i) => (
            <div 
              key={item._id || i} 
              className="group relative overflow-hidden rounded-2xl bg-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200/80"
            >
              <div className="aspect-[4/3] w-full overflow-hidden">
                <img 
                  src={(item.imageUrl || item.url || item.image || '').includes('?') ? (item.imageUrl || item.url || item.image) : `${item.imageUrl || item.url || item.image}?auto=format&w=800&q=80`} 
                  alt={`${item.title || item.caption || 'Campus Facility'} - Tejas Academy Photo Gallery`} 
                  width="800"
                  height="600"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-1">
                  {item.category || 'Campus Life'}
                </span>
                <h3 className="text-white font-bold text-base leading-snug">
                  {item.title || item.caption || 'Tejas Academy Campus'}
                </h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Gallery;
