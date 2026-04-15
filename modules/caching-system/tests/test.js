const Cache = require("./cache");

const cache = new Cache({
  capacity: 2,
  ttlMs: 3000,
  policy: "LRU", // try "LFU"
});

cache.set("A", 1);
cache.set("B", 2);

console.log(cache.get("A")); // 1

cache.set("C", 3); // evicts B (LRU)

console.log(cache.get("B")); // null
console.log(cache.get("C")); // 3

setTimeout(() => {
  console.log("After TTL:");
  console.log(cache.get("A")); // null (expired)
}, 4000);