'use client';

import { Location, RoleKey } from '@/types/salary';
import { TrendIndicator } from './TrendIndicator';

interface SalaryCardProps {
  location: Location;
  role: RoleKey;
  onClick?: (location: Location) => void;
  isSelected?: boolean;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function SalaryCard({ location, role, onClick, isSelected = false }: SalaryCardProps) {
  const roleData = location.roles[role];

  return (
    <button
      type="button"
      onClick={() => onClick?.(location)}
      className={`
        w-full text-left p-4 rounded-lg border-2 transition-all
        focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2
        ${
          isSelected
            ? 'border-navy bg-navy-50 shadow-md'
            : 'border-gray-200 bg-white hover:border-navy-200 hover:shadow-sm'
        }
      `}
      aria-pressed={isSelected}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-navy-900 truncate">
            {location.city}
          </h3>
          <p className="text-sm text-gray-500">{location.state}</p>
        </div>
        <TrendIndicator trend={roleData.trend} />
      </div>

      <div className="mt-3">
        <p className="text-lg font-bold text-navy-800">
          {formatCurrency(roleData.min)} - {formatCurrency(roleData.max)}
        </p>
      </div>
    </button>
  );
}

export default SalaryCard;
