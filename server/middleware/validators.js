// server/middleware/validators.js
function validateRecord(req, res, next) {
  const { patient, type, doctor } = req.body;
  if (!patient) return res.status(400).json({ success: false, message: 'patient is required' });
  if (!type)    return res.status(400).json({ success: false, message: 'type is required' });
  if (!doctor)  return res.status(400).json({ success: false, message: 'doctor is required' });
  next();
}

function validatePatient(req, res, next) {
  const { name, age } = req.body;
  if (!name) return res.status(400).json({ success: false, message: 'name is required' });
  if (!age || isNaN(age)) return res.status(400).json({ success: false, message: 'valid age is required' });
  next();
}

module.exports = { validateRecord, validatePatient };
