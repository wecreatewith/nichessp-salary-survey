'use client';

import { useState, useEffect } from 'react';
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
// NationalStats removed per US-054
import { BenefitsSection } from '@/components/BenefitsSection';
import { MobilePanel } from '@/components/MobilePanel';
import { NationalOverview } from '@/components/NationalOverview';
import { ComparisonCTA } from '@/components/ComparisonCTA';
import { Location, RoleKey, ROLE_DISPLAY_NAMES } from '@/types/salary';
import { getStateName, getLocationByCity } from '@/lib/data';

type ViewMode = 'explore' | 'compare';

export default function Home() {
  const [selectedRole, setSelectedRole] = useState<RoleKey | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [comparisonLocations, setComparisonLocations] = useState<Location[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('explore');
  const [searchQuery, setSearchQuery] = useState('');

  // Handle URL parameters for deep-linking (from shared links)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const city = params.get('city');
    const state = params.get('state');

    if (city && state) {
      const location = getLocationByCity(city, state);
      if (location) {
        setSelectedState(state);
        setSelectedLocation(location);
      }
    } else if (state) {
      setSelectedState(state);
    }
  }, []);

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
          {/* Role Selector - Navy Section */}
          <div className="bg-navy-900 rounded-2xl shadow-xl p-6">
            <h2 className="text-white text-sm font-semibold uppercase tracking-wider mb-3">Select Role</h2>
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
        {/* Role Selector - Navy Section */}
        <div className="bg-navy-900 rounded-2xl shadow-xl p-6">
          <h2 className="text-white text-sm font-semibold uppercase tracking-wider mb-3">Select Role</h2>
          <RoleSelector selectedRole={selectedRole} onChange={setSelectedRole} />
        </div>

        {/* Search Input - Navy Section */}
        <div className="bg-navy-900 rounded-2xl shadow-xl p-6">
          <h2 className="text-white text-sm font-semibold uppercase tracking-wider mb-3">Search Locations</h2>
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search cities or states..."
          />
        </div>

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
            {/* US Map - Navy Section */}
            <div className="lg:col-span-2 bg-navy-900 rounded-2xl shadow-xl p-6">
              <h2 className="text-white text-lg font-bold mb-4">
                Salary by State {selectedRole ? `- ${ROLE_DISPLAY_NAMES[selectedRole]}` : '- All Roles'}
              </h2>
              <div className="bg-white rounded-xl p-4">
                <USMap
                  selectedRole={selectedRole}
                  onStateClick={handleStateClick}
                  selectedState={selectedState}
                />
              </div>

              {/* Map Instructions */}
              <div className="mt-6 text-white/80 text-sm space-y-2">
                <p className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-sky-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                  <span><strong>Click any state</strong> to see city-level salary data and trends</span>
                </p>
                <p className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-orange-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                  <span><strong>Darker states</strong> indicate higher average salaries for the selected role</span>
                </p>
                <p className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-sky-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span><strong>Use the role selector</strong> above to filter salaries by position level</span>
                </p>
              </div>
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

          {/* Comparison CTA - After Map */}
          <ComparisonCTA
            selectedRole={selectedRole}
            comparisonLocations={comparisonLocations}
            onAddToComparison={handleAddToComparison}
            onRemoveFromComparison={handleRemoveFromComparison}
            onOpenComparison={handleOpenComparison}
          />

          {/* Benefits Section - Always visible */}
          <BenefitsSection
            selectedState={selectedState}
            selectedLocation={selectedLocation}
            onLocationClick={handleOverviewLocationClick}
          />
        </>
        )}

        {/* Salary Calculator - Full Width */}
        <SalaryCalculator defaultRole={selectedRole} />

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
