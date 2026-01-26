'use client';

import { RoleKey, ROLE_DISPLAY_NAMES, ROLE_KEYS } from '@/types/salary';

interface RoleSelectorProps {
  selectedRole: RoleKey;
  onChange: (role: RoleKey) => void;
}

export function RoleSelector({ selectedRole, onChange }: RoleSelectorProps) {
  return (
    <div className="w-full">
      <label htmlFor="role-selector" className="sr-only">
        Select Role
      </label>

      {/* Desktop: Segmented button group */}
      <div className="hidden md:flex flex-wrap gap-2" role="radiogroup" aria-label="Select Role">
        {ROLE_KEYS.map((role) => (
          <button
            key={role}
            type="button"
            role="radio"
            aria-checked={selectedRole === role}
            onClick={() => onChange(role)}
            className={`
              px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ease-out
              focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2
              transform hover:scale-[1.02] active:scale-[0.98]
              ${
                selectedRole === role
                  ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-200'
                  : 'bg-white text-navy-700 border-2 border-gray-200 hover:border-sky-300 hover:text-sky-600 hover:shadow-md'
              }
            `}
          >
            {ROLE_DISPLAY_NAMES[role]}
          </button>
        ))}
      </div>

      {/* Mobile: Dropdown */}
      <div className="md:hidden relative">
        <select
          id="role-selector"
          value={selectedRole}
          onChange={(e) => onChange(e.target.value as RoleKey)}
          className="
            w-full px-4 py-3 text-base font-semibold
            bg-white border-2 border-sky-200 rounded-xl
            text-navy-900
            focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400
            appearance-none cursor-pointer
            shadow-sm
          "
          aria-label="Select Role"
        >
          {ROLE_KEYS.map((role) => (
            <option key={role} value={role}>
              {ROLE_DISPLAY_NAMES[role]}
            </option>
          ))}
        </select>
        {/* Custom dropdown arrow */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-sky-500">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 20 20" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7l3 3 3-3" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default RoleSelector;
