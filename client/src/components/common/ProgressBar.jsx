import React from 'react';

export const ProgressBar = ({
  progress = 0,
  showLabel = false,
  size = 'md',
  color = 'brand',
  className = '',
}) => {
  const clamped = Math.min(100, Math.max(0, progress));

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const colors = {
    brand: 'bg-brand-600',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    blue: 'bg-blue-500',
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
          <span>Progress</span>
          <span>{clamped}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden ${heights[size] || heights.md}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${colors[color] || colors.brand}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
