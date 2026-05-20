import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  // Generate page numbers with ellipses (e.g. 1 ... 4 5 6 ... 10)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const delta = 1; // Show current page, plus one page before and after

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (
        pages[pages.length - 1] !== '...' &&
        (i < currentPage - delta || i > currentPage + delta)
      ) {
        pages.push('...');
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-neutral-200 dark:border-neutral-800">
      <span className="text-xs text-neutral-450 dark:text-neutral-500 font-medium">
        Hiển thị trang {currentPage} / {totalPages}
      </span>
      
      <div className="flex items-center gap-1.5 w-full sm:w-auto justify-between sm:justify-end">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 bg-white dark:bg-zinc-950 hover:bg-neutral-50 dark:hover:bg-neutral-900 disabled:opacity-40 disabled:cursor-not-allowed select-none"
        >
          Trang trước
        </button>

        <div className="hidden sm:flex items-center gap-1">
          {getPageNumbers().map((page, index) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2.5 py-1 text-xs text-neutral-400 dark:text-neutral-600 select-none"
                >
                  ...
                </span>
              );
            }
            return (
              <button
                key={`page-${page}`}
                onClick={() => onPageChange(page as number)}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  currentPage === page
                    ? 'bg-neutral-950 text-white dark:bg-neutral-50 dark:text-neutral-950 font-bold'
                    : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900 border border-transparent hover:border-neutral-200 dark:hover:border-neutral-800'
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 bg-white dark:bg-zinc-950 hover:bg-neutral-50 dark:hover:bg-neutral-900 disabled:opacity-40 disabled:cursor-not-allowed select-none"
        >
          Trang sau
        </button>
      </div>
    </div>
  );
};

export default Pagination;
