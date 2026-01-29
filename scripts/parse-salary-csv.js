const fs = require('fs');
const path = require('path');

// Read the CSV file
const csvPath = '/Users/dommcglynn/Downloads/2026 Salary Data for PDFs & Interactive Salary Survey - Sheet1 (2).csv';
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// Parse salary range like "$175,900 - $267,000" or "$162,351 – $190,400"
function parseSalaryRange(str) {
  if (!str || str === '-' || str.trim() === '') {
    return null;
  }

  // Clean the string - remove extra spaces, normalize dashes
  const cleaned = str.trim()
    .replace(/\s+/g, ' ')
    .replace(/–/g, '-')  // en dash to hyphen
    .replace(/—/g, '-'); // em dash to hyphen

  // Extract numbers
  const matches = cleaned.match(/\$?([\d,]+)\s*-\s*\$?([\d,]+)/);
  if (!matches) {
    console.warn('Could not parse salary:', str);
    return null;
  }

  const min = parseInt(matches[1].replace(/,/g, ''), 10);
  const max = parseInt(matches[2].replace(/,/g, ''), 10);

  return { min, max };
}

// Parse trend arrow
function parseTrend(str) {
  if (!str) return 'stable';
  const cleaned = str.trim();
  if (cleaned === '↑' || cleaned.toLowerCase() === 'up') return 'up';
  if (cleaned === '↓' || cleaned.toLowerCase() === 'down') return 'down';
  return 'stable'; // → or anything else
}

// Parse PTO range like "10-22" or "10 - 22" or "15 to 21 days"
function parsePTORange(str) {
  if (!str || str === '-') return { min: 10, max: 20 };

  const cleaned = str.replace(/days?/gi, '').trim();
  const matches = cleaned.match(/(\d+)\s*[-to]+\s*(\d+)/i);
  if (matches) {
    return { min: parseInt(matches[1], 10), max: parseInt(matches[2], 10) };
  }

  // Single number
  const single = cleaned.match(/(\d+)/);
  if (single) {
    const val = parseInt(single[1], 10);
    return { min: val, max: val };
  }

  return { min: 10, max: 20 };
}

// Parse bonus range like "11 - 22%" or "15-25%"
function parseBonusRange(str) {
  if (!str || str === '-') return null;

  const cleaned = str.replace(/%/g, '').trim();
  const matches = cleaned.match(/(\d+)\s*[-to]+\s*(\d+)/i);
  if (matches) {
    return { min: parseInt(matches[1], 10), max: parseInt(matches[2], 10) };
  }

  // Single number
  const single = cleaned.match(/(\d+)/);
  if (single) {
    const val = parseInt(single[1], 10);
    return { min: val, max: val };
  }

  return null;
}

// Parse percentage like "20%" or "20"
function parsePercent(str) {
  if (!str || str === '-') return null;
  const matches = str.match(/(\d+)/);
  return matches ? parseInt(matches[1], 10) : null;
}

// Parse vehicle allowance like "$625"
function parseVehicleAllowance(str) {
  if (!str || str === '-' || str.trim() === '') return null;
  const matches = str.match(/\$?([\d,]+)/);
  return matches ? parseInt(matches[1].replace(/,/g, ''), 10) : null;
}

// Fix city names
function fixCityName(city) {
  const fixes = {
    'Pheonix': 'Phoenix',
    'kalamazoo': 'Kalamazoo',
    'salem': 'Salem',
    'Bismark': 'Bismarck',
  };
  return fixes[city] || city;
}

// Parse city and state from location string like "Chicago, IL" or just "salem"
function parseLocation(locationStr, stateCode) {
  let city = locationStr.trim();
  let state = stateCode.trim();

  // Handle "City, ST" format
  const match = city.match(/^(.+),\s*([A-Z]{2})$/);
  if (match) {
    city = match[1].trim();
    state = match[2];
  }

  city = fixCityName(city);

  // Capitalize first letter of each word
  city = city.replace(/\b\w/g, l => l.toUpperCase());

  return { city, stateCode: state };
}

// State code to full name mapping
const STATE_NAMES = {
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

// Parse CSV - handle multiline fields
function parseCSV(content) {
  const lines = [];
  let currentLine = '';
  let inQuotes = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];

    if (char === '"') {
      inQuotes = !inQuotes;
      currentLine += char;
    } else if (char === '\n' && !inQuotes) {
      if (currentLine.trim()) {
        lines.push(currentLine);
      }
      currentLine = '';
    } else {
      currentLine += char;
    }
  }

  if (currentLine.trim()) {
    lines.push(currentLine);
  }

  return lines;
}

// Split CSV line into fields
function splitCSVLine(line) {
  const fields = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      fields.push(current.replace(/^"|"$/g, '').trim());
      current = '';
    } else {
      current += char;
    }
  }

  fields.push(current.replace(/^"|"$/g, '').trim());
  return fields;
}

// Main parsing
const lines = parseCSV(csvContent);
const locations = [];

// Skip header row
for (let i = 1; i < lines.length; i++) {
  const fields = splitCSVLine(lines[i]);

  // Column indices (0-based):
  // 0: index, 1: location, 2: state code, 3-6: staff info (skip)
  // 7: director salary, 8: director trend
  // 9: senior manager salary, 10: senior manager trend
  // 11: manager salary, 12: manager trend
  // 13: senior estimator salary, 14: senior estimator trend
  // 15: estimator salary, 16: estimator trend
  // 17: junior salary, 18: junior trend
  // 19: PTO, 20: Bonus, 21: Flex%, 22: ESOP%, 23: Vehicle Allowance

  const locationStr = fields[1];
  const stateCode = fields[2];

  if (!locationStr || !stateCode) continue;

  const { city, stateCode: finalStateCode } = parseLocation(locationStr, stateCode);

  // Parse salaries
  const directorSalary = parseSalaryRange(fields[7]);
  const seniorManagerSalary = parseSalaryRange(fields[9]);
  const managerSalary = parseSalaryRange(fields[11]);
  const seniorEstimatorSalary = parseSalaryRange(fields[13]);
  const estimatorSalary = parseSalaryRange(fields[15]);
  const juniorSalary = parseSalaryRange(fields[17]);

  // Skip locations with no salary data (like Anchorage, AK which has all dashes)
  if (!directorSalary && !seniorManagerSalary && !managerSalary &&
      !seniorEstimatorSalary && !estimatorSalary && !juniorSalary) {
    console.log(`Skipping ${city}, ${finalStateCode} - no salary data`);
    continue;
  }

  // Use default values if some salaries are missing
  const defaultSalary = { min: 80000, max: 100000 };

  const location = {
    city,
    state: finalStateCode,
    stateCode: finalStateCode,
    roles: {
      director: {
        min: directorSalary?.min || 150000,
        max: directorSalary?.max || 200000,
        trend: parseTrend(fields[8]),
      },
      seniorManager: {
        min: seniorManagerSalary?.min || 130000,
        max: seniorManagerSalary?.max || 170000,
        trend: parseTrend(fields[10]),
      },
      manager: {
        min: managerSalary?.min || 110000,
        max: managerSalary?.max || 150000,
        trend: parseTrend(fields[12]),
      },
      seniorEstimator: {
        min: seniorEstimatorSalary?.min || 100000,
        max: seniorEstimatorSalary?.max || 140000,
        trend: parseTrend(fields[14]),
      },
      estimator: {
        min: estimatorSalary?.min || 80000,
        max: estimatorSalary?.max || 120000,
        trend: parseTrend(fields[16]),
      },
      junior: {
        min: juniorSalary?.min || 60000,
        max: juniorSalary?.max || 90000,
        trend: parseTrend(fields[18]),
      },
    },
    benefits: {
      ptoDays: parsePTORange(fields[19]),
      bonusPercent: parseBonusRange(fields[20]),
      flexPercent: parsePercent(fields[21]),
      esopPercent: parsePercent(fields[22]),
      autoAllowance: parseVehicleAllowance(fields[23]),
    },
  };

  locations.push(location);
}

// Sort by state, then city
locations.sort((a, b) => {
  if (a.stateCode !== b.stateCode) {
    return a.stateCode.localeCompare(b.stateCode);
  }
  return a.city.localeCompare(b.city);
});

console.log(`Parsed ${locations.length} locations`);

// Write output
const outputPath = path.join(__dirname, '..', 'src', 'data', 'salaries.json');
fs.writeFileSync(outputPath, JSON.stringify(locations, null, 2));
console.log(`Written to ${outputPath}`);

// Print summary
const stateCount = new Set(locations.map(l => l.stateCode)).size;
console.log(`States covered: ${stateCount}`);
