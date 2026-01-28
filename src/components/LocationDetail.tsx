'use client';

import { Location, ROLE_DISPLAY_NAMES, ROLE_KEYS } from '@/types/salary';
import { SalaryBar } from './SalaryBar';
import { SalaryBarLegend } from './SalaryBarLegend';
import { TrendIndicator } from './TrendIndicator';

interface LocationDetailProps {
  location: Location;
  onBack: () => void;
}


export function LocationDetail({ location, onBack }: LocationDetailProps) {
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
          <span className="text-sm">Back to {location.state}</span>
        </button>
        <h2 className="text-xl font-semibold text-white">
          {location.city}, {location.stateCode}
        </h2>
      </div>

      {/* Salary Ranges by Role */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-navy">Salary Ranges by Role</h3>
          <SalaryBarLegend />
        </div>
        <div className="space-y-6">
          {ROLE_KEYS.map((roleKey) => {
            const roleData = location.roles[roleKey];
            return (
              <div key={roleKey}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {ROLE_DISPLAY_NAMES[roleKey]}
                  </span>
                  <TrendIndicator trend={roleData.trend} showLabel />
                </div>
                <SalaryBar
                  min={roleData.min}
                  max={roleData.max}
                  role={roleKey}
                  showLabels={true}
                  showNationalAverage={true}
                />
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

export default LocationDetail;
