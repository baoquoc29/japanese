import React from 'react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Chưa có dữ liệu cho cấp độ này.',
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-neutral-200/80 dark:border-neutral-800/80 rounded-2xl py-16 px-6 text-center">
      <h3 className="text-sm font-bold text-neutral-850 dark:text-neutral-200">{title}</h3>
      {description && (
        <p className="text-xs text-neutral-450 dark:text-neutral-500 mt-1 max-w-sm mx-auto leading-relaxed">
          {description}
        </p>
      )}
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-5 px-4 py-2 border border-neutral-350 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-750 dark:text-neutral-300 text-xs font-bold rounded-lg transition-colors cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
