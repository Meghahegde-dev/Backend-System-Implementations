// src/slidingWindow.js

class SlidingWindowLimiter {
  constructor(limit, windowMs) {
    this.limit = limit;         // max requests allowed
    this.windowMs = windowMs;   // window size in milliseconds
    this.requestLog = new Map(); // key -> array of timestamps
  }

  allowRequest(key) {
    const now = Date.now();

    if (!this.requestLog.has(key)) {
      this.requestLog.set(key, []);
    }

    const timestamps = this.requestLog.get(key);

    // Remove timestamps outside the window
    while (timestamps.length && now - timestamps[0] > this.windowMs) {
      timestamps.shift();
    }

    if (timestamps.length < this.limit) {
      timestamps.push(now);
      return true;
    }

    return false;
  }
}

module.exports = SlidingWindowLimiter;