# In-Memory Cache System (LRU + LFU + TTL)

A lightweight in-memory caching system built in Node.js that demonstrates core cache eviction strategies and TTL-based expiration.

This project is designed for learning and system design interview preparation.

---

## Features

- In-memory key-value storage
- TTL (Time-To-Live) expiration
- LRU (Least Recently Used) eviction
- LFU (Least Frequently Used) eviction
- Manual deletion / invalidation
- Configurable capacity
- Pluggable eviction policy (LRU / LFU)

---

## Core Concepts

### TTL (Time-To-Live)
Each key expires automatically after a fixed duration.

### LRU Eviction
Removes the least recently accessed item when cache is full.

### LFU Eviction
Removes the least frequently accessed item when cache is full.

### Capacity Control
Cache size is limited. When full, eviction policy is triggered.

---

## Project Structure
/cache-system
│
├── cache.js # Core cache implementation
├── index.js # Test / usage examples
└── README.md


--
# Eviction Behavior
-LRU Mode
Removes least recently used key
-LFU Mode
Removes least frequently used key

# TTL Behavior
-Each key has an expiration time
-Expired keys return null
-Expired keys are removed lazily during access