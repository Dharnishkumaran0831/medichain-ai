// ─────────────────────────────────────────────
//  Utility: Hashing helpers
// ─────────────────────────────────────────────
const crypto = require('crypto');

const hashHelper = {
  sha256: (data) =>
    crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex'),

  shortHash: (data) =>
    crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex').slice(0, 12),

  verifyHash: (data, hash) =>
    crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex') === hash
};

module.exports = hashHelper;
