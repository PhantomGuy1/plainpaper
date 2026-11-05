# Payday Buckets — Requirements

## Introduction

Payday Buckets is the hero feature of PlainPaper. The user sets their
payday pattern once — two days of the month they get paid (for example, the
12th and the 30th). It is a pattern the user types in, never a bank
connection. Every dated open item is then labelled with the paycheck it
should come from, for example "From the Nov 12 paycheck." An item due before
the user's next payday is flagged in plain words: "Due before your next
payday." The label fills the paycheck slot the plain-english-card spec
reserves, so it appears on the dashboard too. Changing the pattern re-labels
every dated item. With no pattern set, cards show "Payday not set." and
nothing is guessed.

## User stories

- As a single-income householder paid twice a month, I want each dated bill
  labelled with which paycheck it comes from, so I know which pay covers it.
- As a busy parent, I want items due before my next payday flagged, so I know
  what can't wait for the next check.
- As a non-technical user, I want to set my payday pattern once, so I don't
  answer the same question for every paper.
- As a private user, I want my payday pattern stored only on my device, so
  nothing about my income is uploaded.

## Acceptance criteria

1. The system shall provide a payday pattern setting of two days of the
   month, set once by the user and editable later.
2. The system shall impose no default payday pattern; the 12th and 30th are
   an example only.
3. When a payday pattern is set and a paper has a due date, the system shall
   label the paper "From the {Month} {day} paycheck."
4. The paycheck in the label shall be the most recent payday on or before the
   paper's due date.
5. When a payday pattern is set and a paper's due date is before the user's
   next payday, the system shall flag the paper "Due before your next payday."
6. The next payday shall be the first payday strictly after today.
7. When no payday pattern is set, the system shall show "Payday not set." and
   shall not invent a paycheck.
8. When a payday pattern is set but a paper has no due date, the system shall
   show "No due date, so no paycheck." and shall not invent a paycheck.
9. The system shall compute the paycheck label and flag on each render and
   shall not store them, so changing the pattern re-labels every dated item.
10. The paycheck label and flag shall appear on the dashboard through the
    plain-english-card rendering.
11. The system shall store the payday pattern only in the browser localStorage
    and shall not transmit it to any network endpoint.
12. The system shall not infer or invent any amount, date, or consequence the
    user did not enter.
