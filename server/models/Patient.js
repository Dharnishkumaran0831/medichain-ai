// ─────────────────────────────────────────────
//  Patient Model — In-memory patient store
//  (swap with MongoDB/PostgreSQL for production)
// ─────────────────────────────────────────────
const { v4: uuidv4 } = require('uuid');

const patients = [
  {
    id: 'p-001', name: 'Raj Kumar', age: 52, gender: 'Male',
    bloodGroup: 'O+', phone: '+91-9876543210',
    vitals: { bp: '142/90', hr: 88, spo2: 96, temp: 37.1, bmi: 28.4, sugar: 186 },
    riskLevel: 'high',
    history: [
      { date: '2024-11-15', title: 'Hypertension Follow-up', desc: 'BP elevated. Medication adjusted.' },
      { date: '2024-09-02', title: 'Fasting Blood Sugar',    desc: 'FBS 186 mg/dL — pre-diabetic range.' }
    ]
  },
  {
    id: 'p-002', name: 'Priya Sharma', age: 34, gender: 'Female',
    bloodGroup: 'A+', phone: '+91-9812345678',
    vitals: { bp: '118/76', hr: 72, spo2: 99, temp: 36.8, bmi: 22.1, sugar: 92 },
    riskLevel: 'low',
    history: [
      { date: '2024-12-01', title: 'Annual Checkup', desc: 'All parameters normal.' }
    ]
  },
  {
    id: 'p-003', name: 'Amit Reddy', age: 61, gender: 'Male',
    bloodGroup: 'B+', phone: '+91-9988776655',
    vitals: { bp: '158/98', hr: 94, spo2: 93, temp: 37.4, bmi: 31.2, sugar: 214 },
    riskLevel: 'high',
    history: [
      { date: '2024-11-28', title: 'Cardiac Assessment', desc: 'Mild CAD suspected. Echo scheduled.' }
    ]
  }
];

const PatientModel = {
  getAll: ()        => patients,
  getById: (id)     => patients.find(p => p.id === id) || null,
  create: (data)    => {
    const patient = { id: 'p-' + uuidv4().slice(0, 6), ...data };
    patients.push(patient);
    return patient;
  },
  update: (id, data) => {
    const idx = patients.findIndex(p => p.id === id);
    if (idx === -1) return null;
    patients[idx] = { ...patients[idx], ...data };
    return patients[idx];
  },
  delete: (id)      => {
    const idx = patients.findIndex(p => p.id === id);
    if (idx === -1) return false;
    patients.splice(idx, 1);
    return true;
  }
};

module.exports = PatientModel;
