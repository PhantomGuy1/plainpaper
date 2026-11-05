import './style.css';
import { ensureStore, loadStore } from './storage';
import { renderAddPaper } from './add-paper';
import { renderDashboard } from './dashboard';
import { renderPaydaySettings } from './payday-settings';
import { renderMorning } from './morning';
import { renderBackupControls } from './backup';

// PlainPaper shell + simple view navigation. Feature views are added spec by
// spec (see /.kiro/specs — no spec, no feature). The home view shows the
// due-first dashboard (four open groups plus a Done list); saving a paper
// returns to this shell.

const app = document.querySelector<HTMLDivElement>('#app');

type View = 'home' | 'add-paper' | 'payday-settings' | 'morning';
let currentView: View = 'home';

function goHome(): void {
  currentView = 'home';
  render();
}

function goToAddPaper(): void {
  currentView = 'add-paper';
  render();
}

function goToPaydaySettings(): void {
  currentView = 'payday-settings';
  render();
}

function goToMorning(): void {
  currentView = 'morning';
  render();
}

function renderHome(): void {
  if (!app) return;
  app.innerHTML = '';

  const main = document.createElement('main');
  main.className = 'page';

  const h1 = document.createElement('h1');
  h1.textContent = 'PlainPaper';

  const tagline = document.createElement('p');
  tagline.className = 'tagline';
  tagline.textContent = 'Your bills and letters, in plain English.';

  // Privacy line — shown exactly, always, on the home screen.
  const privacy = document.createElement('p');
  privacy.className = 'privacy-line';
  privacy.textContent = 'Your papers stay on this device. Nothing is uploaded.';

  const addBtn = document.createElement('button');
  addBtn.className = 'primary';
  addBtn.type = 'button';
  addBtn.textContent = 'Add a paper';
  addBtn.addEventListener('click', goToAddPaper);

  const paydayBtn = document.createElement('button');
  paydayBtn.type = 'button';
  paydayBtn.textContent = 'Set payday days';
  paydayBtn.addEventListener('click', goToPaydaySettings);

  const todayBtn = document.createElement('button');
  todayBtn.type = 'button';
  todayBtn.textContent = "Today's 3";
  todayBtn.addEventListener('click', goToMorning);

  const homeActions = document.createElement('div');
  homeActions.className = 'home-actions';
  homeActions.append(todayBtn, addBtn, paydayBtn);

  main.append(h1, tagline, privacy, homeActions);

  // Saved papers render as the due-first dashboard: four open groups plus a
  // Done list (see src/dashboard.ts). With no papers, show the first-run
  // welcome instead of the per-group empty states.
  const store = loadStore();
  if (store.papers.length > 0) {
    main.appendChild(renderDashboard(render));
  } else {
    main.appendChild(renderFirstRun());
  }

  // Local backup — export and import, all on the device.
  main.appendChild(renderBackupControls({ onImported: render }));

  app.appendChild(main);
}

/** The first-run welcome, shown on the home screen when there are no papers.
 *  Explains the app in plain words and gives a clear way to add the first
 *  paper. The privacy line is shown above it (always on the home screen). */
function renderFirstRun(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'first-run';

  const heading = document.createElement('h2');
  heading.textContent = 'Welcome to PlainPaper';
  section.appendChild(heading);

  const para = document.createElement('p');
  para.textContent =
    'PlainPaper turns your bills, letters, and school notes into plain-English cards. ' +
    'Each card shows what it is, how much, and when it is due. ' +
    'Set your payday days once, and each card also shows which paycheck it comes from.';
  section.appendChild(para);

  const cta = document.createElement('button');
  cta.type = 'button';
  cta.className = 'primary';
  cta.textContent = 'Add your first paper';
  cta.addEventListener('click', goToAddPaper);
  section.appendChild(cta);

  return section;
}

function render(): void {
  if (!app) return;
  app.innerHTML = '';
  if (currentView === 'home') {
    renderHome();
  } else if (currentView === 'add-paper') {
    app.appendChild(renderAddPaper({ onSaved: goHome, onCancel: goHome }));
  } else if (currentView === 'morning') {
    app.appendChild(renderMorning({ onBack: goHome }));
  } else {
    app.appendChild(renderPaydaySettings({ onSaved: goHome, onCancel: goHome }));
  }
}

// Initialize an empty versioned store on first run.
ensureStore();
render();
