# PlainPaper — Plain-English House Voice

This file is the house voice for **all** user-facing text: headlines,
labels, buttons, empty states, errors, and help text.

> **Inclusion note:** this file must be included for any task that
> touches UI text. If a task changes words a user will read and this
> steering file was not in context, the task was run wrong.

## The rules

- **Short sentences.** One idea per sentence. If a sentence needs a
  comma to survive, consider splitting it.
- **Amounts and dates always go in the headline sentence** — never
  buried in smaller text below it.
  Example: "Water bill: $42.10, due Nov 21."
- **No jargon without an explanation.** Any term a non-technical person
  might not know gets a one-sentence plain-English explanation right
  there with it (see the glossary below).
- **"Not entered" instead of any guess.** If the user did not enter an
  amount, a date, or a detail, the UI says "not entered". Never invent,
  estimate, or fill in a typical value — this is the NEVER-INVENT rule
  from `product.md`, applied to wording.
- Write like you're explaining it to a tired neighbour in the morning,
  one-handed, coffee in the other hand. Then shorten it.

## Action lines — fixed vocabulary

Every card's action line uses exactly one of these. Do not invent new
action wording:

- **Pay**
- **Reply**
- **Sign and return**
- **Show up**
- **No action needed**

## Glossary — seed entries

Each entry: the term as it appears on real papers, then one plain
sentence. Grow this list as new terms appear on real papers; never
remove the one-sentence limit.

- **past due** — The payment date has already passed and the money is
  still owed.
- **minimum due** — The smallest amount you must pay this time to stay
  in good standing; paying only this may leave the rest for later.
- **co-pay** — The fixed amount you pay at the appointment; your
  insurance pays the rest.
- **remittance** — The part of a bill you send back with your payment,
  or the payment itself.
- **due upon receipt** — They want payment as soon as you get the bill,
  not by a later date.
