# Due-First Dashboard — Requirements

## Introduction

The dashboard shows all open papers in one list, grouped by due date:
Overdue, Due this week, Due later, and No date / no action. Sorting is
deterministic — due date first, then entry order — with no scoring or
prioritisation magic. One tap marks an item Done and moves it to a separate
Done list; Done items can be moved back. Each open item renders as a card
per the plain-english-card spec.

## User stories

- As a busy parent, I want the most urgent papers on top, so I know what to
  handle first.
- As a non-technical user, I want clear groups I can scan in ten seconds, so
  I don't have to think about sorting.
- As a user, I want to mark a paper Done in one tap and undo it, so I can
  track what's handled without a fuss.

## Acceptance criteria

1. The system shall group open papers into four groups: Overdue, Due this
   week, Due later, and No date / no action.
2. Overdue shall contain open papers with a due date before today.
3. Due this week shall contain open papers with a due date within the next
   7 days, including today.
4. Due later shall contain open papers with a due date more than 7 days
   from today.
5. No date / no action shall contain open papers with no due date.
6. Within each date group, the system shall sort by due date ascending, then
   by entry order (`createdAt` ascending).
7. The No date / no action group shall sort by entry order only.
8. When the user taps Done on a paper, the system shall mark it done, remove
   it from the open groups, add it to the Done list, and persist the change.
9. When the user taps Move back on a Done paper, the system shall mark it
   not done, return it to the open groups, and persist the change.
10. The system shall apply no scoring, weighting, or prioritisation beyond
    due date and entry order.
11. The system shall render each open paper as a card per the plain-english-
    card spec.
12. When a group is empty, the system shall show a short plain line saying
    so.
