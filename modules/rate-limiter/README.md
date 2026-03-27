# Rate Limiter

A rate limiter restricts the number of requests a user, client, or service can make in a given time window.

## Why Rate Limiting is Important

- Prevents clients from overwhelming the server  
- Protects against DDoS attacks  
- Ensures fair usage across multiple users  
- Can be used to enforce pricing tiers or quotas

## Common strategies

Some popular algorithms to implement rate limiting:

- Fixed Window: Counts requests in a fixed interval (e.g., 100 requests per minute). Simple but can allow bursts at window edges.  
- Sliding Window: Counts requests in a moving time window. More accurate than Fixed Window for high-frequency requests.  
- Token Bucket: Allows bursts with smooth refill rate. Efficient and commonly used in production systems.  
- Leaky Bucket: Smoothes out bursts into a constant flow. Useful for consistent traffic shaping.

---

## Token Bucket

The **Token Bucket** algorithm is a popular rate limiting strategy that allows bursts while enforcing a sustained request rate.

**How it works:**
- Each client has a “bucket” containing tokens.  
- Each request consumes a token.  
- Tokens are refilled at a fixed rate over time.  
- If the bucket is empty, requests are rejected until tokens refill.

## Trade-offs:

✅ Allows bursts smoothly
✅ Handles sustained traffic efficiently
❌ Slight memory overhead for tracking tokens and last refill

**Parameters:**
- `burst`: Maximum number of requests allowed in a short period (bucket capacity)  
- `sustained`: Rate at which tokens are added to the bucket (per minute)  

**Example Usage:**
```js
const TokenBucketLimiter = require('./tokenBucket');

const bucket = new TokenBucketLimiter(5, 60); // 5 burst, 60 tokens/min

console.log(bucket.allowRequest()); // true
console.log(bucket.allowRequest()); // true
console.log(bucket.allowRequest()); // true



----------------------------------------------------------------------------------------------------
## Sliding Window

The **Sliding Window** algorithm is a rate limiting strategy that counts requests in a moving time window, providing more accurate control than Fixed Window.

**How it works:**
- Each request timestamp is recorded per client.  
- Old timestamps outside the window are removed automatically.  
- Requests are allowed if the number of timestamps within the window is below the limit.  
- Requests exceeding the limit are rejected until timestamps slide out of the window.

## Trade-offs:

✅ Accurate for high-frequency requests
✅ Prevents bursts at window edges
❌ Uses more memory than Fixed Window (stores timestamps)

**Parameters:**
- `limit`: Maximum number of requests allowed in the time window  
- `windowMs`: Size of the sliding window in milliseconds  

**Example Usage:**
```js
const SlidingWindowLimiter = require('./slidingWindow');

const limiter = new SlidingWindowLimiter(3, 1000); // 3 requests per 1 second

console.log(limiter.allowRequest('user1')); // true
console.log(limiter.allowRequest('user1')); // true
console.log(limiter.allowRequest('user1')); // true
console.log(limiter.allowRequest('user1')); // false (limit reached)