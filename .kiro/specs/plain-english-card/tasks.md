# Plain-English Card — Tasks

Implementation checklist. No application code is written in the spec run;
this list drives the build.

- [x] 1. Create a Card component that renders one `Paper`.
- [x] 2. Implement `headline(paper)` with the per-type templates (Bill amount + due clause; Appointment "on {date}"; others "due {date}").
- [x] 3. Implement date formatting (short month + day; append the year when it differs from the current year).
- [x] 4. Implement amount display: single `$` prefix, strip a user-typed leading `$`, no rounding or inference.
- [x] 5. Show "amount not entered" in the headline when a Bill has no amount.
- [x] 6. Implement `actionFor(type)` with the fixed mapping (Bill->Pay, Letter->Reply, School note->Sign and return, Appointment->Show up, Other->No action needed).
- [x] 7. Add the glossary constant (seed terms from plain-english.md) and a case-insensitive matcher over the paper's entered text.
- [x] 8. Render matching glossary terms with their one-sentence explanations on the card.
- [x] 9. Add the paycheck label slot: render the label when provided, else show "Payday not set." and never invent a paycheck.
- [x] 10. Render secondary details (sender, reference) only when entered; omit them when absent.
- [x] 11. Verify the card never invents amounts, dates, or consequences.
- [x] 12. Run the build check (`npm run build`) and fix any errors.
