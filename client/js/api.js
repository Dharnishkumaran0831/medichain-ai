// ─────────────────────────────────────────────
//  API Client — wraps all fetch calls to server
// ─────────────────────────────────────────────
const API = {
  BASE: '/api',

  async get(path) {
    const res = await fetch(this.BASE + path);
    return res.json();
  },

  async post(path, body) {
    const res = await fetch(this.BASE + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return res.json();
  },

  async put(path, body) {
    const res = await fetch(this.BASE + path, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return res.json();
  },

  async delete(path) {
    const res = await fetch(this.BASE + path, { method: 'DELETE' });
    return res.json();
  },

  // Convenience methods
  patients: {
    getAll:    ()          => API.get('/patients'),
    getById:   (id)        => API.get(`/patients/${id}`),
    create:    (data)      => API.post('/patients', data),
    update:    (id, data)  => API.put(`/patients/${id}`, data),
    delete:    (id)        => API.delete(`/patients/${id}`)
  },

  blockchain: {
    getChain:   ()     => API.get('/blockchain'),
    getStats:   ()     => API.get('/blockchain/stats'),
    validate:   ()     => API.get('/blockchain/validate'),
    mineBlock:  (data) => API.post('/blockchain/mine', data)
  },

  ai: {
    predict: (data) => API.post('/ai/predict', data)
  },

  records: {
    byPatient: (id) => API.get(`/records/patient/${id}`),
    stats:     ()   => API.get('/records/stats')
  }
};
