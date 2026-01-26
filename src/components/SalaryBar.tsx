'use client';

import { useMemo } from 'react';
import { RoleKey } from '@/types/salary';
import { getNationalSalaryRange, calculateAverageSalary } from '@/lib/data';

interface SalaryBarProps {
  min: number;
  max: number;
  role: RoleKey;
  showLabels?: boolean;
  showNationalAverage?: boolean;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function SalaryBar({
  min,
  max,
  role,
  showLabels = true,
  showNationalAverage = true,
}: SalaryBarProps) {
  const { nationalRange, nationalAverage, leftPercent, widthPercent, avgPositionPercent } = useMemo(() => {
    const range = getNationalSalaryRange(role);
    const avg = calculateAverageSalary(role);
    const totalRange = range.max - range.min;

    // Calculate bar position and width as percentage of national range
    const left = ((min - range.min) / totalRange) * 100;
    const width = ((max - min) / totalRange) * 100;
    const avgPosition = ((avg - range.min) / totalRange) * 100;

    return {
      nationalRange: range,
      nationalAverage: avg,
      leftPercent: Math.max(0, left),
      widthPercent: Math.min(100 - left, width),
      avgPositionPercent: avgPosition,
    };
  }, [min, max, role]);

  return (
    <div className="w-full">
      {/* Labels */}
      {showLabels && (
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>{formatCurrency(min)}</span>
          <span>{formatCurrency(max)}</span>
        </div>
      )}

      {/* Bar container */}
      <div className="relative h-6 bg-gray-100 rounded-full overflow-hidden">
        {/* Salary range bar */}
        <div
          className="absolute top-0 h-full bg-gradient-to-r from-navy-400 to-navy rounded-full transition-all duration-300"
          style={{
            left: `${leftPercent}%`,
            width: `${widthPercent}%`,
          }}
        />

        {/* National average line */}
        {showNationalAverage && (
          <div
            className="absolute top-0 h-full w-0.5 bg-gold z-10"
            style={{ left: `${avgPositionPercent}%` }}
            title={`National Average: ${formatCurrency(nationalAverage)}`}
          />
        )}
      </div>

      {/* National range labels */}
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>{formatCurrency(nationalRange.min)}</span>
        {showNationalAverage && (
          <span className="text-gold font-medium">
            Avg: {formatCurrency(nationalAverage)}
          </span>
        )}
        <span>{formatCurrency(nationalRange.max)}</span>
      </div>
    </div>
  );
}

export default SalaryBar;
