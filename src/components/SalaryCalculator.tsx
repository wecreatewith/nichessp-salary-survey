'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { RoleKey, ROLE_DISPLAY_NAMES, ROLE_KEYS } from '@/types/salary';
import {
  getAllStates,
  getLocationsByState,
  getSalaryPercentile,
  getStateSalaryPercentile,
  calculateAverageSalary,
  calculateStateSalaryAverage,
  getTopPayingLocations,
  getStateSalaryRange,
  STATE_NAMES,
} from '@/lib/data';

interface SalaryCalculatorProps {
  defaultRole?: RoleKey;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

interface SearchableSelectProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  disabled?: boolean;
  emptyMessage?: string;
}

function SearchableSelect({
  id,
  label,
  placeholder,
  value,
  options,
  onChange,
  disabled = false,
  emptyMessage = 'No options available',
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = useMemo(() => {
    if (!searchQuery) return options;
    const query = searchQuery.toLowerCase();
    return options.filter((opt) => opt.label.toLowerCase().includes(query));
  }, [options, searchQuery]);

  const selectedLabel = options.find((opt) => opt.value === value)?.label || '';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div ref={containerRef} className="relative">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div
        className={`
          w-full px-3 py-2 border rounded-lg cursor-pointer flex items-center justify-between
          ${disabled ? 'bg-gray-100 border-gray-200 cursor-not-allowed' : 'border-gray-300 hover:border-navy'}
          ${isOpen ? 'ring-2 ring-navy border-navy' : ''}
        `}
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
            if (!isOpen) {
              setTimeout(() => inputRef.current?.focus(), 0);
            }
          }
        }}
      >
        <span className={value ? 'text-gray-900' : 'text-gray-500'}>
          {value ? selectedLabel : placeholder}
        </span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-hidden">
          {/* Search input */}
          <div className="p-2 border-b border-gray-100">
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type to search..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-navy focus:border-navy"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Options list */}
          <ul className="max-h-44 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option.value}
                  className={`
                    px-4 py-2 cursor-pointer text-sm
                    ${option.value === value ? 'bg-navy text-white' : 'hover:bg-gray-50'}
                  `}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(option.value);
                  }}
                >
                  {option.label}
                </li>
              ))
            ) : (
              <li className="px-4 py-3 text-sm text-gray-500 text-center">{emptyMessage}</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export function SalaryCalculator({ defaultRole = 'estimator' }: SalaryCalculatorProps) {
  const [selectedRole, setSelectedRole] = useState<RoleKey>(defaultRole);
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [currentSalary, setCurrentSalary] = useState<string>('');
  const [showResults, setShowResults] = useState(false);

  // Get all states that have data
  const stateOptions = useMemo(() => {
    const states = getAllStates();
    return states
      .map((stateCode) => ({
        value: stateCode,
        label: `${STATE_NAMES[stateCode] || stateCode} (${stateCode})`,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, []);

  // Get cities for selected state
  const cityOptions = useMemo(() => {
    if (!selectedState) return [];
    const cities = getLocationsByState(selectedState);
    return cities
      .map((loc) => ({
        value: loc.city,
        label: loc.city,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [selectedState]);

  // Reset city when state changes
  useEffect(() => {
    setSelectedCity('');
  }, [selectedState]);

  const hasCitiesForState = cityOptions.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole && selectedState && currentSalary) {
      setShowResults(true);
    }
  };

  const handleReset = () => {
    setShowResults(false);
  };

  const results = useMemo(() => {
    if (!showResults || !currentSalary || !selectedState) return null;

    const salary = parseInt(currentSalary.replace(/[^0-9]/g, ''), 10);
    if (isNaN(salary)) return null;

    const percentile = getSalaryPercentile(salary, selectedRole);
    const statePercentile = getStateSalaryPercentile(salary, selectedRole, selectedState);
    const nationalAverage = calculateAverageSalary(selectedRole);
    const stateAverage = calculateStateSalaryAverage(selectedState, selectedRole);
    const topLocation = getTopPayingLocations(selectedRole, 1)[0];
    const nationalDifference = salary - nationalAverage;
    const stateDifference = salary - stateAverage;
    const stateLocationsCount = getLocationsByState(selectedState).length;

    // If city selected, use city data; otherwise use state average
    let localMax = 0;
    let isStateAverage = false;

    if (selectedCity && hasCitiesForState) {
      const cities = getLocationsByState(selectedState);
      const cityData = cities.find((loc) => loc.city === selectedCity);
      if (cityData) {
        localMax = cityData.roles[selectedRole].max;
      }
    } else {
      // Use state average
      const stateRange = getStateSalaryRange(selectedState, selectedRole);
      if (stateRange) {
        localMax = stateRange.max;
        isStateAverage = true;
      }
    }

    return {
      percentile,
      statePercentile,
      nationalAverage,
      stateAverage,
      nationalDifference,
      stateDifference,
      topLocation,
      localMax,
      salary,
      isStateAverage,
      stateLocationsCount,
      stateName: STATE_NAMES[selectedState] || selectedState,
    };
  }, [showResults, currentSalary, selectedRole, selectedState, selectedCity, hasCitiesForState]);

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden">
      <div className="bg-navy px-6 py-4">
        <h2 className="text-xl font-semibold text-white">How Do I Stack Up?</h2>
        <p className="text-sm text-navy-200">
          Compare your salary to the market
        </p>
      </div>

      {!showResults ? (
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Role Selector */}
          <div>
            <label htmlFor="calc-role" className="block text-sm font-medium text-gray-700 mb-1">
              Your Role
            </label>
            <select
              id="calc-role"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as RoleKey)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-navy"
            >
              {ROLE_KEYS.map((key) => (
                <option key={key} value={key}>
                  {ROLE_DISPLAY_NAMES[key]}
                </option>
              ))}
            </select>
          </div>

          {/* State Selector */}
          <SearchableSelect
            id="calc-state"
            label="Your State"
            placeholder="Select a state..."
            value={selectedState}
            options={stateOptions}
            onChange={setSelectedState}
            emptyMessage="No states found"
          />

          {/* City Selector - only show if state is selected */}
          {selectedState && (
            <div>
              {hasCitiesForState ? (
                <SearchableSelect
                  id="calc-city"
                  label="Your City (optional)"
                  placeholder="Select a city or use state average..."
                  value={selectedCity}
                  options={cityOptions}
                  onChange={setSelectedCity}
                  emptyMessage="No cities found"
                />
              ) : (
                <div className="bg-navy-50 border border-navy-100 rounded-lg p-3">
                  <p className="text-sm text-navy-700">
                    <span className="font-medium">No city data available</span> - we&apos;ll use the state average for {STATE_NAMES[selectedState] || selectedState}.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Current Salary Input */}
          <div>
            <label htmlFor="calc-salary" className="block text-sm font-medium text-gray-700 mb-1">
              Current Annual Salary
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="text"
                id="calc-salary"
                value={currentSalary}
                onChange={(e) => {
                  // Format as currency
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  if (value) {
                    setCurrentSalary(parseInt(value, 10).toLocaleString());
                  } else {
                    setCurrentSalary('');
                  }
                }}
                placeholder="e.g., 150,000"
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-navy"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!selectedRole || !selectedState || !currentSalary}
            className={`
              w-full py-3 rounded-lg font-medium transition-colors
              ${selectedRole && selectedState && currentSalary
                ? 'bg-gold text-navy hover:bg-gold-600'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
            `}
          >
            Calculate My Position
          </button>
        </form>
      ) : results && (
        <div className="p-6 space-y-6">
          {/* Dual Percentile Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* National Percentile */}
            <div className="bg-gray-50 rounded-lg p-4 text-center border-2 border-gray-200">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Nationwide
              </div>
              {results.percentile >= 50 ? (
                <>
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    Top {100 - results.percentile}%
                  </div>
                  <p className="text-sm text-gray-600">
                    of all {ROLE_DISPLAY_NAMES[selectedRole]} professionals
                  </p>
                </>
              ) : results.percentile === 50 ? (
                <>
                  <div className="text-3xl font-bold text-navy mb-1">
                    Median
                  </div>
                  <p className="text-sm text-gray-600">
                    exactly average nationwide
                  </p>
                </>
              ) : (
                <>
                  <div className="text-3xl font-bold text-amber-600 mb-1">
                    Bottom {results.percentile}%
                  </div>
                  <p className="text-sm text-gray-600">
                    of all {ROLE_DISPLAY_NAMES[selectedRole]} professionals
                  </p>
                </>
              )}
            </div>

            {/* State Percentile */}
            <div className="bg-sky-50 rounded-lg p-4 text-center border-2 border-sky-200">
              <div className="text-xs font-semibold text-sky-600 uppercase tracking-wide mb-2">
                In {results.stateName}
              </div>
              {results.statePercentile !== null ? (
                results.statePercentile >= 50 ? (
                  <>
                    <div className="text-3xl font-bold text-green-600 mb-1">
                      Top {100 - results.statePercentile}%
                    </div>
                    <p className="text-sm text-gray-600">
                      of {results.stateLocationsCount} {results.stateName} locations
                    </p>
                  </>
                ) : results.statePercentile === 50 ? (
                  <>
                    <div className="text-3xl font-bold text-navy mb-1">
                      Median
                    </div>
                    <p className="text-sm text-gray-600">
                      average for {results.stateName}
                    </p>
                  </>
                ) : (
                  <>
                    <div className="text-3xl font-bold text-amber-600 mb-1">
                      Bottom {results.statePercentile}%
                    </div>
                    <p className="text-sm text-gray-600">
                      of {results.stateLocationsCount} {results.stateName} locations
                    </p>
                  </>
                )
              ) : (
                <p className="text-sm text-gray-600">
                  Not enough state data
                </p>
              )}
            </div>
          </div>

          {/* Contextual explanation */}
          {results.statePercentile !== null && Math.abs(results.percentile - results.statePercentile) >= 15 && (
            <div className="bg-navy-50 border border-navy-100 rounded-lg p-3 text-sm text-navy-700">
              {results.statePercentile > results.percentile ? (
                <>
                  <strong>Why the difference?</strong> You rank higher in {results.stateName} because salaries there
                  tend to be {results.stateAverage < results.nationalAverage ? 'lower' : 'higher'} than the national average
                  ({formatCurrency(results.stateAverage)} vs {formatCurrency(results.nationalAverage)}).
                </>
              ) : (
                <>
                  <strong>Why the difference?</strong> You rank lower in {results.stateName} because salaries there
                  tend to be {results.stateAverage > results.nationalAverage ? 'higher' : 'lower'} than the national average
                  ({formatCurrency(results.stateAverage)} vs {formatCurrency(results.nationalAverage)}).
                </>
              )}
            </div>
          )}

          {/* Low percentile encouragement */}
          {results.percentile < 25 && (
            <div className="text-center text-sm text-navy font-medium">
              There may be significant opportunities to increase your compensation.
            </div>
          )}

          {/* Comparison Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-500 mb-1">National Average</div>
              <div className="text-lg font-semibold text-navy">
                {formatCurrency(results.nationalAverage)}
              </div>
              <div className={`text-sm ${results.nationalDifference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {results.nationalDifference >= 0 ? '+' : ''}{formatCurrency(results.nationalDifference)}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-500 mb-1">{results.stateName} Average</div>
              <div className="text-lg font-semibold text-navy">
                {formatCurrency(results.stateAverage)}
              </div>
              <div className={`text-sm ${results.stateDifference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {results.stateDifference >= 0 ? '+' : ''}{formatCurrency(results.stateDifference)}
              </div>
            </div>
          </div>

          {/* Top market info */}
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-sm text-gray-500 mb-1">Highest Paying Market</div>
            <div className="text-lg font-semibold text-navy">
              {formatCurrency(results.topLocation.roles[selectedRole].max)}
            </div>
            <div className="text-sm text-gray-600">
              {results.topLocation.city}, {results.topLocation.stateCode}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-navy-50 rounded-lg p-4 border border-navy-100">
            <h3 className="font-semibold text-navy mb-2">
              Ready for Your Next Opportunity?
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Our consultants specialize in connecting preconstruction professionals
              with the best opportunities in the industry.
            </p>
            <a
              href="https://nichessp.com/about"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gold text-navy px-6 py-2 rounded-lg font-medium hover:bg-gold-600 transition-colors"
            >
              Talk to Our Consultants
            </a>
          </div>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="w-full py-2 text-navy hover:text-gold transition-colors text-sm"
          >
            Calculate Again
          </button>
        </div>
      )}
    </div>
  );
}

export default SalaryCalculator;
