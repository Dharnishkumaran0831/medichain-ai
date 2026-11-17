/**
 * MediChain AI — Health & Telemetry API Route
 * Provides real-time server uptime, memory usage, and node health telemetry.
 */
const express = require('express');
const router = express.Router();
const blockchain = require('../models/Blockchain');

router.get('/', (req, res) => {
  const chain = blockchain.getChain();
  const memoryUsage = process.memoryUsage();

  res.json({
    status: 'healthy',
    service: 'MediChain AI Node',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    blockchain: {
      blocksCount: chain.length,
      difficulty: blockchain.difficulty,
      isChainValid: blockchain.isChainValid(),
    },
    system: {
      memoryUsedMB: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      nodeVersion: process.version,
      platform: process.platform,
    },
  });
});

module.exports = router;
