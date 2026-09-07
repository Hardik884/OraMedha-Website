'use client';
import { Wrapper, Inner, Header, HeaderMainText } from './styles';
import MaskText from '@/components/Common/MaskText';
import { useIsMobile } from '../../../../libs/useIsMobile';
import {
  desktopHeaderPhrase,
  desktopParagraphPhrase,
  desktopSecondParagraphPhrase,
  eyebrow,
  mobileHeaderPhrase,
  mobileParagraphPhrase,
  mobileSecondParagraphPhrase,
} from './constants';

/**
 * A brand moment, not another feature card.
 *
 * Sits between the Action Layer and the clinical detail underneath it, so
 * the page states plainly — right after showing intelligence layered on top
 * of the connected workflow — that none of it made the product harder to
 * use. Same eyebrow-plus-headline shape as TrustSection: typography and
 * whitespace only, no screenshot and no invented UI, because the point is
 * the product gets out of the way, not another surface to look at.
 */
const SimplicitySection = () => {
  const isMobile = useIsMobile();

  return (
    <Wrapper data-testid="simplicity-section">
      <Inner>
        <Header>
          <h3>{eyebrow}</h3>
          <HeaderMainText>
            {isMobile ? (
              <>
                <MaskText phrases={mobileHeaderPhrase} tag="h1" />
                <MaskText phrases={mobileParagraphPhrase} tag="p" />
                <MaskText phrases={mobileSecondParagraphPhrase} tag="p" />
              </>
            ) : (
              <>
                <MaskText phrases={desktopHeaderPhrase} tag="h1" />
                <MaskText phrases={desktopParagraphPhrase} tag="p" />
                <MaskText phrases={desktopSecondParagraphPhrase} tag="p" />
              </>
            )}
          </HeaderMainText>
        </Header>
      </Inner>
    </Wrapper>
  );
};

export default SimplicitySection;
