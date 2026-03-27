class SlidingWindowLog {
    constructor(limit, windowSizeInSeconds) {
        this.limit = limit;
        this.windowSize = windowSizeInSeconds * 1000; // convert to ms
        this.log = []; // This stores our timestamps
    }

    allowRequest() {
        const now = Date.now();
        const windowBoundary = now - this.windowSize;

        // 1. Remove timestamps that have fallen out of the current window
        // (Filter keeps only the ones newer than windowBoundary)
        this.log = this.log.filter(timestamp => timestamp > windowBoundary);

        // 2. Check if we are still under the limit
        if (this.log.length < this.limit) {
            this.log.push(now);
            return true;
        }

        return false;
    }
}

module.exports = SlidingWindowLog;