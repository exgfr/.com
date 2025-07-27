import Link from "next/link"
import { Book, Box, Github, LifeBuoy } from "lucide-react"

import { Header } from '/components/header';

// In a real app, you'd fetch this data from a CMS, a local file, or an API
// based on the `params.slug`.
const projectData = {
  slug: "pike",
  name: "Pike",
  tagline: "A lightweight Elixir library for API key authentication and fine-grained authorization.",
  githubUrl: "https://github.com/exgfr/pike",
  docsUrl: "https://hexdocs.pm/pike",
  packageUrl: "https://hex.pm/packages/pike",
  keyFeatures: [
    "Secure, signed API keys with metadata.",
    "Policy-based authorization for granular control.",
    "Pluggable architecture for easy integration.",
    "Minimal dependencies and high performance.",
  ],
  readmeContent: `
    <h3 class="text-xl font-bold">Installation</h3>
    <p>If you're using Mix, add Pike as a dependency to your <code>mix.exs</code> file:</p>
    <pre><code class="language-elixir">def deps do
  [
    {:pike, "~> 0.1.0"}
  ]
end</code></pre>
    <p>Then, run <code>mix deps.get</code> in your shell to fetch the dependencies.</p>
    <h3 class="text-xl font-bold mt-6">Quick Start</h3>
    <p>1. Configure Pike in your <code>config/config.exs</code>:</p>
    <pre><code class="language-elixir">config :pike,
  secret: "your-very-long-and-secret-signing-key"</code></pre>
    <p>2. Create a new API key:</p>
    <pre><code class="language-elixir">{:ok, key} = Pike.generate_key(%{sub: "user_123", scopes: ["read:data"]})</code></pre>
    <p>3. Verify a key in your application (e.g., in a Plug middleware):</p>
    <pre><code class="language-elixir">case Pike.verify(provided_key) do
  {:ok, claims} -> # Key is valid, proceed
  {:error, reason} -> # Key is invalid, halt
end</code></pre>
  `,
  license: "MIT",
}

export default function OssProjectPage({ params }) {
  // You can use params.slug to fetch the correct project data
  const project = projectData

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
          <div
            className="mt-4 prose prose-stone max-w-none prose-pre:bg-stone-100 prose-pre:text-stone-800 prose-code:before:content-[''] prose-code:after:content-['']"
            dangerouslySetInnerHTML={{ __html: project.readmeContent }}
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
              {project.license} License
            </Link>
            .
          </p>
        </section>
    </>
  )
}
