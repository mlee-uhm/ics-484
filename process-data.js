const fs = require('fs');
const path = require('path');
const d3 = require('d3'); // Assumes you have d3 installed

const PUBLIC_DIR = path.join(__dirname, 'public');

// 1. Get all source files
const INPUT_FILES = fs.readdirSync(PUBLIC_DIR)
  .filter(f => f.startsWith('cartodb-query') && f.endsWith('.csv'));

console.log(`Found ${INPUT_FILES.length} input files. Starting processing...`);

// 2. Clear out any existing crime_YYYY.csv files (so we don't append duplicates)
const existingYearFiles = fs.readdirSync(PUBLIC_DIR)
  .filter(f => f.startsWith('crime_') && f.endsWith('.csv'));
existingYearFiles.forEach(f => fs.unlinkSync(path.join(PUBLIC_DIR, f)));

// 3. Initialize Stats
const overallStats = {
  yearly: {},
  monthly: Array(12).fill(0),
  hourly: Array(24).fill(0),
  types: {},
  days: Array(7).fill(0),
  years: [], // Will populate at the end
};

// Helper: Update stats for a single row
function updateStats(row) {
  if (!row.dispatch_date) return;

  // Parse Date safely
  // Note: dispatch_date is usually "YYYY-MM-DD"
  const parts = row.dispatch_date.split('-');
  const year = parts[0];
  const month = parseInt(parts[1], 10) - 1; // 0-11

  // Parse Hour
  const hour = parseInt(row.hour, 10);

  // Parse Day of Week (requires full date object)
  // T00:00 prevents timezone issues shifting the day
  const day = new Date(`${row.dispatch_date}T00:00`).getDay();

  // Update Counts
  if (year) {
    overallStats.yearly[year] = (overallStats.yearly[year] || 0) + 1;
  }
  if (!isNaN(month)) overallStats.monthly[month]++;
  if (!isNaN(hour)) overallStats.hourly[hour]++;
  if (!isNaN(day)) overallStats.days[day]++;

  if (row.text_general_code) {
    const type = row.text_general_code;
    overallStats.types[type] = (overallStats.types[type] || 0) + 1;
  }
}

// 4. Process Files One by One
INPUT_FILES.forEach((file, index) => {
  console.log(`[${index + 1}/${INPUT_FILES.length}] Processing ${file}...`);

  const content = fs.readFileSync(path.join(PUBLIC_DIR, file), 'utf8');
  const data = d3.csvParse(content);

  // Group rows by Year
  // This allows us to write to disk in batches (much faster than row-by-row)
  const rowsByYear = {};

  data.forEach(row => {
    const year = row.dispatch_date?.split('-')[0];
    if (!year) return;

    // Add to stats
    updateStats(row);

    // Add to batch
    if (!rowsByYear[year]) rowsByYear[year] = [];
    rowsByYear[year].push(row);
  });

  // Write batches to disk
  Object.keys(rowsByYear).forEach(year => {
    const rows = rowsByYear[year];
    const targetFile = path.join(PUBLIC_DIR, `crime_${year}.csv`);
    const isNewFile = !fs.existsSync(targetFile);

    let csvContent;
    if (isNewFile) {
      // New file: Include Headers
      csvContent = d3.csvFormat(rows);
    } else {
      // Existing file: Append rows ONLY (skip header)
      // d3.csvFormat includes header, so we remove the first line
      const fullCsv = d3.csvFormat(rows);
      csvContent = fullCsv.substring(fullCsv.indexOf('\n') + 1);
      csvContent = `\n${csvContent}`; // Ensure newline separator
    }

    fs.appendFileSync(targetFile, csvContent);
  });
});

// 5. Finalize Stats Output
const output = {
  years: Object.entries(overallStats.yearly)
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => b.year - a.year), // Sort Descending (2025 -> 2006)
  monthly: overallStats.monthly,
  days: overallStats.days,
  hourly: overallStats.hourly,
  types: Object.entries(overallStats.types)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10) // Top 10 Crime Types
    .map(([type, count]) => ({ type, count })),
};

fs.writeFileSync(path.join(PUBLIC_DIR, 'overall_stats.json'), JSON.stringify(output, null, 2));

console.log('-----------------------------------');
console.log('✅ Success! Data split by year.');
console.log('✅ Created: public/overall_stats.json');
console.log('✅ Created: public/crime_2006.csv ... crime_2025.csv');
