#!/usr/bin/env node

/**
 * Extreme Optimization Script
 * 
 * This script performs a series of optimization steps:
 * 1. Runs the Next.js build
 * 2. Strips all JavaScript
 * 3. Optimizes CSS (purge, minify, inline critical CSS)
 * 4. Minifies HTML
 */

const { execSync } = require('child_process');
const path = require('path');

// Configuration
const rootDir = path.join(__dirname, '..');
const scriptsDir = __dirname;

// Helper function to execute a script and log its output
function runScript(scriptPath, description) {
  console.log(`\n=== ${description} ===\n`);
  try {
    execSync(`node ${scriptPath}`, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`Error during ${description}:`, error.message);
    return false;
  }
}

// Main function
async function main() {
  console.log('=== Starting Extreme Optimization Process ===\n');
  
  // Step 1: Run Next.js build
  console.log('=== Step 1: Building Next.js static site ===\n');
  try {
    execSync('npm run build', { stdio: 'inherit', cwd: rootDir });
  } catch (error) {
    console.error('Error during Next.js build:', error.message);
    process.exit(1);
  }
  
  // Step 2: Strip all JavaScript
  if (!runScript(path.join(scriptsDir, 'strip-javascript.js'), 'Step 2: Stripping all JavaScript')) {
    process.exit(1);
  }
  
  // Step 3: Optimize CSS
  if (!runScript(path.join(scriptsDir, 'optimize-css.mjs'), 'Step 3: Optimizing CSS')) {
    process.exit(1);
  }
  
  // Step 4: Minify HTML
  if (!runScript(path.join(scriptsDir, 'minify-html.js'), 'Step 4: Minifying HTML')) {
    process.exit(1);
  }
  
  console.log('\n=== Extreme Optimization Complete! ===');
  console.log('Your site has been optimized to the maximum extent possible.');
  console.log('The output is in the "out" directory and is ready to be deployed.');
}

// Run the script
main().catch(error => {
  console.error('Unexpected error during optimization:', error);
  process.exit(1);
});