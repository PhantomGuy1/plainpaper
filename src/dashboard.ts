// Due-First Dashboard — the list view
// (see .kiro/specs/due-first-dashboard/design.md).
//
// Four open groups — Overdue, Due this week, Due later, No date / no action —
// plus a separate Done list. Sorting is deterministic: due date ascending,
// then entry order. No scoring, weighting, or prioritisation beyond that.
// One tap marks a paper Done; Done items move back. Everything stays on device.

import { loadStore, setPaperDone, type Paper } from './storage';
import { renderCard } from './card';

/** The current local calendar date as ISO YYYY-MM-DD (date-only, ignoring time).
 *  Used as "today" for grouping and date comparisons. */
export function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Add N days to an ISO YYYY-MM-DD date and return a new ISO date, building the
 *  Date in local calendar time so a daylight change never shifts the day. */
function addDays(iso: string, days: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  const ny = date.getFullYear();
  const nm = String(date.getMonth() + 1).padStart(2, '0');
  const nd = String(date.getDate()).padStart(2, '0');
  return `${ny}-${nm}-${nd}`;
}

/** Does the paper carry a usable due date? */
function hasDueDate(p: Paper): boolean {
  return p.dueDate !== undefined && p.dueDate !== '';
}

/** The four open-paper groups, in display order. */
export type GroupKey = 'overdue' | 'this-week' | 'later' | 'no-date';

export interface GroupedPapers {
  overdue: Paper[];
  'this-week': Paper[];
  later: Paper[];
  'no-date': Paper[];
}

/** Assign each OPEN paper (done !== true) to one group by due date.
 *  ISO YYYY-MM-DD strings compare correctly by calendar date as plain strings. */
export function groupPapers(papers: Paper[], today: string): GroupedPapers {
  const groups: GroupedPapers = {
    overdue: [],
    'this-week': [],
    later: [],
    'no-date': [],
  };
  const weekEnd = addDays(today, 6);
  for (const p of papers) {
    if (p.done === true) continue; // open papers only
    if (!hasDueDate(p)) {
      groups['no-date'].push(p);
      continue;
    }
    const due = p.dueDate as string;
    if (due < today) {
      groups.overdue.push(p);
    } else if (due <= weekEnd) {
      groups['this-week'].push(p);
    } else {
      groups.later.push(p);
    }
  }
  return groups;
}

/** Deterministic sort for the date groups: due date ascending, then entry
 *  order (createdAt ascending). No other ordering is applied. */
function sortByDueThenCreated(a: Paper, b: Paper): number {
  const ad = a.dueDate ?? '';
  const bd = b.dueDate ?? '';
  if (ad !== bd) return ad < bd ? -1 : 1;
  return a.createdAt - b.createdAt;
}

/** Entry-order-only sort for the No date group: createdAt ascending. */
function sortByCreated(a: Paper, b: Paper): number {
  return a.createdAt - b.createdAt;
}

/** Display metadata for each open group, in order. */
const GROUPS: { key: GroupKey; heading: string; empty: string }[] = [
  { key: 'overdue', heading: 'Overdue', empty: 'Nothing overdue.' },
  { key: 'this-week', heading: 'Due this week', empty: 'Nothing due this week.' },
  { key: 'later', heading: 'Due later', empty: 'Nothing due later.' },
  { key: 'no-date', heading: 'No date / no action', empty: 'Nothing without a date.' },
];

/** Render one open paper as a card per the plain-english-card spec, with a
 *  Done control that marks it done and triggers a re-render. */
function renderOpenCard(paper: Paper, rerender: () => void): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = 'card-item';
  wrap.appendChild(renderCard(paper));

  const doneBtn = document.createElement('button');
  doneBtn.type = 'button';
  doneBtn.className = 'done-btn';
  doneBtn.textContent = 'Done';
  doneBtn.addEventListener('click', () => {
    setPaperDone(paper.id, true);
    rerender();
  });
  wrap.appendChild(doneBtn);
  return wrap;
}

/** Render one Done paper as a card with a Move back control. */
function renderDoneCard(paper: Paper, rerender: () => void): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = 'card-item';
  wrap.appendChild(renderCard(paper));

  const backBtn = document.createElement('button');
  backBtn.type = 'button';
  backBtn.className = 'move-back-btn';
  backBtn.textContent = 'Move back';
  backBtn.addEventListener('click', () => {
    setPaperDone(paper.id, false);
    rerender();
  });
  wrap.appendChild(backBtn);
  return wrap;
}

/** Render the dashboard: the four open groups in order, then the Done list.
 *  @param rerender called after a Done / Move back change so the list rebuilds. */
export function renderDashboard(rerender: () => void): HTMLElement {
  const store = loadStore();
  const today = todayISO();
  const groups = groupPapers(store.papers, today);

  // Each group is sorted deterministically; date groups by due then entry
  // order, the No date group by entry order only.
  groups.overdue.sort(sortByDueThenCreated);
  groups['this-week'].sort(sortByDueThenCreated);
  groups.later.sort(sortByDueThenCreated);
  groups['no-date'].sort(sortByCreated);

  const section = document.createElement('section');
  section.className = 'dashboard';

  // Four open groups, in order, each with its short empty-state line.
  for (const g of GROUPS) {
    const wrap = document.createElement('div');
    wrap.className = 'group';

    const heading = document.createElement('h2');
    heading.textContent = g.heading;
    wrap.appendChild(heading);

    const list = groups[g.key];
    if (list.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'empty-state';
      empty.textContent = g.empty;
      wrap.appendChild(empty);
    } else {
      for (const paper of list) {
        wrap.appendChild(renderOpenCard(paper, rerender));
      }
    }
    section.appendChild(wrap);
  }

  // Done list — most recently done first (doneAt descending).
  const doneWrap = document.createElement('div');
  doneWrap.className = 'group done-group';

  const doneHeading = document.createElement('h2');
  doneHeading.textContent = 'Done';
  doneWrap.appendChild(doneHeading);

  const donePapers = store.papers.filter((p) => p.done === true);
  donePapers.sort((a, b) => (b.doneAt ?? 0) - (a.doneAt ?? 0));
  if (donePapers.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = 'Nothing done yet.';
    doneWrap.appendChild(empty);
  } else {
    for (const paper of donePapers) {
      doneWrap.appendChild(renderDoneCard(paper, rerender));
    }
  }
  section.appendChild(doneWrap);

  return section;
}
