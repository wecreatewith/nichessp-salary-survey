'use client';

import { useMemo } from 'react';
import { RoleKey, ROLE_DISPLAY_NAMES } from '@/types/salary';
import { SalaryBar } from './SalaryBar';
import { TrendIndicator } from './TrendIndicator';
import {
  getTopPayingLocations,
  getNationalSalaryRange,
  getTrendDistribution,
} from '@/lib/data';

interface NationalOverviewProps {
  selectedRole: RoleKey;
  onLocationClick?: (city: string, stateCode: string) => void;
}

export function NationalOverview({ selectedRole, onLocationClick }: NationalOverviewProps) {
  const { topCities, nationalRange, trendDist } = useMemo(() => {
    return {
      topCities: getTopPayingLocations(selectedRole, 5),
      nationalRange: getNationalSalaryRange(selectedRole),
      trendDist: getTrendDistribution(selectedRole),
    };
  }, [selectedRole]);

  const totalLocations = trendDist.up + trendDist.down + trendDist.stable;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-navy px-4 py-3">
        <h3 className="text-white font-semibold">National Overview</h3>
        <p className="text-navy-200 text-sm">{ROLE_DISPLAY_NAMES[selectedRole]}</p>
      </div>

      <div className="p-4 space-y-5">
        {/* National Salary Range */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-700">National Salary Range</h4>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex justify-between text-lg font-semibold text-navy mb-2">
              <span>${nationalRange.min.toLocaleString()}</span>
              <span className="text-gray-400">to</span>
              <span>${nationalRange.max.toLocaleString()}</span>
            </div>
            <div className="h-3 bg-gradient-to-r from-navy-200 via-navy-400 to-navy rounded-full" />
          </div>
        </div>

        {/* Top 5 Highest Paying Cities */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Top 5 Highest Paying Cities</h4>
          <div className="space-y-3">
            {topCities.map((location, index) => {
              const roleData = location.roles[selectedRole];
              return (
                <button
                  key={`${location.city}-${location.stateCode}`}
                  onClick={() => onLocationClick?.(location.city, location.stateCode)}
                  className="w-full text-left group hover:bg-gray-50 rounded-lg p-2 -mx-2 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gold text-white text-xs font-bold">
                        {index + 1}
                      </span>
                      <span className="font-medium text-navy group-hover:text-gold transition-colors">
                        {location.city}, {location.stateCode}
                      </span>
                    </div>
                    <TrendIndicator trend={roleData.trend} />
                  </div>
                  <div className="pl-7">
                    <SalaryBar
                      min={roleData.min}
                      max={roleData.max}
                      role={selectedRole}
                      showLabels={true}
                      showNationalAverage={false}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Trend Distribution */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Salary Trend Distribution</h4>
          <div className="grid grid-cols-3 gap-2">
            {/* Increasing */}
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span className="text-xl font-bold text-green-700">{trendDist.up}</span>
              </div>
              <p className="text-xs text-green-600 font-medium">Increasing</p>
              <p className="text-xs text-green-500">{Math.round((trendDist.up / totalLocations) * 100)}%</p>
            </div>

            {/* Stable */}
            <div className="bg-gray-100 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
                </svg>
                <span className="text-xl font-bold text-gray-700">{trendDist.stable}</span>
              </div>
              <p className="text-xs text-gray-600 font-medium">Stable</p>
              <p className="text-xs text-gray-500">{Math.round((trendDist.stable / totalLocations) * 100)}%</p>
            </div>

            {/* Decreasing */}
            <div className="bg-red-50 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                <span className="text-xl font-bold text-red-700">{trendDist.down}</span>
              </div>
              <p className="text-xs text-red-600 font-medium">Decreasing</p>
              <p className="text-xs text-red-500">{Math.round((trendDist.down / totalLocations) * 100)}%</p>
            </div>
          </div>
        </div>

        {/* Prompt to explore */}
        <div className="text-center pt-2 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Click a state on the map to explore city-level data
          </p>
        </div>
      </div>
    </div>
  );
}

export default NationalOverview;
