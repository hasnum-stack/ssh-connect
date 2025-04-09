#!/usr/bin/env node
import nodeModule from 'node:module';

const { enableCompileCache } = nodeModule;
if (enableCompileCache) {
  try {
    enableCompileCache();
  } catch {
    // ignore errors
  }
}

async function main() {
  const { run } = await import('../dist/index.js');
  run();
}

await main();
