/**
 * Sistema de cache inteligente
 */

interface CacheOptions {
  ttl?: number;
  maxSize?: number;
  strategy?: 'lru' | 'fifo' | 'lfu';
}

class IntelligentCache {
  private cache = new Map<string, {
    data: any;
    timestamp: number;
    accessCount: number;
    lastAccessed: number;
  }>();
  
  private options: Required<CacheOptions>;
  
  constructor(options: CacheOptions = {}) {
    this.options = {
      ttl: options.ttl || 5 * 60 * 1000,
      maxSize: options.maxSize || 100,
      strategy: options.strategy || 'lru'
    };
  }
  
  set(key: string, data: any): void {
    const now = Date.now();
    
    if (this.cache.size >= this.options.maxSize && !this.cache.has(key)) {
      this.evict();
    }
    
    this.cache.set(key, {
      data,
      timestamp: now,
      accessCount: 1,
      lastAccessed: now
    });
  }
  
  get(key: string): any | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    const now = Date.now();
    
    if (now - entry.timestamp > this.options.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    entry.accessCount++;
    entry.lastAccessed = now;
    
    return entry.data;
  }
  
  has(key: string): boolean {
    return this.get(key) !== null;
  }
  
  delete(key: string): void {
    this.cache.delete(key);
  }
  
  clear(): void {
    this.cache.clear();
  }
  
  private evict(): void {
    if (this.cache.size === 0) return;
    
    let keyToEvict: string;
    
    switch (this.options.strategy) {
      case 'lru':
        keyToEvict = this.findLRUKey();
        break;
      case 'lfu':
        keyToEvict = this.findLFUKey();
        break;
      case 'fifo':
      default:
        keyToEvict = this.cache.keys().next().value;
        break;
    }
    
    this.cache.delete(keyToEvict);
  }
  
  private findLRUKey(): string {
    let lruKey = '';
    let oldestTime = Date.now();
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccessed < oldestTime) {
        oldestTime = entry.lastAccessed;
        lruKey = key;
      }
    }
    
    return lruKey;
  }
  
  private findLFUKey(): string {
    let lfuKey = '';
    let minCount = Infinity;
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.accessCount < minCount) {
        minCount = entry.accessCount;
        lfuKey = key;
      }
    }
    
    return lfuKey;
  }
  
  getStats(): {
    size: number;
    maxSize: number;
    hitRate: number;
    memoryUsage: number;
  } {
    const entries = Array.from(this.cache.values());
    const totalAccesses = entries.reduce((sum, entry) => sum + entry.accessCount, 0);
    const cacheHits = entries.filter(entry => entry.accessCount > 1).length;
    
    return {
      size: this.cache.size,
      maxSize: this.options.maxSize,
      hitRate: totalAccesses > 0 ? cacheHits / totalAccesses : 0,
      memoryUsage: this.estimateMemoryUsage()
    };
  }
  
  private estimateMemoryUsage(): number {
    let usage = 0;
    for (const [key, entry] of this.cache.entries()) {
      usage += key.length * 2;
      usage += JSON.stringify(entry.data).length * 2;
      usage += 24;
    }
    return usage;
  }
}

export const medicalDataCache = new IntelligentCache({
  ttl: 10 * 60 * 1000,
  maxSize: 200,
  strategy: 'lru'
});

export { IntelligentCache };
export type { CacheOptions };