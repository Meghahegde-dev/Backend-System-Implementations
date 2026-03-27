const TokenBucketLimiter = require('../src/tokenBucket');

const bucket = new TokenBucketLimiter(5, 60); // 5 burst, 60 tokens/min
const key = 'user1';

console.log(bucket.allowRequest()); // true
console.log(bucket.allowRequest()); // true
console.log(bucket.allowRequest()); // true
console.log(bucket.allowRequest()); // true
console.log(bucket.allowRequest()); // true
console.log(bucket.allowRequest()); // false (tokens exhausted)

setTimeout(() => {
  console.log(bucket.allowRequest()); // true (tokens refilled)
}, 1000);