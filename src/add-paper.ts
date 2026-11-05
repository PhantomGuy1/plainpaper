// Add a Paper — the guided entry form (see .kiro/specs/add-a-paper/design.md).
// The form opens on the type chooser. Title is always shown; the rest of the
// fields appear once a type is chosen. Only a title and a type are required;
// every other field is optional and never blocks saving. Nothing leaves the device.

import { addPaper, type NewPaper, type PaperType } from './storage';

/** The five paper types, shown in this order in the type chooser. */
export const PAPER_TYPES: { value: PaperType; label: string }[] = [
  { value: 'bill', label: 'Bill' },
  { value: 'letter', label: 'Letter' },
  { value: 'school-note', label: 'School note' },
  { value: 'appointment', label: 'Appointment' },
  { value: 'other', label: 'Other' },
];

interface AddPaperViewOptions {
  onSaved: () => void;
  onCancel: () => void;
}

/** Per-type labels for the date and sender fields. */
function labelsFor(type: PaperType): { date: string; sender: string } {
  if (type === 'appointment') {
    return { date: 'Appointment date', sender: 'Who with / where' };
  }
  if (type === 'bill') {
    return { date: 'Due date', sender: 'Who sent it (company)' };
  }
  return { date: 'Due date', sender: 'Who sent it' };
}

/** Build the Add a Paper form view and wire up its behaviour. */
export function renderAddPaper({ onSaved, onCancel }: AddPaperViewOptions): HTMLElement {
  let selectedType: PaperType | null = null;

  const section = document.createElement('section');
  section.className = 'page';

  const heading = document.createElement('h1');
  heading.textContent = 'Add a paper';
  section.appendChild(heading);

  const form = document.createElement('form');
  form.className = 'add-paper';
  form.noValidate = true; // we manage Save enablement ourselves
  section.appendChild(form);

  // --- Type chooser ---
  const chooser = document.createElement('fieldset');
  chooser.className = 'type-chooser';
  const legend = document.createElement('legend');
  legend.textContent = 'What is it?';
  chooser.appendChild(legend);

  const typeRow = document.createElement('div');
  typeRow.className = 'type-row';
  const typeButtons: HTMLButtonElement[] = [];
  for (const t of PAPER_TYPES) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = t.label;
    btn.dataset.type = t.value;
    btn.addEventListener('click', () => selectType(t.value));
    typeButtons.push(btn);
    typeRow.appendChild(btn);
  }
  chooser.appendChild(typeRow);
  form.appendChild(chooser);

  // --- Title (always shown, required) ---
  const titleLabel = document.createElement('label');
  titleLabel.htmlFor = 'pp-title';
  titleLabel.textContent = 'Title';
  const titleInput = document.createElement('input');
  titleInput.id = 'pp-title';
  titleInput.type = 'text';
  titleInput.autocomplete = 'off';
  titleInput.setAttribute('aria-required', 'true');
  form.appendChild(titleLabel);
  form.appendChild(titleInput);

  // --- Type-specific fields (revealed once a type is chosen) ---
  const fields = document.createElement('div');
  fields.className = 'type-fields';
  fields.hidden = true;

  // Amount — Bill only
  const amountLabel = document.createElement('label');
  amountLabel.htmlFor = 'pp-amount';
  amountLabel.textContent = 'Amount';
  const amountInput = document.createElement('input');
  amountInput.id = 'pp-amount';
  amountInput.type = 'text';
  amountInput.autocomplete = 'off';
  amountInput.inputMode = 'decimal';
  const amountGroup = document.createElement('div');
  amountGroup.className = 'field';
  amountGroup.appendChild(amountLabel);
  amountGroup.appendChild(amountInput);
  amountGroup.hidden = true; // shown only for Bill
  fields.appendChild(amountGroup);

  // Due / appointment date — all types
  const dateLabel = document.createElement('label');
  dateLabel.htmlFor = 'pp-date';
  dateLabel.textContent = 'Due date';
  const dateInput = document.createElement('input');
  dateInput.id = 'pp-date';
  dateInput.type = 'date';
  const dateGroup = document.createElement('div');
  dateGroup.className = 'field';
  dateGroup.appendChild(dateLabel);
  dateGroup.appendChild(dateInput);
  fields.appendChild(dateGroup);

  // Who sent it / company / who with — all types
  const senderLabel = document.createElement('label');
  senderLabel.htmlFor = 'pp-sender';
  senderLabel.textContent = 'Who sent it';
  const senderInput = document.createElement('input');
  senderInput.id = 'pp-sender';
  senderInput.type = 'text';
  senderInput.autocomplete = 'off';
  const senderGroup = document.createElement('div');
  senderGroup.className = 'field';
  senderGroup.appendChild(senderLabel);
  senderGroup.appendChild(senderInput);
  fields.appendChild(senderGroup);

  // Reference / phone — all types
  const refLabel = document.createElement('label');
  refLabel.htmlFor = 'pp-ref';
  refLabel.textContent = 'Reference / phone';
  const refInput = document.createElement('input');
  refInput.id = 'pp-ref';
  refInput.type = 'text';
  refInput.autocomplete = 'off';
  const refGroup = document.createElement('div');
  refGroup.className = 'field';
  refGroup.appendChild(refLabel);
  refGroup.appendChild(refInput);
  fields.appendChild(refGroup);

  form.appendChild(fields);

  // --- Actions ---
  const actions = document.createElement('div');
  actions.className = 'actions';
  const saveBtn = document.createElement('button');
  saveBtn.type = 'submit';
  saveBtn.className = 'primary';
  saveBtn.textContent = 'Save';
  saveBtn.disabled = true;
  const cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.textContent = 'Cancel';
  cancelBtn.addEventListener('click', onCancel);
  actions.appendChild(saveBtn);
  actions.appendChild(cancelBtn);
  form.appendChild(actions);

  // --- Behaviour ---

  function updateSaveState(): void {
    // Save is enabled only when a type is chosen and the title is non-empty.
    // Optional fields never block saving.
    saveBtn.disabled = !(selectedType !== null && titleInput.value.trim() !== '');
  }

  titleInput.addEventListener('input', updateSaveState);

  function selectType(type: PaperType): void {
    selectedType = type;
    for (const b of typeButtons) {
      b.classList.toggle('selected', b.dataset.type === type);
    }
    const labels = labelsFor(type);
    dateLabel.textContent = labels.date;
    senderLabel.textContent = labels.sender;
    amountGroup.hidden = type !== 'bill';
    fields.hidden = false;
    updateSaveState();
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (saveBtn.disabled) return;
    const type = selectedType;
    if (type === null) return;

    const title = titleInput.value.trim();
    if (title === '') return; // Save stays disabled, but guard anyway

    const input: NewPaper = { title, type };

    // Optional details are stored only when the user entered them. Nothing is
    // invented or filled in — unknown stays omitted, shown as "not entered" later.
    if (type === 'bill') {
      const amount = amountInput.value.trim();
      if (amount !== '') input.amount = amount; // stored as typed, including any leading $
    }
    const dueDate = dateInput.value; // native date input yields ISO YYYY-MM-DD or ''
    if (dueDate !== '') input.dueDate = dueDate;
    const sender = senderInput.value.trim();
    if (sender !== '') input.sender = sender;
    const ref = refInput.value.trim();
    if (ref !== '') input.ref = ref;

    addPaper(input);
    onSaved();
  });

  return section;
}
