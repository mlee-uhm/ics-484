const fs = require('fs');
const path = require('path');
const d3 = require('d3');

const PUBLIC_DIR = path.join(__dirname, 'public');

// 1. Get all source files
const INPUT_FILES = fs.readdirSync(PUBLIC_DIR)
  .filter(f => f.startsWith('cartodb-query') && f.endsWith('.csv'));

console.log(`Found ${INPUT_FILES.length} input files. Starting processing...`);

// 2. Initialize Stats
const overallStats = {
  yearly: {},
  monthly: Array(12).fill(0),
  hourly: Array(24).fill(0),
  types: {},
  days: Array(7).fill(0),
  trends: {}, // <--- THIS IS THE KEY PART MISSING
};

function updateStats(row) {
  if (!row.dispatch_date) return;

  // Parse Date
  const parts = row.dispatch_date.split('-');
  const year = parts[0];
  const month = parseInt(parts[1], 10) - 1;
  const hour = parseInt(row.hour, 10);
  const day = new Date(`${row.dispatch_date}T12:00:00`).getDay();
  const type = row.text_general_code;

  // Update Basic Counts
  if (year) overallStats.yearly[year] = (overallStats.yearly[year] || 0) + 1;
  if (!isNaN(month)) overallStats.monthly[month]++;
  if (!isNaN(hour)) overallStats.hourly[hour]++;
  if (!isNaN(day)) overallStats.days[day]++;

  // Update Trends (Specific Crime Types per Year)
  if (type) {
    overallStats.types[type] = (overallStats.types[type] || 0) + 1;

    if (year) {
      if (!overallStats.trends[year]) overallStats.trends[year] = {};
      if (!overallStats.trends[year][type]) overallStats.trends[year][type] = 0;
      overallStats.trends[year][type]++;
    }
  }
}

// 3. Process Files
INPUT_FILES.forEach((file, index) => {
  console.log(`[${index + 1}/${INPUT_FILES.length}] Processing ${file}...`);
  const content = fs.readFileSync(path.join(PUBLIC_DIR, file), 'utf8');
  const data = d3.csvParse(content);

  data.forEach(row => updateStats(row));
});

// 4. Output JSON
const output = {
  years: Object.entries(overallStats.yearly)
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => b.year - a.year),
  monthly: overallStats.monthly,
  days: overallStats.days,
  hourly: overallStats.hourly,
  types: Object.entries(overallStats.types)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([type, count]) => ({ type, count })),
  trends: overallStats.trends, // <--- ENSURE THIS IS INCLUDED
};

fs.writeFileSync(path.join(PUBLIC_DIR, 'overall_stats.json'), JSON.stringify(output, null, 2));
console.log('✅ Done! Trends calculated.');
