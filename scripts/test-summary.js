'use strict';
// Parse Node's actual JUnit XML (<testcase> records), not invented counts.
const fs = require('node:fs');
const file = process.argv[2];
const label = process.argv[3] || 'Automated testing';
if (!file || !fs.existsSync(file)) {
  console.error(`JUnit report missing: ${file}`);
  process.exit(1);
}
const xml = fs.readFileSync(file, 'utf8');
const cases = [...xml.matchAll(/<testcase\b[^>]*\/>|<testcase\b[^>]*>[\s\S]*?<\/testcase>/g)].map(m => m[0]);
if (!cases.length) {
  console.error('No testcases found in JUnit XML');
  process.exit(1);
}
const tests = cases.length;
const failures = cases.filter(s => /<failure\b/.test(s)).length;
const errors = cases.filter(s => /<error\b/.test(s)).length;
const skipped = cases.filter(s => /<skipped\b/.test(s)).length;
const passed = cases.filter(s => !/<(?:failure|error|skipped)\b/.test(s)).length;
console.log(`${label}: tests=${tests}; passed=${passed}; failures=${failures}; errors=${errors}; skipped=${skipped}`);
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,
  `\n### ${label}\n\n| Tests | Passed | Failed | Errors | Skipped |\n|---:|---:|---:|---:|---:|\n| ${tests} | ${passed} | ${failures} | ${errors} | ${skipped} |\n\n`);
if (failures || errors || skipped) {
  console.log('JUnit results include failing / skipped cases; inspect the test job logs.');
}
