'use client';

import { useState } from 'react';
import { Location, RoleKey, ROLE_DISPLAY_NAMES } from '@/types/salary';
import { getTopPayingLocations, getLowestPayingLocations } from '@/lib/data';
import { LocationSelectorModal } from './LocationSelectorModal';

interface ComparisonCTAProps {
  selectedRole: RoleKey;
  comparisonLocations: Location[];
  onAddToComparison: (location: Location) => void;
  onRemoveFromComparison: (location: Location) => void;
  onOpenComparison: () => void;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function ComparisonCTA({
  selectedRole,
  comparisonLocations,
  onAddToComparison,
  onRemoveFromComparison,
  onOpenComparison,
}: ComparisonCTAProps) {
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  // Get top and contrasting locations for quick add suggestions
  const topLocations = getTopPayingLocations(selectedRole, 3);
  const lowLocations = getLowestPayingLocations(selectedRole, 3);

  const isInComparison = (location: Location) => {
    return comparisonLocations.some(
      (loc) => loc.city === location.city && loc.stateCode === location.stateCode
    );
  };

  const canAddMore = comparisonLocations.length < 3;
  const canCompare = comparisonLocations.length >= 2;

  // Sample comparison preview using top 2 locations when nothing selected
  const previewLoc1 = topLocations[0];
  const previewLoc2 = topLocations[1];

  return (
    <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-sky-600 rounded-2xl p-1 shadow-xl">
      <div className="bg-white rounded-xl p-6 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100 rounded-full filter blur-3xl opacity-30 transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-sky-100 rounded-full filter blur-3xl opacity-30 transform -translate-x-1/2 translate-y-1/2" />

        <div className="relative">
          {/* Header with icon */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-xl shadow-lg">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-navy-900">Compare Locations</h2>
                <p className="text-gray-600 text-sm">Perfect for anyone considering relocation</p>
              </div>
            </div>

            {/* Quick selection count */}
            {comparisonLocations.length > 0 && (
              <div className="flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full text-sm font-semibold">
                <span>{comparisonLocations.length}/3 selected</span>
              </div>
            )}
          </div>

          {/* Main content area */}
          {comparisonLocations.length === 0 ? (
            // Show teaser when nothing selected
            <div className="space-y-4">
              <p className="text-gray-700">
                Compare salaries, benefits, and trends across up to <strong>3 locations</strong> side-by-side.
                See which city offers the best {ROLE_DISPLAY_NAMES[selectedRole]} compensation.
              </p>

              {/* Sample comparison preview */}
              <div className="bg-gradient-to-r from-sky-50 to-orange-50 rounded-xl p-4 border border-gray-200">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Sample Comparison Preview</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="font-semibold text-navy-900">{previewLoc1.city}, {previewLoc1.stateCode}</p>
                    <p className="text-lg font-bold text-sky-600">
                      {formatCurrency(previewLoc1.roles[selectedRole].max)}
                    </p>
                    <p className="text-xs text-gray-500">Top salary</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-navy-900">{previewLoc2.city}, {previewLoc2.stateCode}</p>
                    <p className="text-lg font-bold text-sky-600">
                      {formatCurrency(previewLoc2.roles[selectedRole].max)}
                    </p>
                    <p className="text-xs text-gray-500">Top salary</p>
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <span className="text-sm text-orange-600 font-medium">
                    {formatCurrency(previewLoc1.roles[selectedRole].max - previewLoc2.roles[selectedRole].max)} difference
                  </span>
                </div>
              </div>

              {/* Quick add buttons */}
              <div>
                <button
                  onClick={() => setShowQuickAdd(!showQuickAdd)}
                  className="flex items-center gap-2 text-sm font-semibold text-sky-600 hover:text-sky-700 transition-colors"
                >
                  <svg className={`h-4 w-4 transition-transform ${showQuickAdd ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  <span>Quick add locations to compare</span>
                </button>

                {showQuickAdd && (
                  <div className="mt-3 space-y-3 animate-fadeIn">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Highest Paying</p>
                    <div className="flex flex-wrap gap-2">
                      {topLocations.map((loc) => (
                        <button
                          key={`top-${loc.city}-${loc.stateCode}`}
                          onClick={() => onAddToComparison(loc)}
                          disabled={isInComparison(loc) || !canAddMore}
                          className={`
                            inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                            ${isInComparison(loc)
                              ? 'bg-orange-100 text-orange-600 border border-orange-200'
                              : canAddMore
                                ? 'bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 hover:border-sky-300'
                                : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'}
                          `}
                        >
                          {isInComparison(loc) ? (
                            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                          )}
                          {loc.city}, {loc.stateCode}
                        </button>
                      ))}
                    </div>

                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Cost-Effective Markets</p>
                    <div className="flex flex-wrap gap-2">
                      {lowLocations.map((loc) => (
                        <button
                          key={`low-${loc.city}-${loc.stateCode}`}
                          onClick={() => onAddToComparison(loc)}
                          disabled={isInComparison(loc) || !canAddMore}
                          className={`
                            inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                            ${isInComparison(loc)
                              ? 'bg-orange-100 text-orange-600 border border-orange-200'
                              : canAddMore
                                ? 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                                : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'}
                          `}
                        >
                          {isInComparison(loc) ? (
                            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                          )}
                          {loc.city}, {loc.stateCode}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Compare Now button - opens modal */}
              <button
                onClick={() => setShowLocationModal(true)}
                className="w-full py-3 rounded-xl font-bold text-lg transition-all duration-200 bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-200 hover:shadow-xl transform hover:scale-[1.02]"
              >
                Compare Now →
              </button>

              {/* Or explore text */}
              <p className="text-sm text-gray-500 text-center pt-2 border-t border-gray-100">
                Or click the <span className="inline-flex items-center justify-center w-5 h-5 bg-gray-100 rounded text-gray-600 text-xs"><svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg></span> button on any location in the state panel
              </p>
            </div>
          ) : (
            // Show selected locations when some are chosen
            <div className="space-y-4">
              <p className="text-gray-700">
                {canCompare
                  ? 'Ready to compare! Click the button below to see the full comparison.'
                  : `Add ${3 - comparisonLocations.length} more location${3 - comparisonLocations.length !== 1 ? 's' : ''} to enable comparison.`}
              </p>

              {/* Selected locations */}
              <div className="flex flex-wrap gap-2">
                {comparisonLocations.map((loc) => (
                  <div
                    key={`selected-${loc.city}-${loc.stateCode}`}
                    className="inline-flex items-center gap-2 bg-sky-100 text-sky-800 px-4 py-2 rounded-xl border border-sky-200"
                  >
                    <div>
                      <p className="font-semibold">{loc.city}, {loc.stateCode}</p>
                      <p className="text-xs text-sky-600">
                        {formatCurrency(loc.roles[selectedRole].min)} - {formatCurrency(loc.roles[selectedRole].max)}
                      </p>
                    </div>
                    <button
                      onClick={() => onRemoveFromComparison(loc)}
                      className="ml-1 p-1 hover:bg-sky-200 rounded-full transition-colors"
                      aria-label={`Remove ${loc.city}`}
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}

                {/* Empty slots */}
                {Array.from({ length: 3 - comparisonLocations.length }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="inline-flex items-center gap-2 border-2 border-dashed border-gray-300 text-gray-400 px-4 py-2 rounded-xl"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-sm">Add location</span>
                  </div>
                ))}
              </div>

              {/* Quick add when partially filled */}
              {canAddMore && (
                <div>
                  <button
                    onClick={() => setShowQuickAdd(!showQuickAdd)}
                    className="flex items-center gap-2 text-sm font-semibold text-sky-600 hover:text-sky-700 transition-colors"
                  >
                    <svg className={`h-4 w-4 transition-transform ${showQuickAdd ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    <span>Quick add more locations</span>
                  </button>

                  {showQuickAdd && (
                    <div className="mt-3 flex flex-wrap gap-2 animate-fadeIn">
                      {[...topLocations, ...lowLocations]
                        .filter(loc => !isInComparison(loc))
                        .slice(0, 4)
                        .map((loc) => (
                          <button
                            key={`quick-${loc.city}-${loc.stateCode}`}
                            onClick={() => onAddToComparison(loc)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-all"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            {loc.city}, {loc.stateCode}
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* Compare button - opens modal if not ready, goes to comparison if ready */}
              <button
                onClick={() => canCompare ? onOpenComparison() : setShowLocationModal(true)}
                className="w-full py-3 rounded-xl font-bold text-lg transition-all duration-200 bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-200 hover:shadow-xl transform hover:scale-[1.02]"
              >
                {canCompare ? 'Compare Now →' : `Add ${2 - comparisonLocations.length} more to compare →`}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Location selector modal */}
      <LocationSelectorModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        selectedRole={selectedRole}
        comparisonLocations={comparisonLocations}
        onAddToComparison={onAddToComparison}
        onRemoveFromComparison={onRemoveFromComparison}
        onOpenComparison={onOpenComparison}
      />
    </div>
  );
}

export default ComparisonCTA;
