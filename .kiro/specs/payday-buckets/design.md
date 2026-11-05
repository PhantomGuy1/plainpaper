# Payday Buckets — Design

## Components

- **PaydaySettings** — the form to set the two payday days, set once and
  editable.
- **paydayFor(dueDate, pattern)** — pure function: the most recent payday on
  or before a due date.
- **nextPayday(pattern, today)** — pure function: the first payday strictly
  after today.
- **paydayLabel(paper, pattern, today)** — pure function: the paycheck label
  string, or null when no pattern is set.
- **isDueBeforeNextPayday(paper, pattern, today)** — pure function: whether the
  pre-payday flag applies.

## Data

Extends the `PlainPaperStore` from add-a-paper with the payday pattern,
owned by this spec:

```ts
interface PaydayPattern {
  day1: number; // 1–31
  day2: number; // 1–31
}

interface PlainPaperStore {
  version: 1;
  papers: Paper[];
  paydayPattern?: PaydayPattern; // owned by payday-buckets
}
```

Storing the pattern in the same store object keeps export and import
(local-storage-and-backup) to a single object. The label and flag are
computed on each render; they are never stored, so changing the pattern
re-labels every dated item for free.

## Behaviour

### Setting the pattern

Two day-of-month inputs (1–31), no default — empty until the user enters
their own. Save persists `paydayPattern` to the store. Editing updates it
and re-labels all items on the next render.

### Resolving a payday in a month

For a pattern day `p` and month `M`, the payday is `min(p, daysInMonth(M))`.
If the pattern day exceeds the days in that month (for example, the 30th in
February), the payday falls on the last day of the month. This is derived
from the user's pattern, not invented.

### paydayFor(dueDate, pattern)

The most recent payday on or before the due date. In the due date's month,
take the latest of that month's two paydays that is on or before the due
date. If neither is, take the later payday of the previous month.

### nextPayday(pattern, today)

The first payday strictly after today. In today's month, take the earliest
of that month's two paydays that is after today. If neither is, take the
earlier payday of next month.

### Paycheck label

For a dated paper: `"From the {Month} {day} paycheck."` using
`paydayFor`'s date, formatted as short month + day (year appended when it
differs from the current year), matching the plain-english-card date format.

### Pre-payday flag

When `isDueBeforeNextPayday` is true (pattern set, due date set, due date
before `nextPayday`), show `"Due before your next payday."` alongside the
label.

### No pattern / no due date

- No pattern -> `paydayLabel` returns null; the card slot shows
  `"Payday not set."` No flag, no invented paycheck.
- Pattern set, no due date -> label is `"No due date, so no paycheck."` No
  flag.

### Where it shows

The label and flag fill the paycheck slot the plain-english-card spec
reserves, so they appear on the dashboard and the morning view through the
card rendering. Payday-buckets adds no separate dashboard UI. No network
calls.
