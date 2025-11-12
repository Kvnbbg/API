#!/usr/bin/env node
import { rm, mkdir, cp, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const SOURCE_DIR = path.join(ROOT_DIR, 'src');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

async function build() {
  await rm(DIST_DIR, { recursive: true, force: true });
  await mkdir(DIST_DIR, { recursive: true });
  await cp(SOURCE_DIR, DIST_DIR, { recursive: true });

  const runtimeManifest = {
    type: 'module',
    main: 'index.js'
  };

  await writeFile(
    path.join(DIST_DIR, 'package.json'),
    `${JSON.stringify(runtimeManifest, null, 2)}\n`
  );

  console.log('Build complete. Output available in ./dist');
}

build().catch((error) => {
  console.error('Build failed:', error);
  process.exitCode = 1;
});
