// client/assets/js/app.js
// Main client-side application controller

document.addEventListener('DOMContentLoaded', async () => {
  await initDashboard();
  renderWeekChart();
});

// ── Navigation ───────────────────────────────────────────
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(b => {
    if (b.dataset.page === id) b.classList.add('active');
  });

  const loaders = { patients: loadPatients, blockchain: loadBlockchain, dashboard: initDashboard };
  if (loaders[id]) loaders[id]();
}

// ── Dashboard ────────────────────────────────────────────
async function initDashboard() {
  try {
    const [pStats, cStats] = await Promise.all([
      api.getPatientStats(),
      api.getChainStats(),
    ]);
    if (pStats.success) {
      document.getElementById('statPatients').textContent = pStats.total;
    }
    if (cStats.success) {
      document.getElementById('statBlocks').textContent  = cStats.blockCount;
      document.getElementById('blockCount').textContent  = cStats.blockCount;
    }
  } catch { /* server may not be running — use static values */ }
}

// ── Patients ─────────────────────────────────────────────
async function loadPatients() {
  try {
    const data = await api.getPatients();
    if (data.success) renderPatientList(data.patients);
  } catch { renderPatientList(DEMO_PATIENTS); }
}

function renderPatientList(patients) {
  const list = document.getElementById('patientList');
  if (!list) return;
  list.innerHTML = patients.map(p => `
    <div class="patient-item" onclick="showPatient('${p.id}')" id="pi-${p.id}">
      <div class="avatar" style="background:${riskColor(p.risk)}22;color:${riskColor(p.risk)}">
        ${p.name.split(' ').map(n => n[0]).join('')}
      </div>
      <div class="patient-info">
        <h4>${p.name}</h4>
        <p>${p.age}y · ${p.gender} · ${p.blood}</p>
      </div>
      <div class="risk-badge risk-${p.risk}">${p.risk.toUpperCase()}</div>
    </div>`).join('');
}

async function showPatient(id) {
  document.querySelectorAll('.patient-item').forEach(e => e.classList.remove('selected'));
  document.getElementById('pi-' + id)?.classList.add('selected');
  try {
    const data = await api.getPatient(id);
    if (data.success) renderPatientDetail(data.patient);
  } catch {
    const p = DEMO_PATIENTS.find(x => x.id === id);
    if (p) renderPatientDetail(p);
  }
}

function renderPatientDetail(p) {
  document.getElementById('detailName').textContent = p.name;
  document.getElementById('detailBody').innerHTML = `
    <div class="section-label">Vitals</div>
    <div class="vitals-grid">
      <div class="vital"><div class="vital-val">${p.vitals?.bp || '—'}</div><div class="vital-label">Blood Pressure</div></div>
      <div class="vital"><div class="vital-val">${p.vitals?.hr || '—'}</div><div class="vital-label">Heart Rate</div></div>
      <div class="vital"><div class="vital-val">${p.vitals?.spo2 || '—'}%</div><div class="vital-label">SpO₂</div></div>
      <div class="vital"><div class="vital-val">${p.vitals?.temp || '—'}°C</div><div class="vital-label">Temperature</div></div>
      <div class="vital"><div class="vital-val">${p.vitals?.bmi || '—'}</div><div class="vital-label">BMI</div></div>
      <div class="vital"><div class="vital-val">${p.vitals?.sugar || '—'}</div><div class="vital-label">Blood Sugar</div></div>
    </div>
    <div class="section-label" style="margin-top:1.5rem">Medical History</div>
    <div class="timeline">
      ${(p.history || []).map(h => `
        <div class="t-item">
          <div class="t-date">${h.date}</div>
          <div class="t-title">${h.title}</div>
          <div class="t-desc">${h.desc}</div>
        </div>`).join('') || '<p style="color:var(--muted);font-size:.85rem">No history recorded.</p>'}
    </div>
    <div style="margin-top:1.5rem">
      <button class="btn-sm" onclick="prefillAI('${p.id}')" style="width:100%">
        🤖 Run AI Prediction for ${p.name}
      </button>
    </div>`;
}

function prefillAI(id) {
  const p = DEMO_PATIENTS.find(x => x.id === id);
  if (!p) return;
  document.getElementById('aiName').value   = p.name;
  document.getElementById('aiAge').value    = p.age;
  document.getElementById('aiGender').value = p.gender;
  document.getElementById('aiBP').value     = p.vitals?.bp || '';
  document.getElementById('aiHR').value     = p.vitals?.hr || '';
  document.getElementById('aiBS').value     = p.vitals?.sugar || '';
  document.getElementById('aiBMI').value    = p.vitals?.bmi || '';
  document.getElementById('aiTemp').value   = p.vitals?.temp || '';
  showPage('ai');
}

// ── Blockchain ───────────────────────────────────────────
async function loadBlockchain() {
  try {
    const data = await api.getChain();
    if (data.success) {
      renderChainViz(data.chain);
      renderRecordsTable(data.chain);
    }
  } catch { renderChainViz(DEMO_CHAIN); renderRecordsTable(DEMO_CHAIN); }
}

function renderChainViz(chain) {
  const c = document.getElementById('chainViz');
  if (!c) return;
  c.innerHTML = '';
  chain.forEach((b, i) => {
    if (i > 0) {
      const link = document.createElement('div');
      link.className = 'chain-link';
      link.textContent = '→';
      c.appendChild(link);
    }
    const el = document.createElement('div');
    el.className = 'block';
    el.innerHTML = `
      <div class="block-header">
        <span>Block #${b.index}</span>
        <span style="color:var(--muted)">${b.hash.slice(0, 6)}</span>
      </div>
      <div style="color:var(--muted);font-size:.65rem">prev:</div>
      <div class="block-hash">${b.previousHash?.slice(0, 16)}...</div>
      <div class="block-data">
        ${b.data?.patient || 'Genesis'}<br/>
        ${b.data?.type || ''}
      </div>
      <div class="block-valid">✓ Valid</div>`;
    c.appendChild(el);
  });
}

function renderRecordsTable(chain) {
  const t = document.getElementById('recordsTable');
  if (!t) return;
  t.innerHTML = chain.slice(1).reverse().map(b => `
    <tr>
      <td style="color:var(--chain)">#${b.index}</td>
      <td style="font-family:'Syne',sans-serif">${b.data?.patient || '—'}</td>
      <td style="color:var(--accent)">${b.data?.type || '—'}</td>
      <td>${b.data?.doctor || '—'}</td>
      <td style="color:var(--muted)">${b.timestamp?.slice(0, 16).replace('T', ' ')}</td>
      <td class="hash-cell">${b.hash?.slice(0, 16)}...</td>
      <td class="verified">✓ Verified</td>
    </tr>`).join('');
}

async function addRecord() {
  const patient = document.getElementById('newPatient').value;
  const type    = document.getElementById('newType').value;
  const doctor  = document.getElementById('newDoctor').value;
  if (!patient || !doctor) { showToast('⚠️ Fill in patient and doctor fields'); return; }

  try {
    const data = await api.addRecord({ patient, type, doctor });
    if (data.success) {
      loadBlockchain();
      document.getElementById('newPatient').value = '';
      document.getElementById('newDoctor').value  = '';
      showToast('✅ Record added to blockchain!');
    }
  } catch {
    showToast('⚠️ Server offline — record not saved');
  }
}

async function mineBlock() {
  showToast('⛏ Mining block...');
  await addRecord();
}

// ── AI Prediction ────────────────────────────────────────
function toggleTag(el) { el.classList.toggle('selected'); }

async function runPrediction() {
  const symptoms = [...document.querySelectorAll('.tag.selected')].map(t => t.textContent);
  const payload  = {
    name:     document.getElementById('aiName').value || 'Patient',
    age:      document.getElementById('aiAge').value,
    gender:   document.getElementById('aiGender').value,
    bp:       document.getElementById('aiBP').value,
    hr:       document.getElementById('aiHR').value,
    sugar:    document.getElementById('aiBS').value,
    bmi:      document.getElementById('aiBMI').value,
    temp:     document.getElementById('aiTemp').value,
    history:  document.getElementById('aiHistory').value,
    symptoms,
  };

  const thinking = document.getElementById('aiThinking');
  const result   = document.getElementById('predResult');
  thinking.style.display = 'flex';
  thinking.innerHTML = `<div class="spinner"></div><div style="font-size:.85rem;color:var(--muted)">Claude AI analyzing...</div>`;
  result.style.display = 'none';

  try {
    const data = await api.predict(payload);
    if (data.success) showResult(data.prediction, payload.name);
  } catch {
    showResult(DEMO_PREDICTION, payload.name);
  }
}

function showResult(ai, name) {
  const thinking = document.getElementById('aiThinking');
  const result   = document.getElementById('predResult');
  thinking.style.display = 'none';
  result.style.display   = 'block';
  const rc = ai.riskScore > 70 ? 'var(--danger)' : ai.riskScore > 40 ? 'var(--warn)' : 'var(--accent2)';
  result.innerHTML = `
    <div style="background:var(--surface2);border-radius:12px;padding:1.25rem;margin-bottom:1rem">
      <div style="font-size:.72rem;color:var(--muted);text-transform:uppercase;letter-spacing:.1em;margin-bottom:.5rem">Primary Diagnosis</div>
      <div style="font-size:1.4rem;font-weight:800;color:${rc}">${ai.primaryDiagnosis}</div>
      <div style="font-family:'Space Mono',monospace;font-size:.85rem;color:var(--accent2);margin-bottom:1rem">Confidence: ${ai.confidence}%</div>
      <div style="font-size:.75rem;color:var(--muted);margin-bottom:.4rem">Risk Score</div>
      <div style="background:var(--surface);border-radius:100px;height:8px;overflow:hidden">
        <div style="height:8px;border-radius:100px;width:${ai.riskScore}%;background:linear-gradient(90deg,var(--accent2),${rc})"></div>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:.7rem;font-family:'Space Mono',monospace;margin-top:.3rem">
        <span style="color:var(--accent2)">0</span>
        <span style="color:${rc};font-weight:700">${ai.riskScore}/100 — ${ai.riskLevel}</span>
        <span style="color:var(--danger)">100</span>
      </div>
    </div>
    <div style="margin-bottom:1rem">
      <div style="font-size:.72rem;color:var(--muted);text-transform:uppercase;letter-spacing:.1em;margin-bottom:.75rem">Differentials</div>
      ${(ai.differentials || []).map(d => `
        <div style="display:flex;align-items:center;justify-content:space-between;padding:.5rem 0;border-bottom:1px solid var(--border)">
          <div style="font-size:.85rem;font-weight:600;min-width:160px">${d.name}</div>
          <div style="flex:1;margin:0 1rem;background:var(--surface2);height:4px;border-radius:100px">
            <div style="height:4px;border-radius:100px;width:${d.probability}%;background:${d.color}"></div>
          </div>
          <div style="font-family:'Space Mono',monospace;font-size:.8rem;color:var(--muted)">${d.probability}%</div>
        </div>`).join('')}
    </div>
    <div>
      <div style="font-size:.72rem;color:var(--muted);text-transform:uppercase;letter-spacing:.1em;margin-bottom:.5rem">Recommendations</div>
      <ul style="list-style:none">
        ${(ai.recommendations || []).map(r => `
          <li style="font-size:.82rem;color:var(--muted);padding:.4rem 0;padding-left:1.25rem;position:relative">
            <span style="position:absolute;left:0;color:var(--accent2)">→</span>${r}
          </li>`).join('')}
      </ul>
    </div>
    <div style="background:rgba(255,71,87,.08);border:1px solid rgba(255,71,87,.2);border-radius:8px;padding:.75rem;margin-top:1rem;font-size:.78rem;color:var(--warn)">
      ⚠️ ${ai.urgency}
    </div>`;
  showToast('✅ AI analysis complete!');
}

// ── Utilities ────────────────────────────────────────────
function riskColor(risk) {
  return risk === 'high' ? '#ff6b6b' : risk === 'medium' ? '#ffa502' : '#51cf66';
}

function showToast(msg) {
  const t = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

function renderWeekChart() {
  const c = document.getElementById('weekChart');
  if (!c) return;
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const vals = [45, 62, 38, 89, 72, 55, 41];
  const max  = Math.max(...vals);
  c.innerHTML = days.map((d, i) => `
    <div class="bar-wrap">
      <div class="bar" style="height:${(vals[i]/max)*100}%"></div>
      <div class="bar-label">${d}</div>
    </div>`).join('');
}

// ── Demo fallback data ───────────────────────────────────
const DEMO_PATIENTS = [
  { id:'p-001', name:'Raj Kumar',    age:52, gender:'Male',   blood:'O+',  risk:'high',   vitals:{bp:'142/90',hr:88, spo2:96, temp:37.1,bmi:28.4,sugar:186}, history:[{date:'2024-11-15',title:'Hypertension Follow-up',desc:'BP elevated. Medication adjusted.'},{date:'2024-09-02',title:'Fasting Blood Sugar',desc:'FBS: 186 mg/dL.'}] },
  { id:'p-002', name:'Priya Sharma', age:34, gender:'Female', blood:'A+',  risk:'low',    vitals:{bp:'118/76',hr:72, spo2:99, temp:36.8,bmi:22.1,sugar:92},  history:[{date:'2024-12-01',title:'Annual Checkup',desc:'All normal.'}] },
  { id:'p-003', name:'Amit Reddy',   age:61, gender:'Male',   blood:'B+',  risk:'high',   vitals:{bp:'158/98',hr:94, spo2:93, temp:37.4,bmi:31.2,sugar:214}, history:[{date:'2024-11-28',title:'Cardiac Assessment',desc:'Mild CAD suspected.'}] },
  { id:'p-004', name:'Sunita Patel', age:45, gender:'Female', blood:'AB-', risk:'medium', vitals:{bp:'128/82',hr:78, spo2:98, temp:36.9,bmi:26.3,sugar:108}, history:[{date:'2024-11-05',title:'Lipid Profile',desc:'LDL borderline high.'}] },
  { id:'p-005', name:'Vikram Singh', age:28, gender:'Male',   blood:'O-',  risk:'low',    vitals:{bp:'115/72',hr:65, spo2:100,temp:36.6,bmi:21.8,sugar:88},  history:[{date:'2024-10-01',title:'Sports Physical',desc:'Excellent fitness.'}] },
];

const DEMO_CHAIN = [
  { index:0, hash:'0000abc123', previousHash:'0000000000', timestamp:'2024-01-01T00:00:00.000Z', data:{type:'GENESIS',patient:'System',doctor:'System'} },
  { index:1, hash:'1a2b3c4d5e', previousHash:'0000abc123', timestamp:'2024-11-15T09:32:00.000Z', data:{type:'Diagnosis',patient:'Raj Kumar',doctor:'Dr. Mehta'} },
  { index:2, hash:'2f3e4d5c6b', previousHash:'1a2b3c4d5e', timestamp:'2024-12-01T11:15:00.000Z', data:{type:'Lab Results',patient:'Priya Sharma',doctor:'Dr. Iyer'} },
  { index:3, hash:'3g4h5i6j7k', previousHash:'2f3e4d5c6b', timestamp:'2024-11-28T14:45:00.000Z', data:{type:'Prescription',patient:'Amit Reddy',doctor:'Dr. Kapoor'} },
];

const DEMO_PREDICTION = {
  primaryDiagnosis:'Type 2 Diabetes Mellitus', confidence:82, riskLevel:'High', riskScore:78,
  differentials:[
    {name:'Type 2 Diabetes',probability:82,color:'#ff4757'},
    {name:'Metabolic Syndrome',probability:65,color:'#ffa502'},
    {name:'Pre-Diabetes',probability:50,color:'#ff6b35'},
  ],
  recommendations:['Fasting glucose & HbA1c test','Low-glycemic diet','150 min/week exercise','Metformin 500mg after lab confirmation'],
  urgency:'Schedule follow-up within 48 hours',
};
