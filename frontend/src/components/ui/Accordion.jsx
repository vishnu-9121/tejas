import React, { useState, createContext, useContext } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

const AccordionContext = createContext();

export const Accordion = ({ children, className }) => {
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => setOpenId(openId === id ? null : id);

  return (
    <AccordionContext.Provider value={{ openId, toggle }}>
      <div className={cn("w-full space-y-2", className)}>
        {React.Children.map(children, (child, index) => {
          if (!React.isValidElement(child)) return null;
          return React.cloneElement(child, { id: child.props.id || index.toString() });
        })}
      </div>
    </AccordionContext.Provider>
  );
};

export const AccordionItem = ({ title, children, id }) => {
  const { openId, toggle } = useContext(AccordionContext);
  const isOpen = openId === id;

  return (
    <div className="border border-neutral-200 rounded-lg overflow-hidden bg-neutral-0">
      <button
        type="button"
        onClick={() => toggle(id)}
        className="w-full flex justify-between items-center p-4 text-left font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
      >
        <span>{title}</span>
        <ChevronDown className={cn("w-5 h-5 transition-transform duration-300 text-neutral-500", isOpen && "rotate-180")} />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div className="p-4 pt-0 text-sm text-neutral-600 leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
