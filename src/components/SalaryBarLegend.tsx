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

          {/* Tooltip */}
          <div className="absolute left-0 top-full mt-2 z-50 w-72 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-navy text-sm">Understanding the Salary Bar</h4>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-3 text-sm">
              {/* Blue Bar */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-4 bg-gradient-to-r from-navy-400 to-navy rounded-full mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700">Blue Bar</p>
                  <p className="text-gray-500 text-xs">This location&apos;s salary range (min to max)</p>
                </div>
              </div>

              {/* Gold Line */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 flex justify-center mt-0.5">
                  <div className="w-0.5 h-4 bg-gold" />
                </div>
                <div>
                  <p className="font-medium text-gray-700">Gold Line</p>
                  <p className="text-gray-500 text-xs">National average salary for this role</p>
                </div>
              </div>

              {/* Gray Background */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-4 bg-gray-100 rounded-full mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700">Gray Background</p>
                  <p className="text-gray-500 text-xs">Full national salary range (lowest to highest paying market)</p>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-3 pt-3 border-t border-gray-100">
              The bar shows how this location compares to the national market for each role.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default SalaryBarLegend;
