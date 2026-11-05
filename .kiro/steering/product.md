# PlainPaper — Product Steering

## What this is

PlainPaper is a free, private, no-account single-page web app that turns
household bills, letters, and school notes into plain-English cards — and
labels each one with **which paycheck** it comes from.

Entrant: Jonathan Ream (non-developer) directing an AI-agent Kiro CLI build
for Kiroween 2026.

Home screen line, shown exactly like this:

> Your papers stay on this device. Nothing is uploaded.

## Who it's for

Everyday people first — not power users, not businesses.

- Busy parents juggling bills, letters, and school notes
- Single-income households paid twice a month
- Anyone who has ever opened a bill and thought: *how much, by when, and can
  this wait until payday?*

The reference payday pattern used throughout this project is the 12th and
the 30th of the month. That is an example, not a default imposed on anyone —
each user sets their own pattern once.

## The Simplicity Gate

Every screen, feature, and line of text must pass the ten-second test:

> **Could a tired, non-technical person understand this in ten seconds,
> one-handed, in the morning?**

If the answer is no, simplify it until the answer is yes — or cut it.
No feature is exempt. No "they'll figure it out."

## The plain-English law

- All user-facing text follows `.kiro/steering/plain-english.md`.
- One headline sentence per paper, built only from what the user entered.
  Example: "Water bill: $42.10, due Nov 21."
- Amounts and dates belong in the headline, not buried below it.
- Jargon is allowed only with a one-sentence plain-English explanation
  right there with it.

## The NEVER-INVENT rule

**Never invent an amount, a date, or a consequence the user did not enter.**

- If a field was not entered, it shows as **"not entered"** — never a guess,
  never a typical value, never a helpful estimate.
- No inferred late fees, no assumed due dates, no predicted consequences.
- Generated text (headlines, action lines, labels) may use only data the
  user actually typed in.

This rule overrides convenience, completeness, and good intentions.

## The privacy law

- Everything is local. Nothing is uploaded. There is no server side to
  PlainPaper.
- No accounts, no sign-in, no tracking, no analytics.
- Papers live in the browser's localStorage on the user's own device.
- The user's only backup is the JSON export they choose to download —
  and importing that file is also entirely local.

If a proposed feature needs a server, an account, or an upload, it is not
a PlainPaper feature.

## Hero feature: Payday Buckets

**Lead with payday: always ask which paycheck an item hits.**

Knowing a bill is "due Nov 21" is only half the answer. The question a
twice-a-month household actually asks is: *which paycheck does this come
out of?*

- The user sets their payday pattern once (for example, the 12th and
  the 30th).
- Every dated item is labelled from that pattern:
  "From the Nov 12 paycheck."
- Any item due before the next payday is flagged plainly:
  "Due before your next payday."
- When in doubt about where a feature belongs in the layout or the copy,
  the payday label wins prominence over secondary details.

## Core features (brief)

1. **Add a Paper** — A guided form. Types: Bill / Letter / School note /
   Appointment / Other. Only title and type are required; everything else
   is optional.
2. **Plain-English Card** — One headline sentence from entered data only
   (e.g. "Water bill: $42.10, due Nov 21."), one action line from the fixed
   vocabulary (Pay / Reply / Sign and return / Show up / No action needed),
   plus a plain-English glossary for any jargon on the paper.
3. **Due-first Dashboard** — Papers grouped as Overdue / Due this week /
   Due later / No date — no action. Sort is deterministic: due date first,
   then entry order. One tap marks an item Done.
4. **Payday Buckets** — The hero feature above: payday pattern set once,
   every dated item labelled with its paycheck, pre-payday items flagged.
5. **Today's 3** — A morning view showing today's top three items, plus a
   one-tap `.ics` calendar download for dated items.
6. **Local backup** — Local-only storage (localStorage) with JSON
   export/import so users can back up and restore their own papers.

## Out of scope — never build, never promise

- OCR or photo scanning of papers
- Bank, email, or calendar account connections
- Payments of any kind (PlainPaper never moves money)
- AI chat
- Accounts or sign-in
- Notification servers or push notifications
- Property-based testing or correctness claims — that tooling is IDE-only
  and is not available to CLI builds, so it is not part of this project
