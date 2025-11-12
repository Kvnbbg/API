#!/usr/bin/env node
import { spawn } from 'node:child_process';

const passthroughArgs = process.argv.slice(2).filter((arg) => arg !== '--ci');

const testProcess = spawn(process.execPath, ['--test', ...passthroughArgs], {
  stdio: 'inherit'
});

testProcess.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
