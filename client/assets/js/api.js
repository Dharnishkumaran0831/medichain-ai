// client/assets/js/api.js
// Central API service — all calls to the MediChain server

const BASE_URL = window.location.origin + '/api';

const api = {
  // ── Blockchain ──────────────────────────────────────
  async getChain() {
    const r = await fetch(`${BASE_URL}/blockchain`);
    return r.json();
  },
  async getChainStats() {
    const r = await fetch(`${BASE_URL}/blockchain/stats`);
    return r.json();
  },
  async addRecord(data) {
    const r = await fetch(`${BASE_URL}/blockchain/record`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return r.json();
  },
  async validateChain() {
    const r = await fetch(`${BASE_URL}/blockchain/validate`);
    return r.json();
  },
  async searchChain(query) {
    const r = await fetch(`${BASE_URL}/blockchain/search?q=${encodeURIComponent(query)}`);
    return r.json();
  },

  // ── Patients ─────────────────────────────────────────
  async getPatients(params = {}) {
    const qs = new URLSearchParams(params).toString();
    const r = await fetch(`${BASE_URL}/patients${qs ? '?' + qs : ''}`);
    return r.json();
  },
  async getPatient(id) {
    const r = await fetch(`${BASE_URL}/patients/${id}`);
    return r.json();
  },
  async getPatientStats() {
    const r = await fetch(`${BASE_URL}/patients/stats`);
    return r.json();
  },
  async createPatient(data) {
    const r = await fetch(`${BASE_URL}/patients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return r.json();
  },
  async updatePatient(id, data) {
    const r = await fetch(`${BASE_URL}/patients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return r.json();
  },
  async deletePatient(id) {
    const r = await fetch(`${BASE_URL}/patients/${id}`, { method: 'DELETE' });
    return r.json();
  },

  // ── AI Prediction ─────────────────────────────────────
  async predict(data) {
    const r = await fetch(`${BASE_URL}/ai/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return r.json();
  },
  async getPredictionHistory() {
    const r = await fetch(`${BASE_URL}/ai/history`);
    return r.json();
  },

  // ── Health ────────────────────────────────────────────
  async health() {
    const r = await fetch(`${BASE_URL}/health`);
    return r.json();
  },
};

window.api = api;
