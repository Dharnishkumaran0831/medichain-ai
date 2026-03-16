// ─────────────────────────────────────────────
//  App Controller — routing, init, utilities
// ─────────────────────────────────────────────
const App = {
  currentPage: 'dashboard',

  async init() {
    // Wire nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => this.showPage(btn.dataset.page));
    });
    await this.renderDashboard();
  },

  async showPage(id) {
    this.currentPage = id;
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.page === id);
    });
    document.getElementById('page-' + id).classList.add('active');

    if (id === 'dashboard')  await this.renderDashboard();
    if (id === 'patients')   await PatientsPage.render();
    if (id === 'blockchain') await BlockchainPage.render();
    if (id === 'ai')              AIPage.render();
  },

  async renderDashboard() {
    const [statsRes] = await Promise.all([API.records.stats()]);
    const s = statsRes.data || {};

    document.getElementById('blockCount').textContent = s.totalBlocks || '—';

    document.getElementById('page-dashboard').innerHTML = `
      <div class="container">
        <div class="hero">
          <div class="hero-badge">🔬 Blockchain-Secured · AI-Powered · HIPAA Framework</div>
          <h1>Secure Medical Records<br/><span>Powered by Blockchain & AI</span></h1>
          <p>Immutable patient records on a decentralized ledger with real-time AI disease prediction — keeping health data tamper-proof, private, and intelligent.</p>
          <div class="hero-btns">
            <button class="btn-primary" onclick="App.showPage('ai')">Run AI Prediction</button>
            <button class="btn-outline" onclick="App.showPage('blockchain')">View Blockchain</button>
          </div>
        </div>

        <div class="stats-grid">
          <div class="stat-card"><div class="stat-num" style="color:var(--accent)">${s.totalPatients||0}</div><div class="stat-label">Total Patients</div></div>
          <div class="stat-card"><div class="stat-num" style="color:var(--accent2)">${s.totalRecords||0}</div><div class="stat-label">Records Secured</div></div>
          <div class="stat-card"><div class="stat-num" style="color:var(--chain)">${s.totalBlocks||0}</div><div class="stat-label">Blockchain Blocks</div></div>
          <div class="stat-card"><div class="stat-num" style="color:var(--accent)">${s.chainValid?'✓':'✗'}</div><div class="stat-label">Chain Integrity</div></div>
          <div class="stat-card"><div class="stat-num" style="color:var(--danger)">${s.highRisk||0}</div><div class="stat-label">High Risk Cases</div></div>
        </div>

        <div class="two-col" style="margin-top:1.5rem">
          <div class="panel">
            <div class="panel-header"><span class="panel-title">📊 Weekly Predictions</span></div>
            <div class="chart-bars" id="weekChart"></div>
            <div style="height:.75rem"></div>
          </div>
          <div class="panel">
            <div class="panel-header"><span class="panel-title">⚡ Recent Activity</span></div>
            <div class="a-item"><div class="a-icon" style="background:rgba(0,212,255,.1)">🔗</div><div class="a-text"><h4>Block mined</h4><p>Genesis block initialized</p></div><div class="a-time">now</div></div>
            <div class="a-item"><div class="a-icon" style="background:rgba(0,255,157,.1)">🤖</div><div class="a-text"><h4>AI Ready</h4><p>Claude AI endpoint active</p></div><div class="a-time">now</div></div>
            <div class="a-item"><div class="a-icon" style="background:rgba(124,58,237,.1)">📋</div><div class="a-text"><h4>Patients Loaded</h4><p>${s.totalPatients||0} patients in registry</p></div><div class="a-time">now</div></div>
          </div>
        </div>

        <div class="features-grid" style="margin-top:1.5rem">
          <div class="feature-card"><div class="feature-icon">⛓️</div><h3>Immutable Ledger</h3><p>Every record is SHA-256 hashed and chained — any tampering immediately invalidates the chain.</p></div>
          <div class="feature-card"><div class="feature-icon">🤖</div><h3>Claude AI Diagnosis</h3><p>Real-time disease prediction with differential diagnoses, confidence scores, and treatment recommendations.</p></div>
          <div class="feature-card"><div class="feature-icon">🔐</div><h3>Zero-Knowledge Privacy</h3><p>Patient data is encrypted end-to-end. Role-gated access. No central authority.</p></div>
          <div class="feature-card"><div class="feature-icon">📊</div><h3>Live Analytics</h3><p>Monitor population health trends and detect risk patterns across patient cohorts in real time.</p></div>
        </div>
      </div>`;

    // Render bar chart
    const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    const vals = [45,62,38,89,72,55,41];
    const max  = Math.max(...vals);
    document.getElementById('weekChart').innerHTML = days.map((d,i)=>`
      <div class="bar-wrap">
        <div class="bar" style="height:${(vals[i]/max)*100}%"></div>
        <div class="bar-label">${d}</div>
      </div>`).join('');
  }
};

// Global toast
function showToast(msg) {
  const t = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// Boot
document.addEventListener('DOMContentLoaded', () => App.init());
