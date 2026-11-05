# Morning View and Calendar — Design

## Components

- **MorningView** — the view: a short heading plus Today's 3 cards.
- **todaysThree(papers, today)** — the top 3 open items by the dashboard's
  deterministic sort.
- **icsFor(paper)** — builds RFC 5545 .ics content for a dated paper.
- **downloadIcs(paper)** — wraps the .ics string in a Blob and triggers a
  file download.

## Data

- Consumes the `Paper` shape from add-a-paper. Adds no stored fields.
- Computed (not stored): the Today's 3 list and the .ics string.

## Behaviour

### Today's 3

Open items only (`done !== true`), sorted by the due-first-dashboard
deterministic sort (due date ascending, then `createdAt` ascending; no-date
items last by `createdAt`). Take the first three. No-date items appear only
when fewer than three dated open items exist. Fewer than three -> show what
is there. None -> show `"Nothing on the list today."` Nothing else is shown.

### Calendar download

Each dated card in the Morning view has a one-tap "Add to calendar" control.
No-due-date items do not show the control — there is no date for the event.

### .ics content (RFC 5545)

An all-day event on the due date:

- `PRODID` : `-//PlainPaper//EN`
- `VERSION` : `2.0`
- `UID` : `{paper.id}@plainpaper`
- `DTSTAMP` : current UTC time, `YYYYMMDDTHHMMSSZ`
- `DTSTART;VALUE=DATE` : the due date as `YYYYMMDD`
- `DTEND;VALUE=DATE` : the day after the due date (all-day events use an
  exclusive end)
- `SUMMARY` : the paper title
- `DESCRIPTION` : the plain-English headline followed by the action line

All fields are built only from data the user entered (the action line is the
fixed per-type label, not an invented fact). Lines are joined with CRLF.
Commas, semicolons, backslashes, and newlines in text fields are escaped per
RFC 5545.

### Download

Build the .ics string, create a `Blob` with type `text/calendar`, and trigger
a download with filename `plainpaper-{title}.ics` (title trimmed and
sanitized for a filename). All client-side; no network calls, no calendar
account, no sign-in.
