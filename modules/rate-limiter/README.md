# Rate Limiter

A rate limiter restricts the number of requests a user, client, or service can make in a given time window.

## Why Rate Limiting is Important

- Prevents clients from overwhelming the server  
- Protects against DDoS attacks  
- Ensures fair usage across multiple users  
- Can be used to enforce pricing tiers or quotas

## Common strategies

- **Fixed Window**: Counts requests in a fixed interval (e.g., 100 requests per minute). Simple but can allow bursts at window edges.  
- **Sliding Window Counter**: Uses a weighted average of the current and previous window to estimate usage. Memory efficient and smooths out boundary bursts.
- **Sliding Window Log**: Tracks every request timestamp. 100% accurate but uses more memory as it stores every event.
- **Token Bucket**: Allows bursts with a smooth refill rate. Efficient and commonly used in production systems.  
- **Leaky Bucket**: Smoothes out bursts into a constant flow. Useful for consistent traffic shaping.

--------------------------------------------------------------------------------------------------------------------------------------

## Token Bucket

The **Token Bucket** algorithm is a popular rate limiting strategy that allows bursts while enforcing a sustained request rate.

**How it works:**
- Each client has a “bucket” containing tokens.  
- Each request consumes a token.  
- Tokens are refilled at a fixed rate over time.  
- If the bucket is empty, requests are rejected until tokens refill.

## Trade-offs:

✅ **Pros:**Allows bursts smoothly
✅ **Pros:**Handles sustained traffic efficiently
❌ **Cons:** Slight memory overhead for tracking tokens and last refill

---------------------------------------------------------------------------------------------------------------------------------

## Leaky Bucket

The **Leaky Bucket** algorithm is a rate limiting strategy that enforces a constant, steady output rate regardless of the burstiness of the input.

**How it works:**
- Imagine a bucket with a small hole at the bottom.
- Requests are added to the bucket (the queue).  
- If the bucket is full, new requests are discarded (overflow).  
- Requests "leak" out of the bucket and are processed at a fixed, constant rate.

## Trade-offs:

✅ **Pros:** Smoothes out bursts perfectly; provides a very predictable flow of requests to the server.
❌ **Cons:** Cons: A burst of requests can be delayed as they wait in the "bucket" to be processed; does not allow for any burst capacity beyond the bucket size.

---------------------------------------------------------------------------------------------------------------------------------

## Fixed Window

The **Fixed Window** algorithm is the simplest approach. It resets the counter exactly when the time window expires.

**How it works:**
- A counter is incremented for every request within a fixed block of time (e.g., 10:00:00 to 10:00:10).
- When the window resets, the counter drops to zero.

### Trade-offs:
✅ **Pros:** Extremely low memory (1 integer) and very fast.  
❌ **Cons:** **Boundary Burst.** A user can send 5 requests at 10:09 and 5 more at 10:11, effectively doubling the rate limit in a short burst.

-------------------------------------------------------------------------------------------------------------------------------------

## Sliding Window Counter

The **Sliding Window Counter** provides a "smoothed" version of the Fixed Window without the memory cost of a Log.

**How it works:**
- It looks at the count of the current window and the previous window.
- It calculates a weighted average based on how far we are into the current window.
- Formula: count = current_window_count + (previous_window_count * percentage_of_previous_window_overlapping)

## Trade-offs:
✅ **Pros:**  Prevents the boundary burst issue; low memory footprint.
❌ **Cons:** It is an estimation. It assumes requests in the previous window were evenly distributed.

-------------------------------------------------------------------------------------------------------------------------------------

## Sliding Window Log

The **Sliding Window Log**  provides 100% accuracy by tracking every single request timestamp.

**How it works:**
- Every request timestamp is stored in a list.
- On every request, timestamps older than the window size are discarded.
- The request is allowed if the number of remaining timestamps is below the limit.

## Trade-offs:
✅ **Pros:**  Perfectly accurate; handles rolling windows with no boundary issues.
❌ **Cons:** High memory usage; processing time grows with the number of requests in the

-------------------------------------------------------------------------------------------------------------------------------------

## Comparison Summary

| Algorithm | Precision | Memory Usage | Burst Handling | Best For |
| :--- | :--- | :--- | :--- | :--- |
| **Fixed Window** | Low | Very Low | Poor (Boundary Bursts) | Basic APIs, low-traffic services |
| **Sliding Counter** | Medium | Low | Good (Smoothed) | Scalable APIs with high traffic |
| **Sliding Log** | High | High | Excellent | Security-critical or financial limits |
| **Token Bucket** | High | Low | Excellent (Configurable) | Modern web apps, flexible traffic |
| **Leaky Bucket** | High | Low | None (Forced Steady Rate) | Traffic shaping, backend protection |

## Summary: Which one to choose?

* **Token Bucket** is usually the industry standard for most web applications because it allows for bursts while maintaining a steady long-term rate.
* **Sliding Window Counter** is the best "middle ground" if you want to avoid the edge cases of Fixed Windows without the high memory of a Log.
* **Leaky Bucket** is perfect for background jobs or message processing where the target system can only handle a specific, unchangeable rate (e.g., 5 jobs per second).

* **Sliding Window Log** only when 100% precision is required and you have a small enough limit that memory won't be an issue.
