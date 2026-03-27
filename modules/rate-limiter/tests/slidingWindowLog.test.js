const SlidingWindowLog = require('./SlidingWindowLog');


const limiter = new SlidingWindowLog(3, 5); 

console.log('--- Initial Burst ---');
console.log('Req 1:', limiter.allowRequest()); // true
console.log('Req 2:', limiter.allowRequest()); // true
console.log('Req 3:', limiter.allowRequest()); // true
console.log('Req 4 (Limit hit):', limiter.allowRequest()); // false

setTimeout(() => {
    console.log('\n--- After 3 Seconds ---');
    console.log('Req 5 (Still blocked):', limiter.allowRequest()); // false
}, 3000);

setTimeout(() => {
    console.log('\n--- After 6 Seconds ---');
    console.log('Req 6 (Allowed!):', limiter.allowRequest()); // true
    console.log('Current Log Size:', limiter.log.length); 
}, 6000);