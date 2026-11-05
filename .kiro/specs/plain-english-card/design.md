# Plain-English Card — Design

## Components

- **Card** — renders a single `Paper` as a card.
- **headline(paper)** — pure function building the one-sentence headline
  from entered data only.
- **actionFor(type)** — pure function mapping a type to one fixed action line.
- **glossary(paper)** — scans the paper's entered text for glossary terms and
  returns matching one-sentence explanations.
- **Paycheck label slot** — renders the label string from payday-buckets,
  or the empty state.

## Data

- Consumes the `Paper` shape from add-a-paper. Adds no stored fields.
- **Glossary** — a constant map of term to one-sentence explanation, seeded
  from `.kiro/steering/plain-english.md`:

  - **past due** — The payment date has already passed and the money is
    still owed.
  - **minimum due** — The smallest amount you must pay this time to stay in
    good standing; paying only this may leave the rest for later.
  - **co-pay** — The fixed amount you pay at the appointment; your insurance
    pays the rest.
  - **remittance** — The part of a bill you send back with your payment, or
    the payment itself.
  - **due upon receipt** — They want payment as soon as you get the bill,
    not by a later date.

  The list may grow; it never drops the one-sentence limit.
- **Computed (not stored):** headline string, action string, glossary
  matches, paycheck label.

## Behaviour

### Headline

One sentence starting with the title. Clauses are added only from entered
data:

- **Bill:**
  - amount entered -> `"{title}: ${amount}, ..."`
  - amount missing -> `"{title}: amount not entered, ..."`
- **Date clause** (added only when a due date is entered):
  - Bill, Letter, School note, Other -> `", due {date}."`
  - Appointment -> `" on {date}."` (no leading comma; appointments have no
    amount clause)
- **No due date** -> the headline ends after the title (and the amount
  clause for Bill) with a period. No date is invented.

Examples:
- `Water bill: $42.10, due Nov 21.`
- `Water bill: amount not entered, due Nov 21.`
- `Water bill: $42.10.`
- `Dental appointment on Nov 21.`
- `Parking permit letter, due Nov 30.`
- `School field trip.`

### Date formatting

`{date}` is the due date shown as short month + day, e.g. `Nov 21`. If the
date's year differs from the current year, append the year:
`Nov 21, 2027`.

### Amount display

For Bill, show a single `$` prefix; strip a leading `$` the user may have
typed so it never doubles. The amount is otherwise shown exactly as entered
— no rounding, no inference.

### Action line

Fixed mapping, deterministic — no scoring or prioritisation:

| Type         | Action line        |
|--------------|--------------------|
| Bill         | Pay                |
| Letter       | Reply              |
| School note  | Sign and return    |
| Appointment  | Show up            |
| Other        | No action needed   |

This is the default action for the type the user chose; it labels the
category, it does not invent a fact. A future spec may let the user override
it; until then the mapping is fixed and visible.

### Glossary

Scan the paper's entered text (title, sender, ref) case-insensitively for
the glossary terms. For each match, show the term and its one-sentence
explanation as a small glossary line on the card. Only the seed terms above
are matched in this spec; no jargon is invented.

### Paycheck label slot

The slot renders the paycheck label string for the item when payday-buckets
provides one. While payday-buckets is not implemented or the payday pattern
is not set, the slot shows `Payday not set.` and never invents a paycheck.
The label itself is computed by the payday-buckets feature from the payday
pattern and the paper's due date; this spec only renders it.

### What is not shown

Secondary details (sender, reference) appear only when entered; when absent
they are omitted, not labelled as "not entered", to keep the card short. The
headline carries the "not entered" honesty for the one key fact most likely
to be guessed elsewhere: a Bill's amount.
