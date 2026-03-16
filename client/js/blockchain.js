// ─────────────────────────────────────────────
//  Blockchain Page Module
// ─────────────────────────────────────────────
const BlockchainPage = {
  async render() {
    const page = document.getElementById('page-blockchain');
    page.innerHTML = `
      <div class="container" style="padding-top:2rem">
        <h2 class="section-title">Blockchain Ledger</h2>
        <p class="section-sub">Immutable cryptographic chain of medical records</p>
        <div class="panel" style="margin-bottom:1.5rem;padding:1.5rem">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.25rem">
            <span style="font-size:.85rem;font-weight:700;letter-spacing:.05em">CHAIN VISUALIZATION</span>
            <button class="btn-purple" onclick="BlockchainPage.mine()">⛏ Mine New Block</button>
          </div>
          <div class="chain-container" id="chainViz">Loading...</div>
        </div>
        <div class="panel" style="margin-bottom:1.5rem;padding:1.5rem">
          <h3 style="font-size:.95rem;font-weight:700;margin-bottom:1.25rem">➕ Add Medical Record</h3>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr auto;gap:.75rem;align-items:end">
            <div class="field" style="margin:0"><label>Patient Name</label>
              <input id="newPatient" placeholder="e.g. Arjun Sharma" style="width:100%;background:var(--surface2);border:1px solid var(--border);color:var(--text);font-family:'Space Mono',monospace;font-size:.85rem;padding:.7rem 1rem;border-radius:8px;outline:none"/>
            </div>
            <div class="field" style="margin:0"><label>Record Type</label>
              <select id="newType" style="width:100%;background:var(--surface2);border:1px solid var(--border);color:var(--text);font-family:'Space Mono',monospace;font-size:.85rem;padding:.7rem 1rem;border-radius:8px;outline:none">
                <option>Lab Results</option><option>Prescription</option><option>Diagnosis</option><option>Surgery Notes</option><option>Imaging</option>
              </select>
            </div>
            <div class="field" style="margin:0"><label>Doctor</label>
              <input id="newDoctor" placeholder="Dr. Name" style="width:100%;background:var(--surface2);border:1px solid var(--border);color:var(--text);font-family:'Space Mono',monospace;font-size:.85rem;padding:.7rem 1rem;border-radius:8px;outline:none"/>
            </div>
            <button class="btn-sm" onclick="BlockchainPage.addRecord()" style="white-space:nowrap">Add to Chain</button>
          </div>
        </div>
        <div class="panel">
          <div class="panel-header"><span class="panel-title">📋 All Records</span><span id="chainStatus" style="font-size:.75rem;color:var(--accent2);font-family:'Space Mono',monospace"></span></div>
          <div style="overflow-x:auto">
            <table class="records-table">
              <thead><tr>
                <th>Block #</th><th>Patient</th><th>Type</th><th>Doctor</th><th>Timestamp</th><th>Hash</th><th>Status</th>
              </tr></thead>
              <tbody id="recordsTable"></tbody>
            </table>
          </div>
        </div>
      </div>`;
    await this.loadChain();
  },

  async loadChain() {
    const [chainRes, statsRes] = await Promise.all([API.blockchain.getChain(), API.blockchain.getStats()]);
    const chain = chainRes.data;
    const stats = statsRes.data;

    document.getElementById('chainStatus').textContent = stats.isValid ? '✓ Chain Valid' : '✗ Compromised';
    document.getElementById('blockCount').textContent = stats.totalBlocks;

    // Render visual chain
    const viz = document.getElementById('chainViz');
    viz.innerHTML = chain.map((b, i) => `
      ${i > 0 ? '<div class="chain-link">→</div>' : ''}
      <div class="block">
        <div class="block-header"><span>Block #${b.index}</span><span style="color:var(--muted)">#${b.hash.slice(0,6)}</span></div>
        <div style="color:var(--muted);font-size:.62rem">prev:</div>
        <div class="block-hash">${b.previousHash.slice(0,16)}...</div>
        <div class="block-data">${b.data?.patientName || b.data?.message || 'Genesis'}<br/>${b.data?.recordType || ''}</div>
        <div class="block-valid">✓ Valid</div>
      </div>`).join('');

    // Table
    const tbody = document.getElementById('recordsTable');
    tbody.innerHTML = chain.slice(1).reverse().map(b => `
      <tr>
        <td style="color:var(--chain)">#${b.index}</td>
        <td style="font-family:'Syne',sans-serif">${b.data?.patientName || '—'}</td>
        <td style="color:var(--accent)">${b.data?.recordType || '—'}</td>
        <td>${b.data?.doctor || '—'}</td>
        <td style="color:var(--muted)">${b.timestamp?.slice(0,16).replace('T',' ') || '—'}</td>
        <td class="hash-cell">${b.hash.slice(0,16)}...</td>
        <td class="verified">✓ Verified</td>
      </tr>`).join('');
  },

  async addRecord() {
    const patientName = document.getElementById('newPatient').value;
    const recordType  = document.getElementById('newType').value;
    const doctor      = document.getElementById('newDoctor').value;
    if (!patientName) { showToast('⚠️ Enter a patient name'); return; }
    await API.blockchain.mineBlock({ patientName, recordType, doctor });
    document.getElementById('newPatient').value = '';
    document.getElementById('newDoctor').value  = '';
    await this.loadChain();
    showToast('✅ Record added to blockchain');
  },

  async mine() {
    showToast('⛏ Mining block...');
    await this.addRecord();
  }
};
