'use client';

import { Location } from '@/types/salary';

interface ComparisonTrayProps {
  locations: Location[];
  onRemove: (location: Location) => void;
  onCompare: () => void;
  onClear: () => void;
}

export function ComparisonTray({ locations, onRemove, onCompare, onClear }: ComparisonTrayProps) {
  if (locations.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-navy-900 via-navy-800 to-sky-900 border-t-4 border-orange-500 shadow-2xl z-40 py-4 px-4 animate-slideInUp">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-4">
          {/* Icon and selected locations */}
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              {/* Compare icon */}
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-2 rounded-lg shadow-lg">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className="text-sm font-bold text-white">
                  Comparing {locations.length}/3 locations
                </span>
              </div>
              {/* Location chips */}
              {locations.map((loc) => (
                <div
                  key={`${loc.city}-${loc.stateCode}`}
                  className="inline-flex items-center gap-1.5 bg-sky-500/20 text-white px-3 py-1.5 rounded-full text-sm border border-sky-400/30"
                >
                  <span className="font-semibold">{loc.city}, {loc.stateCode}</span>
                  <button
                    onClick={() => onRemove(loc)}
                    className="hover:text-orange-400 transition-colors ml-1"
                    aria-label={`Remove ${loc.city} from comparison`}
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={onClear}
              className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors font-medium"
            >
              Clear All
            </button>
            <button
              onClick={onCompare}
              disabled={locations.length < 2}
              className={`
                px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200
                ${locations.length >= 2
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/30 hover:shadow-xl transform hover:scale-105'
                  : 'bg-white/20 text-white/50 cursor-not-allowed'}
              `}
            >
              {locations.length >= 2 ? 'Compare Now' : 'Select 1 more'}
            </button>
          </div>
        </div>
        {locations.length < 2 && (
          <p className="text-xs text-sky-200 mt-2">
            Add {2 - locations.length} more location{2 - locations.length !== 1 ? 's' : ''} to start comparing
          </p>
        )}
      </div>
    </div>
  );
}

export default ComparisonTray;
