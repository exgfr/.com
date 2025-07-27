import Link from 'next/link';
import { Header } from '../components/header';
import ossProjects from '../data/oss.json';

export const dynamic = 'force-static';

export default function Page() {
    return (
        <>
            <Header title="exgfr" description="We are a Partnership of former Shopify staff, now building the next generation of essential applications for commerce and beyond." showBackLink={false} />
            
            <section>
              <h2 className="text-3xl font-bold tracking-tight border-b border-stone-200 pb-2">Our Mission</h2>
              <p className="mt-4 text-stone-700">
                Our focus is on creating robust, reliable, and ridiculously fast software. We believe in the power of
                simplicity and craftsmanship to build tools that solve real problems without unnecessary complexity.
              </p>
            </section>
            
            <section className="mt-12">
              <h2 className="text-3xl font-bold tracking-tight border-b border-stone-200 pb-2">Open Source</h2>
              <p className="mt-4 text-stone-700">
                All our OSS is released under the MIT license. Feel free to do as you wish with it.
              </p>
              <ul className="mt-4 space-y-4 text-stone-700">
                {ossProjects.map((project) => (
                  <li key={project.slug}>
                    <Link href={`/oss/${project.slug}`} className="font-semibold underline hover:text-stone-900">
                      {project.name}
                    </Link>
                    <span className="text-stone-600"> &middot; </span>
                    <span className="text-stone-600">{project.tagline}</span>
                  </li>
                ))}
              </ul>
            </section>
        </>
    );
}