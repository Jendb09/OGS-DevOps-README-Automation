'use strict';
// Deliberately not *.test.js: unit tests must not require a downloaded build.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const pkg = require('../package.json');

const artifactFile = path.join(__dirname, '../dist/build-info.json');
const readInfo = () => JSON.parse(fs.readFileSync(artifactFile, 'utf8'));

test('Built artifact was downloaded and extracted', () => {
  assert.ok(fs.existsSync(artifactFile), `Artifact missing: ${artifactFile}`);
});
test('Artifact contains exact package name and version', () => {
  const info = readInfo();
  assert.equal(info.name, pkg.name);
  assert.equal(info.version, pkg.version);
});
test('Artifact identifies the tested Git commit', () => {
  const info = readInfo();
  if (process.env.GITHUB_SHA) assert.equal(info.commit, process.env.GITHUB_SHA);
  else assert.equal(info.commit, 'local');
});
test('Artifact build timestamp is valid ISO 8601 UTC', () => {
  const info = readInfo();
  assert.equal(new Date(info.buildTime).toISOString(), info.buildTime);
});
test('Artifact has only expected metadata fields', () => {
  assert.deepEqual(Object.keys(readInfo()).sort(), ['buildTime', 'commit', 'name', 'version'].sort());
});
test('Integration tests execute in the staging test environment', () => {
  assert.equal(process.env.TEST_ENV, 'staging');
});
test('Deliberate regression fails and blocks every deployment', () => {
  assert.notEqual(process.env.SIMULATE_TEST_FAILURE, 'true', 'Intentional failure to prove the deployment gate');
});
