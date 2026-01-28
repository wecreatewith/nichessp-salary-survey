'use client';

import { Location, ROLE_DISPLAY_NAMES, ROLE_KEYS, RoleKey } from '@/types/salary';
import { TrendIndicator } from './TrendIndicator';

interface CompareViewProps {
  locations: Location[];
  selectedRole?: RoleKey | null; // Optional, reserved for future highlighting
  onBack: () => void;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatBenefitRange(min: number, max: number, suffix: string = ''): string {
  if (min === max) return `${min}${suffix}`;
  return `${min}-${max}${suffix}`;
}

function formatBenefit(value: number | null, suffix: string = '%'): string {
  if (value === null) return 'N/A';
  return `${value}${suffix}`;
}

export function CompareView({ locations, onBack }: CompareViewProps) {
  // Find the highest paying location for each role
  const getHighestPayingIndex = (roleKey: RoleKey): number => {
    let maxIndex = 0;
    let maxSalary = 0;
    locations.forEach((loc, index) => {
      const midpoint = (loc.roles[roleKey].min + loc.roles[roleKey].max) / 2;
      if (midpoint > maxSalary) {
        maxSalary = midpoint;
        maxIndex = index;
      }
    });
    return maxIndex;
  };

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-navy px-4 py-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white hover:text-gold transition-colors mb-2"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-sm">Back to Map</span>
        </button>
        <h2 className="text-xl font-semibold text-white">Location Comparison</h2>
        <p className="text-sm text-navy-200">
          Comparing {locations.length} locations
        </p>
      </div>

      {/* Location Headers */}
      <div className={`grid gap-4 p-4 bg-gray-50 border-b border-gray-200 ${
        locations.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
      }`}>
        {locations.map((loc) => (
          <div key={`${loc.city}-${loc.stateCode}`} className="text-center">
            <h3 className="font-semibold text-navy">{loc.city}</h3>
            <p className="text-sm text-gray-600">{loc.state}</p>
          </div>
        ))}
      </div>

      {/* Salary Comparison by Role */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-navy mb-4">Salary by Role</h3>
        <div className="space-y-4">
          {ROLE_KEYS.map((roleKey) => {
            const highestIndex = getHighestPayingIndex(roleKey);
            return (
              <div key={roleKey} className="border-b border-gray-100 pb-4 last:border-b-0">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  {ROLE_DISPLAY_NAMES[roleKey]}
                </p>
                <div className={`grid gap-4 ${
                  locations.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
                }`}>
                  {locations.map((loc, index) => {
                    const roleData = loc.roles[roleKey];
                    const isHighest = index === highestIndex;
                    return (
                      <div
                        key={`${loc.city}-${roleKey}`}
                        className={`p-3 rounded-lg ${
                          isHighest ? 'bg-gold-50 border border-gold' : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-sm font-semibold ${
                            isHighest ? 'text-gold-700' : 'text-navy'
                          }`}>
                            {formatCurrency((roleData.min + roleData.max) / 2)}
                          </span>
                          <TrendIndicator trend={roleData.trend} />
                        </div>
                        <p className="text-xs text-gray-500">
                          {formatCurrency(roleData.min)} - {formatCurrency(roleData.max)}
                        </p>
                        {isHighest && (
                          <span className="inline-block mt-1 text-xs text-gold-600 font-medium">
                            Highest
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Benefits Comparison */}
      <div className="p-4 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-navy mb-4">Benefits</h3>

        {/* PTO */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">PTO Days</p>
          <div className={`grid gap-4 ${
            locations.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
          }`}>
            {locations.map((loc) => (
              <div key={`${loc.city}-pto`} className="bg-gray-50 p-3 rounded-lg text-center">
                <span className="font-semibold text-navy">
                  {formatBenefitRange(loc.benefits.ptoDays.min, loc.benefits.ptoDays.max, ' days')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bonus */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Bonus</p>
          <div className={`grid gap-4 ${
            locations.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
          }`}>
            {locations.map((loc) => (
              <div key={`${loc.city}-bonus`} className="bg-gray-50 p-3 rounded-lg text-center">
                <span className="font-semibold text-navy">
                  {loc.benefits.bonusPercent
                    ? formatBenefitRange(loc.benefits.bonusPercent.min, loc.benefits.bonusPercent.max, '%')
                    : 'N/A'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Flex */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Flex Time</p>
          <div className={`grid gap-4 ${
            locations.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
          }`}>
            {locations.map((loc) => (
              <div key={`${loc.city}-flex`} className="bg-gray-50 p-3 rounded-lg text-center">
                <span className="font-semibold text-navy">
                  {formatBenefit(loc.benefits.flexPercent)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ESOP */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">ESOP</p>
          <div className={`grid gap-4 ${
            locations.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
          }`}>
            {locations.map((loc) => (
              <div key={`${loc.city}-esop`} className="bg-gray-50 p-3 rounded-lg text-center">
                <span className="font-semibold text-navy">
                  {formatBenefit(loc.benefits.esopPercent)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompareView;
