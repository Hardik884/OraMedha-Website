import Layout from '@/components/Layout';
import './globals.css';
import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';

/**
 * The title and description a link card shows on WhatsApp, LinkedIn, iMessage
 * and the like — kept apart from the `<title>`/`description` below because
 * those are tested verbatim (see e2e/homepage.spec.ts) and read as a tab
 * label, not a pitch. This is the pitch: the same "action and intelligence
 * layer" and "designed around how clinics actually work" language the
 * homepage itself uses (see FinancialFuture and TrustSection), so a shared
 * link promises exactly what the page delivers.
 */
const shareTitle = 'OraMedha — Action and Intelligence for Dental Clinics';
const shareDescription =
  'OraMedha connects appointments, patients, clinical records and billing in one workflow, then adds an action and intelligence layer that surfaces what needs attention — designed around how clinics actually work.';

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
