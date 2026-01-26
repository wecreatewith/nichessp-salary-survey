'use client';

import { useMemo } from 'react';
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
import { Benefits } from '@/types/salary';
import { getNationalAverageBenefits } from '@/lib/data';

interface BenefitsChartProps {
  benefits: Benefits;
  locationName: string;
}

export function BenefitsChart({ benefits, locationName }: BenefitsChartProps) {
  const { chartData } = useMemo(() => {
    const avgBenefits = getNationalAverageBenefits();

    // Calculate location values (use midpoint for ranges)
    const locationPto = (benefits.ptoDays.min + benefits.ptoDays.max) / 2;
    const locationBonus = benefits.bonusPercent
      ? (benefits.bonusPercent.min + benefits.bonusPercent.max) / 2
      : 0;
    const locationFlex = benefits.flexPercent ?? 0;
    const locationEsop = benefits.esopPercent ?? 0;

    const data = [
      {
        name: 'PTO Days',
        location: locationPto,
        national: avgBenefits.ptoDays,
      },
      {
        name: 'Bonus %',
        location: locationBonus,
        national: avgBenefits.bonusPercent,
      },
      {
        name: 'Flex %',
        location: locationFlex,
        national: avgBenefits.flexPercent,
      },
      {
        name: 'ESOP %',
        location: locationEsop,
        national: avgBenefits.esopPercent,
      },
    ];

    return { chartData: data, nationalAverages: avgBenefits };
  }, [benefits]);

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-navy mb-4">Benefits Comparison</h3>
      <div className="h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="name"
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              labelStyle={{ color: '#1a365d', fontWeight: 600 }}
            />
            <Legend
              wrapperStyle={{ paddingTop: 16 }}
              iconType="circle"
            />
            <Bar
              dataKey="location"
              name={locationName}
              fill="#1a365d"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="national"
              name="National Average"
              fill="#d69e2e"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-gray-500 mt-2 text-center">
        Comparing {locationName} benefits to national averages
      </p>
    </div>
  );
}

export default BenefitsChart;
