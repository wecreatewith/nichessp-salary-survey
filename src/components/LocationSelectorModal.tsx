'use client';

import { useState, useEffect, useRef } from 'react';
import { Location, RoleKey, ROLE_DISPLAY_NAMES } from '@/types/salary';
import { getAllStates, getLocationsByState, getStateName } from '@/lib/data';

interface LocationSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRole: RoleKey;
  comparisonLocations: Location[];
  onAddToComparison: (location: Location) => void;
  onRemoveFromComparison: (location: Location) => void;
  onOpenComparison: () => void;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function LocationSelectorModal({
  isOpen,
  onClose,
  selectedRole,
  comparisonLocations,
  onAddToComparison,
  onRemoveFromComparison,
  onOpenComparison,
}: LocationSelectorModalProps) {
  const [selectedState, setSelectedState] = useState<string>('');
  const [stateSearch, setStateSearch] = useState('');
  const [citySearch, setCitySearch] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  // Get states that have data
  const statesWithData = getAllStates();

  // Filter states based on search
  const filteredStates = statesWithData.filter((stateCode) => {
    const stateName = getStateName(stateCode);
    return (
      stateName.toLowerCase().includes(stateSearch.toLowerCase()) ||
      stateCode.toLowerCase().includes(stateSearch.toLowerCase())
    );
  });

  // Get cities in selected state
  const citiesInState = selectedState ? getLocationsByState(selectedState) : [];

  // Filter cities based on search
  const filteredCities = citiesInState.filter((loc) =>
    loc.city.toLowerCase().includes(citySearch.toLowerCase())
  );

  const isInComparison = (location: Location) => {
    return comparisonLocations.some(
      (loc) => loc.city === location.city && loc.stateCode === location.stateCode
    );
  };

  const canAddMore = comparisonLocations.length < 3;
  const canCompare = comparisonLocations.length >= 2;

  // Reset city search when state changes
  useEffect(() => {
    setCitySearch('');
  }, [selectedState]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleAddCity = (city: Location) => {
    if (!isInComparison(city) && canAddMore) {
      onAddToComparison(city);
    }
  };

  const handleCompare = () => {
    onClose();
    onOpenComparison();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-slideInUp"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-sky-900 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Select Locations to Compare</h2>
            <p className="text-sky-200 text-sm">
              Compare {ROLE_DISPLAY_NAMES[selectedRole]} salaries across up to 3 locations
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Selected locations bar */}
        {comparisonLocations.length > 0 && (
          <div className="px-6 py-3 bg-sky-50 border-b border-sky-100 flex items-center gap-3 flex-wrap">
            <span className="text-sm font-medium text-sky-700">Selected:</span>
            {comparisonLocations.map((loc) => (
              <div
                key={`selected-${loc.city}-${loc.stateCode}`}
                className="inline-flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-sky-200 text-sm"
              >
                <span className="font-medium text-navy-900">{loc.city}, {loc.stateCode}</span>
                <button
                  onClick={() => onRemoveFromComparison(loc)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  aria-label={`Remove ${loc.city}`}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            {Array.from({ length: 3 - comparisonLocations.length }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="inline-flex items-center px-3 py-1 rounded-full border-2 border-dashed border-gray-300 text-sm text-gray-400"
              >
                Empty slot
              </div>
            ))}
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* State selector */}
            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-2">
                1. Select State
              </label>
              <input
                type="text"
                placeholder="Search states..."
                value={stateSearch}
                onChange={(e) => setStateSearch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
              />
              <div className="h-48 overflow-y-auto border border-gray-200 rounded-lg">
                {filteredStates.map((stateCode) => (
                  <button
                    key={stateCode}
                    onClick={() => setSelectedState(stateCode)}
                    className={`
                      w-full px-4 py-2 text-left transition-colors flex items-center justify-between
                      ${selectedState === stateCode
                        ? 'bg-sky-100 text-sky-800 font-semibold'
                        : 'hover:bg-gray-50'}
                    `}
                  >
                    <span>{getStateName(stateCode)}</span>
                    <span className="text-xs text-gray-500">
                      {getLocationsByState(stateCode).length} cities
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* City selector */}
            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-2">
                2. Select City
              </label>
              {selectedState ? (
                <>
                  <input
                    type="text"
                    placeholder={`Search cities in ${getStateName(selectedState)}...`}
                    value={citySearch}
                    onChange={(e) => setCitySearch(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                  />
                  <div className="h-48 overflow-y-auto border border-gray-200 rounded-lg">
                    {filteredCities.map((city) => {
                      const alreadyAdded = isInComparison(city);
                      const disabled = alreadyAdded || !canAddMore;
                      return (
                        <button
                          key={`${city.city}-${city.stateCode}`}
                          onClick={() => handleAddCity(city)}
                          disabled={disabled}
                          className={`
                            w-full px-4 py-2 text-left transition-colors flex items-center justify-between
                            ${alreadyAdded
                              ? 'bg-orange-50 text-orange-700'
                              : disabled
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'hover:bg-gray-50'}
                          `}
                        >
                          <div>
                            <span className="font-medium">{city.city}</span>
                            <span className="block text-xs text-gray-500">
                              {formatCurrency(city.roles[selectedRole].min)} - {formatCurrency(city.roles[selectedRole].max)}
                            </span>
                          </div>
                          {alreadyAdded ? (
                            <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
                              Added
                            </span>
                          ) : !canAddMore ? (
                            <span className="text-xs text-gray-400">Max reached</span>
                          ) : (
                            <svg className="h-5 w-5 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="h-[calc(48px+0.5rem+12rem)] border border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <svg className="h-8 w-8 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    <p className="text-sm">Select a state first</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          {!canAddMore && (
            <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg text-orange-700 text-sm">
              <strong>Maximum 3 locations selected.</strong> Remove a location to add a different one.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {comparisonLocations.length === 0
              ? 'Select at least 2 locations to compare'
              : comparisonLocations.length === 1
                ? 'Select 1 more location to compare'
                : `${comparisonLocations.length} locations selected`}
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors"
            >
              Done
            </button>
            <button
              onClick={handleCompare}
              disabled={!canCompare}
              className={`
                px-6 py-2 rounded-lg font-bold transition-all duration-200
                ${canCompare
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'}
              `}
            >
              Compare Now →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LocationSelectorModal;
