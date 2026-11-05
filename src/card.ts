// Plain-English Card — renders one Paper as a card
// (see .kiro/specs/plain-english-card/design.md).
//
// The headline is built only from data the user entered — never an invented
// amount, date, or consequence. The action line is the fixed per-type
// mapping. The glossary explains seed jargon terms. The paycheck slot shows
// a provided label, or "Payday not set." Nothing leaves the device.

import type { Paper, PaperType } from './storage';

// Short month names, fixed for deterministic English output (no locale drift).
const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/** Format an ISO YYYY-MM-DD as short month + day, e.g. "Nov 21".
 *  Appends the year when it differs from the current year, e.g. "Nov 21, 2027".
 *
 *  `referenceYear` lets callers (payday-buckets) pass the year to compare
 *  against so they stay pure; it defaults to the actual current year so the
 *  card's existing behaviour is unchanged. */
export function formatDate(isoDate: string, referenceYear?: number): string {
  // Parse the components manually so a UTC midnight parse never shifts the
  // calendar date in a negative timezone.
  const parts = isoDate.split('-');
  const y = Number(parts[0]);
  const m = Number(parts[1]);
  const d = Number(parts[2]);
  const month = MONTHS[m - 1];
  const currentYear = referenceYear ?? new Date().getFullYear();
  if (y !== currentYear) {
    return `${month} ${d}, ${y}`;
  }
  return `${month} ${d}`;
}

/** Strip a single leading "$" the user may have typed, so the display never
 *  doubles it. The amount is otherwise shown exactly as entered. */
export function formatAmount(amount: string): string {
  let a = amount.trim();
  if (a.startsWith('$')) {
    a = a.slice(1);
  }
  return a;
}

/** Build the one-sentence headline from entered data only. */
export function headline(paper: Paper): string {
  const title = paper.title;
  const hasDueDate = paper.dueDate !== undefined && paper.dueDate !== '';
  const dateStr = hasDueDate ? formatDate(paper.dueDate as string) : '';

  if (paper.type === 'bill') {
    // Bill always has an amount clause: the amount, or "amount not entered".
    const amountClause =
      paper.amount !== undefined && paper.amount !== ''
        ? `$${formatAmount(paper.amount)}`
        : 'amount not entered';
    // Date clause starts with a comma for Bill.
    if (hasDueDate) {
      return `${title}: ${amountClause}, due ${dateStr}.`;
    }
    return `${title}: ${amountClause}.`;
  }

  if (paper.type === 'appointment') {
    // Appointments have no amount clause; the date uses " on {date}.".
    if (hasDueDate) {
      return `${title} on ${dateStr}.`;
    }
    return `${title}.`;
  }

  // Letter, School note, Other — date clause starts with a comma.
  if (hasDueDate) {
    return `${title}, due ${dateStr}.`;
  }
  return `${title}.`;
}

/** Fixed type-to-action mapping. Deterministic — no scoring or overrides. */
export function actionFor(type: PaperType): string {
  switch (type) {
    case 'bill':
      return 'Pay';
    case 'letter':
      return 'Reply';
    case 'school-note':
      return 'Sign and return';
    case 'appointment':
      return 'Show up';
    case 'other':
      return 'No action needed';
  }
}

/** Seed glossary terms from .kiro/steering/plain-english.md.
 *  One sentence each; the list may grow but never drops the limit. */
const GLOSSARY: { term: string; explanation: string }[] = [
  {
    term: 'past due',
    explanation:
      'The payment date has already passed and the money is still owed.',
  },
  {
    term: 'minimum due',
    explanation:
      'The smallest amount you must pay this time to stay in good standing; paying only this may leave the rest for later.',
  },
  {
    term: 'co-pay',
    explanation:
      'The fixed amount you pay at the appointment; your insurance pays the rest.',
  },
  {
    term: 'remittance',
    explanation:
      'The part of a bill you send back with your payment, or the payment itself.',
  },
  {
    term: 'due upon receipt',
    explanation:
      'They want payment as soon as you get the bill, not by a later date.',
  },
];

/** Scan the paper's entered text (title, sender, ref) case-insensitively for
 *  glossary terms. Returns each matched term once with its explanation. */
export function glossaryMatches(
  paper: Paper,
): { term: string; explanation: string }[] {
  const haystack = [paper.title, paper.sender, paper.ref]
    .filter((s): s is string => s !== undefined && s !== '')
    .join(' ')
    .toLowerCase();
  const matches: { term: string; explanation: string }[] = [];
  for (const entry of GLOSSARY) {
    if (haystack.includes(entry.term.toLowerCase())) {
      matches.push(entry);
    }
  }
  return matches;
}

/** Render a single Paper as a card.
 *  @param paycheckLabel optional label string from payday-buckets; when absent
 *         the slot shows "Payday not set." and never invents a paycheck.
 *  @param paydayFlag optional pre-payday flag string from payday-buckets
 *         ("Due before your next payday."), shown alongside the label. */
export function renderCard(
  paper: Paper,
  paycheckLabel?: string | null,
  paydayFlag?: string | null,
): HTMLElement {
  const card = document.createElement('article');
  card.className = 'card';

  // Headline — one sentence, entered data only.
  const headlineEl = document.createElement('p');
  headlineEl.className = 'card-headline';
  headlineEl.textContent = headline(paper);
  card.appendChild(headlineEl);

  // Action line — fixed vocabulary, derived from the type.
  const actionEl = document.createElement('p');
  actionEl.className = 'card-action';
  actionEl.textContent = actionFor(paper.type);
  card.appendChild(actionEl);

  // Paycheck label slot — the label from payday-buckets, or "Payday not set."
  // Never invents a paycheck: when no pattern is set the label is null and the
  // slot says so.
  const paydayEl = document.createElement('p');
  paydayEl.className = 'card-payday';
  paydayEl.textContent =
    paycheckLabel !== undefined && paycheckLabel !== null && paycheckLabel !== ''
      ? paycheckLabel
      : 'Payday not set.';
  card.appendChild(paydayEl);

  // Pre-payday flag — shown alongside the label when the due date falls before
  // the user's next payday. Omitted when it does not apply.
  if (paydayFlag !== undefined && paydayFlag !== null && paydayFlag !== '') {
    const flagEl = document.createElement('p');
    flagEl.className = 'card-payday-flag';
    flagEl.textContent = paydayFlag;
    card.appendChild(flagEl);
  }

  // Secondary details — only when entered; omitted when absent (not "not entered").
  if (paper.sender !== undefined && paper.sender !== '') {
    const senderEl = document.createElement('p');
    senderEl.className = 'card-detail';
    senderEl.textContent = `From: ${paper.sender}`;
    card.appendChild(senderEl);
  }
  if (paper.ref !== undefined && paper.ref !== '') {
    const refEl = document.createElement('p');
    refEl.className = 'card-detail';
    refEl.textContent = `Reference: ${paper.ref}`;
    card.appendChild(refEl);
  }

  // Glossary — matching seed terms with their one-sentence explanations.
  const matches = glossaryMatches(paper);
  if (matches.length > 0) {
    const glossaryEl = document.createElement('ul');
    glossaryEl.className = 'card-glossary';
    for (const match of matches) {
      const li = document.createElement('li');
      const term = document.createElement('strong');
      term.textContent = match.term;
      li.appendChild(term);
      li.appendChild(document.createTextNode(` — ${match.explanation}`));
      glossaryEl.appendChild(li);
    }
    card.appendChild(glossaryEl);
  }

  return card;
}
