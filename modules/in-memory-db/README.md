# In-Memory Database with TTL & Backup

This project implements a simplified in-memory database with support for:

- **Level 1:** Basic set/get/delete operations  
- **Level 2:** Scan records and filter fields  
- **Level 3:** TTL (Time-To-Live) for fields  
- **Level 4:** Backup and restore database state  

---

## Usage Example

```js
const InMemoryDB = require('./InMemoryDB');
const db = new InMemoryDB();

// Set a TTL field (value lives 5 units from timestamp 10)
db.setTTL("user1", "name", "Alice", 10, 5);

// Get value at timestamp 12
console.log(db.getTTL("user1", "name", 12)); // Alice

// Scan fields
console.log(db.scanTTL("user1", 12)); // ["name-(Alice)"]

// Backup database
db.save(13);

// Restore database at timestamp 14
db.restore(14);
console.log(db.getTTL("user1", "name", 14)); // Alice