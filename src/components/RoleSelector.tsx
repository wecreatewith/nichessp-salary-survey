'use client';

import { RoleKey, ROLE_DISPLAY_NAMES, ROLE_KEYS } from '@/types/salary';

interface RoleSelectorProps {
  selectedRole: RoleKey | null;
  onChange: (role: RoleKey | null) => void;
}

export function RoleSelector({ selectedRole, onChange }: RoleSelectorProps) {
  const handleRoleClick = (role: RoleKey) => {
    // Toggle: clicking selected role deselects it
    if (selectedRole === role) {
      onChange(null);
    } else {
      onChange(role);
    }
  };

  return (
    <div className="w-full">
      <label htmlFor="role-selector" className="sr-only">
        Select Role
      </label>

      {/* Desktop: Segmented button group - clicking selected role deselects it */}
      <div className="hidden md:flex flex-wrap gap-2" role="radiogroup" aria-label="Select Role">
        {ROLE_KEYS.map((role) => (
          <button
            key={role}
            type="button"
            role="radio"
            aria-checked={selectedRole === role}
            onClick={() => handleRoleClick(role)}
            className={`
              px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ease-out
              focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-navy-900
              transform hover:scale-[1.02] active:scale-[0.98]
              ${
                selectedRole === role
                  ? 'bg-white text-navy-900 shadow-lg'
                  : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
              }
            `}
          >
            {ROLE_DISPLAY_NAMES[role]}
          </button>
        ))}
      </div>

      {/* Mobile: Dropdown - empty value returns to all roles view */}
      <div className="md:hidden relative">
        <select
          id="role-selector"
          value={selectedRole ?? ''}
          onChange={(e) => onChange(e.target.value === '' ? null : e.target.value as RoleKey)}
          className="
            w-full px-4 py-3 text-base font-semibold
            bg-white rounded-xl
            text-navy-900
            focus:outline-none focus:ring-2 focus:ring-white/50
            appearance-none cursor-pointer
            shadow-lg
          "
          aria-label="Select Role"
        >
          <option value="">Select a role...</option>
          {ROLE_KEYS.map((role) => (
            <option key={role} value={role}>
              {ROLE_DISPLAY_NAMES[role]}
            </option>
          ))}
        </select>
        {/* Custom dropdown arrow */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-navy-900">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 20 20" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7l3 3 3-3" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default RoleSelector;
