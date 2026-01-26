'use client';

import { useMemo, useEffect, useState } from 'react';
import { RoleKey, ROLE_DISPLAY_NAMES } from '@/types/salary';
import {
  calculateAverageSalary,
  getTopPayingLocations,
  getMostCommonTrend,
  getAllLocations,
} from '@/lib/data';
import { TrendIndicator } from './TrendIndicator';

interface NationalStatsProps {
  selectedRole: RoleKey;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

// Animated number component
function AnimatedNumber({ value, format }: { value: number; format: (n: number) => string }) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    const duration = 500; // ms
    const steps = 20;
    const stepDuration = duration / steps;
    const startValue = displayValue;
    const stepValue = (value - startValue) / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setDisplayValue(value);
        clearInterval(interval);
      } else {
        setDisplayValue(startValue + stepValue * currentStep);
      }
    }, stepDuration);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <>{format(Math.round(displayValue))}</>;
}

export function NationalStats({ selectedRole }: NationalStatsProps) {
  const stats = useMemo(() => {
    const avgSalary = calculateAverageSalary(selectedRole);
    const topLocation = getTopPayingLocations(selectedRole, 1)[0];
    const trend = getMostCommonTrend(selectedRole);
    const totalLocations = getAllLocations().length;

    return {
      avgSalary,
      topLocation,
      trend,
      totalLocations,
    };
  }, [selectedRole]);

  return (
    <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-sky-900 rounded-2xl p-6 text-white relative overflow-hidden shadow-xl">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-400 rounded-full filter blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-400 rounded-full filter blur-3xl transform -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative">
        <h2 className="text-lg font-semibold text-sky-200 mb-4">
          National Overview: <span className="text-white">{ROLE_DISPLAY_NAMES[selectedRole]}</span>
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Average Salary */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 transition-all duration-300 hover:bg-white/20 hover:scale-[1.02] border border-white/10">
            <p className="text-sm text-sky-200 mb-1">Average Salary</p>
            <p className="text-2xl font-bold">
              <AnimatedNumber value={stats.avgSalary} format={formatCurrency} />
            </p>
          </div>

          {/* Top Paying City */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 transition-all duration-300 hover:bg-white/20 hover:scale-[1.02] border border-white/10">
            <p className="text-sm text-sky-200 mb-1">Highest Paying</p>
            <p className="text-lg font-semibold">
              {stats.topLocation.city}, {stats.topLocation.stateCode}
            </p>
            <p className="text-sm text-orange-400 font-semibold">
              {formatCurrency(stats.topLocation.roles[selectedRole].max)}
            </p>
          </div>

          {/* Market Trend */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 transition-all duration-300 hover:bg-white/20 hover:scale-[1.02] border border-white/10">
            <p className="text-sm text-sky-200 mb-1">Market Trend</p>
            <div className="flex items-center gap-2">
              <TrendIndicator trend={stats.trend} showLabel />
            </div>
          </div>

          {/* Total Locations */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 transition-all duration-300 hover:bg-white/20 hover:scale-[1.02] border border-white/10">
            <p className="text-sm text-sky-200 mb-1">Locations Tracked</p>
            <p className="text-2xl font-bold">
              <AnimatedNumber value={stats.totalLocations} format={(n) => n.toString()} />
            </p>
            <p className="text-sm text-sky-300">cities nationwide</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NationalStats;
