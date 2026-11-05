# Plain-English Card — Tasks

Implementation checklist. No application code is written in the spec run;
this list drives the build.

- [ ] 1. Create a Card component that renders one `Paper`.
- [ ] 2. Implement `headline(paper)` with the per-type templates (Bill amount + due clause; Appointment "on {date}"; others "due {date}").
- [ ] 3. Implement date formatting (short month + day; append the year when it differs from the current year).
- [ ] 4. Implement amount display: single `$` prefix, strip a user-typed leading `$`, no rounding or inference.
- [ ] 5. Show "amount not entered" in the headline when a Bill has no amount.
- [ ] 6. Implement `actionFor(type)` with the fixed mapping (Bill->Pay, Letter->Reply, School note->Sign and return, Appointment->Show up, Other->No action needed).
- [ ] 7. Add the glossary constant (seed terms from plain-english.md) and a case-insensitive matcher over the paper's entered text.
- [ ] 8. Render matching glossary terms with their one-sentence explanations on the card.
- [ ] 9. Add the paycheck label slot: render the label when provided, else show "Payday not set." and never invent a paycheck.
- [ ] 10. Render secondary details (sender, reference) only when entered; omit them when absent.
- [ ] 11. Verify the card never invents amounts, dates, or consequences.
- [ ] 12. Run the build check (`npm run build`) and fix any errors.
