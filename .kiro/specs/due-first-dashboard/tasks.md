# Due-First Dashboard — Tasks

Implementation checklist. No application code is written in the spec run;
this list drives the build.

- [x] 1. Extend the `Paper` shape with `done?` and `doneAt?` (this spec owns them).
- [x] 2. Implement `today` as the current local calendar date (date-only).
- [x] 3. Implement the grouper: Overdue, Due this week (today + 6 days), Due later, No date / no action.
- [x] 4. Implement the deterministic sorter: due date ascending, then `createdAt` ascending; No date group by `createdAt` only.
- [x] 5. Render the four open groups in order, each with a short empty-state line.
- [x] 6. Render each open paper as a card per the plain-english-card spec, with a Done control.
- [x] 7. Implement Done: set `done` + `doneAt`, persist, re-render (paper leaves the open groups).
- [x] 8. Render the Done list, sorted by `doneAt` descending.
- [x] 9. Implement Move back: clear `done` + `doneAt`, persist, re-render (paper returns to its group).
- [x] 10. Add empty-state lines for each group and the Done list.
- [x] 11. Verify no scoring, weighting, or prioritisation beyond due date and entry order.
- [x] 12. Run the build check (`npm run build`) and fix any errors.
