
const fs = require("node:fs");
const path = require("node:path");
const pkg = require("../package.json");

const outputDir = path.join(__dirname, "../dist");

fs.mkdirSync(outputDir, { recursive: true });

const buildInfo = {
  name: pkg.name,
  version: pkg.version,
  buildTime: new Date().toISOString(),
  commit: process.env.GITHUB_SHA || "local"
};

fs.writeFileSync(
  path.join(outputDir, "build-info.json"),
  JSON.stringify(buildInfo, null, 2)
);

console.log("Build completed successfully!");
console.log(`Version: ${pkg.version}`);
