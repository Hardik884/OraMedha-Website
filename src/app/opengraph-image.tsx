import { ImageResponse } from 'next/server';

/*
 * The node runtime's bundled @vercel/og tries to resolve its own default
 * font through `fileURLToPath`, which throws "Invalid URL" building on
 * Windows (a packaging bug in the version Next 13.5 bundles, unrelated to
 * anything in this file). The edge runtime renders through a different,
 * fetch-based code path that doesn't hit it.
 */
export const runtime = 'edge';

/**
 * The image WhatsApp, LinkedIn, iMessage and the like render on a shared
 * link card. Generated rather than a static asset, so the wording stays a
 * single source of truth with the rest of the site's copy instead of a
 * screenshot someone has to remember to update by hand.
 *
 * Composition mirrors the homepage's own eyebrow-plus-headline shape (see
 * FinancialFuture, TrustSection): a jade eyebrow naming the intelligence
 * layer, a headline stating what it does, and a line of body copy in the
 * page's own "designed around how clinics actually work" language — so the
 * card promises exactly what the page delivers, in its own voice.
 *
 * No web font is loaded here: satori (what `ImageResponse` renders through)
 * needs font data fetched and passed in explicitly, and the system
 * sans-serif it falls back to reads perfectly well at this size — not worth
 * the extra network fetch on every render for a passing resemblance to SF
 * Pro Display.
 */
export const alt = 'OraMedha — Action and Intelligence for Dental Clinics';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px',
          background: '#070606',
          backgroundImage:
            'radial-gradient(circle at 88% 8%, rgba(23,107,80,0.65) 0%, rgba(7,6,6,0) 52%)',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Wordmark row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              display: 'flex',
              width: 18,
              height: 18,
              borderRadius: 5,
              background: '#229870',
            }}
          />
          <div
            style={{
              display: 'flex',
              fontSize: 32,
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-0.01em',
            }}
          >
            OraMedha
          </div>
        </div>

        {/* Pitch */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 22,
            maxWidth: 980,
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 24,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#229870',
            }}
          >
            Intelligence and action
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 62,
              fontWeight: 600,
              lineHeight: 1.15,
              color: '#ffffff',
            }}
          >
            An intelligence layer for your clinic&apos;s daily workflow
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 26,
              lineHeight: 1.5,
              color: '#bdbdbd',
              maxWidth: 900,
            }}
          >
            Designed around how clinics actually work — connected workflow,
            clinical records and billing, with an action layer that surfaces
            what needs attention.
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            fontSize: 22,
            color: '#6f6f6f',
          }}
        >
          oramedha.com
        </div>
      </div>
    ),
    { ...size }
  );
}
