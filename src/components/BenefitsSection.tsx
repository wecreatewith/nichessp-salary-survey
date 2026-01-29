'use client';

import { useMemo, useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Location } from '@/types/salary';
import { getNationalAverageBenefits, getStateAverageBenefits, getStateName, BenefitType } from '@/lib/data';
import { BenefitsDeepDive } from './BenefitsDeepDive';

interface BenefitsSectionProps {
  selectedState: string | null;
  selectedLocation: Location | null;
  onLocationClick?: (city: string, stateCode: string) => void;
}

interface BenefitData {
  name: string;
  current: number;
  national: number;
}

const BENEFIT_TYPES: { key: BenefitType; label: string }[] = [
  { key: 'ptoDays', label: 'PTO Days' },
  { key: 'bonusPercent', label: 'Bonus %' },
  { key: 'flexPercent', label: 'Flex %' },
  { key: 'esopPercent', label: 'ESOP %' },
  { key: 'autoAllowance', label: 'Auto Allowance' },
];

export function BenefitsSection({ selectedState, selectedLocation, onLocationClick }: BenefitsSectionProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [prevKey, setPrevKey] = useState('');
  const [deepDiveBenefit, setDeepDiveBenefit] = useState<BenefitType | null>(null);

  const { chartData, displayName, currentKey } = useMemo(() => {
    const nationalBenefits = getNationalAverageBenefits();
    let currentBenefits = nationalBenefits;
    let name = 'National Average';
    let key = 'national';

    // If location selected, use location benefits
    if (selectedLocation) {
      const locBenefits = selectedLocation.benefits;
      currentBenefits = {
        ptoDays: (locBenefits.ptoDays.min + locBenefits.ptoDays.max) / 2,
        bonusPercent: locBenefits.bonusPercent
          ? (locBenefits.bonusPercent.min + locBenefits.bonusPercent.max) / 2
          : 0,
        flexPercent: locBenefits.flexPercent ?? 0,
        esopPercent: locBenefits.esopPercent ?? 0,
        autoAllowance: locBenefits.autoAllowance ?? 0,
      };
      name = `${selectedLocation.city}, ${selectedLocation.stateCode}`;
      key = `${selectedLocation.city}-${selectedLocation.stateCode}`;
    }
    // If only state selected, use state average
    else if (selectedState) {
      const stateBenefits = getStateAverageBenefits(selectedState);
      if (stateBenefits) {
        currentBenefits = stateBenefits;
      }
      name = `${getStateName(selectedState)} Average`;
      key = `state-${selectedState}`;
    }

    const data: BenefitData[] = [
      {
        name: 'PTO Days',
        current: Math.round(currentBenefits.ptoDays * 10) / 10,
        national: nationalBenefits.ptoDays,
      },
      {
        name: 'Bonus %',
        current: Math.round(currentBenefits.bonusPercent * 10) / 10,
        national: nationalBenefits.bonusPercent,
      },
      {
        name: 'Flex %',
        current: Math.round(currentBenefits.flexPercent * 10) / 10,
        national: nationalBenefits.flexPercent,
      },
      {
        name: 'ESOP %',
        current: Math.round(currentBenefits.esopPercent * 10) / 10,
        national: nationalBenefits.esopPercent,
      },
      {
        name: 'Auto ($100s)',
        current: Math.round((currentBenefits.autoAllowance / 100) * 10) / 10,
        national: Math.round((nationalBenefits.autoAllowance / 100) * 10) / 10,
      },
    ];

    return { chartData: data, displayName: name, currentKey: key };
  }, [selectedState, selectedLocation]);

  // Trigger animation when data changes
  useEffect(() => {
    if (currentKey !== prevKey) {
      setIsAnimating(true);
      setPrevKey(currentKey);
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [currentKey, prevKey]);

  // If deep dive is open, show that instead
  if (deepDiveBenefit) {
    return (
      <BenefitsDeepDive
        benefitType={deepDiveBenefit}
        onBack={() => setDeepDiveBenefit(null)}
        onLocationClick={onLocationClick}
      />
    );
  }

  return (
    <div className="bg-navy-900 rounded-2xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white">Benefits Comparison</h2>
        <div
          className={`
            text-sm px-4 py-1.5 rounded-full font-medium transition-all duration-300
            ${selectedLocation ? 'bg-white text-navy-900 shadow-sm' : selectedState ? 'bg-white/20 text-white' : 'bg-white/10 text-white/80'}
            ${isAnimating ? 'scale-105' : 'scale-100'}
          `}
        >
          {displayName}
        </div>
      </div>

      {/* Chart in white card */}
      <div className="bg-white rounded-xl p-4">
        <div className={`h-64 sm:h-72 transition-opacity duration-300 ${isAnimating ? 'opacity-70' : 'opacity-100'}`}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="name"
                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 12 }}
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                }}
                labelStyle={{ color: '#0f172a', fontWeight: 700 }}
                formatter={(value, name) => [
                  typeof value === 'number' ? value.toFixed(1) : value,
                  name === 'current' ? displayName : 'National Average'
                ]}
              />
              <Legend
                wrapperStyle={{ paddingTop: 16 }}
                iconType="circle"
                formatter={(value) => value === 'current' ? displayName : 'National Average'}
              />
              <Bar
                dataKey="current"
                name="current"
                fill="#1a365d"
                radius={[6, 6, 0, 0]}
                animationDuration={500}
              />
              <Bar
                dataKey="national"
                name="national"
                fill="#E59941"
                radius={[6, 6, 0, 0]}
                animationDuration={500}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Deep dive buttons */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-xs text-white/60 mb-3 text-center">
          Click a benefit to explore in detail across all locations
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {BENEFIT_TYPES.map((benefit) => (
            <button
              key={benefit.key}
              onClick={() => setDeepDiveBenefit(benefit.key)}
              className="flex items-center justify-center gap-1 px-3 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-xl transition-all duration-200 group border border-white/10 hover:border-white/30"
            >
              <span>{benefit.label}</span>
              <svg
                className="h-4 w-4 text-white/50 group-hover:text-white transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-white/50 mt-4 text-center">
        {selectedLocation
          ? `Benefits in ${selectedLocation.city} compared to national average`
          : selectedState
          ? `Average benefits in ${getStateName(selectedState)} compared to national average`
          : 'Select a state or city to compare local benefits'}
      </p>
    </div>
  );
}

export default BenefitsSection;
