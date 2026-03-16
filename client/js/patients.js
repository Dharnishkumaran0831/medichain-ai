// ─────────────────────────────────────────────
//  Patients Page Module
// ─────────────────────────────────────────────
const PatientsPage = {
  async render() {
    const page = document.getElementById('page-patients');
    page.innerHTML = `
      <div class="container" style="padding-top:2rem">
        <h2 class="section-title">Patient Records</h2>
        <p class="section-sub">Blockchain-secured patient medical histories</p>
        <div class="records-layout">
          <div class="panel">
            <div class="panel-header">
              <span class="panel-title">Patients</span>
              <span id="patientCount" style="font-size:.75rem;color:var(--muted);font-family:'Space Mono',monospace">Loading...</span>
            </div>
            <div class="patient-list" id="patientList">
              <div style="padding:2rem;text-align:center;color:var(--muted)">Loading patients...</div>
            </div>
          </div>
          <div class="panel" id="patientDetail">
            <div class="panel-header"><span class="panel-title" id="detailName">Select a patient</span></div>
            <div class="detail-body" id="detailBody">
              <div style="text-align:center;padding:4rem 2rem;color:var(--muted)">
                <div style="font-size:3rem;margin-bottom:1rem">👤</div>
                <p>Select a patient to view their secure medical record</p>
              </div>
            </div>
          </div>
        </div>
      </div>`;
    await this.loadPatients();
  },

  async loadPatients() {
    const res = await API.patients.getAll();
    const list = document.getElementById('patientList');
    document.getElementById('patientCount').textContent = `${res.data.length} total`;
    const colors = ['#ff6b6b','#51cf66','#ffa502','#74c0fc','#cc5de8'];
    list.innerHTML = res.data.map((p, i) => `
      <div class="patient-item" onclick="PatientsPage.showPatient('${p.id}')" id="pi-${p.id}">
        <div class="avatar" style="background:${colors[i%colors.length]}22;color:${colors[i%colors.length]}">
          ${p.name.split(' ').map(n=>n[0]).join('')}
        </div>
        <div class="patient-info">
          <h4>${p.name}</h4>
          <p>${p.age}y · ${p.gender} · ${p.bloodGroup}</p>
        </div>
        <div class="risk-badge risk-${p.riskLevel}">${p.riskLevel.toUpperCase()}</div>
      </div>`).join('');
  },

  async showPatient(id) {
    document.querySelectorAll('.patient-item').forEach(e => e.classList.remove('selected'));
    document.getElementById('pi-' + id)?.classList.add('selected');
    const res = await API.patients.getById(id);
    const p = res.data;
    document.getElementById('detailName').textContent = p.name;
    document.getElementById('detailBody').innerHTML = `
      <div style="padding:1.5rem">
        <div class="label" style="margin-bottom:.75rem">Vitals</div>
        <div class="vitals-grid">
          <div class="vital"><div class="vital-val">${p.vitals?.bp||'—'}</div><div class="vital-label">Blood Pressure</div></div>
          <div class="vital"><div class="vital-val">${p.vitals?.hr||'—'}</div><div class="vital-label">Heart Rate</div></div>
          <div class="vital"><div class="vital-val">${p.vitals?.spo2||'—'}%</div><div class="vital-label">SpO₂</div></div>
          <div class="vital"><div class="vital-val">${p.vitals?.temp||'—'}°C</div><div class="vital-label">Temperature</div></div>
          <div class="vital"><div class="vital-val">${p.vitals?.bmi||'—'}</div><div class="vital-label">BMI</div></div>
          <div class="vital"><div class="vital-val">${p.vitals?.sugar||'—'}</div><div class="vital-label">Blood Sugar</div></div>
        </div>
        <div class="label" style="margin:1.5rem 0 .75rem">Medical History</div>
        <div class="timeline">
          ${(p.history||[]).map(h=>`
            <div class="t-item">
              <div class="t-date">${h.date}</div>
              <div class="t-title">${h.title}</div>
              <div class="t-desc">${h.desc}</div>
            </div>`).join('') || '<p style="color:var(--muted);font-size:.85rem">No history on file</p>'}
        </div>
        <button class="btn-sm" style="width:100%;margin-top:1.5rem" onclick="AIPage.prefill('${p.id}')">
          🤖 Run AI Prediction
        </button>
      </div>`;
  }
};
