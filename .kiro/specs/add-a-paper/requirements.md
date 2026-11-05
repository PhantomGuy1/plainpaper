# Add a Paper — Requirements

## Introduction

Add a Paper is the guided entry form for PlainPaper. The user picks a type
(Bill, Letter, School note, Appointment, Other), then answers only the
questions that type needs: who sent it, how much (if any), when it is due,
and a phone number or reference if present. Only a title and a type are
required. Every other field is optional, and the form never blocks saving
because an optional detail is missing. Everything the user enters stays on
the device.

This spec owns the base `Paper` data shape and the versioned localStorage
store that every other feature reads from.

## User stories

- As a busy parent, I want to add a bill in a few taps with just a title and
  a type, so I can get it into the list and move on.
- As a single-income householder, I want the form to ask only the questions
  my type needs, so I don't fill out pointless fields.
- As a non-technical user, I want saving to never be blocked by a missing
  optional detail, so I don't get stuck on a form.
- As a private user, I want my entry stored only on my device, so nothing
  I type is uploaded anywhere.

## Acceptance criteria

1. When the user opens Add a Paper, the system shall show a type chooser
   with exactly five options: Bill, Letter, School note, Appointment, Other.
2. When the user selects a type, the system shall reveal only the fields
   that type uses, with the title field always present.
3. The system shall show the amount field only when the type is Bill.
4. The system shall enable Save only when the title is non-empty (after
   trimming) and a type is selected.
5. If an optional field is empty, the system shall allow saving and shall
   not block, warn, or require it.
6. When the user saves, the system shall assign a stable unique id and a
   `createdAt` timestamp, append the paper to the versioned store in
   localStorage, and return to the list.
7. While the Appointment type is selected, the system shall label the date
   field as the appointment date rather than "due date".
8. If the stored object does not exist, the system shall create it with
   version 1 and an empty papers array before saving.
9. The system shall store entries only in the browser localStorage and
   shall not transmit any entry to any network endpoint.
10. The system shall not infer, estimate, or add any value the user did not
    enter.
