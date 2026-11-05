# Add a Paper — Tasks

Implementation checklist. No application code is written in the spec run;
this list drives the build.

- [ ] 1. Scaffold the Add a Paper form view in `src/` and wire it into app navigation.
- [ ] 2. Render the type chooser with the five types: Bill, Letter, School note, Appointment, Other.
- [ ] 3. Reveal the type's fields when a type is chosen; always show the title field.
- [ ] 4. Show the amount field only for Bill; show sender, due date, and reference for all types.
- [ ] 5. Apply type-appropriate labels (Appointment date vs due date; company / who-with wording).
- [ ] 6. Enable Save only when title is non-empty (after trim) and a type is selected; never block on optional fields.
- [ ] 7. Implement the storage module: read/write `plainpaper:data` as `{ version: 1, papers: [] }`.
- [ ] 8. Initialize an empty versioned store on first run.
- [ ] 9. On Save: trim title, assign UUID id and `createdAt`, append, persist, return to the list.
- [ ] 10. Add Cancel: discard the in-progress entry and return to the list.
- [ ] 11. Verify no network calls occur and nothing leaves the device.
- [ ] 12. Run the build check (`npm run build`) and fix any errors.
