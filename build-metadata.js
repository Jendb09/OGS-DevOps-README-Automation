'use strict';

// Small, production-used module that we can meaningfully unit-test and measure.
function createBuildInfo(pkg, commit = 'local', now = new Date()) {
  if (!pkg || typeof pkg.name !== 'string' || !pkg.name.trim()) {
    throw new TypeError('A nonempty package name is required');
  }
  if (typeof pkg.version !== 'string' || !/^\d+\.\d+\.\d+$/.test(pkg.version)) {
    throw new TypeError('Package version must be major.minor.patch');
  }
  if (!(now instanceof Date) || Number.isNaN(now.getTime())) {
    throw new TypeError('A valid build date is required');
  }
  return {
    name: pkg.name,
    version: pkg.version,
    buildTime: now.toISOString(),
    commit: commit || 'local'
  };
}

module.exports = { createBuildInfo };
