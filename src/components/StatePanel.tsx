'use client';

import { useState, useMemo } from 'react';
import { Location, RoleKey, ROLE_DISPLAY_NAMES } from '@/types/salary';
import { getLocationsByState } from '@/lib/data';
import { TrendIndicator } from './TrendIndicator';

type SortOrder = 'high-to-low' | 'low-to-high';

interface StatePanelProps {
  stateCode: string;
  stateName: string;
  selectedRole: RoleKey;
  onClose: () => void;
  onLocationSelect?: (location: Location) => void;
  onCompareAdd?: (location: Location) => void;
  comparisonLocations?: Location[];
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function StatePanel({
  stateCode,
  stateName,
  selectedRole,
  onClose,
  onLocationSelect,
  onCompareAdd,
  comparisonLocations = [],
}: StatePanelProps) {
  const [sortOrder, setSortOrder] = useState<SortOrder>('high-to-low');

  const isInComparison = (location: Location) => {
    return comparisonLocations.some(
      (loc) => loc.city === location.city && loc.stateCode === location.stateCode
    );
  };

  const canAddToComparison = comparisonLocations.length < 3;

  const locations = useMemo(() => {
    return getLocationsByState(stateCode);
  }, [stateCode]);

  const sortedLocations = useMemo(() => {
    return [...locations].sort((a, b) => {
      const salaryA = (a.roles[selectedRole].min + a.roles[selectedRole].max) / 2;
      const salaryB = (b.roles[selectedRole].min + b.roles[selectedRole].max) / 2;
      return sortOrder === 'high-to-low' ? salaryB - salaryA : salaryA - salaryB;
    });
  }, [locations, selectedRole, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'high-to-low' ? 'low-to-high' : 'high-to-low'));
  };

  if (locations.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-navy-900 to-sky-900 px-4 py-4 flex items-center justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-400 rounded-full filter blur-2xl transform translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="relative">
          <h2 className="text-lg font-bold text-white">{stateName}</h2>
          <p className="text-sm text-sky-200">
            {locations.length} {locations.length === 1 ? 'city' : 'cities'} with salary data
          </p>
        </div>
        <button
          onClick={onClose}
          className="relative text-white hover:text-orange-300 transition-colors p-1 rounded"
          aria-label="Close panel"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Compare hint */}
      {onCompareAdd && comparisonLocations.length === 0 && (
        <div className="px-4 py-2 bg-sky-50 border-b border-sky-200">
          <p className="text-xs text-sky-700 flex items-center gap-1.5">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>Click <strong>&quot;+ Compare&quot;</strong> to add locations for side-by-side comparison</span>
          </p>
        </div>
      )}

      {/* Sort controls */}
      <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <span className="text-sm font-medium text-navy-700">
          {ROLE_DISPLAY_NAMES[selectedRole]}
        </span>
        <button
          onClick={toggleSortOrder}
          className="flex items-center gap-1 text-sm text-sky-600 hover:text-sky-700 font-medium transition-colors"
        >
          <span>Sort: {sortOrder === 'high-to-low' ? 'High to Low' : 'Low to High'}</span>
          <svg
            className={`h-4 w-4 transition-transform ${sortOrder === 'low-to-high' ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* City list */}
      <div className="max-h-96 overflow-y-auto">
        <ul className="divide-y divide-gray-100">
          {sortedLocations.map((location) => {
            const salaryRange = location.roles[selectedRole];
            const inComparison = isInComparison(location);
            return (
              <li
                key={`${location.city}-${location.stateCode}`}
                className="px-4 py-3 hover:bg-sky-50 transition-all duration-200 hover:pl-5 cursor-pointer group"
              >
                <div className="flex items-center justify-between gap-2">
                  <div
                    className={onLocationSelect ? 'cursor-pointer flex-1' : 'flex-1'}
                    onClick={() => onLocationSelect?.(location)}
                  >
                    <p className="font-semibold text-navy-900 group-hover:text-sky-700 transition-colors">{location.city}</p>
                    <p className="text-sm text-gray-600">
                      {formatCurrency(salaryRange.min)} - {formatCurrency(salaryRange.max)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendIndicator trend={salaryRange.trend} />
                    {onCompareAdd && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!inComparison && canAddToComparison) {
                            onCompareAdd(location);
                          }
                        }}
                        disabled={inComparison || !canAddToComparison}
                        className={`
                          flex items-center gap-1 px-2 py-1 rounded-lg transition-all duration-200 text-xs font-medium whitespace-nowrap
                          ${inComparison
                            ? 'bg-orange-100 text-orange-600 border border-orange-200'
                            : canAddToComparison
                              ? 'bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 hover:border-sky-300 hover:shadow-sm'
                              : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'}
                        `}
                        aria-label={inComparison ? 'Already in comparison' : canAddToComparison ? 'Add to compare' : 'Max 3 locations'}
                      >
                        {inComparison ? (
                          <>
                            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span>Added</span>
                          </>
                        ) : canAddToComparison ? (
                          <>
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Compare</span>
                          </>
                        ) : (
                          <span>Max 3</span>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default StatePanel;
