'use client';

import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { RoleSelector } from '@/components/RoleSelector';
import { USMap } from '@/components/USMap';
import { StatePanel } from '@/components/StatePanel';
import { LocationDetail } from '@/components/LocationDetail';
import { ComparisonTray } from '@/components/ComparisonTray';
import { CompareView } from '@/components/CompareView';
import { SalaryCalculator } from '@/components/SalaryCalculator';
import { SearchInput } from '@/components/SearchInput';
import { SearchResults } from '@/components/SearchResults';
import { NationalStats } from '@/components/NationalStats';
import { BenefitsSection } from '@/components/BenefitsSection';
import { MobilePanel } from '@/components/MobilePanel';
import { NationalOverview } from '@/components/NationalOverview';
import { ComparisonCTA } from '@/components/ComparisonCTA';
import { Location, RoleKey, ROLE_DISPLAY_NAMES } from '@/types/salary';
import { calculateAverageSalary, getTopPayingLocations, getStateName, getLocationByCity } from '@/lib/data';

type ViewMode = 'explore' | 'compare';

export default function Home() {
  const [selectedRole, setSelectedRole] = useState<RoleKey>('estimator');
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [comparisonLocations, setComparisonLocations] = useState<Location[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('explore');
  const [searchQuery, setSearchQuery] = useState('');

  const averageSalary = calculateAverageSalary(selectedRole);
  const topLocations = getTopPayingLocations(selectedRole, 3);

  const handleStateClick = (stateCode: string) => {
    setSelectedState(stateCode === selectedState ? null : stateCode);
    setSelectedLocation(null); // Clear location when changing state
  };

  const handleClosePanel = () => {
    setSelectedState(null);
    setSelectedLocation(null);
  };

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
  };

  const handleBackToState = () => {
    setSelectedLocation(null);
  };

  const handleAddToComparison = (location: Location) => {
    if (comparisonLocations.length < 3) {
      const alreadyAdded = comparisonLocations.some(
        (loc) => loc.city === location.city && loc.stateCode === location.stateCode
      );
      if (!alreadyAdded) {
        setComparisonLocations([...comparisonLocations, location]);
      }
    }
  };

  const handleRemoveFromComparison = (location: Location) => {
    setComparisonLocations(
      comparisonLocations.filter(
        (loc) => !(loc.city === location.city && loc.stateCode === location.stateCode)
      )
    );
  };

  const handleClearComparison = () => {
    setComparisonLocations([]);
  };

  const handleOpenComparison = () => {
    setViewMode('compare');
  };

  const handleCloseComparison = () => {
    setViewMode('explore');
  };

  const handleSearchLocationClick = (location: Location) => {
    setSelectedLocation(location);
    setSearchQuery(''); // Clear search after selecting
  };

  const handleSearchStateClick = (stateCode: string) => {
    setSelectedState(stateCode);
  };

  const handleOverviewLocationClick = (city: string, stateCode: string) => {
    const location = getLocationByCity(city, stateCode);
    if (location) {
      setSelectedState(stateCode);
      setSelectedLocation(location);
    }
  };

  // If in compare mode, show comparison view
  if (viewMode === 'compare' && comparisonLocations.length >= 2) {
    return (
      <Layout>
        <div className="space-y-8">
          {/* Role Selector */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <RoleSelector selectedRole={selectedRole} onChange={setSelectedRole} />
          </div>

          {/* Comparison View */}
          <CompareView
            locations={comparisonLocations}
            selectedRole={selectedRole}
            onBack={handleCloseComparison}
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Search and Role Selector */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search cities or states..."
            />
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <RoleSelector selectedRole={selectedRole} onChange={setSelectedRole} />
          </div>
        </div>

        {/* National Stats */}
        <NationalStats selectedRole={selectedRole} />

        {/* Comparison CTA - Front and Center */}
        <ComparisonCTA
          selectedRole={selectedRole}
          comparisonLocations={comparisonLocations}
          onAddToComparison={handleAddToComparison}
          onRemoveFromComparison={handleRemoveFromComparison}
          onOpenComparison={handleOpenComparison}
        />

        {/* Search Results (shown when searching) */}
        {searchQuery && (
          <SearchResults
            query={searchQuery}
            selectedRole={selectedRole}
            onLocationClick={handleSearchLocationClick}
            onStateClick={handleSearchStateClick}
          />
        )}

        {/* Map, Panel, and Benefits (hidden when searching) */}
        {!searchQuery && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* US Map */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-lg p-6">
              <h2 className="text-lg font-bold text-navy-900 mb-4">
                Salary by State - {ROLE_DISPLAY_NAMES[selectedRole]}
              </h2>
              <USMap
                selectedRole={selectedRole}
                onStateClick={handleStateClick}
                selectedState={selectedState}
              />
            </div>

            {/* Side Panel - Desktop only */}
            <div className="hidden lg:block lg:col-span-1">
              <div
                key={selectedLocation ? `loc-${selectedLocation.city}` : selectedState ? `state-${selectedState}` : 'empty'}
                className="animate-fadeIn"
              >
                {selectedLocation ? (
                  <LocationDetail
                    location={selectedLocation}
                    onBack={handleBackToState}
                  />
                ) : selectedState ? (
                  <StatePanel
                    stateCode={selectedState}
                    stateName={getStateName(selectedState)}
                    selectedRole={selectedRole}
                    onClose={handleClosePanel}
                    onLocationSelect={handleLocationSelect}
                    onCompareAdd={handleAddToComparison}
                    comparisonLocations={comparisonLocations}
                  />
                ) : (
                  <NationalOverview
                    selectedRole={selectedRole}
                    onLocationClick={handleOverviewLocationClick}
                  />
                )}
              </div>
            </div>

            {/* Mobile Panel - Slides up from bottom */}
            <MobilePanel
              isOpen={!!(selectedState || selectedLocation)}
              onClose={handleClosePanel}
            >
              {selectedLocation ? (
                <LocationDetail
                  location={selectedLocation}
                  onBack={handleBackToState}
                />
              ) : selectedState ? (
                <StatePanel
                  stateCode={selectedState}
                  stateName={getStateName(selectedState)}
                  selectedRole={selectedRole}
                  onClose={handleClosePanel}
                  onLocationSelect={handleLocationSelect}
                  onCompareAdd={handleAddToComparison}
                  comparisonLocations={comparisonLocations}
                />
              ) : null}
            </MobilePanel>
          </div>

          {/* Benefits Section - Always visible */}
          <BenefitsSection
            selectedState={selectedState}
            selectedLocation={selectedLocation}
            onLocationClick={handleOverviewLocationClick}
          />
        </>
        )}

        {/* Stats and Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Stats Preview */}
          <div className="bg-gradient-to-br from-sky-50 to-sky-100 rounded-xl p-6 border border-sky-200 shadow-sm">
            <h2 className="text-xl font-bold text-navy-900 mb-4">
              {ROLE_DISPLAY_NAMES[selectedRole]}
            </h2>
            <p className="text-gray-700 mb-4">
              National average salary:{' '}
              <span className="font-bold text-sky-600">
                ${averageSalary.toLocaleString()}
              </span>
            </p>
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-navy-700 mb-2">Top 3 Paying Locations:</h3>
              <ul className="space-y-2">
                {topLocations.map((loc, index) => (
                  <li key={`${loc.city}-${loc.stateCode}`} className="flex items-center gap-2">
                    <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                      index === 0 ? 'bg-orange-500 text-white' :
                      index === 1 ? 'bg-orange-400 text-white' :
                      'bg-orange-300 text-white'
                    }`}>
                      {index + 1}
                    </span>
                    <span className="text-navy-800 font-medium">
                      {loc.city}, {loc.stateCode} - <span className="text-sky-600 font-bold">${loc.roles[selectedRole].max.toLocaleString()}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Salary Calculator */}
          <SalaryCalculator defaultRole={selectedRole} />
        </div>

        {/* Add padding at bottom when comparison tray is visible */}
        {comparisonLocations.length > 0 && <div className="h-24" />}
      </div>

      {/* Comparison Tray */}
      <ComparisonTray
        locations={comparisonLocations}
        onRemove={handleRemoveFromComparison}
        onCompare={handleOpenComparison}
        onClear={handleClearComparison}
      />
    </Layout>
  );
}
