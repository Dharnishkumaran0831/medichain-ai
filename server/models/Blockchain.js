// ─────────────────────────────────────────────
//  Blockchain Model — Chain management
// ─────────────────────────────────────────────
const Block = require('./Block');

class Blockchain {
  constructor() {
    this.chain      = [this.createGenesisBlock()];
    this.difficulty = 2;
  }

  createGenesisBlock() {
    const genesis = new Block(0, {
      type:    'GENESIS',
      message: 'MediChain AI — Genesis Block',
      system:  'Blockchain Medical Records v1.0'
    }, '0000000000000000');
    genesis.hash = 'genesis_' + Date.now().toString(36);
    return genesis;
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(data) {
    const newBlock = new Block(
      this.chain.length,
      data,
      this.getLatestBlock().hash
    );
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
    return newBlock;
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const current  = this.chain[i];
      const previous = this.chain[i - 1];

      if (current.hash !== current.calculateHash()) return false;
      if (current.previousHash !== previous.hash)   return false;
    }
    return true;
  }

  getBlock(index) {
    return this.chain[index] || null;
  }

  getAllBlocks() {
    return this.chain;
  }

  getStats() {
    return {
      totalBlocks:  this.chain.length,
      isValid:      this.isChainValid(),
      latestHash:   this.getLatestBlock().hash,
      latestBlock:  this.chain.length - 1,
      difficulty:   this.difficulty
    };
  }
}

// Singleton — one chain for the app lifetime
module.exports = new Blockchain();
