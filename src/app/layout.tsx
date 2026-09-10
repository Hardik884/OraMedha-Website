import Layout from '@/components/Layout';
import './globals.css';
import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';

/**
 * The title and description a link card shows on WhatsApp, LinkedIn, iMessage
 * and the like — kept apart from the `<title>`/`description` below because
 * those are tested verbatim (see e2e/homepage.spec.ts) and read as a tab
 * label, not a pitch. This is the pitch: "OraMedha | Intelligent Clinic
 * Management for Dentists" plus a line on what the product actually does day
 * to day, so a shared link promises exactly what the page delivers.
 */
const shareTitle = 'OraMedha | Intelligent Clinic Management for Dentists';
const shareDescription =
  'Run and grow your dental clinic with intelligence and clarity. OraMedha brings the day-to-day work of your clinic together, helps you see what needs attention, and act on what matters.';

export const metadata: Metadata = {
  metadataBase: new URL('https://oramedha.com'),
  title: 'OraMedha',
  description:
    'OraMedha brings the people, patients and processes that run your clinic together in one place, then adds an action and intelligence layer on top of it.',
  openGraph: {
    title: shareTitle,
    description: shareDescription,
    url: 'https://oramedha.com',
    siteName: 'OraMedha',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: shareTitle,
    description: shareDescription,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Layout>{children}</Layout>
        <Analytics />
      </body>
    </html>
  );
}
