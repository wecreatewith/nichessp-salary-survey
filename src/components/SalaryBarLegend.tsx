'use client';

import { useState } from 'react';

export function SalaryBarLegend() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      {/* Info Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-navy transition-colors"
        aria-label="Explain salary bar visualization"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>How to read</span>
      </button>

      {/* Legend Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Tooltip - positioned to the right and use fixed positioning for reliability */}
          <div className="fixed inset-0 flex items-start justify-center pt-24 px-4 z-50">
            <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-navy">Understanding the Salary Bar</h4>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4 text-sm">
                {/* Blue Bar */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-5 bg-gradient-to-r from-navy-400 to-navy rounded-full mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">Blue Bar</p>
                    <p className="text-gray-500 text-sm">This location&apos;s salary range (min to max)</p>
                  </div>
                </div>

                {/* Gold Line */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 flex justify-center mt-0.5">
                    <div className="w-1 h-5 bg-gold rounded" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Gold Line</p>
                    <p className="text-gray-500 text-sm">National average salary for this role</p>
                  </div>
                </div>

                {/* Gray Background */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-5 bg-gray-200 rounded-full mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">Gray Background</p>
                    <p className="text-gray-500 text-sm">Full national salary range (lowest to highest)</p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-500 mt-4 pt-4 border-t border-gray-100">
                The bar shows how this location compares to the national market for each role.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default SalaryBarLegend;
