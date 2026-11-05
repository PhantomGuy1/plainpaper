// Morning View and Calendar — Today's 3 plus on-device .ics download
// (see .kiro/specs/morning-view-and-calendar/design.md).
//
// The Morning view shows only the top three open items by the dashboard's
// deterministic sort, and nothing else. Each dated card gets a one-tap
// "Add to calendar" control that builds a standard .ics file entirely on the
// device as a Blob download. No calendar account, no sign-in, no network
// calls. The .ics uses only the item's user-entered data — never an invented
// amount, date, or consequence.

import { loadStore, type Paper } from './storage';
import { renderCard, headline, actionFor } from './card';
import { paydayCardInfo } from './payday';
import { openPaperComparator, todayISO } from './dashboard';

/** The top three open items by the dashboard's deterministic sort.
 *  Open items only (done !== true), dated items first (due date ascending,
 *  then entry order), no-date items last (by entry order). Take the first
 *  three. `today` is accepted for signature parity with the spec; the sort
 *  itself is purely by due date and entry order, so it is not needed here. */
export function todaysThree(papers: Paper[], _today: string): Paper[] {
  const open = papers.filter((p) => p.done !== true);
  open.sort(openPaperComparator);
  return open.slice(0, 3);
}

/** Escape a text field per RFC 5545: backslash, semicolon, comma, newline.
 *  Backslash is escaped first so the later escapes are not double-escaped. */
function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

/** The current UTC time as an iCalendar UTC-time string: YYYYMMDDTHHMMSSZ. */
function icsTimeStamp(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
  );
}

/** Add one day to an ISO YYYY-MM-DD date, returning a new ISO date. Built in
 *  local calendar time so a daylight change never shifts the day. All-day
 *  .ics events use an exclusive end (the day after the due date). */
function addOneDay(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + 1);
  const ny = date.getFullYear();
  const nm = String(date.getMonth() + 1).padStart(2, '0');
  const nd = String(date.getDate()).padStart(2, '0');
  return `${ny}-${nm}-${nd}`;
}

/** Compact date for iCalendar VALUE=DATE: YYYYMMDD (no hyphens). */
function compactDate(iso: string): string {
  return iso.replace(/-/g, '');
}

/** Build RFC 5545 .ics content for a dated paper: an all-day VEVENT on the due
 *  date. All fields use only the item's user-entered data. The DESCRIPTION is
 *  the plain-English headline followed by the action line — both built from
 *  the paper's type and entered data, never an invented fact. Lines are joined
 *  with CRLF; text fields are escaped per RFC 5545. */
export function icsFor(paper: Paper): string {
  const due = paper.dueDate as string; // caller guarantees a due date exists
  const description = `${headline(paper)}\n${actionFor(paper.type)}`;
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//PlainPaper//EN',
    'BEGIN:VEVENT',
    `UID:${paper.id}@plainpaper`,
    `DTSTAMP:${icsTimeStamp()}`,
    `DTSTART;VALUE=DATE:${compactDate(due)}`,
    `DTEND;VALUE=DATE:${compactDate(addOneDay(due))}`,
    `SUMMARY:${escapeIcsText(paper.title)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lines.join('\r\n') + '\r\n';
}

/** Sanitize a title for use in a filename: trim, keep alphanumerics, hyphens,
 *  underscores, and spaces; collapse runs of spaces to a single hyphen; trim
 *  leading and trailing hyphens. */
function sanitizeFilename(title: string): string {
  return title
    .trim()
    .replace(/[^a-zA-Z0-9-_ ]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Build the .ics string, wrap it in a Blob (text/calendar), and trigger a
 *  download as plainpaper-{title}.ics. All client-side — no network calls, no
 *  calendar account, no sign-in. */
export function downloadIcs(paper: Paper): void {
  const ics = icsFor(paper);
  const blob = new Blob([ics], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const safe = sanitizeFilename(paper.title);
  a.download = safe === '' ? 'plainpaper.ics' : `plainpaper-${safe}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Does the paper carry a usable due date? */
function hasDueDate(p: Paper): boolean {
  return p.dueDate !== undefined && p.dueDate !== '';
}

interface MorningViewOptions {
  onBack: () => void;
}

/** The Morning view: a short heading plus Today's 3 cards. Each dated card has
 *  a one-tap "Add to calendar" control; no-due-date items do not. Cards reuse
 *  the plain-english-card rendering and the payday info, so they match the
 *  dashboard's cards. Nothing else is shown. */
export function renderMorning({ onBack }: MorningViewOptions): HTMLElement {
  const section = document.createElement('section');
  section.className = 'page morning';

  // Back to the dashboard.
  const backBtn = document.createElement('button');
  backBtn.type = 'button';
  backBtn.className = 'back-btn';
  backBtn.textContent = 'Back';
  backBtn.addEventListener('click', onBack);
  section.appendChild(backBtn);

  const heading = document.createElement('h1');
  heading.textContent = "Today's 3";
  section.appendChild(heading);

  const store = loadStore();
  const today = todayISO();
  const pattern = store.paydayPattern;
  const top = todaysThree(store.papers, today);

  if (top.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = 'Nothing on the list today.';
    section.appendChild(empty);
    return section;
  }

  const list = document.createElement('div');
  list.className = 'morning-list';
  for (const paper of top) {
    const wrap = document.createElement('div');
    wrap.className = 'card-item';

    // Payday label and flag so Morning cards match the dashboard's cards.
    const info = paydayCardInfo(paper, pattern, today);
    wrap.appendChild(renderCard(paper, info.label, info.flag));

    // Calendar download — only for dated items (no date, no event).
    if (hasDueDate(paper)) {
      const calBtn = document.createElement('button');
      calBtn.type = 'button';
      calBtn.className = 'calendar-btn';
      calBtn.textContent = 'Add to calendar';
      calBtn.addEventListener('click', () => downloadIcs(paper));
      wrap.appendChild(calBtn);
    }

    list.appendChild(wrap);
  }
  section.appendChild(list);

  return section;
}
