# Local Storage and Backup — Tasks

Implementation checklist. No application code is written in the spec run;
this list drives the build.

- [ ] 1. Add the migration hook `migrate(store, target)` with the ordered-step pattern (no steps yet; target 1).
- [ ] 2. Ensure storage reads run incoming stores through `migrate` so old data is always current.
- [ ] 3. Implement Export: serialize the store to JSON, Blob (application/json), download as plainpaper-backup-{date}.json.
- [ ] 4. Implement Import: file input, read as text, JSON.parse, all on device.
- [ ] 5. Validate the imported object has a version (number) and papers (array); else show "This file is not a PlainPaper backup." and change nothing.
- [ ] 6. Before overwriting, show the warning "Importing replaces everything on this device with this backup." and require confirm.
- [ ] 7. On confirm: migrate the imported store, write to localStorage, re-render; on cancel, do nothing.
- [ ] 8. Show the privacy line "Your papers stay on this device. Nothing is uploaded." exactly on the home screen.
- [ ] 9. When the store has no papers, show a plain-words first-run welcome explaining the app (plus the privacy line) and a way to add the first paper.
- [ ] 10. Verify no account, no sign-in, and no network calls anywhere in export, import, or the first-run state.
- [ ] 11. Verify export and import never invent or add values the user did not enter.
- [ ] 12. Run the build check (`npm run build`) and fix any errors.
