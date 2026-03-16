// ─────────────────────────────────────────────
//  Route: /api/records — Medical record helpers
// ─────────────────────────────────────────────
const router     = require('express').Router();
const blockchain = require('../models/Blockchain');
const Patient    = require('../models/Patient');

// GET /api/records/patient/:id — all records for a patient
router.get('/patient/:id', (req, res) => {
  const blocks = blockchain.getAllBlocks()
    .filter(b => b.data && b.data.patientId === req.params.id);
  res.json({ success: true, count: blocks.length, data: blocks });
});

// GET /api/records/stats — summary stats
router.get('/stats', (req, res) => {
  const chain    = blockchain.getAllBlocks();
  const patients = Patient.getAll();
  const byType   = {};
  chain.slice(1).forEach(b => {
    const t = b.data?.recordType || 'Unknown';
    byType[t] = (byType[t] || 0) + 1;
  });
  res.json({
    success: true,
    data: {
      totalPatients:  patients.length,
      totalRecords:   chain.length - 1,
      totalBlocks:    chain.length,
      recordsByType:  byType,
      chainValid:     blockchain.isChainValid(),
      highRisk:       patients.filter(p => p.riskLevel === 'high').length
    }
  });
});

module.exports = router;
