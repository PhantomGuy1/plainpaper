# Due-First Dashboard — Tasks

Implementation checklist. No application code is written in the spec run;
this list drives the build.

- [ ] 1. Extend the `Paper` shape with `done?` and `doneAt?` (this spec owns them).
- [ ] 2. Implement `today` as the current local calendar date (date-only).
- [ ] 3. Implement the grouper: Overdue, Due this week (today + 6 days), Due later, No date / no action.
- [ ] 4. Implement the deterministic sorter: due date ascending, then `createdAt` ascending; No date group by `createdAt` only.
- [ ] 5. Render the four open groups in order, each with a short empty-state line.
- [ ] 6. Render each open paper as a card per the plain-english-card spec, with a Done control.
- [ ] 7. Implement Done: set `done` + `doneAt`, persist, re-render (paper leaves the open groups).
- [ ] 8. Render the Done list, sorted by `doneAt` descending.
- [ ] 9. Implement Move back: clear `done` + `doneAt`, persist, re-render (paper returns to its group).
- [ ] 10. Add empty-state lines for each group and the Done list.
- [ ] 11. Verify no scoring, weighting, or prioritisation beyond due date and entry order.
- [ ] 12. Run the build check (`npm run build`) and fix any errors.
