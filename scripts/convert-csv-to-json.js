/**
 * Convert salaries-2025.csv to salaries.json
 * Run with: node scripts/convert-csv-to-json.js
 */

const fs = require('fs');
const path = require('path');

// Read CSV
const csvPath = path.join(__dirname, '../source-data/salaries-2025.csv');
const csv = fs.readFileSync(csvPath, 'utf-8');

const lines = csv.trim().split('\n');
const headers = lines[0].split(',');

// Parse each line (skip header)
const locations = [];

for (let i = 1; i < lines.length; i++) {
  const line = lines[i];
  if (!line.trim()) continue;

  // Parse CSV line (handle quoted fields)
  const values = [];
  let current = '';
  let inQuotes = false;

  for (const char of line) {
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current.trim());

  // Parse location "City, State"
  const locationParts = values[0].split(', ');
  const city = locationParts[0];
  const state = locationParts.length > 1 ? locationParts[1] : '';

  // Map trend strings to enum values
  const mapTrend = (trend) => {
    if (trend === 'up') return 'up';
    if (trend === 'down') return 'down';
    return 'stable';
  };

  // Parse benefits ranges like "10-22" to { min: 10, max: 22 }
  const parsePtoDays = (pto) => {
    const match = pto.match(/(\d+)-(\d+)/);
    if (match) {
      return { min: parseInt(match[1]), max: parseInt(match[2]) };
    }
    const single = parseInt(pto);
    return { min: single, max: single };
  };

  // Parse percentage ranges like "11-22%" to { min: 11, max: 22 }
  const parsePercentRange = (pct) => {
    const match = pct.match(/(\d+)-(\d+)%?/);
    if (match) {
      return { min: parseInt(match[1]), max: parseInt(match[2]) };
    }
    const single = parseInt(pct);
    if (isNaN(single)) return null;
    return { min: single, max: single };
  };

  // Parse single percentage like "20%" to number
  const parsePercent = (pct) => {
    const match = pct.match(/(\d+)%?/);
    if (match) return parseInt(match[1]);
    if (pct === '-') return null;
    return null;
  };

  const location = {
    city,
    state,
    stateCode: values[1],
    roles: {
      director: {
        min: parseInt(values[2]),
        max: parseInt(values[3]),
        trend: mapTrend(values[4])
      },
      seniorManager: {
        min: parseInt(values[5]),
        max: parseInt(values[6]),
        trend: mapTrend(values[7])
      },
      manager: {
        min: parseInt(values[8]),
        max: parseInt(values[9]),
        trend: mapTrend(values[10])
      },
      seniorEstimator: {
        min: parseInt(values[11]),
        max: parseInt(values[12]),
        trend: mapTrend(values[13])
      },
      estimator: {
        min: parseInt(values[14]),
        max: parseInt(values[15]),
        trend: mapTrend(values[16])
      },
      junior: {
        min: parseInt(values[17]),
        max: parseInt(values[18]),
        trend: mapTrend(values[19])
      }
    },
    benefits: {
      ptoDays: parsePtoDays(values[20]),
      bonusPercent: parsePercentRange(values[21]),
      flexPercent: parsePercent(values[22]),
      esopPercent: parsePercent(values[23]),
      autoAllowance: values[24] ? parsePercent(values[24]) : null
    }
  };

  locations.push(location);
}

// Write JSON
const outputPath = path.join(__dirname, '../src/data/salaries.json');
fs.writeFileSync(outputPath, JSON.stringify(locations, null, 2));

console.log(`Converted ${locations.length} locations to ${outputPath}`);
