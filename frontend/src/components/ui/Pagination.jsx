import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/utils/cn';

export const Pagination = ({ currentPage, totalPages, onPageChange, className }) => {
  const getPages = () => {
    let pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    return pages;
  };

  return (
    <nav className={cn("flex items-center justify-center space-x-2 my-8", className)}>
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="w-10 h-10 p-0"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      {getPages().map((page, i) => (
        <React.Fragment key={i}>
          {page === '...' ? (
            <span className="px-3 py-2">...</span>
          ) : (
            <Button
              variant={currentPage === page ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onPageChange(page)}
              className="w-10 h-10 p-0"
            >
              {page}
            </Button>
          )}
        </React.Fragment>
      ))}
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="w-10 h-10 p-0"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </nav>
  );
};
