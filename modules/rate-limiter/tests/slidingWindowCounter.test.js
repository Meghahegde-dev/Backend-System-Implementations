const SlidingWindowCounter = require('./SlidingWindowCounter');

// 5 requests per 10 seconds
const limiter = new SlidingWindowCounter(5, 10); 

console.log('--- Initial Burst (Window 1) ---');
for (let i = 0; i < 7; i++) {
    console.log(`Request ${i + 1}:`, limiter.allowRequest());
}

// Wait 11 seconds to ensure we are in a new window
setTimeout(() => {
    console.log('\n--- After 11 Seconds (Weighting Logic) ---');
    console.log('Request 1 (New Window):', limiter.allowRequest());
    
    for (let i = 2; i <= 5; i++) {
        console.log(`Request ${i}:`, limiter.allowRequest());
    }
}, 11000);