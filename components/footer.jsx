import Link from 'next/link';

// Server Component (default in Next.js App Router)
export function Footer() {
    // Get year at build time only
    const currentYear = new Date().getFullYear();
    
    return (
        <footer className="mt-20 pt-8 border-t border-stone-200 text-center text-stone-500">
          <p>&copy; {currentYear} exgfr. All rights reserved.</p>
          <p className="mt-2 text-sm">
            Interested in what we&apos;re building? Reach out at{" "}
            <Link href="mailto:pls@exgfr.com" className="underline hover:text-stone-900">
              pls@exgfr.com
            </Link>
          </p>
        </footer>
    );
}
