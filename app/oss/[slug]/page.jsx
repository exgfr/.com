import Link from "next/link"
import { Header } from '/components/header';
import ossProjects from '../../../data/oss.json';
// Use React Server Components to process markdown at build time
import { remark } from 'remark';
import html from 'remark-html';

export const dynamic = 'force-static';

// Define SVG icons as constants to avoid client-side imports
const GITHUB_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>`;
const BOOK_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg>`;
const BOX_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.29 7 12 12 20.71 7"></polyline><line x1="12" y1="22" x2="12" y2="12"></line></svg>`;
const LIFEBUOY_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"></line><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"></line><line x1="14.83" y1="9.17" x2="19.07" y2="4.93"></line><line x1="14.83" y1="9.17" x2="18.36" y2="5.64"></line><line x1="4.93" y1="19.07" x2="9.17" y2="14.83"></line></svg>`;

// Function to fetch README content from GitHub - optimized for static generation
async function fetchReadmeContent(githubUrl) {
  try {
    // Extract owner, repo from the GitHub URL
    const urlParts = githubUrl.replace('https://github.com/', '').split('/');
    const owner = urlParts[0];
    const repo = urlParts[1];
    
    // Construct the raw GitHub URL for the README
    const readmeUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/README.md`;
    
    // Fetch the README content with no revalidation - static generation
    const response = await fetch(readmeUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch README: ${response.status}`);
    }
    
    // Process markdown to HTML at build time
    const markdown = await response.text();
    const processedContent = await remark()
      .use(html)
      .process(markdown);
    
    return processedContent.toString();
  } catch (error) {
    console.error("Error fetching README:", error);
    return "<p>Failed to load README content.</p>";
  }
}

// Generate static paths at build time
export async function generateStaticParams() {
  return ossProjects.map(project => ({
    slug: project.slug,
  }));
}

export default async function OssProjectPage({ params }) {
  // Find the project that matches the slug
  const project = ossProjects.find(p => p.slug === params.slug);
  
  if (!project) {
    return <div>Project not found</div>;
  }
  
  // Fetch and process README content at build time
  const readmeHtml = await fetchReadmeContent(project.githubUrl);

  return (
    <>
        <Header title={project.name} description={project.tagline} showBackLink={true} />
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12 text-sm">
          <Link
            href={project.githubUrl}
            target="_blank"
            className="flex items-center gap-2 p-3 bg-stone-100 rounded-md hover:bg-stone-200 transition-colors"
            dangerouslySetInnerHTML={{ 
              __html: GITHUB_ICON + 'GitHub'
            }}
          />
          <Link
            href={project.docsUrl}
            target="_blank"
            className="flex items-center gap-2 p-3 bg-stone-100 rounded-md hover:bg-stone-200 transition-colors"
            dangerouslySetInnerHTML={{ 
              __html: BOOK_ICON + 'Docs'
            }}
          />
          <Link
            href={project.packageUrl}
            target="_blank"
            className="flex items-center gap-2 p-3 bg-stone-100 rounded-md hover:bg-stone-200 transition-colors"
            dangerouslySetInnerHTML={{ 
              __html: BOX_ICON + 'Package'
            }}
          />
          <Link
            href={`${project.githubUrl}/issues`}
            target="_blank"
            className="flex items-center gap-2 p-3 bg-stone-100 rounded-md hover:bg-stone-200 transition-colors"
            dangerouslySetInnerHTML={{ 
              __html: LIFEBUOY_ICON + 'Issues'
            }}
          />
        </div>

        <section>
          <h2 className="text-2xl font-bold tracking-tight border-b border-stone-200 pb-2">Key Features</h2>
          <ul className="mt-4 space-y-2 text-stone-700 list-disc list-inside">
            {project.keyFeatures.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight border-b border-stone-200 pb-2">README</h2>
          <div 
            className="mt-4 prose prose-stone max-w-none prose-pre:bg-stone-100 prose-pre:text-stone-800 prose-code:before:content-[''] prose-code:after:content-['']"
            dangerouslySetInnerHTML={{ __html: readmeHtml }}
          />
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight border-b border-stone-200 pb-2">License</h2>
          <p className="mt-4 text-stone-700">
            {project.name} is released under the{" "}
            <Link
              href={`${project.githubUrl}/blob/main/LICENSE`}
              target="_blank"
              className="underline hover:text-stone-900"
            >
              MIT License
            </Link>
            .
          </p>
        </section>
    </>
  )
}
