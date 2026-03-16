// ─────────────────────────────────────────────
//  Block Model — Single blockchain block
// ─────────────────────────────────────────────
const crypto = require('crypto');

class Block {
  constructor(index, data, previousHash = '0') {
    this.index        = index;
    this.timestamp    = new Date().toISOString();
    this.data         = data;           // medical record payload
    this.previousHash = previousHash;
    this.nonce        = 0;
    this.hash         = this.calculateHash();
  }

  calculateHash() {
    const content = this.index + this.timestamp +
                    JSON.stringify(this.data) +
                    this.previousHash + this.nonce;
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  // Proof-of-work (difficulty = leading zeros)
  mineBlock(difficulty = 2) {
    const target = '0'.repeat(difficulty);
    while (!this.hash.startsWith(target)) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log(`Block #${this.index} mined: ${this.hash}`);
  }
}

module.exports = Block;
