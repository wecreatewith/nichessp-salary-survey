import { describe, it, expect } from 'vitest';
import {
  getAllStates,
  getLocationsByState,
  getLocationByCity,
  calculateAverageSalary,
  getSalaryPercentile,
  getTopPayingLocations,
  getLowestPayingLocations,
  getNationalSalaryRange,
  getMostCommonTrend,
  searchLocations,
  getAllLocations,
  getLocationCountByState,
} from '../data';

describe('getAllStates', () => {
  it('returns an array of state codes', () => {
    const states = getAllStates();
    expect(Array.isArray(states)).toBe(true);
    expect(states.length).toBeGreaterThan(0);
  });

  it('returns sorted state codes', () => {
    const states = getAllStates();
    const sorted = [...states].sort();
    expect(states).toEqual(sorted);
  });

  it('includes known states', () => {
    const states = getAllStates();
    expect(states).toContain('CA');
    expect(states).toContain('TX');
    expect(states).toContain('NY');
  });
});

describe('getLocationsByState', () => {
  it('returns locations for a valid state', () => {
    const txLocations = getLocationsByState('TX');
    expect(txLocations.length).toBeGreaterThan(0);
    txLocations.forEach((loc) => {
      expect(loc.stateCode).toBe('TX');
    });
  });

  it('returns empty array for invalid state', () => {
    const locations = getLocationsByState('ZZ');
    expect(locations).toEqual([]);
  });
});

describe('getLocationByCity', () => {
  it('finds a location by city and state', () => {
    const chicago = getLocationByCity('Chicago', 'IL');
    expect(chicago).toBeDefined();
    expect(chicago?.city).toBe('Chicago');
    expect(chicago?.stateCode).toBe('IL');
  });

  it('is case insensitive for city name', () => {
    const chicago = getLocationByCity('CHICAGO', 'IL');
    expect(chicago).toBeDefined();
    expect(chicago?.city).toBe('Chicago');
  });

  it('returns undefined for non-existent city', () => {
    const fake = getLocationByCity('Faketown', 'IL');
    expect(fake).toBeUndefined();
  });
});

describe('calculateAverageSalary', () => {
  it('returns a positive number', () => {
    const avg = calculateAverageSalary('director');
    expect(avg).toBeGreaterThan(0);
  });

  it('returns different values for different roles', () => {
    const directorAvg = calculateAverageSalary('director');
    const juniorAvg = calculateAverageSalary('junior');
    expect(directorAvg).toBeGreaterThan(juniorAvg);
  });
});

describe('getSalaryPercentile', () => {
  it('returns 0 for very low salary', () => {
    const percentile = getSalaryPercentile(10000, 'director');
    expect(percentile).toBe(0);
  });

  it('returns ~100 for very high salary', () => {
    const percentile = getSalaryPercentile(500000, 'director');
    expect(percentile).toBeGreaterThanOrEqual(95);
  });

  it('returns value between 0 and 100', () => {
    const percentile = getSalaryPercentile(150000, 'estimator');
    expect(percentile).toBeGreaterThanOrEqual(0);
    expect(percentile).toBeLessThanOrEqual(100);
  });
});

describe('getTopPayingLocations', () => {
  it('returns the requested number of locations', () => {
    const top5 = getTopPayingLocations('director', 5);
    expect(top5).toHaveLength(5);
  });

  it('returns locations sorted by salary descending', () => {
    const top5 = getTopPayingLocations('director', 5);
    for (let i = 0; i < top5.length - 1; i++) {
      const currentMid =
        (top5[i].roles.director.min + top5[i].roles.director.max) / 2;
      const nextMid =
        (top5[i + 1].roles.director.min + top5[i + 1].roles.director.max) / 2;
      expect(currentMid).toBeGreaterThanOrEqual(nextMid);
    }
  });
});

describe('getLowestPayingLocations', () => {
  it('returns the requested number of locations', () => {
    const bottom5 = getLowestPayingLocations('director', 5);
    expect(bottom5).toHaveLength(5);
  });

  it('returns locations sorted by salary ascending', () => {
    const bottom5 = getLowestPayingLocations('director', 5);
    for (let i = 0; i < bottom5.length - 1; i++) {
      const currentMid =
        (bottom5[i].roles.director.min + bottom5[i].roles.director.max) / 2;
      const nextMid =
        (bottom5[i + 1].roles.director.min +
          bottom5[i + 1].roles.director.max) /
        2;
      expect(currentMid).toBeLessThanOrEqual(nextMid);
    }
  });
});

describe('getNationalSalaryRange', () => {
  it('returns min and max values', () => {
    const range = getNationalSalaryRange('director');
    expect(range).toHaveProperty('min');
    expect(range).toHaveProperty('max');
    expect(range.max).toBeGreaterThan(range.min);
  });

  it('returns higher values for senior roles', () => {
    const directorRange = getNationalSalaryRange('director');
    const juniorRange = getNationalSalaryRange('junior');
    expect(directorRange.max).toBeGreaterThan(juniorRange.max);
  });
});

describe('getMostCommonTrend', () => {
  it('returns a valid trend value', () => {
    const trend = getMostCommonTrend('director');
    expect(['up', 'down', 'stable']).toContain(trend);
  });
});

describe('searchLocations', () => {
  it('finds locations by city name', () => {
    const results = searchLocations('Chicago');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((loc) => loc.city === 'Chicago')).toBe(true);
  });

  it('finds locations by state code', () => {
    const results = searchLocations('TX');
    expect(results.length).toBeGreaterThan(0);
    results.forEach((loc) => {
      expect(loc.stateCode).toBe('TX');
    });
  });

  it('returns all locations for empty query', () => {
    const all = getAllLocations();
    const results = searchLocations('');
    expect(results.length).toBe(all.length);
  });
});

describe('getAllLocations', () => {
  it('returns all 108 locations', () => {
    const locations = getAllLocations();
    expect(locations).toHaveLength(108);
  });
});

describe('getLocationCountByState', () => {
  it('returns object with state counts', () => {
    const counts = getLocationCountByState();
    expect(typeof counts).toBe('object');
    expect(Object.keys(counts).length).toBeGreaterThan(0);
  });

  it('has correct count for Texas', () => {
    const counts = getLocationCountByState();
    const txLocations = getLocationsByState('TX');
    expect(counts['TX']).toBe(txLocations.length);
  });
});
