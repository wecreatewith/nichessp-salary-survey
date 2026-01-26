export type Trend = 'up' | 'down' | 'stable';

export type RoleKey =
  | 'director'
  | 'seniorManager'
  | 'manager'
  | 'seniorEstimator'
  | 'estimator'
  | 'junior';

export interface SalaryRange {
  min: number;
  max: number;
  trend: Trend;
}

export interface RangeValue {
  min: number;
  max: number;
}

export interface Benefits {
  ptoDays: RangeValue;
  bonusPercent: RangeValue | null;
  flexPercent: number | null;
  esopPercent: number | null;
  autoAllowance: number | null;
}

export interface Roles {
  director: SalaryRange;
  seniorManager: SalaryRange;
  manager: SalaryRange;
  seniorEstimator: SalaryRange;
  estimator: SalaryRange;
  junior: SalaryRange;
}

export interface Location {
  city: string;
  state: string;
  stateCode: string;
  roles: Roles;
  benefits: Benefits;
}

// Friendly display names for roles
export const ROLE_DISPLAY_NAMES: Record<RoleKey, string> = {
  director: 'Director of Preconstruction',
  seniorManager: 'Senior Preconstruction Manager',
  manager: 'Preconstruction Manager',
  seniorEstimator: 'Senior Estimator',
  estimator: 'Estimator',
  junior: 'Junior Estimator',
};

// Array of role keys in seniority order
export const ROLE_KEYS: RoleKey[] = [
  'director',
  'seniorManager',
  'manager',
  'seniorEstimator',
  'estimator',
  'junior',
];
