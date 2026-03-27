// src/tokenBucket.js

class TokenBucketLimiter {
  constructor(burst, sustained) {
    this.tokens = burst;
    this.burst = burst;        // max tokens in bucket
    this.sustained = sustained; // tokens added per minute
    this.lastRefill = Date.now();
  }

  refill() {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000; // seconds
    const tokensToAdd = (elapsed * this.sustained) / 60;
    this.tokens = Math.min(this.burst, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }

  allowRequest(count = 1) {
    this.refill();
    if (this.tokens >= count) {
      this.tokens -= count;
      return true;
    }
    return false;
  }
}

module.exports = TokenBucketLimiter;