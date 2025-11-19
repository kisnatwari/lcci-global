/**
 * Simple encryption using base64 and XOR cipher
 * Works in both browser and Node.js
 * 
 * Note: This is obfuscation, not true encryption. 
 * For production, consider using proper encryption libraries.
 * 
 * Security: XOR cipher provides basic obfuscation but is not cryptographically secure.
 * It prevents casual inspection but should not be relied upon for sensitive data.
 */

function getSecret(): string {
  const key = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || process.env.ENCRYPTION_KEY;
  
  if (!key) {
    // Only warn once per server restart in development
    if (process.env.NODE_ENV === 'development' && !(global as any).__encryption_key_warning_shown) {
      console.warn('⚠️ ENCRYPTION_KEY not set. Using default (INSECURE for production).');
      console.warn('   Set ENCRYPTION_KEY in .env.local to enable proper session encryption.');
      (global as any).__encryption_key_warning_shown = true;
    }
    return 'default-secret-key-change-in-production-32-chars!!';
  }
  
  return key;
}

/**
 * Simple XOR cipher + base64 encoding
 */
export function encrypt(data: string): string {
  const secret = getSecret();
  let encrypted = '';
  
  for (let i = 0; i < data.length; i++) {
    const charCode = data.charCodeAt(i) ^ secret.charCodeAt(i % secret.length);
    encrypted += String.fromCharCode(charCode);
  }
  
  // Encode to base64
  if (typeof btoa !== 'undefined') {
    // Browser
    return btoa(encrypted);
  } else {
    // Node.js
    return Buffer.from(encrypted, 'binary').toString('base64');
  }
}

/**
 * Decrypt base64 + XOR cipher
 */
export function decrypt(encryptedData: string): string {
  const secret = getSecret();
  
  // Decode from base64
  let decoded: string;
  if (typeof atob !== 'undefined') {
    // Browser
    decoded = atob(encryptedData);
  } else {
    // Node.js
    decoded = Buffer.from(encryptedData, 'base64').toString('binary');
  }
  
  let decrypted = '';
  for (let i = 0; i < decoded.length; i++) {
    const charCode = decoded.charCodeAt(i) ^ secret.charCodeAt(i % secret.length);
    decrypted += String.fromCharCode(charCode);
  }
  
  return decrypted;
}

