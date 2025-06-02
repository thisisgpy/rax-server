export class Snowflake {
  private twepoch = 1748707200000n; // 2025-06-01 00:00:00
  private workerIdBits = 2n;
  private maxWorkerId = -1n ^ (-1n << this.workerIdBits);
  private sequenceBits = 4n;
  private workerIdShift = this.sequenceBits;
  private timestampLeftShift = this.sequenceBits + this.workerIdBits;
  private sequenceMask = -1n ^ (-1n << this.sequenceBits);

  private lastTimestamp = -1n;
  private sequence = 0n;

  constructor(
    private workerId = 1n
  ) {
    if (workerId > this.maxWorkerId || workerId < 0n) {
      throw new Error(`workerId must be between 0 and ${this.maxWorkerId}`);
    }
  }

  private timeGen(): bigint {
    return BigInt(Date.now());
  }

  private tilNextMillis(lastTimestamp: bigint): bigint {
    let timestamp = this.timeGen();
    while (timestamp <= lastTimestamp) {
      timestamp = this.timeGen();
    }
    return timestamp;
  }

  nextId(): number {
    let timestamp = this.timeGen();
    if (timestamp < this.lastTimestamp) {
      throw new Error('Clock moved backwards. Refusing to generate id');
    }
    if (this.lastTimestamp === timestamp) {
      this.sequence = (this.sequence + 1n) & this.sequenceMask;
      if (this.sequence === 0n) {
        timestamp = this.tilNextMillis(this.lastTimestamp);
      }
    } else {
      this.sequence = 0n;
    }
    this.lastTimestamp = timestamp;
    const id = ((timestamp - this.twepoch) << this.timestampLeftShift)
      | (this.workerId << this.workerIdShift)
      | this.sequence;
    return Number(id);
  }
}

// const snowflake = new Snowflake(1n);
// const id = snowflake.nextId(); 