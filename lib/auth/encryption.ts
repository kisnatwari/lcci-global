import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

// Get encryption key from environment
// In production, use a strong 32-byte key
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'default-32-byte-key-change-in-prod!!';
const ALGORITHM = 'aes-256-cbc';

// Ensure key is 32 bytes
const getEncryptionKey = (): Buffer => {
  const key = Buffer.from(ENCRYPTION_KEY, 'utf8');
  if (key.length !== 32) {
    // Pad or truncate to 32 bytes
    const paddedKey = Buffer.alloc(32);
    key.copy(paddedKey, 0, 0, Math.min(key.length, 32));
    return paddedKey;
  }
  return key;
};

/**
 * Encrypts data using AES-256-CBC
 */
export function encrypt(data: string): string {
  try {
    const key = getEncryptionKey();
    const iv = randomBytes(16);
    const cipher = createCipheriv(ALGORITHM, key, iv);
    
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Return IV + encrypted data (IV is needed for decryption)
    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypts data using AES-256-CBC
 */
export function decrypt(encryptedData: string): string {
  try {
    const key = getEncryptionKey();
    const parts = encryptedData.split(':');
    
    if (parts.length !== 2) {
      throw new Error('Invalid encrypted data format');
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    
    const decipher = createDecipheriv(ALGORITHM, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}

