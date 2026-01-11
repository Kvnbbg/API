export function renderLandingPage(payload) {
  const { name, version, status, sections } = payload;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#0b0f1a" />
    <title>${name}</title>
    <style>
      :root {
        color-scheme: dark;
        --bg: #0b0f1a;
        --panel: rgba(17, 24, 39, 0.9);
        --accent: #7c5cff;
        --accent-2: #22d3ee;
        --text: #e5e7eb;
        --muted: #9ca3af;
        --success: #10b981;
        font-family: "Inter", "Segoe UI", system-ui, sans-serif;
      }

      * {
        box-sizing: border-box;
      }

      html,
      body {
        background-color: var(--bg);
      }

      body {
        margin: 0;
        background: radial-gradient(circle at 20% 20%, #1f2a44, var(--bg));
        color: var(--text);
        min-height: 100vh;
        overflow-x: hidden;
      }

      .glow {
        position: absolute;
        inset: -200px;
        background: conic-gradient(from 90deg, rgba(124, 92, 255, 0.3), rgba(34, 211, 238, 0.15), transparent 60%);
        filter: blur(120px);
        animation: orbit 18s linear infinite;
        opacity: 0.65;
        pointer-events: none;
      }

      .grid::before {
        content: "";
        position: absolute;
        inset: -120px 0 auto;
        height: 220px;
        background: radial-gradient(circle, rgba(124, 92, 255, 0.25), transparent 70%);
        filter: blur(40px);
        opacity: 0.6;
        animation: float 10s ease-in-out infinite;
        pointer-events: none;
      }

      @keyframes orbit {
        to {
          transform: rotate(1turn);
        }
      }

      header {
        position: relative;
        padding: 56px 10vw 24px;
        z-index: 1;
      }

      .badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 6px 14px;
        border-radius: 999px;
        background: rgba(124, 92, 255, 0.2);
        color: var(--accent-2);
        font-size: 0.85rem;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }

      h1 {
        margin: 16px 0 8px;
        font-size: clamp(2rem, 4vw, 3.25rem);
      }

      p.lead {
        margin: 0;
        color: var(--muted);
        max-width: 640px;
        font-size: 1.05rem;
      }

      main {
        padding: 24px 10vw 64px;
        position: relative;
        z-index: 1;
      }

      .toolbar {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 24px;
      }

      .status-pill {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 6px 12px;
        background: rgba(16, 185, 129, 0.15);
        color: var(--success);
        border-radius: 999px;
        font-size: 0.85rem;
      }

      .status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--success);
        box-shadow: 0 0 12px rgba(16, 185, 129, 0.8);
        animation: pulse 2s ease-in-out infinite;
      }

      @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 0.8; }
        50% { transform: scale(1.6); opacity: 1; }
      }

      @keyframes float {
        0%, 100% { transform: translateY(0); opacity: 0.6; }
        50% { transform: translateY(18px); opacity: 0.9; }
      }

      .actions {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
      }

      button {
        border: none;
        background: linear-gradient(135deg, var(--accent), var(--accent-2));
        color: #0b0f1a;
        padding: 10px 18px;
        border-radius: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }

      button:hover {
        transform: translateY(-2px) scale(1.02);
        box-shadow: 0 12px 24px rgba(124, 92, 255, 0.35);
      }

      .grid {
        display: grid;
        gap: 18px;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      }

      .card {
        background: var(--panel);
        border-radius: 18px;
        padding: 18px;
        border: 1px solid rgba(124, 92, 255, 0.2);
        backdrop-filter: blur(12px);
        transition: transform 0.25s ease, border 0.25s ease;
        position: relative;
        overflow: hidden;
      }

      .card:hover {
        transform: translateY(-4px);
        border-color: rgba(34, 211, 238, 0.6);
      }

      .card::after {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(120deg, transparent, rgba(34, 211, 238, 0.08), transparent);
        transform: translateX(-100%);
        transition: transform 0.6s ease;
      }

      .card:hover::after {
        transform: translateX(100%);
      }

      .card h3 {
        margin: 0 0 8px;
      }

      .tag {
        display: inline-block;
        padding: 4px 10px;
        border-radius: 999px;
        font-size: 0.78rem;
        color: var(--muted);
        background: rgba(148, 163, 184, 0.1);
        margin-bottom: 8px;
      }

      details {
        margin-top: 12px;
        background: rgba(15, 23, 42, 0.6);
        padding: 10px 12px;
        border-radius: 12px;
        border: 1px dashed rgba(148, 163, 184, 0.2);
      }

      summary {
        cursor: pointer;
        color: var(--accent-2);
        font-weight: 600;
      }

      pre {
        margin: 10px 0 0;
        font-size: 0.8rem;
        color: #c7d2fe;
        overflow-x: auto;
      }

      .toast {
        position: fixed;
        right: 24px;
        bottom: 24px;
        background: rgba(17, 24, 39, 0.92);
        padding: 12px 16px;
        border-radius: 12px;
        border: 1px solid rgba(124, 92, 255, 0.35);
        color: var(--text);
        box-shadow: 0 16px 32px rgba(15, 23, 42, 0.55);
        opacity: 0;
        transform: translateY(16px);
        transition: opacity 0.3s ease, transform 0.3s ease;
        pointer-events: none;
      }

      .toast.visible {
        opacity: 1;
        transform: translateY(0);
      }

      .drift {
        position: absolute;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: rgba(124, 92, 255, 0.6);
        animation: drift 6s linear infinite;
        pointer-events: none;
      }

      @keyframes drift {
        from { transform: translateY(0) scale(1); opacity: 1; }
        to { transform: translateY(-140px) scale(0.4); opacity: 0; }
      }

      footer {
        padding: 24px 10vw 40px;
        color: var(--muted);
        font-size: 0.9rem;
      }
    </style>
  </head>
  <body>
    <div class="glow"></div>
    <header>
      <span class="badge">Quantum-ready API</span>
      <h1>${name}</h1>
      <p class="lead">Daily-ready console with live payload previews, animated status feedback, and zero-break fallback JSON.</p>
    </header>
    <main>
      <div class="toolbar">
        <div class="status-pill">
          <span class="status-dot"></span>
          <span>Service status: ${status} • v${version}</span>
        </div>
        <div class="actions">
          <button id="refresh">Refresh live payloads</button>
          <button id="toggle">Toggle payload view</button>
        </div>
      </div>
      <section class="grid" id="cards"></section>
    </main>
    <div class="toast" id="toast">Payloads refreshed.</div>
    <footer>
      <div>Available sections: ${sections.join(' • ')}</div>
    </footer>
    <script>
      const endpoints = [
        { id: 'app-console', label: 'App Console', description: 'Ownership & navigation links.', url: '/app-console' },
        { id: 'announcement', label: 'Announcements', description: 'Latest broadcast updates.', url: '/announcement' },
        { id: 'docs', label: 'Docs', description: 'API sections and endpoints.', url: '/docs' }
      ];

      const cards = document.getElementById('cards');
      const refreshBtn = document.getElementById('refresh');
      const toggleBtn = document.getElementById('toggle');
      const toast = document.getElementById('toast');
      let expanded = true;
      let motionOn = true;

      function createCard(endpoint) {
        const card = document.createElement('article');
        card.className = 'card';
        card.innerHTML = [
          '<span class="tag">', endpoint.url, '</span>',
          '<h3>', endpoint.label, '</h3>',
          '<p>', endpoint.description, '</p>',
          '<details open>',
          '<summary>Live payload</summary>',
          '<pre>Loading…</pre>',
          '</details>'
        ].join('');
        return card;
      }

      async function hydrateCard(card, endpoint) {
        const output = card.querySelector('pre');
        try {
          const response = await fetch(endpoint.url);
          const data = await response.json();
          output.textContent = JSON.stringify(data, null, 2);
        } catch (error) {
          output.textContent = 'Failed to load: ' + error;
        }
      }

      function sprinkle(card) {
        if (!motionOn) return;
        const dot = document.createElement('span');
        dot.className = 'drift';
        dot.style.left = (Math.random() * 90 + 5) + '%';
        dot.style.bottom = '12px';
        card.appendChild(dot);
        setTimeout(() => dot.remove(), 6000);
      }

      function showToast(message) {
        toast.textContent = message;
        toast.classList.add('visible');
        setTimeout(() => toast.classList.remove('visible'), 2000);
      }

      function renderCards() {
        cards.innerHTML = '';
        endpoints.forEach((endpoint) => {
          const card = createCard(endpoint);
          cards.appendChild(card);
          hydrateCard(card, endpoint);
          card.addEventListener('mouseenter', () => sprinkle(card));
        });
      }

      refreshBtn.addEventListener('click', () => {
        document.querySelectorAll('.card').forEach((card, index) => {
          hydrateCard(card, endpoints[index]);
        });
        showToast('Payloads refreshed.');
      });

      toggleBtn.addEventListener('click', () => {
        expanded = !expanded;
        document.querySelectorAll('details').forEach((detail) => {
          detail.open = expanded;
        });
        showToast(expanded ? 'Payloads expanded.' : 'Payloads collapsed.');
      });

      toggleBtn.addEventListener('dblclick', () => {
        motionOn = !motionOn;
        showToast(motionOn ? 'Motion enabled.' : 'Motion paused.');
      });

      renderCards();
    </script>
  </body>
</html>`;
}
