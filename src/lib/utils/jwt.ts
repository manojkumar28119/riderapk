/**
 * JWT utility functions for decoding and extracting claims
 */

interface JWTPayload {
  exp?: number;
  iat?: number;
}

/**
 * Decode JWT payload without verification (for client-side use only)
 * JWT format: header.payload.signature
 * @param token JWT token string
 * @returns Decoded payload object or null if invalid
 */
export const decodeJWT = (token: string): JWTPayload | null => {
  try {
    if (!token || typeof token !== 'string') {
      return null;
    }

    const parts = token.split('.');
    
    // JWT should have 3 parts
    if (parts.length !== 3) {
      console.warn('Invalid JWT format: expected 3 parts');
      return null;
    }

    // Decode the payload (second part)
    const payload = parts[1];
    
    // Add padding if needed (JWT uses base64url without padding)
    const paddingNeeded = 4 - (payload.length % 4);
    const paddedPayload = payload + (paddingNeeded < 4 ? '='.repeat(paddingNeeded) : '');
    
    // Decode from base64url to string
    const decoded = atob(paddedPayload);
    
    // Parse JSON
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
};

/**
 * Extract expiry timestamp from JWT token
 * @param token JWT token string
 * @returns Expiry time in milliseconds (exp claim * 1000) or null if invalid
 */
export const getTokenExpiry = (token: string): number | null => {
  const payload = decodeJWT(token);
  
  if (!payload || !payload.exp) {
    return null;
  }

  // JWT exp is in seconds, convert to milliseconds
  return payload.exp * 1000;
};

/**
 * Check if token is expired
 * @param expiryMs Token expiry time in milliseconds
 * @returns true if token is expired
 */
export const isTokenExpired = (expiryMs: number): boolean => {
  return Date.now() > expiryMs;
};

/**
 * Check if token needs refresh (expires in less than specified minutes)
 * @param expiryMs Token expiry time in milliseconds
 * @param minutesThreshold Minutes before expiry to consider as "needs refresh"
 * @returns true if token expires within threshold
 */
export const shouldRefreshToken = (expiryMs: number, minutesThreshold: number = 10): boolean => {
  const now = Date.now();
  const thresholdMs = minutesThreshold * 60 * 1000;
  
  return (expiryMs - now < thresholdMs) && (expiryMs - now > 0);
};
