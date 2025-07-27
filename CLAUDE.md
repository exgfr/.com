# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a Next.js 15+ (App Router) project deployed on Netlify as a static site. The website is optimized for "exgfr", a partnership of former Shopify staff building next-generation commerce applications. The site includes information about their mission and open-source projects.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (standalone Next.js)
npm run dev

# Run development server with Netlify features enabled
# This is required for edge functions, blob store, etc.
netlify dev

# Build the application for static export (with JavaScript)
npm run build

# Build a JavaScript-free version
npm run build:static

# Build an extremely optimized version (no JS, optimized CSS, minified HTML)
npm run build:extreme

# Run linting
npm run lint

# Preview the static build locally
npm run preview
```

## Optimization Strategy

This site has been optimized for maximum performance using the following techniques:

1. Static HTML export using Next.js with `output: 'export'` in next.config.js
2. React Server Components (RSC) to render components at build time
3. Replaced client component libraries with static SVG elements
4. Pre-renders Markdown content at build time instead of client-side
5. Inlined SVG icons instead of loading icon libraries
6. Post-build script that completely removes all JavaScript from the static output
7. CSS optimization with purging of unused styles and minification
8. Critical CSS extraction and inlining for above-the-fold content using ESM modules
9. Extreme HTML minification for the smallest possible file sizes

The site's content is entirely pre-rendered during the build process, and our custom scripts optimize every aspect of the output, resulting in pure HTML and CSS with zero JavaScript footprint for the client.

### Optimization Build Processes

#### Basic JavaScript-Free Build (`build:static`)

The `build:static` script:
1. Runs the standard Next.js build process
2. Executes a Node.js script that:
   - Removes all `<script>` tags from HTML files
   - Removes all preload links for JavaScript files
   - Removes the Next.js data script
   - Deletes all JavaScript files from the output directory

#### Extreme Optimization Build (`build:extreme`)

The `build:extreme` script performs a comprehensive optimization process:

1. Builds the Next.js static site
2. Strips all JavaScript using the same process as `build:static`
3. Optimizes CSS:
   - Purges unused CSS selectors based on HTML content
   - Minifies CSS using CleanCSS with advanced optimizations
   - Extracts and inlines critical CSS for above-the-fold content
   - Configures remaining CSS to load asynchronously
4. Minifies HTML with extreme settings:
   - Collapses whitespace and removes comments
   - Removes attribute quotes and redundant attributes
   - Minifies inline CSS and URLs
   - Sorts attributes and class names for better gzip compression
   - Uses short doctype and collapses boolean attributes

This multi-step optimization process results in the smallest possible file sizes and fastest loading times for a completely static website.

## Project Architecture

### Next.js App Router Structure

- `app/` - Contains the Next.js application using the App Router
  - `layout.jsx` - Root layout with metadata, fonts, and global structure
  - `page.jsx` - Home page with mission statement and OSS project links
  - `oss/[slug]/page.jsx` - Dynamic routes for individual OSS project pages

### Components

- `components/` - Reusable UI components
  - `header.jsx` - Page header with title, description, and optional back link
  - `footer.jsx` - Page footer
  - Various other components for UI elements (cards, alerts, markdown rendering, etc.)

### Data

- `data/` - Static data files
  - `quotes.json` - Likely used for displaying random quotes
  - `oss.json` - Information about open-source projects

### Styling

- Uses Tailwind CSS for styling

### Netlify Integration

- Configured to deploy to Netlify using Next.js Runtime v5
- Uses Netlify's Core Primitives (Edge Functions, Image CDN, Blob Store)
- Netlify configuration in `netlify.toml`

## Important Notes

1. To fully test the application locally with all Netlify features, use `netlify dev` instead of `npm run dev`

2. The project requires Netlify CLI when developing locally:
   ```bash
   npm install netlify-cli@latest -g
   netlify link  # Link to your deployed site
   netlify dev   # Start development server
   ```

3. When deployed, the site should use Netlify Next Runtime v5 for full functionality

4. The project uses dynamic routes with the App Router pattern (`app/oss/[slug]/page.jsx`)