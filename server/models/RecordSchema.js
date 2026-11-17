/**
 * MediChain AI — Medical Record Schema and Data Contracts
 * Defines standard EHR payload structures for blockchain block storage.
 */

const RECORD_TYPES = {
  CONSULTATION: 'Consultation',
  LAB_REPORT: 'Lab Report',
  PRESCRIPTION: 'Prescription',
  DIAGNOSIS: 'Diagnosis',
  VACCINATION: 'Vaccination',
  SURGERY: 'Surgery',
};

const SEVERITY_LEVELS = {
  LOW: 'Low',
  MODERATE: 'Moderate',
  HIGH: 'High',
  CRITICAL: 'Critical',
};

/**
 * Validates medical record payload before appending to block
 */
function validateRecordPayload(payload) {
  const errors = [];

  if (!payload.patientId) {
    errors.push('patientId is required');
  }

  if (!payload.recordType || !Object.values(RECORD_TYPES).includes(payload.recordType)) {
    errors.push(`recordType must be one of: ${Object.values(RECORD_TYPES).join(', ')}`);
  }

  if (!payload.doctorId) {
    errors.push('doctorId is required');
  }

  if (!payload.clinicalNotes || payload.clinicalNotes.trim().length < 5) {
    errors.push('clinicalNotes must be at least 5 characters long');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

module.exports = {
  RECORD_TYPES,
  SEVERITY_LEVELS,
  validateRecordPayload,
};
