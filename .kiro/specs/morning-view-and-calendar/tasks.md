# Morning View and Calendar — Tasks

Implementation checklist. No application code is written in the spec run;
this list drives the build.

- [ ] 1. Scaffold the Morning view and wire it into app navigation.
- [ ] 2. Implement `todaysThree(papers, today)`: top three open items by the dashboard's deterministic sort (no-date items last).
- [ ] 3. Render a short heading and up to three cards (per plain-english-card); show nothing else.
- [ ] 4. Add the empty state "Nothing on the list today." when there are no open items.
- [ ] 5. Add a one-tap "Add to calendar" control to each dated card in the Morning view; hide it for no-due-date items.
- [ ] 6. Implement `icsFor(paper)`: an all-day VEVENT on the due date (DTSTART/DTEND;VALUE=DATE, UID, DTSTAMP, SUMMARY=title, DESCRIPTION=headline + action line).
- [ ] 7. Escape commas, semicolons, backslashes, and newlines in .ics text fields; join lines with CRLF.
- [ ] 8. Implement `downloadIcs(paper)`: Blob (type text/calendar) + programmatic download, filename plainpaper-{title}.ics.
- [ ] 9. Verify the .ics uses only user-entered data and never invents an amount, date, or consequence.
- [ ] 10. Verify no network calls, no calendar account, and no sign-in.
- [ ] 11. Run the build check (`npm run build`) and fix any errors.
