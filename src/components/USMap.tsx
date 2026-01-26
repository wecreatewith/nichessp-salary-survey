'use client';

import { memo, useState, useCallback, useMemo } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { RoleKey } from '@/types/salary';
import { getLocationsByState, calculateStateSalaryAverage, getAllStates } from '@/lib/data';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

// State names mapping
const STATE_NAMES: Record<string, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', DC: 'Washington D.C.', FL: 'Florida',
  GA: 'Georgia', HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana',
  IA: 'Iowa', KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine',
  MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi',
  MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire',
  NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota',
  OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island',
  SC: 'South Carolina', SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah',
  VT: 'Vermont', VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin',
  WY: 'Wyoming',
};

interface TooltipData {
  stateName: string;
  stateCode: string;
  cityCount: number;
  avgSalary: number;
  hasData: boolean;
}

interface TooltipPosition {
  x: number;
  y: number;
}

interface USMapProps {
  selectedRole: RoleKey;
  onStateClick?: (stateCode: string) => void;
  selectedState?: string | null;
}

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

function getSalaryColor(salary: number, minSalary: number, maxSalary: number): string {
  if (salary === 0) return '#e2e8f0'; // Gray for no data (slate-200)

  // Normalize salary to 0-1 range
  const normalized = (salary - minSalary) / (maxSalary - minSalary);

  // Vibrant sky blue color scale
  if (normalized < 0.2) return '#e0f2fe'; // sky-100
  if (normalized < 0.4) return '#7dd3fc'; // sky-300
  if (normalized < 0.6) return '#38bdf8'; // sky-400
  if (normalized < 0.8) return '#0ea5e9'; // sky-500
  return '#0369a1'; // sky-700 (darkest for highest salaries)
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

function USMapComponent({ selectedRole, onStateClick, selectedState }: USMapProps) {
  const [tooltipData, setTooltipData] = useState<TooltipData | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>({ x: 0, y: 0 });

  // Get all states with data and calculate salaries
  const statesWithData = getAllStates();

  const { stateSalaries, stateCityCounts, minSalary, maxSalary } = useMemo(() => {
    const salaries: Record<string, number> = {};
    const cityCounts: Record<string, number> = {};
    let min = Infinity;
    let max = 0;

    statesWithData.forEach(stateCode => {
      const avg = calculateStateSalaryAverage(stateCode, selectedRole);
      const locations = getLocationsByState(stateCode);
      salaries[stateCode] = avg;
      cityCounts[stateCode] = locations.length;
      if (avg > 0) {
        if (avg < min) min = avg;
        if (avg > max) max = avg;
      }
    });

    return { stateSalaries: salaries, stateCityCounts: cityCounts, minSalary: min, maxSalary: max };
  }, [statesWithData, selectedRole]);

  const handleMouseEnter = useCallback((stateCode: string, event: React.MouseEvent) => {
    const hasData = statesWithData.includes(stateCode);
    setTooltipData({
      stateName: STATE_NAMES[stateCode] || stateCode,
      stateCode,
      cityCount: stateCityCounts[stateCode] || 0,
      avgSalary: stateSalaries[stateCode] || 0,
      hasData,
    });
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  }, [statesWithData, stateSalaries, stateCityCounts]);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTooltipData(null);
  }, []);

  return (
    <div className="w-full aspect-[4/3] max-w-3xl mx-auto relative">
      <ComposableMap
        projection="geoAlbersUsa"
        projectionConfig={{
          scale: 1000,
        }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const fips = geo.id;
              const stateCode = FIPS_TO_STATE[fips];
              const salary = stateSalaries[stateCode] || 0;
              const hasData = statesWithData.includes(stateCode);
              const isSelected = selectedState === stateCode;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => hasData && onStateClick?.(stateCode)}
                  onMouseEnter={(e) => handleMouseEnter(stateCode, e)}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    default: {
                      fill: isSelected ? '#E59941' : getSalaryColor(salary, minSalary, maxSalary),
                      stroke: isSelected ? '#d08530' : '#fff',
                      strokeWidth: isSelected ? 2.5 : 0.5,
                      outline: 'none',
                      cursor: hasData ? 'pointer' : 'default',
                      transition: 'all 300ms ease-out',
                      filter: isSelected ? 'drop-shadow(0 4px 6px rgba(229, 153, 65, 0.3))' : 'none',
                    },
                    hover: {
                      fill: hasData ? (isSelected ? '#d08530' : '#f2ae59') : getSalaryColor(salary, minSalary, maxSalary),
                      stroke: '#E59941',
                      strokeWidth: 2,
                      outline: 'none',
                      cursor: hasData ? 'pointer' : 'default',
                      transition: 'all 150ms ease-out',
                    },
                    pressed: {
                      fill: '#d08530',
                      stroke: '#ad6a24',
                      strokeWidth: 2.5,
                      outline: 'none',
                      transition: 'all 100ms ease-out',
                    },
                  }}
                  aria-label={`${stateCode}${hasData ? ' - Click to view salary data' : ' - No data available'}`}
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
          {tooltipData.hasData ? (
            <>
              <p className="text-sm text-gray-600">
                {tooltipData.cityCount} {tooltipData.cityCount === 1 ? 'city' : 'cities'} with data
              </p>
              <p className="text-sm font-semibold text-sky-600">
                Avg: {formatCurrency(tooltipData.avgSalary)}
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-400">No data available</p>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-600">
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
          <span className="ml-1 font-medium">Low to High Salary</span>
        </div>
      </div>
    </div>
  );
}

export const USMap = memo(USMapComponent);
export default USMap;
