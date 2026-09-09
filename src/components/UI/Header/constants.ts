import { SECTION_IDS } from '../../../../libs/useScrollToSection';

/**
 * The two states of the jade shape behind the menu button, in one place.
 *
 * The stylesheet reads these too, so the links and the button that sit ON the
 * open panel are laid out against the panel's real width instead of a number
 * copied by hand — and the button's own box is the closed pill's size, which is
 * what puts the burger icon on its centre.
 */
export const MENU_PILL_WIDTH = 55;
export const MENU_PILL_HEIGHT = 40;
export const MENU_PANEL_WIDTH = 250;
export const MENU_PANEL_HEIGHT = 300;

/** The header's own vertical padding below the breakpoint, in px. */
const MENU_HEADER_PADDING = 12;

export const menu = {
  open: {
    width: `${MENU_PANEL_WIDTH}px`,
    height: `${MENU_PANEL_HEIGHT}px`,
    /*
     * Flush with the top of the page and with the row's right edge.
     *
     * Both offsets used to be -25px, which put a quarter of the panel's corner
     * radius off the top of the screen and its right edge 25px past the page's
     * gutter — 6px outside a 375px viewport, and horizontal scroll the body's
     * blanket \`overflow-x\` was quietly swallowing. Same panel, same size, now
     * inside the page.
     */
    top: `-${MENU_HEADER_PADDING}px`,
    right: '0px',
    transition: { duration: 0.75, type: 'tween', ease: [0.76, 0, 0.24, 1] },
  },

  closed: {
    width: `${MENU_PILL_WIDTH}px`,
    height: `${MENU_PILL_HEIGHT}px`,
    /* Exactly over the button's box, which is the same size. */
    top: '0px',
    right: '0px',
    transition: {
      duration: 0.75,
      delay: 0.35,
      type: 'tween',
      ease: [0.76, 0, 0.24, 1],
    },
  },
};
/**
 * The navigation. Each entry points at a section that exists on the
 * homepage, so every link has a real destination — there is no Pricing page
 * to send anyone to, so there is no Pricing link.
 *
 * The header renders on every route (see Layout), including `/privacy`,
 * where these sections don't exist — so the href carries the homepage's own
 * path rather than a bare hash. See libs/useScrollToSection for how that
 * gets a visitor there and onto the right section either way.
 */
export const links = [
  {
    href: `/#${SECTION_IDS.product}`,
    linkTo: 'Product',
  },
  {
    href: `/#${SECTION_IDS.intelligence}`,
    linkTo: 'Intelligence',
  },
  {
    href: `/#${SECTION_IDS.security}`,
    linkTo: 'FAQs',
  },
];
