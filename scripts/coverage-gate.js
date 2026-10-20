'use strict';
// Reads REAL LCOV line counters. Does not estimate or fabricate coverage.
const fs = require('node:fs');
const path = require('node:path');

const report = process.argv[2] || 'reports/lcov.info';
const threshold = Number(process.argv[3] ?? 80);
if (!Number.isFinite(threshold) || threshold < 0 || threshold > 100) {
  console.error('Coverage threshold must be between 0 and 100');
  process.exit(2);
}
if (!fs.existsSync(report)) {
  console.error(`Missing LCOV report: ${report}`);
  process.exit(2);
}
const content = fs.readFileSync(report, 'utf8');
const records = content.split('end_of_record');
let covered = 0, total = 0;
const included = [];
for (const record of records) {
  const file = /^SF:(.+)$/m.exec(record)?.[1];
  // Only report production module coverage, not inflated test-file coverage.
  if (!file || !file.replaceAll('\\', '/').endsWith('scripts/build-metadata.js')) continue;
  const hits = [...record.matchAll(/^DA:\d+,(\d+)/gm)].map(m => Number(m[1]));
  if (!hits.length) continue;
  total += hits.length;
  covered += hits.filter(n => n > 0).length;
  included.push(path.basename(file));
}
if (!total || included.length !== 1) {
  console.error('No unique application source file found in LCOV; refusing to pass gate.');
  process.exit(2);
}
const percentage = covered / total * 100;
const pass = percentage + 1e-9 >= threshold;
const outcome = pass ? 'PASS' : 'FAIL';
console.log(`COVERAGE_GATE ${outcome}: ${covered}/${total} application lines = ${percentage.toFixed(2)}%, required >= ${threshold}%`);
const summary = process.env.GITHUB_STEP_SUMMARY;
if (summary) fs.appendFileSync(summary, `\n### Real source-code coverage\n\n| Module | Covered / Total lines | Coverage | Required | Result |\n|---|---:|---:|---:|---|\n| \`scripts/build-metadata.js\` | ${covered}/${total} | ${percentage.toFixed(2)}% | ${threshold}% | **${outcome}** |\n\n`);
if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `coverage=${percentage.toFixed(2)}\ncovered=${covered}\ntotal=${total}\n`);
if (!pass) process.exit(1);
