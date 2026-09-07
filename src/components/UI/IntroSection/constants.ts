import ic_arrows_right_left from '../../../../public/svgs/ic_arrows_right_left.svg';
import ic_identification from '../../../../public/svgs/ic_identification.svg';
import ic_banknotes from '../../../../public/svgs/ic_banknotes.svg';

// SimplicitySection above now makes the "one connected workflow" point in
// almost these words, so this leads with the front desk itself — the day it is
// running, rather than the list of things that workflow contains. It also
// stays clear of the three cards below, which already name the day’s list, the
// shared queue and the loose ends.

// For desktop
export const desktopHeaderPhrase = ['Less front-desk chaos'];
export const desktopParagraphPhrase = [
  'The front desk stops holding the day together by hand — everything it',
  'runs on is visible to whoever needs it, at the moment they need it.',
];

// For mobile
export const mobileHeaderPhrase = ['Less front-desk', 'chaos'];
export const mobileParagraphPhrase = [
  'The front desk stops holding the day',
  'together by hand — everything it runs on is',
  'visible to whoever needs it, at the moment',
  'they need it.',
];

export const edges = [
  {
    point: 'One list for the day',
    details:
      'Booked appointments, walk-ins and check-ins land on the same schedule instead of a diary, a phone and somebody’s memory.',
    icon: ic_arrows_right_left,
  },
  {
    point: 'A queue everyone can see',
    details:
      'Who is waiting, who is in the chair and who is next — the same view at the desk and in the treatment room.',
    icon: ic_identification,
  },
  {
    point: 'Nothing left hanging',
    details:
      'Bills are settled against the treatment that was done, and follow-ups stay on a list until somebody rebooks them.',
    icon: ic_banknotes,
  },
];
