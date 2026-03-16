// ─────────────────────────────────────────────
//  Route: /api/blockchain
// ─────────────────────────────────────────────
const router     = require('express').Router();
const blockchain = require('../models/Blockchain');

// GET  /api/blockchain         — full chain
router.get('/', (req, res) => {
  res.json({ success: true, data: blockchain.getAllBlocks() });
});

// GET  /api/blockchain/stats   — chain metadata
router.get('/stats', (req, res) => {
  res.json({ success: true, data: blockchain.getStats() });
});

// GET  /api/blockchain/validate — integrity check
router.get('/validate', (req, res) => {
  const valid = blockchain.isChainValid();
  res.json({ success: true, valid, message: valid ? 'Chain intact ✓' : 'Chain compromised ✗' });
});

// GET  /api/blockchain/:index  — single block
router.get('/:index', (req, res) => {
  const block = blockchain.getBlock(Number(req.params.index));
  if (!block) return res.status(404).json({ success: false, error: 'Block not found' });
  res.json({ success: true, data: block });
});

// POST /api/blockchain/mine    — add new block
router.post('/mine', (req, res) => {
  const { patientId, patientName, recordType, doctor, details } = req.body;
  if (!patientName || !recordType) {
    return res.status(400).json({ success: false, error: 'patientName and recordType required' });
  }
  const block = blockchain.addBlock({ patientId, patientName, recordType, doctor, details,
    addedAt: new Date().toISOString() });
  res.status(201).json({ success: true, data: block,
    message: `Block #${block.index} mined and added to chain` });
});

module.exports = router;
