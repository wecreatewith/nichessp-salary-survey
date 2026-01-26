'use client';

import { Location, ROLE_DISPLAY_NAMES, ROLE_KEYS } from '@/types/salary';
import { SalaryBar } from './SalaryBar';
import { SalaryBarLegend } from './SalaryBarLegend';
import { TrendIndicator } from './TrendIndicator';
import { BenefitsChart } from './BenefitsChart';

interface LocationDetailProps {
  location: Location;
  onBack: () => void;
}

function formatBenefit(value: number | null, suffix: string = '%'): string {
  if (value === null) return 'N/A';
  return `${value}${suffix}`;
}

function formatCurrency(value: number | null): string {
  if (value === null) return 'N/A';
  return `$${value.toLocaleString()}`;
}

function formatBenefitRange(min: number, max: number, suffix: string = ''): string {
  if (min === max) return `${min}${suffix}`;
  return `${min}-${max}${suffix}`;
}

export function LocationDetail({ location, onBack }: LocationDetailProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden">
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

      {/* Benefits Section */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-navy mb-4">Benefits</h3>
        <div className="grid grid-cols-2 gap-4">
          {/* PTO Days */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm text-gray-500 mb-1">PTO Days</div>
            <div className="text-lg font-semibold text-navy">
              {formatBenefitRange(location.benefits.ptoDays.min, location.benefits.ptoDays.max, ' days')}
            </div>
          </div>

          {/* Bonus % */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm text-gray-500 mb-1">Bonus</div>
            <div className="text-lg font-semibold text-navy">
              {location.benefits.bonusPercent
                ? formatBenefitRange(location.benefits.bonusPercent.min, location.benefits.bonusPercent.max, '%')
                : 'N/A'}
            </div>
          </div>

          {/* Flex % */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm text-gray-500 mb-1">Flex Time</div>
            <div className="text-lg font-semibold text-navy">
              {formatBenefit(location.benefits.flexPercent)}
            </div>
          </div>

          {/* ESOP % */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm text-gray-500 mb-1">ESOP</div>
            <div className="text-lg font-semibold text-navy">
              {formatBenefit(location.benefits.esopPercent)}
            </div>
          </div>

          {/* Auto Allowance */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm text-gray-500 mb-1">Auto Allowance</div>
            <div className="text-lg font-semibold text-navy">
              {formatCurrency(location.benefits.autoAllowance)}
            </div>
          </div>
        </div>

        {/* Benefits Comparison Chart */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <BenefitsChart
            benefits={location.benefits}
            locationName={`${location.city}, ${location.stateCode}`}
          />
        </div>
      </div>
    </div>
  );
}

export default LocationDetail;
