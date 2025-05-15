export class Snowflake {
  private twepoch = 1747031284000n;
  private workerIdBits = 5n;
  private datacenterIdBits = 5n;
  private maxWorkerId = -1n ^ (-1n << this.workerIdBits); // 31
  private maxDatacenterId = -1n ^ (-1n << this.datacenterIdBits); // 31
  private sequenceBits = 12n;
  private workerIdShift = this.sequenceBits;
  private datacenterIdShift = this.sequenceBits + this.workerIdBits;
  private timestampLeftShift = this.sequenceBits + this.workerIdBits + this.datacenterIdBits;
  private sequenceMask = -1n ^ (-1n << this.sequenceBits);

  private lastTimestamp = -1n;
  private sequence = 0n;

  constructor(
    private workerId = 1n,
    private datacenterId = 1n
  ) {
    if (workerId > this.maxWorkerId || workerId < 0n) {
      throw new Error(`workerId must be between 0 and ${this.maxWorkerId}`);
    }
    if (datacenterId > this.maxDatacenterId || datacenterId < 0n) {
      throw new Error(`datacenterId must be between 0 and ${this.maxDatacenterId}`);
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

  nextId(): string {
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
      | (this.datacenterId << this.datacenterIdShift)
      | (this.workerId << this.workerIdShift)
      | this.sequence;
    return id.toString();
  }
}

// 用法示例：
// const snowflake = new Snowflake(1n, 1n);
// const id = snowflake.nextId(); 