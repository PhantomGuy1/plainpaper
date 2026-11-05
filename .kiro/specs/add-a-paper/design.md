# Add a Paper — Design

## Components

- **AddPaperForm** — the form view. A type chooser followed by the fields the
  chosen type uses, plus Save and Cancel.
- **storage** — reads and writes the versioned PlainPaper store in
  localStorage. Owns the store's shape and the migration hook for version 1.
- **paperTypes** — the five types and the per-type field configuration the
  form renders.

## Data

### Paper (base shape, owned by this spec)

```ts
type PaperType = 'bill' | 'letter' | 'school-note' | 'appointment' | 'other';

interface Paper {
  id: string;        // stable unique id, assigned on save
  title: string;     // required, trimmed, non-empty
  type: PaperType;   // required
  sender?: string;   // who sent it (optional)
  amount?: string;   // how much, Bill only, stored as typed (optional)
  dueDate?: string;  // ISO YYYY-MM-DD from a date input (optional)
  ref?: string;      // phone number or reference (optional)
  createdAt: number; // ms timestamp; entry order for deterministic sort
}
```

The `done` and `doneAt` fields are added by the due-first-dashboard spec.
This spec creates papers without them.

### Store (localStorage key `plainpaper:data`)

```ts
interface PlainPaperStore {
  version: 1;
  papers: Paper[];
}
```

One versioned object carrying the array, so future shape changes can migrate
old data instead of breaking it.

## Behaviour

- The form opens on the type chooser. Title is always shown; the other
  fields appear once a type is chosen.
- Field visibility by type:

  | Field           | Bill | Letter | School note | Appointment | Other |
  |-----------------|:----:|:------:|:-----------:|:-----------:|:-----:|
  | Title           |  ✓   |   ✓    |     ✓       |      ✓      |   ✓   |
  | Amount          |  ✓   |   —    |     —       |      —      |   —   |
  | Due date        |  ✓   |   ✓    |     ✓       |      ✓      |   ✓   |
  | Who sent it     |  ✓   |   ✓    |     ✓       |      ✓      |   ✓   |
  | Reference/phone |  ✓   |   ✓    |     ✓       |      ✓      |   ✓   |

- The amount field is shown only for Bill. Every other field is available to
  all types and is optional.
- Labels adapt to the type: for Appointment the date field reads "Appointment
  date" and the sender field reads "Who with / where"; for Bill the sender
  reads "Who sent it (company)"; otherwise "Who sent it".
- Save is enabled iff the title is non-empty after trimming and a type is
  selected. Optional fields never block saving and never warn.
- On Save:
  1. trim the title;
  2. assign `id` (UUID) and `createdAt` (`Date.now()`);
  3. append the paper to `papers`;
  4. persist the store to localStorage;
  5. return to the list.
- If the store does not exist on first save, create
  `{ version: 1, papers: [] }` first.
- Cancel discards the in-progress entry and returns to the list.
- The date input is a native date picker (yields ISO `YYYY-MM-DD`); the
  amount input is plain text. No network calls. No formatting or inference of
  amount or date — values are stored exactly as the user entered them.
