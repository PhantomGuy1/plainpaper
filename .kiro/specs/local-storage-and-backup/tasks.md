# Local Storage and Backup — Tasks

Implementation checklist. No application code is written in the spec run;
this list drives the build.

- [x] 1. Add the migration hook `migrate(store, target)` with the ordered-step pattern (no steps yet; target 1).
- [x] 2. Ensure storage reads run incoming stores through `migrate` so old data is always current.
- [x] 3. Implement Export: serialize the store to JSON, Blob (application/json), download as plainpaper-backup-{date}.json.
- [x] 4. Implement Import: file input, read as text, JSON.parse, all on device.
- [x] 5. Validate the imported object has a version (number) and papers (array); else show "This file is not a PlainPaper backup." and change nothing.
- [x] 6. Before overwriting, show the warning "Importing replaces everything on this device with this backup." and require confirm.
- [x] 7. On confirm: migrate the imported store, write to localStorage, re-render; on cancel, do nothing.
- [x] 8. Show the privacy line "Your papers stay on this device. Nothing is uploaded." exactly on the home screen.
- [x] 9. When the store has no papers, show a plain-words first-run welcome explaining the app (plus the privacy line) and a way to add the first paper.
- [x] 10. Verify no account, no sign-in, and no network calls anywhere in export, import, or the first-run state.
- [x] 11. Verify export and import never invent or add values the user did not enter.
- [x] 12. Run the build check (`npm run build`) and fix any errors.
