// Payday Buckets — the hero feature
// (see .kiro/specs/payday-buckets/design.md).
//
// Pure functions only. The user sets a payday pattern (two days of the month);
// every dated paper is labelled with the paycheck it comes from, and items due
// before the next payday are flagged. Labels and flags are computed on each
// render and never stored, so changing the pattern re-labels everything. With
// no pattern set, paydayLabel returns null and the card slot shows
// "Payday not set." Nothing is invented — no amount, date, or paycheck the
// user did not enter.

import type { Paper, PaydayPattern } from './storage';
import { formatDate } from './card';

/** Parse the year from an ISO YYYY-MM-DD string. */
function yearOf(iso: string): number {
  return Number(iso.split('-')[0]);
}

/** Days in a calendar month. `month` is 1–12 (calendar, not JS 0-indexed).
 *  day 0 of the next month is the last day of this month. */
function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/** Clamp a pattern day to the month's last day on overflow (e.g. the 30th in
 *  February). Derived from the user's pattern, not invented. */
function clampDay(year: number, month: number, day: number): number {
  return Math.min(day, daysInMonth(year, month));
}

/** Build an ISO YYYY-MM-DD string from year, calendar month (1–12), and day. */
function isoOf(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/** The two payday dates in a calendar month as ISO strings, with each pattern
 *  day clamped to the last day of the month on overflow. */
function paydaysInMonth(year: number, month: number, pattern: PaydayPattern): string[] {
  return [
    isoOf(year, month, clampDay(year, month, pattern.day1)),
    isoOf(year, month, clampDay(year, month, pattern.day2)),
  ];
}

/** The most recent payday on or before a due date. In the due date's month, the
 *  latest of that month's two paydays that is on or before the due date; if
 *  neither is, the later payday of the previous month. ISO YYYY-MM-DD strings
 *  compare correctly by calendar date as plain strings. */
export function paydayFor(dueDate: string, pattern: PaydayPattern): string {
  const [y, m] = dueDate.split('-').map(Number);
  const onOrBefore = paydaysInMonth(y, m, pattern).filter((d) => d <= dueDate);
  if (onOrBefore.length > 0) {
    onOrBefore.sort();
    return onOrBefore[onOrBefore.length - 1]; // the latest
  }
  // Neither payday this month is on or before the due date -> previous month.
  let pm = m - 1;
  let py = y;
  if (pm < 1) {
    pm = 12;
    py -= 1;
  }
  const prev = paydaysInMonth(py, pm, pattern).sort();
  return prev[prev.length - 1]; // the later payday of the previous month
}

/** The first payday strictly after today. In today's month, the earliest of
 *  that month's two paydays that is after today; if neither is, the earlier
 *  payday of next month. */
export function nextPayday(pattern: PaydayPattern, today: string): string {
  const [y, m] = today.split('-').map(Number);
  const after = paydaysInMonth(y, m, pattern).filter((d) => d > today);
  if (after.length > 0) {
    after.sort();
    return after[0]; // the earliest after today
  }
  let nm = m + 1;
  let ny = y;
  if (nm > 12) {
    nm = 1;
    ny += 1;
  }
  const next = paydaysInMonth(ny, nm, pattern).sort();
  return next[0]; // the earlier payday of next month
}

/** The paycheck label for a paper, or null when no pattern is set (the card slot
 *  then shows "Payday not set."). Built only from the user's pattern and the
 *  paper's entered due date — never an invented date or paycheck.
 *
 *  `today` supplies the reference year for the date format, so the function is
 *  pure; it matches the plain-english-card "append year when it differs from
 *  the current year" rule. */
export function paydayLabel(
  paper: Paper,
  pattern: PaydayPattern | undefined,
  today: string,
): string | null {
  if (pattern === undefined) return null; // -> card shows "Payday not set."
  const hasDue = paper.dueDate !== undefined && paper.dueDate !== '';
  if (!hasDue) return 'No due date, so no paycheck.';
  const payday = paydayFor(paper.dueDate as string, pattern);
  // Reuse the plain-english-card date format (short month + day; year appended
  // when it differs from the current year).
  const dateStr = formatDate(payday, yearOf(today));
  return `From the ${dateStr} paycheck.`;
}

/** True when a pattern is set, the paper has a due date, and the due date is
 *  before the user's next payday — i.e. the pre-payday flag applies. */
export function isDueBeforeNextPayday(
  paper: Paper,
  pattern: PaydayPattern | undefined,
  today: string,
): boolean {
  if (pattern === undefined) return false;
  if (paper.dueDate === undefined || paper.dueDate === '') return false;
  const next = nextPayday(pattern, today);
  return (paper.dueDate as string) < next;
}

/** The label and flag for a card, computed in one call so callers (the
 *  dashboard, the morning view) stay tidy. Both are derived on each render and
 *  never stored. */
export interface PaydayCardInfo {
  label: string | null;
  flag: string | null;
}

export function paydayCardInfo(
  paper: Paper,
  pattern: PaydayPattern | undefined,
  today: string,
): PaydayCardInfo {
  return {
    label: paydayLabel(paper, pattern, today),
    flag: isDueBeforeNextPayday(paper, pattern, today)
      ? 'Due before your next payday.'
      : null,
  };
}
