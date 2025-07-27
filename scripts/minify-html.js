#!/usr/bin/env node

/**
 * HTML Minification Script
 * 
 * This script compresses all HTML files in the output directory using html-minifier-terser.
 * It removes comments, collapses whitespace, and performs various other optimizations.
 */

const fs = require('fs');
const path = require('path');
const { minify } = require('html-minifier-terser');

// Configuration
const outDir = path.join(__dirname, '../out');
const minifyOptions = {
  collapseWhitespace: true,
  removeComments: true,
  removeAttributeQuotes: true,
  removeRedundantAttributes: true,
  removeEmptyAttributes: true,
  removeOptionalTags: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  minifyCSS: true,
  minifyJS: true,
  minifyURLs: true,
  sortAttributes: true,
  sortClassName: true,
  useShortDoctype: true,
  collapseBooleanAttributes: true,
  collapseInlineTagWhitespace: true,
  conservativeCollapse: false
};

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

// Process a single HTML file
async function processHtmlFile(filePath) {
  try {
    const originalContent = fs.readFileSync(filePath, 'utf8');
    const originalSize = Buffer.byteLength(originalContent, 'utf8');
    
    // Minify the HTML content
    const minifiedContent = await minify(originalContent, minifyOptions);
    const minifiedSize = Buffer.byteLength(minifiedContent, 'utf8');
    
    // Write the minified content back to the file
    fs.writeFileSync(filePath, minifiedContent, 'utf8');
    
    // Calculate reduction percentage
    const reduction = ((originalSize - minifiedSize) / originalSize * 100).toFixed(2);
    
    console.log(`Minified: ${path.relative(outDir, filePath)} (${originalSize} -> ${minifiedSize} bytes, ${reduction}% reduction)`);
    
    return {
      file: filePath,
      originalSize,
      minifiedSize,
      reduction: parseFloat(reduction)
    };
  } catch (error) {
    console.error(`Error minifying ${filePath}:`, error);
    return null;
  }
}

// Process all HTML files
async function processAllHtmlFiles(htmlFiles) {
  console.log(`Minifying ${htmlFiles.length} HTML files...`);
  
  const results = [];
  
  for (const file of htmlFiles) {
    const result = await processHtmlFile(file);
    if (result) {
      results.push(result);
    }
  }
  
  return results;
}

// Print summary of results
function printSummary(results) {
  if (results.length === 0) {
    console.log('No files were processed successfully.');
    return;
  }
  
  const totalOriginalSize = results.reduce((sum, r) => sum + r.originalSize, 0);
  const totalMinifiedSize = results.reduce((sum, r) => sum + r.minifiedSize, 0);
  const averageReduction = results.reduce((sum, r) => sum + r.reduction, 0) / results.length;
  
  console.log('\nSummary:');
  console.log(`Total original size: ${totalOriginalSize} bytes`);
  console.log(`Total minified size: ${totalMinifiedSize} bytes`);
  console.log(`Total reduction: ${((totalOriginalSize - totalMinifiedSize) / totalOriginalSize * 100).toFixed(2)}%`);
  console.log(`Average reduction: ${averageReduction.toFixed(2)}%`);
}

// Main function
async function main() {
  console.log('Starting HTML minification process...');
  
  // Check if out directory exists
  if (!fs.existsSync(outDir)) {
    console.error(`Error: Output directory '${outDir}' does not exist. Run 'next build' first.`);
    process.exit(1);
  }
  
  // Get all HTML files
  const htmlFiles = getAllHtmlFiles(outDir);
  
  // Process all files
  const results = await processAllHtmlFiles(htmlFiles);
  
  // Print summary
  printSummary(results);
  
  console.log('\nHTML minification complete!');
}

// Run the script
main().catch(error => {
  console.error('Error during HTML minification:', error);
  process.exit(1);
});