#!/usr/bin/env node

/**
 * This script removes all JavaScript from the Next.js static export.
 * It processes HTML files to remove script tags and preload links,
 * and optionally removes JS files completely.
 */

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// Configuration
const outDir = path.join(__dirname, '../out');
const removeJsFiles = true; // Set to false if you want to keep JS files

// Function to remove JavaScript from HTML content
function removeJavaScript(htmlContent) {
  const $ = cheerio.load(htmlContent);
  
  // Remove all script tags
  $('script').remove();
  
  // Remove preload links for JavaScript
  $('link[rel="preload"][as="script"]').remove();
  
  // Remove Next.js data script
  $('#__NEXT_DATA__').remove();
  
  // Remove any onclick attributes
  $('[onclick]').removeAttr('onclick');
  
  return $.html();
}

// Process a single HTML file
function processHtmlFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const cleanedHtml = removeJavaScript(content);
    fs.writeFileSync(filePath, cleanedHtml, 'utf8');
    console.log(`Processed: ${path.relative(outDir, filePath)}`);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

// Delete JavaScript files
function deleteJsFiles(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    
    if (entry.isDirectory()) {
      deleteJsFiles(fullPath);
    } else if (entry.isFile() && path.extname(entry.name).toLowerCase() === '.js') {
      fs.unlinkSync(fullPath);
      console.log(`Deleted: ${path.relative(outDir, fullPath)}`);
    }
  }
}

// Process all HTML files in a directory (recursive)
function processDirectory(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    
    if (entry.isDirectory()) {
      processDirectory(fullPath);
    } else if (entry.isFile() && path.extname(entry.name).toLowerCase() === '.html') {
      processHtmlFile(fullPath);
    }
  }
}

// Main function
function main() {
  console.log('Starting JavaScript removal process...');
  
  // Check if out directory exists
  if (!fs.existsSync(outDir)) {
    console.error(`Error: Output directory '${outDir}' does not exist. Run 'next build' first.`);
    process.exit(1);
  }
  
  // Process all HTML files
  processDirectory(outDir);
  
  // Optionally remove all JS files
  if (removeJsFiles) {
    console.log('\nRemoving JavaScript files...');
    deleteJsFiles(outDir);
  }
  
  console.log('\nJavaScript removal complete!');
}

// Run the script
main();