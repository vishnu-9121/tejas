import React, { useState } from 'react';
import { cn } from '@/utils/cn';
import { motion } from 'framer-motion';

export const Tabs = ({ tabs, className }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className={cn("w-full", className)}>
      <div className="flex space-x-4 border-b border-gray-200 relative">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={cn("px-4 py-2 text-sm font-medium relative focus:outline-none transition-colors", activeTab === i ? "text-primary-600" : "text-gray-500 hover:text-gray-700")}
          >
            {tab.label}
            {activeTab === i && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-primary-600"
              />
            )}
          </button>
        ))}
      </div>
      <div className="py-4">
        {tabs[activeTab]?.content}
      </div>
    </div>
  );
};
