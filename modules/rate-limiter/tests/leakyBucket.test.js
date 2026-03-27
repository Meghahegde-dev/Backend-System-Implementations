const LeakyBucketLimiter = require('../src/LeakyBucketLimiter');

const bucket = new LeakyBucketLimiter(5, 1); // capacity 5, 1 request/sec

console.log('Initial requests:');
console.log(bucket.allowRequest()); // true
console.log(bucket.allowRequest()); // true
console.log(bucket.allowRequest()); // true
console.log(bucket.allowRequest()); // true
console.log(bucket.allowRequest()); // true
console.log(bucket.allowRequest()); // false (bucket full)

setTimeout(() => {
    console.log('\nAfter 1 second (1 leaked):');
    console.log(bucket.allowRequest()); // true (space freed by leak)
    console.log(bucket.allowRequest()); // false (still full)
}, 1000);

setTimeout(() => {
    console.log('\nAfter 5 more seconds (5 leaked):');
    console.log(bucket.allowRequest()); // true
    console.log(bucket.allowRequest()); // true
}, 6000);