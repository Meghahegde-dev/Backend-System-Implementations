class Cache {
  constructor(options = {}) {
    this.capacity = options.capacity || 3;
    this.ttlMs = options.ttlMs || 5000;
    this.policy = options.policy || "LRU"; // "LRU" or "LFU"

    this.store = new Map(); // key → { value, expiry }

    // LRU tracking
    this.lru = new Map();

    // LFU tracking
    this.freq = new Map();     // key → frequency
    this.freqMap = new Map();  // freq → Set(keys)
  }

  // =========================
  // SET
  // =========================
  set(key, value) {
    // If key exists, remove old entry first
    if (this.store.has(key)) {
      this.delete(key);
    }

    // Evict if full
    if (this.store.size >= this.capacity) {
      if (this.policy === "LFU") {
        this.evictLFU();
      } else {
        this.evictLRU();
      }
    }

    // Create entry with TTL
    const entry = {
      value,
      expiry: Date.now() + this.ttlMs,
    };

    // Store
    this.store.set(key, entry);

    // Update LRU
    this.touchLRU(key);

    // Initialize LFU
    this.freq.set(key, 1);
    if (!this.freqMap.has(1)) {
      this.freqMap.set(1, new Set());
    }
    this.freqMap.get(1).add(key);
  }

  // =========================
  // GET
  // =========================
  get(key) {
    if (!this.store.has(key)) return null;

    const entry = this.store.get(key);

    // TTL check
    if (this.isExpired(entry)) {
      this.delete(key);
      return null;
    }

    // Update LRU
    this.touchLRU(key);

    // Update LFU
    this.incFreq(key);

    return entry.value;
  }

  // =========================
  // DELETE
  // =========================
  delete(key) {
    if (!this.store.has(key)) return;

    // Remove from store
    this.store.delete(key);

    // Remove from LRU
    this.lru.delete(key);

    // Remove from LFU
    const freq = this.freq.get(key);
    this.freq.delete(key);

    if (this.freqMap.has(freq)) {
      this.freqMap.get(freq).delete(key);
      if (this.freqMap.get(freq).size === 0) {
        this.freqMap.delete(freq);
      }
    }
  }

  // =========================
  // TTL CHECK
  // =========================
  isExpired(entry) {
    return Date.now() > entry.expiry;
  }

  // =========================
  // LRU EVICTION
  // =========================
  evictLRU() {
    const oldestKey = this.lru.keys().next().value;
    this.delete(oldestKey);
  }

  // =========================
  // LFU EVICTION
  // =========================
  evictLFU() {
    const minFreq = Math.min(...this.freqMap.keys());
    const keys = this.freqMap.get(minFreq);

    const keyToRemove = keys.values().next().value;
    this.delete(keyToRemove);
  }

  // =========================
  // LRU HELPER
  // =========================
  touchLRU(key) {
    if (this.lru.has(key)) {
      this.lru.delete(key);
    }
    this.lru.set(key, true);
  }

  // =========================
  // LFU HELPER
  // =========================
  incFreq(key) {
    const oldFreq = this.freq.get(key);
    const newFreq = oldFreq + 1;

    this.freq.set(key, newFreq);

    // Remove from old freq bucket
    if (this.freqMap.has(oldFreq)) {
      this.freqMap.get(oldFreq).delete(key);
      if (this.freqMap.get(oldFreq).size === 0) {
        this.freqMap.delete(oldFreq);
      }
    }

    // Add to new freq bucket
    if (!this.freqMap.has(newFreq)) {
      this.freqMap.set(newFreq, new Set());
    }

    this.freqMap.get(newFreq).add(key);
  }
}

module.exports = Cache;