'use client';

import { ReactLenis, useLenis } from '@studio-freight/react-lenis';
import { useEffect, useState } from 'react';
import StyledComponentsRegistry from '../../../libs/registry';
import { GlobalStyles } from './GlobalStyles';
import { Footer, Header, Preloader } from '..';
import DemoDialog from '../Common/DemoDialog';
import { DemoDialogProvider } from '../Common/DemoDialog/context';
import FoundingClinicPopup from '../Common/FoundingClinicPopup';
import { scrollToTarget } from '../../../libs/useScrollToSection';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [complete, setComplete] = useState(false);

  return (
    <StyledComponentsRegistry>
      <ReactLenis
        root
        easing={(t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))}
      >
        <DemoDialogProvider>
          <GlobalStyles />
          <Preloader setComplete={setComplete} />
          <div className={complete ? 'complete' : 'not_complete'}>
            <Header />
            {children}
            <Footer />
          </div>
          <DemoDialog />
          <FoundingClinicPopup />
          <DeepLinkToSection ready={complete} />
        </DemoDialogProvider>
      </ReactLenis>
    </StyledComponentsRegistry>
  );
};

export default Layout;

/**
 * Honour a `#section` in the address bar on a cold load.
 *
 * The page is not in the document while the loading screen is up, so the
 * browser has nothing to scroll to and silently drops the hash. This waits
 * until the content is mounted and then moves there itself.
 */
const DeepLinkToSection = ({ ready }: { ready: boolean }) => {
  const lenis = useLenis();

  useEffect(() => {
    if (!ready) return;
    const { hash } = window.location;
    if (!hash || hash.length < 2) return;

    // One frame after mount, so the section has a measured position.
    const id = window.setTimeout(() => {
      const target = document.querySelector(hash);
      if (target) scrollToTarget(lenis, target);
    }, 120);

    return () => window.clearTimeout(id);
  }, [ready, lenis]);

  return null;
};
