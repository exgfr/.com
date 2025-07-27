import Link from 'next/link';

// Replace dynamic client icon with static HTML arrow for better performance
export function Header({ title, description, showBackLink = false }) {
    return (
        <>
            {showBackLink && (
                <Link href="/" className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 mb-8">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m12 19-7-7 7-7"/>
                    <path d="M19 12H5"/>
                  </svg>
                  Back to home
                </Link>
            )}
            
            <header className="py-12">
              <h1 className="text-5xl font-bold tracking-tighter">{title}</h1>
              <p className="mt-4 text-lg text-stone-600">
                {description}
              </p>
            </header>
        </>
    );
}