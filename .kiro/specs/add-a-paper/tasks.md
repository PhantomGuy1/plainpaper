# Add a Paper — Tasks

Implementation checklist. No application code is written in the spec run;
this list drives the build.

- [x] 1. Scaffold the Add a Paper form view in `src/` and wire it into app navigation.
- [x] 2. Render the type chooser with the five types: Bill, Letter, School note, Appointment, Other.
- [x] 3. Reveal the type's fields when a type is chosen; always show the title field.
- [x] 4. Show the amount field only for Bill; show sender, due date, and reference for all types.
- [x] 5. Apply type-appropriate labels (Appointment date vs due date; company / who-with wording).
- [x] 6. Enable Save only when title is non-empty (after trim) and a type is selected; never block on optional fields.
- [x] 7. Implement the storage module: read/write `plainpaper:data` as `{ version: 1, papers: [] }`.
- [x] 8. Initialize an empty versioned store on first run.
- [x] 9. On Save: trim title, assign UUID id and `createdAt`, append, persist, return to the list.
- [x] 10. Add Cancel: discard the in-progress entry and return to the list.
- [x] 11. Verify no network calls occur and nothing leaves the device.
- [x] 12. Run the build check (`npm run build`) and fix any errors.
