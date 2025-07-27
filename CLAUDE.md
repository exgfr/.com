# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a Next.js 14+ (App Router) project deployed on Netlify, showcasing the Netlify Core Primitives (Edge Functions, Image CDN, Blob Store). The website appears to be for "exgfr", a partnership of former Shopify staff building next-generation commerce applications. The site includes information about their mission and open-source projects.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (standalone Next.js)
npm run dev

# Run development server with Netlify features enabled
# This is required for edge functions, blob store, etc.
netlify dev

# Build the application
npm run build

# Run linting
npm run lint

# Start the production server locally
npm start
```

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
- Uses the Geist font from Google Fonts

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