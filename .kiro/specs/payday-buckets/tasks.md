# Payday Buckets — Tasks

Implementation checklist. No application code is written in the spec run;
this list drives the build.

- [ ] 1. Extend `PlainPaperStore` with `paydayPattern?` (owned by this spec).
- [ ] 2. Scaffold the Payday settings view: two day-of-month inputs (1–31), no default.
- [ ] 3. Persist the payday pattern to the store; allow editing it.
- [ ] 4. Implement `paydayFor(dueDate, pattern)`: most recent payday on or before a due date, with day-overflow resolved to the last day of the month.
- [ ] 5. Implement `nextPayday(pattern, today)`: first payday strictly after today.
- [ ] 6. Implement `paydayLabel`: "From the {Month} {day} paycheck." for dated papers; "No due date, so no paycheck." when pattern set but no due date; null when no pattern.
- [ ] 7. Implement the pre-payday flag: "Due before your next payday." when the due date is before the next payday.
- [ ] 8. Reuse the plain-english-card date format (short month + day; year appended when it differs from the current year) for the paycheck label.
- [ ] 9. Wire the paycheck label and flag into the card's paycheck slot; confirm they appear on the dashboard via the card.
- [ ] 10. Show "Payday not set." when no pattern is set; never invent a paycheck.
- [ ] 11. Verify changing the pattern re-labels all dated items and that no network calls occur.
- [ ] 12. Run the build check (`npm run build`) and fix any errors.
