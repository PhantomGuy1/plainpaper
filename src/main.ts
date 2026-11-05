import './style.css';
import { ensureStore, loadStore } from './storage';
import { renderAddPaper } from './add-paper';
import { renderCard } from './card';

// PlainPaper shell + simple view navigation. Feature views are added spec by
// spec (see /.kiro/specs — no spec, no feature). Saving a paper returns to
// this shell; the due-first-dashboard spec will add the list view later.

const app = document.querySelector<HTMLDivElement>('#app');

type View = 'home' | 'add-paper';
let currentView: View = 'home';

function goHome(): void {
  currentView = 'home';
  render();
}

function goToAddPaper(): void {
  currentView = 'add-paper';
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

  const privacy = document.createElement('p');
  privacy.textContent = 'Nothing you type here leaves this device.';

  const addBtn = document.createElement('button');
  addBtn.className = 'primary';
  addBtn.type = 'button';
  addBtn.textContent = 'Add a paper';
  addBtn.addEventListener('click', goToAddPaper);

  main.append(h1, tagline, privacy, addBtn);

  // Saved papers render as plain-English cards.
  const store = loadStore();
  if (store.papers.length > 0) {
    const heading = document.createElement('h2');
    heading.textContent = 'Your papers';

    const list = document.createElement('section');
    list.className = 'card-list';
    // Stable display order: entry order (createdAt ascending) for now.
    // The due-first-dashboard spec will add grouping later.
    const sorted = [...store.papers].sort((a, b) => a.createdAt - b.createdAt);
    for (const paper of sorted) {
      // payday-buckets is not implemented yet, so the slot shows
      // "Payday not set." and never invents a paycheck.
      list.appendChild(renderCard(paper));
    }
    main.append(heading, list);
  }

  app.appendChild(main);
}

function render(): void {
  if (!app) return;
  app.innerHTML = '';
  if (currentView === 'home') {
    renderHome();
  } else {
    app.appendChild(renderAddPaper({ onSaved: goHome, onCancel: goHome }));
  }
}

// Initialize an empty versioned store on first run.
ensureStore();
render();
