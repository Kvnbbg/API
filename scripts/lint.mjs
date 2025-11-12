#!/usr/bin/env node
import { readdir, readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const TARGET_DIRECTORIES = ['src', 'tests', 'scripts'];
const SUPPORTED_EXTENSIONS = new Set(['.js', '.mjs', '.cjs']);

async function gatherFiles(directory) {
  const absoluteDir = path.join(ROOT_DIR, directory);
  let entries;
  try {
    entries = await readdir(absoluteDir, { withFileTypes: true });
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }

  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(absoluteDir, entry.name);
      if (entry.isDirectory()) {
        const nestedFiles = await gatherFiles(path.join(directory, entry.name));
        return nestedFiles;
      }

      if (!SUPPORTED_EXTENSIONS.has(path.extname(entry.name))) {
        return [];
      }

      return [path.join(directory, entry.name)];
    })
  );

  return files.flat();
}

function runSyntaxCheck(filePath) {
  return new Promise((resolve) => {
    const absolutePath = path.join(ROOT_DIR, filePath);
    const child = spawn(process.execPath, ['--check', absolutePath], { stdio: ['ignore', 'pipe', 'pipe'] });

    let stderr = '';
    child.stderr.on('data', (chunk) => {
      stderr += chunk;
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve(null);
        return;
      }

      const message = stderr.trim() || `Syntax check failed for ${filePath}`;
      resolve(`${filePath}: ${message}`);
    });
  });
}

async function runContentChecks(filePath) {
  const absolutePath = path.join(ROOT_DIR, filePath);
  const content = await readFile(absolutePath, 'utf8');
  const issues = [];

  const lines = content.split('\n');
  lines.forEach((line, index) => {
    if (/\s$/.test(line) && line.trim().length > 0) {
      issues.push(`${filePath}:${index + 1} contains trailing whitespace`);
    }

    if (/\t/.test(line)) {
      issues.push(`${filePath}:${index + 1} contains tab indentation; use spaces instead`);
    }

    if (/(?:\/\/|\/\*)\s*TODO/.test(line)) {
      issues.push(`${filePath}:${index + 1} contains a TODO placeholder that must be resolved`);
    }
  });

  if (!content.endsWith('\n')) {
    issues.push(`${filePath} must end with a newline character`);
  }

  return issues;
}

async function main() {
  const discoveryResults = await Promise.all(TARGET_DIRECTORIES.map((dir) => gatherFiles(dir)));
  const jsFiles = discoveryResults.flat();

  if (jsFiles.length === 0) {
    console.log('No JavaScript files found to lint.');
    return;
  }

  const syntaxChecks = await Promise.all(jsFiles.map((file) => runSyntaxCheck(file)));
  const contentChecksResults = await Promise.all(jsFiles.map((file) => runContentChecks(file)));

  const issues = [
    ...syntaxChecks.filter(Boolean),
    ...contentChecksResults.flat()
  ];

  if (issues.length > 0) {
    console.error('Lint failures detected:');
    issues.forEach((issue) => console.error(`  - ${issue}`));
    process.exitCode = 1;
    return;
  }

  console.log(`Lint successful: ${jsFiles.length} file(s) passed static analysis.`);
}

main().catch((error) => {
  console.error('Unexpected lint failure:', error);
  process.exitCode = 1;
});
