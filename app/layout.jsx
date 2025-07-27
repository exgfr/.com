import '../styles/globals.css';
import { Footer } from '../components/footer';
import { Geist as GeistSans } from "next/font/google"

const geist = GeistSans({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

export const metadata = {
    title: {
        template: '%s | exgfr',
        default: 'exgfr - Building the next generation of apps'
    }
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={geist.variable}>
            <head>
                <link rel="icon" href="/favicon.svg" sizes="any" />
            </head>
            <body>
                <div className="bg-stone-50 text-stone-900 min-h-screen font-sans">
                    <main className={`max-w-3xl mx-auto p-8`}>
                        {children}
                        <Footer />
                    </main>
                </div>
            </body>
        </html>
    );
}
