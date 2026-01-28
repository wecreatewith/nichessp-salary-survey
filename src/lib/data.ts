import type { Location, RoleKey, Trend } from '@/types/salary';
import { locations } from './salaries';

/**
 * Get all unique state codes from the data
 */
export function getAllStates(): string[] {
  const states = new Set(locations.map((loc) => loc.stateCode));
  return Array.from(states).sort();
}

/**
 * Get all locations in a specific state
 */
export function getLocationsByState(stateCode: string): Location[] {
  return locations.filter((loc) => loc.stateCode === stateCode);
}

/**
 * Get a specific location by city name and state code
 */
export function getLocationByCity(city: string, stateCode: string): Location | undefined {
  return locations.find(
    (loc) => loc.city.toLowerCase() === city.toLowerCase() && loc.stateCode === stateCode
  );
}

/**
 * Calculate the average salary (midpoint of min-max) for a role across all locations
 */
export function calculateAverageSalary(role: RoleKey): number {
  const total = locations.reduce((sum, loc) => {
    const roleData = loc.roles[role];
    return sum + (roleData.min + roleData.max) / 2;
  }, 0);
  return Math.round(total / locations.length);
}

/**
 * Calculate the average salary for a role in a specific state
 */
export function calculateStateSalaryAverage(stateCode: string, role: RoleKey): number {
  const stateLocations = getLocationsByState(stateCode);
  if (stateLocations.length === 0) return 0;

  const total = stateLocations.reduce((sum, loc) => {
    const roleData = loc.roles[role];
    return sum + (roleData.min + roleData.max) / 2;
  }, 0);
  return Math.round(total / stateLocations.length);
}

/**
 * Calculate the average salary across ALL roles for a state (used for "All Roles" view)
 */
export function calculateStateSalaryAverageAllRoles(stateCode: string): number {
  const stateLocations = getLocationsByState(stateCode);
  if (stateLocations.length === 0) return 0;

  const roleKeys: RoleKey[] = ['director', 'seniorManager', 'manager', 'seniorEstimator', 'estimator', 'junior'];
  let total = 0;
  let count = 0;

  stateLocations.forEach(loc => {
    roleKeys.forEach(role => {
      const roleData = loc.roles[role];
      total += (roleData.min + roleData.max) / 2;
      count++;
    });
  });

  return count > 0 ? Math.round(total / count) : 0;
}

/**
 * Get the average salary range for a role in a specific state
 */
export function getStateSalaryRange(stateCode: string, role: RoleKey): { min: number; max: number } | null {
  const stateLocations = getLocationsByState(stateCode);
  if (stateLocations.length === 0) return null;

  const totalMin = stateLocations.reduce((sum, loc) => sum + loc.roles[role].min, 0);
  const totalMax = stateLocations.reduce((sum, loc) => sum + loc.roles[role].max, 0);

  return {
    min: Math.round(totalMin / stateLocations.length),
    max: Math.round(totalMax / stateLocations.length),
  };
}

/**
 * Get percentile rank for a salary in a specific role
 * Returns a number between 0 and 100
 *
 * Uses interpolation to provide accurate percentiles - never returns 0% or 100%.
 * Matches the methodology of getStateSalaryPercentile for consistency.
 */
export function getSalaryPercentile(salary: number, role: RoleKey): number {
  // Get all midpoint salaries for this role, sorted
  const midpoints = locations.map((loc) => {
    const roleData = loc.roles[role];
    return (roleData.min + roleData.max) / 2;
  }).sort((a, b) => a - b);

  const n = midpoints.length;
  const minSalary = midpoints[0];
  const maxSalary = midpoints[n - 1];

  // Handle edge cases: salary at or beyond boundaries
  if (salary <= minSalary) {
    // Even at the minimum, you're not at 0% - use 1/(n+1) * 100 as minimum percentile
    return Math.round((1 / (n + 1)) * 100);
  }

  if (salary >= maxSalary) {
    // At or above the max, use n/(n+1) * 100 as the maximum percentile
    return Math.round((n / (n + 1)) * 100);
  }

  // For salaries in between, use the midrank method
  // Count how many salaries are strictly below the given salary
  let belowCount = 0;
  for (const mid of midpoints) {
    if (mid < salary) {
      belowCount++;
    } else {
      break;
    }
  }

  // Count how many salaries are exactly equal
  const equalCount = midpoints.filter(mid => mid === salary).length;

  // Use (belowCount + 0.5 * equalCount) / n for better percentile estimation (midrank method)
  const effectiveRank = belowCount + (equalCount * 0.5);

  return Math.round((effectiveRank / n) * 100);
}

/**
 * Get percentile rank for a salary within a specific state
 * Returns a number between 0 and 100, or null if state has no data
 *
 * Uses interpolation to provide more accurate percentiles, especially
 * when there are few data points in a state.
 */
export function getStateSalaryPercentile(salary: number, role: RoleKey, stateCode: string): number | null {
  const stateLocations = getLocationsByState(stateCode);
  if (stateLocations.length === 0) return null;

  // Get all midpoint salaries for this role in the state, sorted
  const midpoints = stateLocations.map((loc) => {
    const roleData = loc.roles[role];
    return (roleData.min + roleData.max) / 2;
  }).sort((a, b) => a - b);

  const minSalary = midpoints[0];
  const maxSalary = midpoints[midpoints.length - 1];

  // Handle edge cases: salary at or beyond boundaries
  if (salary <= minSalary) {
    // Even at the minimum, you're not at 0% - you're at the lowest observed
    // Use 1/(n+1) * 100 as the minimum percentile (statistical convention)
    return Math.round((1 / (midpoints.length + 1)) * 100);
  }

  if (salary >= maxSalary) {
    // At or above the max, use n/(n+1) * 100 as the maximum percentile
    return Math.round((midpoints.length / (midpoints.length + 1)) * 100);
  }

  // For salaries in between, use linear interpolation
  // Find where this salary falls in the sorted list
  let belowCount = 0;
  for (const mid of midpoints) {
    if (mid < salary) {
      belowCount++;
    } else {
      break;
    }
  }

  // If exactly equal to a midpoint, count it as being at that rank
  const equalCount = midpoints.filter(mid => mid === salary).length;

  // Use (belowCount + 0.5 * equalCount) / n for better percentile estimation
  // This is the midrank method
  const effectiveRank = belowCount + (equalCount * 0.5);

  return Math.round((effectiveRank / midpoints.length) * 100);
}

/**
 * Get actual rank of a salary within a state (1st, 2nd, 3rd, etc.)
 * Returns { rank: number, total: number, isAboveAverage: boolean } or null if state has no data
 *
 * Useful for small sample sizes where percentile is confusing.
 * Rank 1 = highest salary, Rank N = lowest salary
 */
export function getStateSalaryRank(salary: number, role: RoleKey, stateCode: string): { rank: number; total: number; isAboveAverage: boolean } | null {
  const stateLocations = getLocationsByState(stateCode);
  if (stateLocations.length === 0) return null;

  // Get all midpoint salaries for this role in the state, sorted high to low
  const midpoints = stateLocations.map((loc) => {
    const roleData = loc.roles[role];
    return (roleData.min + roleData.max) / 2;
  }).sort((a, b) => b - a); // High to low

  const total = midpoints.length;
  const average = midpoints.reduce((sum, m) => sum + m, 0) / total;
  const isAboveAverage = salary >= average;

  // Find where this salary would rank (1 = highest)
  let rank = 1;
  for (const mid of midpoints) {
    if (salary >= mid) {
      break;
    }
    rank++;
  }

  // If salary is lower than all, rank equals total + 1 (below all)
  // Cap at total for display purposes
  if (rank > total) rank = total;

  return { rank, total, isAboveAverage };
}

/**
 * Get top N highest paying locations for a role
 */
export function getTopPayingLocations(role: RoleKey, limit: number = 10): Location[] {
  return [...locations]
    .sort((a, b) => {
      const midA = (a.roles[role].min + a.roles[role].max) / 2;
      const midB = (b.roles[role].min + b.roles[role].max) / 2;
      return midB - midA;
    })
    .slice(0, limit);
}

/**
 * Get bottom N lowest paying locations for a role
 */
export function getLowestPayingLocations(role: RoleKey, limit: number = 10): Location[] {
  return [...locations]
    .sort((a, b) => {
      const midA = (a.roles[role].min + a.roles[role].max) / 2;
      const midB = (b.roles[role].min + b.roles[role].max) / 2;
      return midA - midB;
    })
    .slice(0, limit);
}

/**
 * Get the national min and max salary for a role
 */
export function getNationalSalaryRange(role: RoleKey): { min: number; max: number } {
  let nationalMin = Infinity;
  let nationalMax = 0;

  for (const loc of locations) {
    const roleData = loc.roles[role];
    if (roleData.min < nationalMin) nationalMin = roleData.min;
    if (roleData.max > nationalMax) nationalMax = roleData.max;
  }

  return { min: nationalMin, max: nationalMax };
}

/**
 * Get the most common trend for a role across all locations
 */
export function getMostCommonTrend(role: RoleKey): Trend {
  const counts: Record<Trend, number> = { up: 0, down: 0, stable: 0 };

  for (const loc of locations) {
    counts[loc.roles[role].trend]++;
  }

  if (counts.up >= counts.down && counts.up >= counts.stable) return 'up';
  if (counts.down >= counts.up && counts.down >= counts.stable) return 'down';
  return 'stable';
}

/**
 * Get trend distribution counts for a role
 */
export function getTrendDistribution(role: RoleKey): { up: number; down: number; stable: number } {
  const counts = { up: 0, down: 0, stable: 0 };

  for (const loc of locations) {
    counts[loc.roles[role].trend]++;
  }

  return counts;
}

/**
 * Search locations by city or state name
 */
export function searchLocations(query: string): Location[] {
  const q = query.toLowerCase().trim();
  if (!q) return locations;

  return locations.filter(
    (loc) => {
      // Get the full state name for this location
      const fullStateName = STATE_NAMES[loc.stateCode] || '';
      return (
        loc.city.toLowerCase().includes(q) ||
        loc.state.toLowerCase().includes(q) ||
        loc.stateCode.toLowerCase().includes(q) ||
        fullStateName.toLowerCase().includes(q)
      );
    }
  );
}

/**
 * Get all locations
 */
export function getAllLocations(): Location[] {
  return locations;
}

/**
 * Get count of locations by state
 */
export function getLocationCountByState(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const loc of locations) {
    counts[loc.stateCode] = (counts[loc.stateCode] || 0) + 1;
  }
  return counts;
}

/**
 * State code to full name mapping
 */
export const STATE_NAMES: Record<string, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', DC: 'Washington D.C.', FL: 'Florida',
  GA: 'Georgia', HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana',
  IA: 'Iowa', KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine',
  MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi',
  MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire',
  NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota',
  OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island',
  SC: 'South Carolina', SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah',
  VT: 'Vermont', VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin',
  WY: 'Wyoming',
};

/**
 * Get state name from state code
 */
export function getStateName(stateCode: string): string {
  return STATE_NAMES[stateCode] || stateCode;
}

/**
 * Calculate state average benefits
 */
export function getStateAverageBenefits(stateCode: string): {
  ptoDays: number;
  bonusPercent: number;
  flexPercent: number;
  esopPercent: number;
  autoAllowance: number;
} | null {
  const stateLocations = getLocationsByState(stateCode);
  if (stateLocations.length === 0) return null;

  let ptoTotal = 0;
  let bonusTotal = 0;
  let bonusCount = 0;
  let flexTotal = 0;
  let flexCount = 0;
  let esopTotal = 0;
  let esopCount = 0;
  let autoTotal = 0;
  let autoCount = 0;

  for (const loc of stateLocations) {
    const ptoAvg = (loc.benefits.ptoDays.min + loc.benefits.ptoDays.max) / 2;
    ptoTotal += ptoAvg;

    if (loc.benefits.bonusPercent) {
      const bonusAvg = (loc.benefits.bonusPercent.min + loc.benefits.bonusPercent.max) / 2;
      bonusTotal += bonusAvg;
      bonusCount++;
    }

    if (loc.benefits.flexPercent !== null) {
      flexTotal += loc.benefits.flexPercent;
      flexCount++;
    }

    if (loc.benefits.esopPercent !== null) {
      esopTotal += loc.benefits.esopPercent;
      esopCount++;
    }

    if (loc.benefits.autoAllowance !== null) {
      autoTotal += loc.benefits.autoAllowance;
      autoCount++;
    }
  }

  return {
    ptoDays: Math.round(ptoTotal / stateLocations.length),
    bonusPercent: bonusCount > 0 ? Math.round(bonusTotal / bonusCount) : 0,
    flexPercent: flexCount > 0 ? Math.round(flexTotal / flexCount) : 0,
    esopPercent: esopCount > 0 ? Math.round(esopTotal / esopCount) : 0,
    autoAllowance: autoCount > 0 ? Math.round(autoTotal / autoCount) : 0,
  };
}

/**
 * Calculate national average benefits
 */
export function getNationalAverageBenefits(): {
  ptoDays: number;
  bonusPercent: number;
  flexPercent: number;
  esopPercent: number;
  autoAllowance: number;
} {
  let ptoTotal = 0;
  let ptoCount = 0;
  let bonusTotal = 0;
  let bonusCount = 0;
  let flexTotal = 0;
  let flexCount = 0;
  let esopTotal = 0;
  let esopCount = 0;
  let autoTotal = 0;
  let autoCount = 0;

  for (const loc of locations) {
    // PTO - average of min and max
    const ptoAvg = (loc.benefits.ptoDays.min + loc.benefits.ptoDays.max) / 2;
    ptoTotal += ptoAvg;
    ptoCount++;

    // Bonus - average of min and max if present
    if (loc.benefits.bonusPercent) {
      const bonusAvg = (loc.benefits.bonusPercent.min + loc.benefits.bonusPercent.max) / 2;
      bonusTotal += bonusAvg;
      bonusCount++;
    }

    // Flex
    if (loc.benefits.flexPercent !== null) {
      flexTotal += loc.benefits.flexPercent;
      flexCount++;
    }

    // ESOP
    if (loc.benefits.esopPercent !== null) {
      esopTotal += loc.benefits.esopPercent;
      esopCount++;
    }

    // Auto Allowance
    if (loc.benefits.autoAllowance !== null) {
      autoTotal += loc.benefits.autoAllowance;
      autoCount++;
    }
  }

  return {
    ptoDays: ptoCount > 0 ? Math.round(ptoTotal / ptoCount) : 0,
    bonusPercent: bonusCount > 0 ? Math.round(bonusTotal / bonusCount) : 0,
    flexPercent: flexCount > 0 ? Math.round(flexTotal / flexCount) : 0,
    esopPercent: esopCount > 0 ? Math.round(esopTotal / esopCount) : 0,
    autoAllowance: autoCount > 0 ? Math.round(autoTotal / autoCount) : 0,
  };
}

/**
 * Benefit type for deep-dive analysis
 */
export type BenefitType = 'ptoDays' | 'bonusPercent' | 'flexPercent' | 'esopPercent' | 'autoAllowance';

/**
 * Get a location's value for a specific benefit
 */
export function getLocationBenefitValue(loc: Location, benefitType: BenefitType): number | null {
  switch (benefitType) {
    case 'ptoDays':
      return (loc.benefits.ptoDays.min + loc.benefits.ptoDays.max) / 2;
    case 'bonusPercent':
      return loc.benefits.bonusPercent
        ? (loc.benefits.bonusPercent.min + loc.benefits.bonusPercent.max) / 2
        : null;
    case 'flexPercent':
      return loc.benefits.flexPercent;
    case 'esopPercent':
      return loc.benefits.esopPercent;
    case 'autoAllowance':
      return loc.benefits.autoAllowance;
    default:
      return null;
  }
}

/**
 * Get top locations for a specific benefit
 */
export function getTopLocationsByBenefit(benefitType: BenefitType, limit: number = 5): Location[] {
  return [...locations]
    .filter((loc) => getLocationBenefitValue(loc, benefitType) !== null)
    .sort((a, b) => {
      const valueA = getLocationBenefitValue(a, benefitType) ?? 0;
      const valueB = getLocationBenefitValue(b, benefitType) ?? 0;
      return valueB - valueA;
    })
    .slice(0, limit);
}

/**
 * Get benefit distribution for histogram
 * Returns array of [bucketLabel, count] pairs
 */
export function getBenefitDistribution(benefitType: BenefitType): { bucket: string; count: number }[] {
  const values = locations
    .map((loc) => getLocationBenefitValue(loc, benefitType))
    .filter((v): v is number => v !== null);

  if (values.length === 0) return [];

  const min = Math.min(...values);
  const max = Math.max(...values);
  const bucketCount = 5;
  const bucketSize = (max - min) / bucketCount;

  const buckets: { bucket: string; count: number }[] = [];

  for (let i = 0; i < bucketCount; i++) {
    const bucketMin = min + i * bucketSize;
    const bucketMax = min + (i + 1) * bucketSize;
    const count = values.filter(
      (v) => v >= bucketMin && (i === bucketCount - 1 ? v <= bucketMax : v < bucketMax)
    ).length;

    // Format bucket label based on benefit type
    let label = '';
    if (benefitType === 'ptoDays') {
      label = `${Math.round(bucketMin)}-${Math.round(bucketMax)} days`;
    } else if (benefitType === 'autoAllowance') {
      label = `$${Math.round(bucketMin)}-$${Math.round(bucketMax)}`;
    } else {
      label = `${Math.round(bucketMin)}-${Math.round(bucketMax)}%`;
    }

    buckets.push({ bucket: label, count });
  }

  return buckets;
}

/**
 * Get state average for a specific benefit
 */
export function getStateBenefitAverage(stateCode: string, benefitType: BenefitType): number | null {
  const stateLocations = getLocationsByState(stateCode);
  if (stateLocations.length === 0) return null;

  const values = stateLocations
    .map((loc) => getLocationBenefitValue(loc, benefitType))
    .filter((v): v is number => v !== null);

  if (values.length === 0) return null;

  return values.reduce((sum, v) => sum + v, 0) / values.length;
}
