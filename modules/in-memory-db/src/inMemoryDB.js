// InMemoryDB.js
class InMemoryDB {
  constructor() {
    this.db = {};      // main database
    this.backups = []; // backups: { timestamp, db }
  }

  // =========================
  // LEVEL 1 & 3: TTL Methods
  // =========================
  setTTL(key, field, value, timestamp, ttl) {
    if (!this.db[key]) this.db[key] = {};
    this.db[key][field] = { value, createdAt: timestamp, ttl };
  }

  getTTL(key, field, timestamp) {
    const record = this.db[key];
    if (!record || !record[field]) return null;

    const { value, createdAt, ttl } = record[field];
    if (ttl !== undefined && (timestamp < createdAt || timestamp >= createdAt + ttl)) return null;
    return value;
  }

  deleteTTL(key, field, timestamp) {
    const record = this.db[key];
    if (!record || !record[field]) return false;

    const { createdAt, ttl } = record[field];
    if (ttl !== undefined && (timestamp < createdAt || timestamp >= createdAt + ttl)) return false;

    delete record[field];
    return true;
  }

  // =========================
  // LEVEL 2: Scan Methods
  // =========================
  scanTTL(key, timestamp) {
    const record = this.db[key];
    if (!record) return [];

    return Object.entries(record)
      .filter(([_, meta]) => !meta.ttl || (timestamp >= meta.createdAt && timestamp < meta.createdAt + meta.ttl))
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([field, meta]) => `${field}-(${meta.value})`);
  }

  scanByPrefixTTL(key, prefix, timestamp) {
    const record = this.db[key];
    if (!record) return [];

    return Object.entries(record)
      .filter(([field, meta]) =>
        field.startsWith(prefix) &&
        (!meta.ttl || (timestamp >= meta.createdAt && timestamp < meta.createdAt + meta.ttl))
      )
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([field, meta]) => `${field}-(${meta.value})`);
  }

  // =========================
  // LEVEL 4: Backup / Restore
  // =========================
  save(timestamp) {
    const dbCopy = {};
    let nonEmptyRecords = 0;

    for (const [key, record] of Object.entries(this.db)) {
      const newRecord = {};
      for (const [field, meta] of Object.entries(record)) {
        const remainingTTL = meta.ttl !== undefined ? (meta.createdAt + meta.ttl - timestamp) : undefined;
        if (remainingTTL === undefined || remainingTTL > 0) {
          newRecord[field] = {
            value: meta.value,
            createdAt: timestamp,
            ttl: remainingTTL,
          };
        }
      }
      if (Object.keys(newRecord).length > 0) {
        dbCopy[key] = newRecord;
        nonEmptyRecords++;
      }
    }

    this.backups.push({ timestamp, db: dbCopy });
    return nonEmptyRecords;
  }

  restore(timestampToRestore) {
    const backup = [...this.backups].reverse().find(b => b.timestamp <= timestampToRestore);
    if (!backup) return;

    const restoredDB = {};
    for (const [key, record] of Object.entries(backup.db)) {
      restoredDB[key] = {};
      for (const [field, meta] of Object.entries(record)) {
        const remainingTTL = meta.ttl !== undefined ? meta.ttl - (timestampToRestore - backup.timestamp) : undefined;
        if (remainingTTL === undefined || remainingTTL > 0) {
          restoredDB[key][field] = {
            value: meta.value,
            createdAt: timestampToRestore,
            ttl: remainingTTL,
          };
        }
      }
      if (Object.keys(restoredDB[key]).length === 0) delete restoredDB[key];
    }

    this.db = restoredDB;
  }
}

module.exports = InMemoryDB;