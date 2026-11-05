# Plain-English Card — Requirements

## Introduction

Every saved paper renders as one card. The card has exactly one headline
sentence built only from data the user entered (example: "Water bill: $42.10,
due Nov 21."), one action line from the fixed vocabulary, a paycheck label
slot populated by the payday-buckets feature, and a plain-English glossary
for common paper words. Missing data shows as "not entered", never a guess.

## User stories

- As a tired parent, I want one sentence that tells me what, how much, and
  when, so I can understand a paper in ten seconds.
- As a non-technical user, I want paper jargon explained in one plain
  sentence right on the card, so I don't have to look it up.
- As a private user, I want the card to show only what I entered, so nothing
  is made up.

## Acceptance criteria

1. The system shall render each paper as a card with exactly one headline
   sentence, one action line, one paycheck label slot, and a glossary area.
2. The system shall build the headline only from data the user entered; it
   shall never invent an amount, a date, or a consequence.
3. When a Bill has an amount, the headline shall include it as "$" followed
   by the amount; when a Bill has no amount, the headline shall say "amount
   not entered".
4. When a paper has a due date, the headline shall include it as
   "due {date}" for Bill, Letter, School note, and Other, and as
   "on {date}" for Appointment.
5. When a paper has no due date, the headline shall not show a due clause
   and shall not invent a date.
6. The action line shall be exactly one of: Pay, Reply, Sign and return,
   Show up, No action needed.
7. The action line shall be derived from the paper type by a fixed mapping:
   Bill to Pay, Letter to Reply, School note to Sign and return,
   Appointment to Show up, Other to No action needed.
8. When a glossary term appears in the paper's entered text, the system
   shall show that term's one-sentence plain-English explanation on the card.
9. The paycheck label slot shall display the label provided by the
   payday-buckets feature; while no label is available, it shall show
   "Payday not set." and shall not invent a paycheck.
10. The system shall not display any value the user did not enter; absent
    optional details shall be omitted, not fabricated.
