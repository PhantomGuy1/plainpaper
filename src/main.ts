import './style.css';

// PlainPaper shell. Feature views are added spec by spec
// (see /.kiro/specs — no spec, no feature).
const app = document.querySelector<HTMLDivElement>('#app');

if (app) {
  app.innerHTML = `
    <main class="page">
      <h1>PlainPaper</h1>
      <p class="tagline">Your bills and letters, in plain English.</p>
      <p>Nothing you type here leaves this device.</p>
    </main>
  `;
}
