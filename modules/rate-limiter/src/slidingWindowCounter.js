class SlidingWindowCounter {
  constructor(limit, windowSizeInSeconds) {
    this.limit = limit;
    this.windowSize = windowSizeInSeconds * 1000;

    // Track the current and previous window counts
    this.previousCount = 0;
    this.currentCount = 0;
    this.windowStart = Date.now();
  }

  allowRequest() {
    const now = Date.now();
    const elapsedTime = now - this.windowStart;

    //window slide logic
    if (elapsedTime >= this.windowSize) {
      const passedWindows = Math.floor(elapsedTime / this.windowSize);

      if (passedWindows === 1) {
        this.previousCount = this.currentCount;
      } else {
        // If a large gap occurred, the previous window is effectively empty
        this.previousCount = 0;
      }

      this.currentCount = 0;
      this.windowStart = now - (elapsedTime % this.windowSize);
    }

    // Calculate the "sliding" weight
    // weight = (windowSize - timeIntoCurrentWindow) / windowSize
    const weight =
      (this.windowSize - (now - this.windowStart)) / this.windowSize;
    const estimatedCount = this.previousCount * weight + this.currentCount;

    if (estimatedCount < this.limit) {
      this.currentCount += 1;
      return true;
    }

    return false;
  }
}

module.exports = SlidingWindowCounter;
