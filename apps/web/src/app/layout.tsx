import type { Metadata, Viewport } from 'next';
import '../styles/globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const viewport: Viewport = {
  themeColor: '#8B5CF6',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.partyhive.in'),
  title: 'PartyHive — Play Together. Laugh Louder.',
  description: 'The all-in-one real-time multiplayer party games platform. Draw & Guess, Quiz Battle, Hot Takes, Word Dash, Most Likely To, and Reaction Arena with zero downloads.',
  keywords: ['party games', 'multiplayer', 'remote team games', 'trivia', 'drawing game', 'hot takes', 'reaction game', 'word dash', 'most likely to', 'PartyHive'],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: [
      { url: '/favicon.ico', type: 'image/x-icon' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'PartyHive — Play Together. Laugh Louder.',
    description: 'The all-in-one real-time multiplayer party games platform. Play Draw & Guess, Trivia, Social Debates, and Reflex Showdowns with friends.',
    url: 'https://www.partyhive.in',
    siteName: 'PartyHive',
    images: [
      {
        url: '/icon-512.png',
        width: 512,
        height: 512,
        alt: 'PartyHive Logo Emblem',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'PartyHive — Play Together. Laugh Louder.',
    description: 'The all-in-one real-time multiplayer party games platform.',
    images: ['/icon-512.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-slate-100 flex flex-col min-h-screen antialiased selection:bg-brand-500 selection:text-white">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
