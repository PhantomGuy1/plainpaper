// Payday Buckets — Payday settings view
// (see .kiro/specs/payday-buckets/design.md).
//
// Two day-of-month inputs (1–31), no default — empty until the user enters
// their own. Save persists the payday pattern to the store; editing updates it
// and re-labels every dated item on the next render. Nothing leaves the device.

import { loadStore, savePaydayPattern } from './storage';

interface PaydaySettingsOptions {
  onSaved: () => void;
  onCancel: () => void;
}

/** Parse an input value into a day-of-month integer 1–31, or null when empty
 *  or invalid. */
function parseDay(value: string): number | null {
  const trimmed = value.trim();
  if (trimmed === '') return null; // no default — empty is allowed and means unset
  const n = Number(trimmed);
  if (!Number.isInteger(n) || n < 1 || n > 31) return null;
  return n;
}

/** Build the Payday settings view and wire up its behaviour. */
export function renderPaydaySettings({
  onSaved,
  onCancel,
}: PaydaySettingsOptions): HTMLElement {
  // Prefill when a pattern already exists, so the user can edit it. There is
  // never a default imposed — empty until the user enters their own.
  const existing = loadStore().paydayPattern;

  const section = document.createElement('section');
  section.className = 'page';

  const heading = document.createElement('h1');
  heading.textContent = 'Your payday days';
  section.appendChild(heading);

  const intro = document.createElement('p');
  intro.className = 'payday-intro';
  intro.textContent =
    'Enter the two days of the month you get paid. Every dated paper will show which paycheck it comes from.';
  section.appendChild(intro);

  const form = document.createElement('form');
  form.className = 'payday-settings';
  form.noValidate = true; // we manage Save enablement ourselves
  section.appendChild(form);

  const prompt = document.createElement('p');
  prompt.className = 'payday-legend';
  prompt.textContent = 'Which two days do you get paid?';
  form.appendChild(prompt);

  const row = document.createElement('div');
  row.className = 'payday-row';

  // First payday
  const firstGroup = document.createElement('div');
  firstGroup.className = 'field';
  const firstLabel = document.createElement('label');
  firstLabel.htmlFor = 'pp-day1';
  firstLabel.textContent = 'First payday';
  const firstInput = document.createElement('input');
  firstInput.id = 'pp-day1';
  firstInput.type = 'number';
  firstInput.min = '1';
  firstInput.max = '31';
  firstInput.placeholder = '1–31';
  firstInput.autocomplete = 'off';
  if (existing) firstInput.value = String(existing.day1);
  firstGroup.append(firstLabel, firstInput);

  // Second payday
  const secondGroup = document.createElement('div');
  secondGroup.className = 'field';
  const secondLabel = document.createElement('label');
  secondLabel.htmlFor = 'pp-day2';
  secondLabel.textContent = 'Second payday';
  const secondInput = document.createElement('input');
  secondInput.id = 'pp-day2';
  secondInput.type = 'number';
  secondInput.min = '1';
  secondInput.max = '31';
  secondInput.placeholder = '1–31';
  secondInput.autocomplete = 'off';
  if (existing) secondInput.value = String(existing.day2);
  secondGroup.append(secondLabel, secondInput);

  row.append(firstGroup, secondGroup);
  form.appendChild(row);

  const hint = document.createElement('p');
  hint.className = 'payday-hint';
  hint.textContent = 'Example: 12 and 30. You set your own days — we never assume.';
  form.appendChild(hint);

  // Actions
  const actions = document.createElement('div');
  actions.className = 'actions';
  const saveBtn = document.createElement('button');
  saveBtn.type = 'submit';
  saveBtn.className = 'primary';
  saveBtn.textContent = 'Save';
  const cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.textContent = 'Cancel';
  cancelBtn.addEventListener('click', onCancel);
  actions.append(saveBtn, cancelBtn);
  form.appendChild(actions);

  // Save is enabled only when both days are valid integers 1–31.
  function updateSaveState(): void {
    saveBtn.disabled = !(
      parseDay(firstInput.value) !== null && parseDay(secondInput.value) !== null
    );
  }
  firstInput.addEventListener('input', updateSaveState);
  secondInput.addEventListener('input', updateSaveState);
  updateSaveState();

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const day1 = parseDay(firstInput.value);
    const day2 = parseDay(secondInput.value);
    if (day1 === null || day2 === null) return; // Save stays disabled, but guard anyway
    savePaydayPattern({ day1, day2 });
    onSaved();
  });

  return section;
}
