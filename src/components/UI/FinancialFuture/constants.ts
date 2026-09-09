import brain_attention from '../../../../public/images/product/brain_attention.png';
import brain_action from '../../../../public/images/product/brain_action.png';

// Same eyebrow-plus-headline shape as the rest of the page (see
// SimplicitySection, TrustSection): names this as the intelligence layer
// sitting on top of the connected workflow above it, and what it actually
// does with what it finds — surfaces it, then turns it into action.
export const eyebrow = 'Intelligence and guided actions';

/**
 * Both cards show the half of the real briefing that their copy describes: the
 * left card the "Needs attention" column, the right card the "What to do"
 * column beside it. They are two crops of the same captured screen, so the
 * pairing a reader sees on the page is the pairing the product actually makes.
 */
export const cardsInfo = [
  {
    title: 'See what needs attention.',
    details:
      'OraMedha continuously watches activity across the clinic and brings important issues to the surface before they get lost in the day-to-day',
    visual: brain_attention,
    alt: "OraMedha's Needs attention list: four hours of idle chair time set against ₹1,27,000 of planned treatment nobody booked, and fewer new patients than usual",
  },
  {
    title: 'Know what to do next and take action on it',
    details:
      'OraMedha turns important signals into clear next steps, so you can act on what matters instead of digging through the clinic’s data yourself.',
    visual: brain_action,
    alt: "OraMedha's What to do list, pairing each finding with a step and a Contact Patients button",
  },
];

/**
 * These are counts of what the software does, taken from the Business Brain
 * implementation itself — 28 metric definitions, 18 signal evaluators across
 * five categories (financial, scheduling, retention, operational, clinical),
 * producing one daily briefing. They are deliberately NOT customer numbers,
 * revenue figures or outcome claims, none of which OraMedha has verified.
 */
export const stats = [
  {
    number: '28',
    subtitle: 'clinic metrics',
  },
  {
    number: '18',
    subtitle: 'signals watched',
  },
  {
    number: '5',
    subtitle: 'areas of the clinic',
  },
  {
    number: '1',
    subtitle: 'daily briefing',
  },
];

/**
 * The five categories the signal evaluators are grouped into, named rather than
 * counted. "5 areas of the clinic" is only meaningful once a reader can see
 * which five; these are the evaluator directories in the Business Brain
 * (financial, scheduling, retention, operational, clinical), in clinic words.
 */
export const areas = [
  'Revenue',
  'Scheduling',
  'Retention',
  'Operations',
  'Clinical',
];

// For desktop
export const desktopHeaderPhrase = [
  'Don’t just see',
  'your clinic. Know',
  'what to do next.',
];
export const desktopParagraphPhrase = [
  'OraMedha looks across your clinic to identify what needs attention,',
  'prioritise what matters now, and help you act on it.',
];

// For mobile
export const mobileHeaderPhrase = [
  'Don’t just see your',
  'clinic. Know what',
  'to do next.',
];
export const mobileParagraphPhrase = [
  'OraMedha looks across your clinic to',
  'identify what needs attention, prioritise',
  'what matters now, and help you act on it.',
];
