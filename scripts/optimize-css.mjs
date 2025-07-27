#!/usr/bin/env node

/**
 * CSS Optimization Script
 * 
 * This script:
 * 1. Finds all CSS files in the output directory
 * 2. Runs PurgeCSS to remove unused selectors
 * 3. Minifies the CSS using CleanCSS
 * 4. Extracts critical CSS and inlines it into HTML files
 * 5. Loads remaining CSS asynchronously
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PurgeCSS } from 'purgecss';
import CleanCSS from 'clean-css';
import {generate} from 'critical';
import {load} from 'cheerio';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const outDir = path.join(__dirname, '../out');
const cleanCssOptions = {
  level: {
    1: {
      specialComments: 0
    },
    2: {
      restructureRules: true
    }
  }
};

// Clean CSS instance
const cleanCss = new CleanCSS(cleanCssOptions);

// Helper function to get all HTML files
function getAllHtmlFiles(directory) {
  const results = [];
  
  function traverseDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        traverseDir(fullPath);
      } else if (entry.isFile() && path.extname(entry.name).toLowerCase() === '.html') {
        results.push(fullPath);
      }
    }
  }
  
  traverseDir(directory);
  return results;
}

// Helper function to get all CSS files
function getAllCssFiles(directory) {
  const results = [];
  
  function traverseDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        traverseDir(fullPath);
      } else if (entry.isFile() && path.extname(entry.name).toLowerCase() === '.css') {
        results.push(fullPath);
      }
    }
  }
  
  traverseDir(directory);
  return results;
}

// Purge and minify CSS
async function purgeAndMinifyCSS(htmlFiles, cssFiles) {
  console.log(`Found ${cssFiles.length} CSS files to optimize`);
  
  // Purge CSS for unused selectors
  const purgedResults = await new PurgeCSS().purge({
    content: htmlFiles,
    css: cssFiles,
    safelist: ['html', 'body']
  });
  
  // Minify each CSS file
  for (const result of purgedResults) {
    const originalPath = cssFiles.find(file => 
      path.basename(file) === path.basename(result.file)
    );
    
    if (originalPath) {
      const minified = cleanCss.minify(result.css);
      fs.writeFileSync(originalPath, minified.styles, 'utf8');
      console.log(`Optimized: ${path.relative(outDir, originalPath)} (${result.css.length} -> ${minified.styles.length} bytes)`);
    }
  }
}

// Process critical CSS and inline it into HTML
async function processCriticalCSS(htmlFiles) {
  console.log(`Processing critical CSS for ${htmlFiles.length} HTML files`);
  
  for (const htmlFile of htmlFiles) {
    try {
      // Generate critical CSS for different viewports
      const result = await generate({
        src: htmlFile,
        target: {
          html: htmlFile,
          css: path.join(path.dirname(htmlFile), 'critical.css')
        },
        inline: true,
        dimensions: [
          { width: 375, height: 667 }, // Mobile
          { width: 1280, height: 800 } // Desktop
        ],
        penthouse: {
          timeout: 60000
        }
      });
      
      console.log(`Inlined critical CSS: ${path.relative(outDir, htmlFile)}`);
      
      // Remove the temporary critical.css file if it was created
      const criticalCssFile = path.join(path.dirname(htmlFile), 'critical.css');
      if (fs.existsSync(criticalCssFile)) {
        fs.unlinkSync(criticalCssFile);
      }
    } catch (error) {
      console.error(`Error processing critical CSS for ${htmlFile}:`, error);
    }
  }
}

// Load all CSS asynchronously
function updateHtmlToLoadCssAsync(htmlFiles) {
  console.log('Updating HTML files to load CSS asynchronously');
  
  for (const htmlFile of htmlFiles) {
    try {
      const html = fs.readFileSync(htmlFile, 'utf8');
      const $ = load(html);
      
      // Find all <link rel="stylesheet"> that are not inlined
      $('link[rel="stylesheet"]:not([data-inline])').each((i, elem) => {
        const href = $(elem).attr('href');
        
        // Add media="print" onload pattern for async loading
        $(elem).attr('media', 'print');
        $(elem).attr('onload', "this.media='all'");
        
        // Add fallback for no-js
        const noscript = `<noscript><link rel="stylesheet" href="${href}"></noscript>`;
        $(elem).after(noscript);
      });
      
      // Save the updated HTML
      fs.writeFileSync(htmlFile, $.html(), 'utf8');
      console.log(`Updated: ${path.relative(outDir, htmlFile)}`);
    } catch (error) {
      console.error(`Error updating ${htmlFile}:`, error);
    }
  }
}

// Main function
async function main() {
  console.log('Starting CSS optimization process...');
  
  // Check if out directory exists
  if (!fs.existsSync(outDir)) {
    console.error(`Error: Output directory '${outDir}' does not exist. Run 'next build' first.`);
    process.exit(1);
  }
  
  // Get all HTML and CSS files
  const htmlFiles = getAllHtmlFiles(outDir);
  const cssFiles = getAllCssFiles(outDir);
  
  console.log(`Found ${htmlFiles.length} HTML files and ${cssFiles.length} CSS files`);
  
  // 1. Purge and minify CSS
  await purgeAndMinifyCSS(htmlFiles, cssFiles);
  
  // 2. Process critical CSS and inline it
  await processCriticalCSS(htmlFiles);
  
  // 3. Update HTML to load remaining CSS asynchronously
  updateHtmlToLoadCssAsync(htmlFiles);
  
  console.log('\nCSS optimization complete!');
}

// Run the script
main().catch(error => {
  console.error('Error during CSS optimization:', error);
  process.exit(1);
});