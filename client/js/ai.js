// ─────────────────────────────────────────────
//  AI Prediction Page Module
// ─────────────────────────────────────────────
const AIPage = {
  render() {
    const page = document.getElementById('page-ai');
    page.innerHTML = `
      <div class="container" style="padding-top:2rem">
        <h2 class="section-title">🤖 AI Disease Prediction</h2>
        <p class="section-sub">Claude AI-powered analysis from patient vitals and symptoms</p>
        <div class="ai-layout">
          <div class="panel">
            <div class="panel-header"><span class="panel-title">Patient Input</span></div>
            <div style="padding:1.5rem">
              <div class="form-grid">
                <div class="field"><label>Patient Name</label><input id="aiName" placeholder="Full name"/></div>
                <div class="field"><label>Age</label><input id="aiAge" type="number" placeholder="35"/></div>
                <div class="field"><label>Gender</label>
                  <select id="aiGender"><option>Male</option><option>Female</option><option>Other</option></select>
                </div>
                <div class="field"><label>Blood Pressure</label><input id="aiBP" placeholder="120/80 mmHg"/></div>
                <div class="field"><label>Heart Rate (bpm)</label><input id="aiHR" type="number" placeholder="72"/></div>
                <div class="field"><label>Blood Sugar (mg/dL)</label><input id="aiBS" type="number" placeholder="95"/></div>
                <div class="field"><label>BMI</label><input id="aiBMI" type="number" placeholder="24.5" step="0.1"/></div>
                <div class="field"><label>Temperature (°C)</label><input id="aiTemp" type="number" placeholder="37.0" step="0.1"/></div>
              </div>
              <div class="field">
                <label>Symptoms (select all that apply)</label>
                <div class="symptom-tags" id="symptomTags">
                  ${['Chest Pain','Fatigue','Shortness of Breath','Headache','Fever','Cough',
                     'Nausea','Dizziness','Joint Pain','Excessive Thirst','Blurred Vision',
                     'Frequent Urination','Weight Loss','Sweating','Palpitations']
                    .map(s => `<div class="tag" onclick="this.classList.toggle('selected')">${s}</div>`).join('')}
                </div>
              </div>
              <div class="field"><label>Medical History</label>
                <input id="aiHistory" placeholder="e.g. Hypertension, Family history of diabetes"/>
              </div>
              <button class="predict-btn" onclick="AIPage.predict()">🔬 Run AI Prediction</button>
            </div>
          </div>
          <div class="panel" id="resultPanel">
            <div class="panel-header"><span class="panel-title">AI Analysis</span></div>
            <div style="padding:1.5rem">
              <div id="aiState" style="text-align:center;padding:3rem 1rem;color:var(--muted)">
                <div style="font-size:2.5rem;margin-bottom:1rem">🤖</div>
                <p style="font-size:.88rem">Fill in patient data and click Predict</p>
              </div>
            </div>
          </div>
        </div>
      </div>`;
  },

  async prefill(patientId) {
    const res = await API.patients.getById(patientId);
    const p = res.data;
    document.getElementById('aiName').value   = p.name;
    document.getElementById('aiAge').value    = p.age;
    document.getElementById('aiGender').value = p.gender;
    document.getElementById('aiBP').value     = p.vitals?.bp || '';
    document.getElementById('aiHR').value     = p.vitals?.hr || '';
    document.getElementById('aiBS').value     = p.vitals?.sugar || '';
    document.getElementById('aiBMI').value    = p.vitals?.bmi || '';
    document.getElementById('aiTemp').value   = p.vitals?.temp || '';
    App.showPage('ai');
  },

  async predict() {
    const symptoms = [...document.querySelectorAll('.tag.selected')].map(t => t.textContent);
    const body = {
      name:        document.getElementById('aiName').value,
      age:         document.getElementById('aiAge').value,
      gender:      document.getElementById('aiGender').value,
      bp:          document.getElementById('aiBP').value,
      hr:          document.getElementById('aiHR').value,
      bloodSugar:  document.getElementById('aiBS').value,
      bmi:         document.getElementById('aiBMI').value,
      temp:        document.getElementById('aiTemp').value,
      symptoms,
      history:     document.getElementById('aiHistory').value
    };
    if (!body.age) { showToast('⚠️ Patient age is required'); return; }

    // Show spinner
    document.getElementById('aiState').innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;gap:1rem;padding:3rem 1rem">
        <div class="spinner"></div>
        <div style="font-size:.85rem;color:var(--muted)">Claude AI analyzing...</div>
      </div>`;

    const res = await API.ai.predict(body);
    this.showResult(res.data, body.name, res.fallback);
  },

  showResult(ai, name, isFallback) {
    const riskColor = ai.riskScore > 70 ? 'var(--danger)' : ai.riskScore > 40 ? 'var(--warn)' : 'var(--accent2)';
    document.getElementById('aiState').innerHTML = `
      <div style="background:var(--surface2);border-radius:12px;padding:1.25rem;margin-bottom:1rem">
        <div style="font-size:.7rem;color:var(--muted);text-transform:uppercase;letter-spacing:.1em;margin-bottom:.4rem">Primary Diagnosis</div>
        <div style="font-size:1.4rem;font-weight:800;color:${riskColor}">${ai.primaryDiagnosis}</div>
        <div style="font-family:'Space Mono',monospace;font-size:.82rem;color:var(--accent2);margin-bottom:.75rem">Confidence: ${ai.confidence}%</div>
        <div style="font-size:.7rem;color:var(--muted);margin-bottom:.35rem">Risk Score</div>
        <div class="risk-meter"><div class="risk-fill" style="width:${ai.riskScore}%;background:linear-gradient(90deg,var(--accent2),${riskColor})"></div></div>
        <div style="display:flex;justify-content:space-between;font-size:.68rem;font-family:'Space Mono',monospace">
          <span style="color:var(--accent2)">0</span>
          <span style="color:${riskColor};font-weight:700">${ai.riskScore}/100 — ${ai.riskLevel}</span>
          <span style="color:var(--danger)">100</span>
        </div>
      </div>
      ${ai.differentials?.length ? `
        <div style="margin-bottom:1rem">
          <div style="font-size:.7rem;color:var(--muted);text-transform:uppercase;letter-spacing:.1em;margin-bottom:.75rem">Differentials</div>
          ${ai.differentials.map(d=>`
            <div class="disease-item">
              <div class="disease-name">${d.name}</div>
              <div class="prob-bar-wrap"><div class="prob-bar" style="width:${d.probability}%;background:${d.color||'var(--accent)'}"></div></div>
              <div class="disease-prob">${d.probability}%</div>
            </div>`).join('')}
        </div>` : ''}
      <div>
        <div style="font-size:.7rem;color:var(--muted);text-transform:uppercase;letter-spacing:.1em;margin-bottom:.5rem">Recommendations</div>
        <ul class="rec-list">${(ai.recommendations||[]).map(r=>`<li>${r}</li>`).join('')}</ul>
      </div>
      <div style="background:rgba(255,165,2,.08);border:1px solid rgba(255,165,2,.2);border-radius:8px;padding:.75rem;margin-top:1rem;font-size:.78rem;color:var(--warn)">
        ⚠️ ${ai.urgency || 'Always consult a licensed physician.'}
      </div>
      ${!isFallback ? `<button class="btn-sm" style="width:100%;margin-top:1rem" onclick="AIPage.saveToChain('${name}')">💾 Save to Blockchain</button>` : ''}`;
    showToast('✅ AI analysis complete!');
  },

  async saveToChain(name) {
    await API.blockchain.mineBlock({ patientName: name, recordType: 'AI Prediction', doctor: 'Claude AI' });
    showToast(`✅ Saved to blockchain for ${name}`);
  }
};
