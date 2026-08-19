import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Phone, Download, X, HelpCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { cmsService } from '@/services/cmsService';
import { programService } from '@/services/programService';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';
import { BrochureDownloadModal } from '@/components/modals/BrochureDownloadModal';

export const QuickConnectWidget = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isBrochureModalOpen, setIsBrochureModalOpen] = useState(false);
  const { user } = useAuthStore();

  const { data: cmsData } = useQuery({
    queryKey: ['cms', 'global_quick_connect'],
    queryFn: () => cmsService.getCMSData('global_quick_connect'),
  });

  const config = cmsData?.data?.data || {
    isActive: true,
    whatsappNumber: '918331051327',
    whatsappMessage: 'Hello, I would like to know more about Tejas Academy.',
    contactUrl: '/contact',
    brochureUrl: '/brochure.pdf',
  };

  const handleBrochureClick = async () => {
    if (!user) {
      setIsBrochureModalOpen(true);
      return;
    }

    try {
      await programService.downloadBrochure({
        programTitle: 'Tejas Academy Institutional Prospectus',
        downloadType: 'brochure'
      });
      toast.success('Downloading Tejas Academy Prospectus...');
    } catch (err) {
      console.warn('[QuickConnectWidget] Download error:', err);
      toast.error('Could not download prospectus. Please sign in or contact support.');
    }
  };

  if (!config.isActive) return null;

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end select-none">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="mb-4 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 w-64 overflow-hidden"
            >
              <div className="p-3 bg-gray-50 border-b border-gray-100 rounded-t-xl mb-2">
                <h4 className="font-bold text-gray-900 text-sm">Need Guidance?</h4>
                <p className="text-xs text-gray-500">Connect directly with our advisors.</p>
              </div>
              
              <a 
                href={`https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(config.whatsappMessage)}`} 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center gap-3 w-full p-3 hover:bg-green-50 rounded-lg transition-colors group text-left"
              >
                <div className="bg-green-100 text-green-600 p-2 rounded-full group-hover:scale-110 transition-transform">
                  <MessageCircle size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">WhatsApp Chat</p>
                  <p className="text-xs text-gray-500">+91 83310 51327</p>
                </div>
              </a>
              
              <button 
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  navigate(config.contactUrl || '/contact');
                }} 
                className="flex items-center gap-3 w-full p-3 hover:bg-blue-50 rounded-lg transition-colors group text-left mt-1 cursor-pointer"
              >
                <div className="bg-blue-100 text-blue-600 p-2 rounded-full group-hover:scale-110 transition-transform">
                  <Phone size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Request a Call</p>
                  <p className="text-xs text-gray-500">Speak to an advisor</p>
                </div>
              </button>
              
              <button 
                type="button"
                onClick={handleBrochureClick}
                className="flex items-center gap-3 w-full p-3 hover:bg-amber-50 rounded-lg transition-colors group text-left mt-1 border-t border-gray-100 cursor-pointer"
              >
                <div className="bg-amber-100 text-amber-600 p-2 rounded-full group-hover:scale-110 transition-transform">
                  <Download size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Download Prospectus</p>
                  <p className="text-xs text-gray-500">Get complete program details</p>
                </div>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 bg-primary-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-primary-900/30 group cursor-pointer"
          aria-label="Quick connect options"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
              >
                <X size={24} />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
              >
                <HelpCircle size={28} className="group-hover:animate-pulse" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Institutional Brochure Modal */}
      <BrochureDownloadModal
        isOpen={isBrochureModalOpen}
        onClose={() => setIsBrochureModalOpen(false)}
        program={{
          title: 'Tejas Academy Official Prospectus',
          brochureUrl: config.brochureUrl || '/brochure.pdf'
        }}
      />
    </>
  );
};

export default QuickConnectWidget;
