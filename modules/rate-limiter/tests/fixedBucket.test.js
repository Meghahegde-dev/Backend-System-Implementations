const FixedWindowLimiter = require('./FixedWindowLimiter');

const limiter = new FixedWindowLimiter(5, 10); // 5 requests per 10 seconds

for (let i = 0; i < 7; i++) {
    console.log(`Request ${i + 1}:`, limiter.allowRequest());
}

setTimeout(() => {
    console.log('After window reset:');
    console.log('Request 1:', limiter.allowRequest());
}, 11000);