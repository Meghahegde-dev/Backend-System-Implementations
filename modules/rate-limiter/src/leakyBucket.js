class LeakyBucketLimiter {
    constructor(capacity, leakRate) {
        this.capacity = capacity;   // max requests in the bucket
        this.leakRate = leakRate;   // requests per second
        this.queue = [];
        this.lastLeak = Date.now();
    }

    _leak() {
        const now = Date.now();
        const elapsed = (now - this.lastLeak) / 1000; // seconds
        const leaks = Math.floor(elapsed * this.leakRate);

        if (leaks > 0) {
            this.queue.splice(0, Math.min(leaks, this.queue.length));
            this.lastLeak = now;
        }
    }

    allowRequest() {
        this._leak();

        if (this.queue.length < this.capacity) {
            this.queue.push(Date.now());
            return true; // request allowed
        } else {
            return false; // request rejected
        }
    }
}

module.exports = LeakyBucketLimiter;