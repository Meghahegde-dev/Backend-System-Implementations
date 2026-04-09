// test.js
const InMemoryDB = require('./InMemoryDB');

function assertEqual(actual, expected, message) {
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  if (pass) console.log(`✅ PASS: ${message}`);
  else {
    console.log(`❌ FAIL: ${message}`);
    console.log("   Expected:", expected);
    console.log("   Actual:  ", actual);
  }
}

function runTests() {
  const db = new InMemoryDB();

  console.log("\n=== Level 1: Basic Operations ===");
  db.setTTL("user1", "name", "Alice", 1, 10);
  db.setTTL("user1", "age", "25", 1, 10);
  assertEqual(db.getTTL("user1", "name", 2), "Alice", "Get existing field");
  assertEqual(db.deleteTTL("user1", "age", 2), true, "Delete existing field");
  assertEqual(db.getTTL("user1", "age", 2), null, "Deleted field returns null");

  console.log("\n=== Level 2: Scan & Prefix ===");
  db.setTTL("user1", "nickname", "Al", 2, 10);
  assertEqual(db.scanTTL("user1", 3), ["name-(Alice)", "nickname-(Al)"], "Scan all fields");
  assertEqual(db.scanByPrefixTTL("user1", "n", 3), ["name-(Alice)", "nickname-(Al)"], "Scan by prefix 'n'");

  console.log("\n=== Level 3: TTL Expiration ===");
  db.setTTL("user2", "name", "Bob", 5, 3); // expires at 8
  assertEqual(db.getTTL("user2", "name", 6), "Bob", "TTL valid");
  assertEqual(db.getTTL("user2", "name", 9), null, "TTL expired");

  console.log("\n=== Level 4: Backup & Restore ===");
  db.setTTL("user3", "name", "Charlie", 10, 5); // expires at 15
  assertEqual(db.save(12), 2, "Backup returns non-empty records"); // user1 + user3
  db.setTTL("user1", "nickname", "Ally", 13, 5); // update field
  db.restore(14);
  assertEqual(db.getTTL("user1", "nickname", 14), "Al", "Restored previous nickname");
  assertEqual(db.getTTL("user3", "name", 14), "Charlie", "Restored user3");
  assertEqual(db.getTTL("user3", "name", 16), null, "Restored field expired after TTL");

  console.log("\n🎉 All tests executed!");
}

runTests();