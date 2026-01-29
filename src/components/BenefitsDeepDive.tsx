'use client';

import { useMemo, useState, useCallback } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import {
  BenefitType,
  getTopLocationsByBenefit,
  getBenefitDistribution,
  getLocationBenefitValue,
  getNationalAverageBenefits,
  getAllStates,
  getStateBenefitAverage,
  STATE_NAMES,
} from '@/lib/data';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

// State FIPS codes to state abbreviations mapping
const FIPS_TO_STATE: Record<string, string> = {
  '01': 'AL', '02': 'AK', '04': 'AZ', '05': 'AR', '06': 'CA',
  '08': 'CO', '09': 'CT', '10': 'DE', '11': 'DC', '12': 'FL',
  '13': 'GA', '15': 'HI', '16': 'ID', '17': 'IL', '18': 'IN',
  '19': 'IA', '20': 'KS', '21': 'KY', '22': 'LA', '23': 'ME',
  '24': 'MD', '25': 'MA', '26': 'MI', '27': 'MN', '28': 'MS',
  '29': 'MO', '30': 'MT', '31': 'NE', '32': 'NV', '33': 'NH',
  '34': 'NJ', '35': 'NM', '36': 'NY', '37': 'NC', '38': 'ND',
  '39': 'OH', '40': 'OK', '41': 'OR', '42': 'PA', '44': 'RI',
  '45': 'SC', '46': 'SD', '47': 'TN', '48': 'TX', '49': 'UT',
  '50': 'VT', '51': 'VA', '53': 'WA', '54': 'WV', '55': 'WI',
  '56': 'WY',
};

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

interface MapTooltipData {
  stateName: string;
  stateCode: string;
  value: number | null;
}

interface MapTooltipPosition {
  x: number;
  y: number;
}

export function BenefitsDeepDive({ benefitType, onBack, onLocationClick }: BenefitsDeepDiveProps) {
  const [tooltipData, setTooltipData] = useState<MapTooltipData | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<MapTooltipPosition>({ x: 0, y: 0 });

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
    if (value === null) return '#e2e8f0'; // slate-200 for no data
    const range = maxAvg - minAvg;
    if (range === 0) return '#0ea5e9'; // sky-500
    const normalized = (value - minAvg) / range;
    // Sky blue color scale matching USMap
    if (normalized < 0.2) return '#e0f2fe'; // sky-100
    if (normalized < 0.4) return '#7dd3fc'; // sky-300
    if (normalized < 0.6) return '#38bdf8'; // sky-400
    if (normalized < 0.8) return '#0ea5e9'; // sky-500
    return '#0369a1'; // sky-700
  };

  const statesWithData = useMemo(() => {
    return Object.keys(stateAverages).filter(state => stateAverages[state] !== null);
  }, [stateAverages]);

  const handleMouseEnter = useCallback((stateCode: string, event: React.MouseEvent) => {
    const value = stateAverages[stateCode] ?? null;
    setTooltipData({
      stateName: STATE_NAMES[stateCode] || stateCode,
      stateCode,
      value,
    });
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  }, [stateAverages]);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTooltipData(null);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden">
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

        {/* US Map */}
        <div>
          <h3 className="text-lg font-semibold text-navy mb-4">{BENEFIT_LABELS[benefitType]} by State</h3>
          <div className="relative w-full" style={{ minHeight: '280px' }}>
            <ComposableMap
              projection="geoAlbersUsa"
              projectionConfig={{ scale: 700 }}
              style={{ width: '100%', height: '100%' }}
            >
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const fips = geo.id;
                    const stateCode = FIPS_TO_STATE[fips];
                    const value = stateAverages[stateCode] ?? null;
                    const hasData = statesWithData.includes(stateCode);

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onMouseEnter={(e) => handleMouseEnter(stateCode, e)}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        style={{
                          default: {
                            fill: getColorForValue(value),
                            stroke: '#fff',
                            strokeWidth: 0.5,
                            outline: 'none',
                            transition: 'all 300ms ease-out',
                          },
                          hover: {
                            fill: hasData ? '#E59941' : getColorForValue(value),
                            stroke: hasData ? '#d08530' : '#fff',
                            strokeWidth: hasData ? 1.5 : 0.5,
                            outline: 'none',
                            transition: 'all 150ms ease-out',
                          },
                          pressed: {
                            fill: '#d08530',
                            stroke: '#ad6a24',
                            strokeWidth: 1.5,
                            outline: 'none',
                          },
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            </ComposableMap>

            {/* Tooltip */}
            {tooltipData && (
              <div
                className="fixed z-50 bg-white rounded-xl shadow-xl border border-gray-200 p-3 pointer-events-none"
                style={{
                  left: tooltipPosition.x + 10,
                  top: tooltipPosition.y + 10,
                }}
              >
                <p className="font-bold text-navy-900">{tooltipData.stateName}</p>
                {tooltipData.value !== null ? (
                  <p className="text-sm font-semibold text-sky-600">
                    {formatBenefitValue(tooltipData.value, benefitType)}
                  </p>
                ) : (
                  <p className="text-sm text-gray-400">No data available</p>
                )}
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-md bg-gray-200" />
              <span>No data</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded-md bg-sky-100" />
              <div className="w-4 h-4 rounded-md bg-sky-300" />
              <div className="w-4 h-4 rounded-md bg-sky-400" />
              <div className="w-4 h-4 rounded-md bg-sky-500" />
              <div className="w-4 h-4 rounded-md bg-sky-700" />
              <span className="ml-1 font-medium">Low to High</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BenefitsDeepDive;
