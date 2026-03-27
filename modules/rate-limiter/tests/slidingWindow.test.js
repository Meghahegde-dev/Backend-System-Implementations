// tests/slidingWindow.test.js
const SlidingWindowLimiter = require('../src/slidingWindow');

const limiter = new SlidingWindowLimiter(3, 1000); // 3 requests per 1 second
const key = 'user1';

console.log("Sending 4 requests quickly:");
for (let i = 0; i < 4; i++) {
  console.log(`Request ${i + 1}: ${limiter.allowRequest(key) ? "Allowed" : "Rejected"}`);
}

setTimeout(() => {
  console.log("After 1.1 seconds:");
  console.log(`Request 5: ${limiter.allowRequest(key) ? "Allowed" : "Rejected"}`);
}, 1100);