'use client';

import { Trend } from '@/types/salary';

interface TrendIndicatorProps {
  trend: Trend;
  showLabel?: boolean;
}

const trendConfig = {
  up: {
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    ),
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    label: 'Increasing',
    srText: 'Salary trend is increasing',
  },
  down: {
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    ),
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    label: 'Decreasing',
    srText: 'Salary trend is decreasing',
  },
  stable: {
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
      </svg>
    ),
    color: 'text-gray-500',
    bgColor: 'bg-gray-100',
    label: 'Stable',
    srText: 'Salary trend is stable',
  },
};

export function TrendIndicator({ trend, showLabel = false }: TrendIndicatorProps) {
  const config = trendConfig[trend];

  return (
    <div
      className={`
        inline-flex items-center gap-1.5 px-2 py-1 rounded-full
        ${config.bgColor} ${config.color}
      `}
      title={config.label}
      role="status"
    >
      <span className="sr-only">{config.srText}</span>
      {config.icon}
      {showLabel && (
        <span className="text-xs font-medium" aria-hidden="true">
          {config.label}
        </span>
      )}
    </div>
  );
}

export default TrendIndicator;
