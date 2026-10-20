'use strict';
const fs = require('node:fs');
const path = require('node:path');
const pkg = require('../package.json');
const { createBuildInfo } = require('./build-metadata');

const outputDir = path.join(__dirname, '../dist');
fs.mkdirSync(outputDir, { recursive: true });
const metadata = createBuildInfo(pkg, process.env.GITHUB_SHA || 'local');
fs.writeFileSync(path.join(outputDir, 'build-info.json'), JSON.stringify(metadata, null, 2));
console.log('Build completed successfully!');
console.log(`Version: ${metadata.version}, Commit: ${metadata.commit}`);
