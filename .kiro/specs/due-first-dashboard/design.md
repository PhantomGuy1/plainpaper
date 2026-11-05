# Due-First Dashboard — Design

## Components

- **Dashboard** — the list view: four open groups plus a separate Done list.
- **grouper(papers, today)** — assigns each open paper to one group by due
  date.
- **sorter(group)** — deterministic sort: due date ascending, then
  `createdAt` ascending.
- **Done toggle** — marks a paper done / not done and persists.

## Data

Extends the `Paper` shape from add-a-paper with the Done state owned by this
spec:

```ts
interface Paper {
  // ...fields from add-a-paper
  done?: boolean;    // true when the paper is in the Done list
  doneAt?: number;   // ms timestamp when marked done
}
```

Groups are computed from the store on each render; they are not stored.
"Today" is the current local calendar date (date-only, ignoring time). Due
dates are stored as ISO `YYYY-MM-DD` and compared by calendar date.

Grouping is by due date only. The "/ no action" in the fourth group's name
is descriptive — those items have no date and thus no time-sensitive action —
not a separate grouping rule. The action line on each card is independent of
grouping.

## Behaviour

### Grouping (open papers, `done !== true`)

- **Overdue** — `dueDate` set and `dueDate < today`.
- **Due this week** — `dueDate` set and `today <= dueDate <= today + 6 days`.
- **Due later** — `dueDate` set and `dueDate > today + 6 days`.
- **No date / no action** — no `dueDate`.

### Sorting

- Date groups: `dueDate` ascending, then `createdAt` ascending (entry
  order).
- No date / no action: `createdAt` ascending only.
- Done list: `doneAt` descending (most recently done first).
- No other ordering, weighting, or priority is applied.

### Done

- Tap **Done** on an open card -> set `done = true`, `doneAt = Date.now()`,
  persist, re-render. The paper leaves the open groups and joins the Done
  list.
- Tap **Move back** on a Done card -> set `done = false`, clear `doneAt`,
  persist, re-render. The paper returns to its date group (or No date).

### Empty states

Each group shows a short plain line when empty, e.g. `Nothing overdue.` and
`Nothing due this week.` The Done list shows `Nothing done yet.` when empty.

### Rendering

Each open paper renders as a card per the plain-english-card spec, with a
Done control. Done papers render in the Done list with a Move back control.
The dashboard reads and writes localStorage only; it makes no network calls.
