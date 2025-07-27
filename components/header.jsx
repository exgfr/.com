import Link from 'next/link';

import { ArrowLeft } from "lucide-react"

export function Header({ title, description, showBackLink = false }) {
    return (
        <>
            {showBackLink && (
                <Link href="/" className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 mb-8">
                  <ArrowLeft size={16} />
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