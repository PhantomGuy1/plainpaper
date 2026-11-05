# Morning View and Calendar — Requirements

## Introduction

The Morning view is the start of the day in PlainPaper. It shows only
Today's 3 — the top three open items by the same deterministic sort as the
dashboard — and nothing else competing for attention. Any dated item shown
can be downloaded as a standard .ics calendar file with one tap, generated
entirely on the device as a Blob download. No calendar account, no sign-in,
no integration.

## User stories

- As a tired parent in the morning, I want to see only my top three items, so
  I know what matters today without a wall of cards.
- As a non-technical user, I want a one-tap way to put a due date on my phone
  calendar, so I don't retype it.
- As a private user, I want the calendar file made on my device, so nothing
  about my bills is sent to a calendar service.

## Acceptance criteria

1. The system shall provide a Morning view that shows at most three open
   items and no other papers.
2. The system shall select the top three open items using the same
   deterministic sort as the due-first-dashboard (due date ascending, then
   entry order; no-date items last).
3. When fewer than three open items exist, the system shall show only those
   that exist.
4. When no open items exist, the system shall show a short plain line saying
   so.
5. The system shall render each item in the Morning view as a card per the
   plain-english-card spec.
6. The system shall offer a one-tap calendar download for each dated item
   shown in the Morning view.
7. The system shall not offer a calendar download for an item with no due
   date.
8. When the user taps the calendar download, the system shall generate a
   standard .ics file on the device and download it as a Blob, without a
   calendar account or sign-in.
9. The .ics event shall use only the item's user-entered data and shall not
   include any amount, date, or consequence the user did not enter.
10. The system shall make no network calls in generating or downloading the
    .ics file.
