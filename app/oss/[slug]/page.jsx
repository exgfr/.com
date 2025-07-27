import Link from "next/link"
import { Book, Box, Github, LifeBuoy } from "lucide-react"
import { Header } from '/components/header';
import ossProjects from '../../../data/oss.json';
import Markdown from 'markdown-to-jsx';

// Function to fetch README content from GitHub
async function fetchReadmeContent(githubUrl) {
  try {
    // Extract owner, repo from the GitHub URL
    // Example: https://github.com/exgfr/pike -> owner: exgfr, repo: pike
    const urlParts = githubUrl.replace('https://github.com/', '').split('/');
    const owner = urlParts[0];
    const repo = urlParts[1];
    
    // Construct the raw GitHub URL for the README
    const readmeUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/README.md`;
    
    // Fetch the README content
    const response = await fetch(readmeUrl, { next: { revalidate: 86400 } }); // Cache for 24 hours
    
    if (!response.ok) {
      throw new Error(`Failed to fetch README: ${response.status} ${response.statusText}`);
    }
    
    // Return the README content as text
    return await response.text();
  } catch (error) {
    console.error("Error fetching README:", error);
    return "Failed to load README content.";
  }
}

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
  
  // Fetch README content
  const readmeContent = await fetchReadmeContent(project.githubUrl);

  return (
    <>
        <Header title={project.name} description={project.tagline} showBackLink={true} />
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12 text-sm">
          <Link
            href={project.githubUrl}
            target="_blank"
            className="flex items-center gap-2 p-3 bg-stone-100 rounded-md hover:bg-stone-200 transition-colors"
          >
            <Github size={16} />
            GitHub
          </Link>
          <Link
            href={project.docsUrl}
            target="_blank"
            className="flex items-center gap-2 p-3 bg-stone-100 rounded-md hover:bg-stone-200 transition-colors"
          >
            <Book size={16} />
            Docs
          </Link>
          <Link
            href={project.packageUrl}
            target="_blank"
            className="flex items-center gap-2 p-3 bg-stone-100 rounded-md hover:bg-stone-200 transition-colors"
          >
            <Box size={16} />
            Package
          </Link>
          <Link
            href={`${project.githubUrl}/issues`}
            target="_blank"
            className="flex items-center gap-2 p-3 bg-stone-100 rounded-md hover:bg-stone-200 transition-colors"
          >
            <LifeBuoy size={16} />
            Issues
          </Link>
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
          <div className="mt-4 prose prose-stone max-w-none prose-pre:bg-stone-100 prose-pre:text-stone-800 prose-code:before:content-[''] prose-code:after:content-['']">
            <Markdown>{readmeContent}</Markdown>
          </div>
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
              {project.license} License
            </Link>
            .
          </p>
        </section>
    </>
  )
}
