/**
 * MediChain AI — Blockchain Audit & Integrity Verification Engine
 */
const crypto = require('crypto');

class ChainValidator {
  /**
   * Recalculates hash for a given block to detect data tampering
   */
  static verifyBlockIntegrity(block) {
    if (!block) return { valid: false, reason: 'Block is null or undefined' };

    const content = block.index + block.timestamp +
                    JSON.stringify(block.data) +
                    block.previousHash + block.nonce;
    const computedHash = crypto.createHash('sha256').update(content).digest('hex');

    if (computedHash !== block.hash) {
      return {
        valid: false,
        reason: `Hash mismatch at block #${block.index}: expected ${block.hash}, calculated ${computedHash}`,
      };
    }

    return { valid: true };
  }

  /**
   * Validates full chain continuity from genesis block to current head
   */
  static auditChain(chain, difficulty = 2) {
    const target = '0'.repeat(difficulty);
    const auditReport = {
      isValid: true,
      totalBlocks: chain.length,
      invalidBlocks: [],
      timestamp: new Date().toISOString(),
    };

    if (!Array.isArray(chain) || chain.length === 0) {
      auditReport.isValid = false;
      auditReport.error = 'Chain is empty';
      return auditReport;
    }

    // Verify genesis block
    const genesis = chain[0];
    if (genesis.index !== 0 || genesis.previousHash !== '0') {
      auditReport.isValid = false;
      auditReport.invalidBlocks.push({ index: 0, reason: 'Invalid genesis block structure' });
    }

    // Verify each subsequent block
    for (let i = 1; i < chain.length; i++) {
      const current = chain[i];
      const previous = chain[i - 1];

      // Check previousHash linkage
      if (current.previousHash !== previous.hash) {
        auditReport.isValid = false;
        auditReport.invalidBlocks.push({
          index: current.index,
          reason: `Broken chain link: previousHash does not match hash of block #${previous.index}`,
        });
      }

      // Check proof-of-work difficulty requirement
      if (!current.hash.startsWith(target)) {
        auditReport.isValid = false;
        auditReport.invalidBlocks.push({
          index: current.index,
          reason: `Proof of work invalid: hash does not satisfy difficulty requirement (${difficulty} leading zeros)`,
        });
      }

      // Check block hash integrity
      const integrityCheck = this.verifyBlockIntegrity(current);
      if (!integrityCheck.valid) {
        auditReport.isValid = false;
        auditReport.invalidBlocks.push({
          index: current.index,
          reason: integrityCheck.reason,
        });
      }
    }

    return auditReport;
  }
}

module.exports = ChainValidator;
