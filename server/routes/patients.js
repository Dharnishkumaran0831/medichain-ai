// ─────────────────────────────────────────────
//  Route: /api/patients
// ─────────────────────────────────────────────
const router  = require('express').Router();
const Patient = require('../models/Patient');

// GET  /api/patients         — list all
router.get('/', (req, res) => {
  res.json({ success: true, data: Patient.getAll() });
});

// GET  /api/patients/:id     — single patient
router.get('/:id', (req, res) => {
  const patient = Patient.getById(req.params.id);
  if (!patient) return res.status(404).json({ success: false, error: 'Patient not found' });
  res.json({ success: true, data: patient });
});

// POST /api/patients         — create
router.post('/', (req, res) => {
  const { name, age, gender, bloodGroup, phone } = req.body;
  if (!name || !age) return res.status(400).json({ success: false, error: 'name and age required' });
  const patient = Patient.create({ name, age, gender, bloodGroup, phone,
    vitals: req.body.vitals || {}, riskLevel: 'low', history: [] });
  res.status(201).json({ success: true, data: patient });
});

// PUT  /api/patients/:id     — update
router.put('/:id', (req, res) => {
  const updated = Patient.update(req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, error: 'Patient not found' });
  res.json({ success: true, data: updated });
});

// DELETE /api/patients/:id
router.delete('/:id', (req, res) => {
  const ok = Patient.delete(req.params.id);
  if (!ok) return res.status(404).json({ success: false, error: 'Patient not found' });
  res.json({ success: true, message: 'Patient deleted' });
});

module.exports = router;
