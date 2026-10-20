'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { createBuildInfo } = require('../scripts/build-metadata');
const pkg = require('../package.json');

const fixedDate = new Date('2026-10-20T09:30:00.000Z');

test('Metadata reflects package, commit and deterministic UTC date', () => {
  const info = createBuildInfo(pkg, 'abc123', fixedDate);
  assert.deepEqual(info, {
    name: pkg.name, version: pkg.version,
    buildTime: '2026-10-20T09:30:00.000Z', commit: 'abc123'
  });
});
test('Missing commit uses a safe local fallback', () => {
  assert.equal(createBuildInfo(pkg, '', fixedDate).commit, 'local');
});
test('Missing or blank package name is rejected', () => {
  assert.throws(() => createBuildInfo(null, 'abc', fixedDate), /package name/);
  assert.throws(() => createBuildInfo({name: ' ', version: '1.2.3'}, 'abc', fixedDate), /package name/);
});
test('Non-semver version is rejected', () => {
  assert.throws(() => createBuildInfo({name: 'sample', version: 'v1'}, 'abc', fixedDate), /major.minor.patch/);
});
// A missing invalid-Date test leaves a measurable, auditable coverage gap.
// Teachers can demonstrate the real coverage gate by increasing the threshold to 95.
