
const test = require("node:test");
const assert = require("node:assert/strict");
const pkg = require("../package.json");

test("Package must have a valid name", () => {
  assert.ok(pkg.name.length > 0);
});

test("Version must follow semantic versioning", () => {
  assert.match(pkg.version, /^\d+\.\d+\.\d+$/);
});

test("Build script must exist", () => {
  assert.equal(pkg.scripts.build, "node scripts/build.js");
});
