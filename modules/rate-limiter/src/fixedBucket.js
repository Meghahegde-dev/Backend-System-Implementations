class FixedWindowLimiter {
    constructor(limit, windowSizeInSeconds) {
        this.limit = limit;                       // max requests per window
        this.windowSize = windowSizeInSeconds * 1000; // convert to milliseconds
        this.counter = 0;
        this.windowStart = Date.now();
    }

    allowRequest() {
        const now = Date.now();

        // Reset window if time passed
        if (now - this.windowStart >= this.windowSize) {
            this.counter = 0;
            this.windowStart = now;
        }

        if (this.counter < this.limit) {
            this.counter += 1;
            return true; 
        } else {
            return false; 
        }
    }
}

module.exports = FixedWindowLimiter;