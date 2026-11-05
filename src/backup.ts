// PlainPaper — Local backup (export/import), all on the device
// (see .kiro/specs/local-storage-and-backup/design.md).
//
// One tap exports a JSON backup of the whole versioned store. One tap picks a
// file to import; it is read and parsed on the device, validated, and — only
// after a plain-English confirm — written over the current store. No account,
// no sign-in, no network calls anywhere. Export and import never invent or
// add any value the user did not enter: the backup is the store exactly as
// stored, and the import is the parsed file exactly (run through migrate, which
// only copies — it adds nothing).

import {
  loadStore,
  saveStore,
  migrate,
  isValidStore,
  CURRENT_VERSION,
  type PlainPaperStore,
} from './storage';
import { todayISO } from './dashboard';

interface BackupControlsOptions {
  /** Called after a successful import so the app re-renders with the new
   *  store. */
  onImported: () => void;
}

/** Serialize the store to JSON and download it as a backup file. One tap, no
 *  network. The file is the store object exactly as stored — nothing invented
 *  or added. Filename: plainpaper-backup-{YYYY-MM-DD}.json. */
export function exportBackup(): void {
  const store = loadStore();
  const json = JSON.stringify(store);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `plainpaper-backup-${todayISO()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Read a File as text. Resolves with the file's text content. All on device. */
function readText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

/** Render the Backup controls section: Export, Import, the hidden file input,
 *  and a message area that shows the import error or the overwrite warning
 *  with confirm/cancel. Import is read, parsed, validated, and (on confirm)
 *  migrated and written entirely on the device. */
export function renderBackupControls({
  onImported,
}: BackupControlsOptions): HTMLElement {
  const section = document.createElement('section');
  section.className = 'backup';

  const heading = document.createElement('h2');
  heading.textContent = 'Backup';
  section.appendChild(heading);

  // State for the in-progress import, held in the closure. When non-null it
  // holds a validated store awaiting the user's confirm before overwriting.
  let pending: PlainPaperStore | null = null;

  // Controls row: Export + Import buttons.
  const controls = document.createElement('div');
  controls.className = 'backup-controls';

  const exportBtn = document.createElement('button');
  exportBtn.type = 'button';
  exportBtn.textContent = 'Export backup';
  exportBtn.addEventListener('click', exportBackup);

  const importBtn = document.createElement('button');
  importBtn.type = 'button';
  importBtn.textContent = 'Import backup';

  // Hidden file input — triggered by the Import button. Hidden via the
  // `hidden` attribute (kept accessible) rather than display:none.
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'application/json,.json';
  fileInput.hidden = true;
  fileInput.addEventListener('change', () => {
    const files = fileInput.files;
    const file = files && files.length > 0 ? files[0] : null;
    // Reset so picking the same file again still fires change.
    fileInput.value = '';
    if (!file) return;
    void handleFile(file);
  });

  importBtn.addEventListener('click', () => fileInput.click());

  controls.append(exportBtn, importBtn);
  section.append(controls, fileInput);

  // Message area: shows the import error, or the overwrite warning with
  // confirm/cancel. Re-rendered by renderMessage / showError.
  const message = document.createElement('div');
  message.className = 'backup-message';
  section.appendChild(message);

  function renderMessage(): void {
    message.innerHTML = '';
    if (pending === null) return;
    // A valid store is awaiting confirmation -> show the overwrite warning.
    const warn = document.createElement('p');
    warn.className = 'backup-warn';
    warn.textContent =
      'Importing replaces everything on this device with this backup.';
    message.appendChild(warn);

    const actions = document.createElement('div');
    actions.className = 'backup-confirm-actions';

    const confirmBtn = document.createElement('button');
    confirmBtn.type = 'button';
    confirmBtn.className = 'primary';
    confirmBtn.textContent = 'Replace and import';
    confirmBtn.addEventListener('click', () => {
      const store = pending;
      pending = null;
      if (store) {
        // Migrate the imported store to the current shape, then overwrite.
        // migrate only copies — it never invents or adds a value.
        saveStore(migrate(store, CURRENT_VERSION));
      }
      onImported(); // re-render the app with the new store
    });

    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.addEventListener('click', () => {
      pending = null; // cancel: nothing is changed
      renderMessage();
    });

    actions.append(confirmBtn, cancelBtn);
    message.appendChild(actions);
  }

  function showError(text: string): void {
    message.innerHTML = '';
    const error = document.createElement('p');
    error.className = 'backup-error';
    error.textContent = text;
    message.appendChild(error);
  }

  /** Read, parse, and validate the chosen file. On a valid store, hold it and
   *  show the overwrite warning. On anything else, show the plain-English
   *  error and change nothing. All on the device — no upload. */
  async function handleFile(file: File): Promise<void> {
    let parsed: unknown;
    try {
      const text = await readText(file);
      parsed = JSON.parse(text);
    } catch {
      // Not valid JSON -> not a PlainPaper backup. Nothing is overwritten.
      showError('This file is not a PlainPaper backup.');
      return;
    }
    if (!isValidStore(parsed)) {
      showError('This file is not a PlainPaper backup.');
      return;
    }
    // Valid store -> hold it and show the overwrite warning.
    pending = parsed as PlainPaperStore;
    renderMessage();
  }

  return section;
}
