'use client';

import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  BenefitType,
  getTopLocationsByBenefit,
  getBenefitDistribution,
  getLocationBenefitValue,
  getNationalAverageBenefits,
  getAllStates,
  getStateBenefitAverage,
} from '@/lib/data';

interface BenefitsDeepDiveProps {
  benefitType: BenefitType;
  onBack: () => void;
  onLocationClick?: (city: string, stateCode: string) => void;
}

const BENEFIT_LABELS: Record<BenefitType, string> = {
  ptoDays: 'PTO Days',
  bonusPercent: 'Bonus %',
  flexPercent: 'Flex %',
  esopPercent: 'ESOP %',
  autoAllowance: 'Auto Allowance',
};

const BENEFIT_UNITS: Record<BenefitType, string> = {
  ptoDays: 'days',
  bonusPercent: '%',
  flexPercent: '%',
  esopPercent: '%',
  autoAllowance: '',
};

function formatBenefitValue(value: number | null, benefitType: BenefitType): string {
  if (value === null) return 'N/A';
  if (benefitType === 'autoAllowance') {
    return `$${value.toLocaleString()}`;
  }
  return `${value.toFixed(1)} ${BENEFIT_UNITS[benefitType]}`;
}

function formatBenefitDiff(value: number, benefitType: BenefitType): string {
  if (benefitType === 'autoAllowance') {
    return `$${value.toLocaleString()}`;
  }
  return `${value.toFixed(1)} ${BENEFIT_UNITS[benefitType]}`;
}

export function BenefitsDeepDive({ benefitType, onBack, onLocationClick }: BenefitsDeepDiveProps) {
  const { topLocations, distribution, nationalAvg, stateAverages } = useMemo(() => {
    const top = getTopLocationsByBenefit(benefitType, 5);
    const dist = getBenefitDistribution(benefitType);
    const national = getNationalAverageBenefits();

    // Get state averages for mini-map
    const states = getAllStates();
    const stateAvgs: Record<string, number | null> = {};
    for (const state of states) {
      stateAvgs[state] = getStateBenefitAverage(state, benefitType);
    }

    let avg = 0;
    switch (benefitType) {
      case 'ptoDays':
        avg = national.ptoDays;
        break;
      case 'bonusPercent':
        avg = national.bonusPercent;
        break;
      case 'flexPercent':
        avg = national.flexPercent;
        break;
      case 'esopPercent':
        avg = national.esopPercent;
        break;
      case 'autoAllowance':
        avg = national.autoAllowance;
        break;
    }

    return {
      topLocations: top,
      distribution: dist,
      nationalAvg: avg,
      stateAverages: stateAvgs,
    };
  }, [benefitType]);

  // Find min/max for color scale
  const { minAvg, maxAvg } = useMemo(() => {
    const values = Object.values(stateAverages).filter((v): v is number => v !== null);
    return {
      minAvg: values.length > 0 ? Math.min(...values) : 0,
      maxAvg: values.length > 0 ? Math.max(...values) : 1,
    };
  }, [stateAverages]);

  const getColorForValue = (value: number | null): string => {
    if (value === null) return '#e5e7eb'; // gray-200
    const range = maxAvg - minAvg;
    if (range === 0) return '#1a365d'; // navy
    const normalized = (value - minAvg) / range;
    // Light to dark blue gradient
    const lightness = 90 - normalized * 50; // 90% to 40%
    return `hsl(212, 54%, ${lightness}%)`;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-navy px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">{BENEFIT_LABELS[benefitType]} Analysis</h2>
          <p className="text-sm text-navy-200">
            National average: {formatBenefitValue(nationalAvg, benefitType)}
          </p>
        </div>
        <button
          onClick={onBack}
          className="text-white hover:text-gold transition-colors flex items-center gap-1"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-sm">Back</span>
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Top 5 Locations */}
        <div>
          <h3 className="text-lg font-semibold text-navy mb-4">Top 5 Locations</h3>
          <div className="space-y-3">
            {topLocations.map((loc, index) => {
              const value = getLocationBenefitValue(loc, benefitType);
              return (
                <button
                  key={`${loc.city}-${loc.stateCode}`}
                  onClick={() => onLocationClick?.(loc.city, loc.stateCode)}
                  className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
                >
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gold text-white font-bold text-sm">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-navy">
                      {loc.city}, {loc.stateCode}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatBenefitValue(value, benefitType)}
                    </p>
                  </div>
                  <div className="text-right">
                    {value !== null && value > nationalAvg && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        +{formatBenefitDiff(value - nationalAvg, benefitType)}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Distribution Histogram */}
        <div>
          <h3 className="text-lg font-semibold text-navy mb-4">Distribution</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distribution} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="bucket"
                  tick={{ fill: '#6b7280', fontSize: 10 }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  label={{ value: 'Locations', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: '#6b7280' } }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => [`${value} locations`, 'Count']}
                />
                <Bar dataKey="count" fill="#1a365d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mini Map - State Grid */}
        <div>
          <h3 className="text-lg font-semibold text-navy mb-4">By State</h3>
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-1">
            {Object.entries(stateAverages)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([state, value]) => (
                <div
                  key={state}
                  className="aspect-square rounded flex items-center justify-center text-xs font-medium transition-transform hover:scale-110 cursor-default"
                  style={{
                    backgroundColor: getColorForValue(value),
                    color: value !== null && (value - minAvg) / (maxAvg - minAvg) > 0.5 ? '#fff' : '#1a365d',
                  }}
                  title={`${state}: ${value !== null ? formatBenefitValue(value, benefitType) : 'No data'}`}
                >
                  {state}
                </div>
              ))}
          </div>
          <div className="flex items-center justify-center gap-2 mt-3 text-xs text-gray-500">
            <span>Low</span>
            <div className="flex h-3">
              {[0, 0.25, 0.5, 0.75, 1].map((v) => (
                <div
                  key={v}
                  className="w-6 h-full"
                  style={{ backgroundColor: getColorForValue(minAvg + v * (maxAvg - minAvg)) }}
                />
              ))}
            </div>
            <span>High</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BenefitsDeepDive;
