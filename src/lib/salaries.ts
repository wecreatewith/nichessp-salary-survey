import type { Location } from '@/types/salary';
import salariesData from '@/data/salaries.json';

// Type assertion for the imported JSON data
export const locations: Location[] = salariesData as Location[];
