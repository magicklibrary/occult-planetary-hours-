// Secure utility functions for Planetary Hours App

/**
 * Sanitize user input to prevent XSS attacks
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 200); // Limit length
}

/**
 * Validate latitude and longitude
 */
export function validateCoordinates(lat, lon) {
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);
  
  if (isNaN(latitude) || isNaN(longitude)) {
    return null;
  }
  
  if (latitude < -90 || latitude > 90) {
    return null;
  }
  
  if (longitude < -180 || longitude > 180) {
    return null;
  }
  
  return { lat: latitude, lon: longitude };
}

/**
 * Rate-limited fetch with retry logic
 */
export async function secureFetch(url, options = {}, maxRetries = 3) {
  const defaultOptions = {
    headers: {
      'User-Agent': 'PlanetaryHoursApp/4.0',
      'Accept': 'application/json'
    },
    ...options
  };
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, defaultOptions);
      
      if (!response.ok) {
        if (response.status === 429) {
          // Rate limited - wait and retry
          await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1)));
          continue;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

/**
 * Validate and parse date/time input
 */
export function validateDateTime(dateStr, timeStr) {
  try {
    const dateTime = new Date(`${dateStr}T${timeStr}`);
    if (isNaN(dateTime.getTime())) {
      return null;
    }
    
    // Check if date is reasonable (not too far in past/future)
    const year = dateTime.getFullYear();
    if (year < 1900 || year > 2100) {
      return null;
    }
    
    return dateTime;
  } catch {
    return null;
  }
}

/**
 * Cache with expiration
 */
export class SecureCache {
  constructor(maxAge = 3600000) { // 1 hour default
    this.cache = new Map();
    this.maxAge = maxAge;
  }
  
  set(key, value) {
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }
  
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > this.maxAge) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }
  
  clear() {
    this.cache.clear();
  }
}
```

**Updated .gitignore** (if using version control):
```
# Dependencies
node_modules/
package-lock.json
yarn.lock

# Environment variables
.env
.env.local
.env.production

# Build outputs
dist/
build/

# Cache
.cache/
*.log

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Sensitive data
*.key
*.pem
secrets/
