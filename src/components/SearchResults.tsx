'use client';

import { useMemo } from 'react';
import { Location, RoleKey } from '@/types/salary';
import { searchLocationsWithFallback } from '@/lib/data';
import { TrendIndicator } from './TrendIndicator';

interface SearchResultsProps {
  query: string;
  selectedRole: RoleKey | null;
  onLocationClick: (location: Location) => void;
  onStateClick: (stateCode: string) => void;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function SearchResults({
  query,
  selectedRole,
  onLocationClick,
  onStateClick,
}: SearchResultsProps) {
  // Use estimator as default display role when "All Roles" is selected
  const displayRole: RoleKey = selectedRole ?? 'estimator';

  const searchResult = useMemo(() => {
    if (!query.trim()) return { locations: [], fallbackState: null, fallbackStateCode: null, searchedCity: null };
    return searchLocationsWithFallback(query);
  }, [query]);

  const { locations: results, fallbackState, searchedCity } = searchResult;

  if (!query.trim()) {
    return null;
  }

  if (results.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 text-center">
        <svg
          className="h-12 w-12 text-gray-400 mx-auto mb-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
          />
        </svg>
        <p className="text-gray-500 font-medium">No locations found</p>
        <p className="text-sm text-gray-400 mt-1">
          Try searching for a different city or state
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
        {fallbackState ? (
          <p className="text-sm text-gray-600">
            <span className="text-sky-600 font-medium">&quot;{searchedCity}&quot;</span> isn&apos;t in our database — showing {results.length} {results.length === 1 ? 'location' : 'locations'} in <span className="font-medium">{fallbackState}</span>
          </p>
        ) : (
          <p className="text-sm text-gray-600">
            Found {results.length} {results.length === 1 ? 'location' : 'locations'} matching &quot;{query}&quot;
          </p>
        )}
      </div>
      <ul className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
        {results.map((location) => {
          const salaryRange = location.roles[displayRole];
          return (
            <li
              key={`${location.city}-${location.stateCode}`}
              className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => {
                onStateClick(location.stateCode);
                onLocationClick(location);
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-navy">
                    {location.city}, {location.stateCode}
                  </p>
                  <p className="text-sm text-gray-500">{location.state}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {formatCurrency(salaryRange.min)} - {formatCurrency(salaryRange.max)}
                  </p>
                </div>
                <TrendIndicator trend={salaryRange.trend} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default SearchResults;
