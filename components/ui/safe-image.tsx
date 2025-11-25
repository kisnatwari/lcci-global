"use client";

import Image from "next/image";
import { useState } from "react";

interface SafeImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  onError?: () => void;
}

/**
 * Checks if an image domain is configured in next.config.ts
 */
function isDomainConfigured(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    
    // Get configured domains from next.config.ts
    // Since we can't directly import next.config.ts in client components,
    // we'll check against a list of known configured domains
    // This list should match next.config.ts remotePatterns
    const configuredDomains = [
      'images.unsplash.com',
      'themystickeys.com',
      'example.com',
      'wwe.com',
      'www.wwe.com',
      'upload.wikimedia.org',
      'wikimedia.org',
      // DigitalOcean Spaces domains
      'lcci.fra1.cdn.digitaloceanspaces.com',
    ];
    
    // Check exact match
    if (configuredDomains.includes(hostname)) {
      return true;
    }
    
    // Check wildcard patterns (e.g., *.wwe.com, *.wikimedia.org, *.digitaloceanspaces.com)
    const wildcardPatterns = [
      /^.*\.wwe\.com$/,
      /^.*\.wikimedia\.org$/,
      /^.*\.digitaloceanspaces\.com$/,
    ];
    
    return wildcardPatterns.some(pattern => pattern.test(hostname));
  } catch {
    // Invalid URL, assume not configured
    return false;
  }
}

/**
 * SafeImage component that automatically falls back to regular img tag
 * if the image domain is not configured in next.config.ts
 */
export function SafeImage({
  src,
  alt,
  fill,
  width,
  height,
  className,
  sizes,
  priority,
  onError,
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);
  const isConfigured = isDomainConfigured(src);

  const handleError = () => {
    setHasError(true);
    if (onError) {
      onError();
    }
  };

  // If domain is not configured or there's an error, use regular img tag
  if (!isConfigured || hasError) {
    if (fill) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className={className}
          onError={handleError}
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
        />
      );
    }
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        onError={handleError}
      />
    );
  }

  // Use next/image for configured domains
  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        sizes={sizes}
        priority={priority}
        onError={handleError}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      sizes={sizes}
      priority={priority}
      onError={handleError}
    />
  );
}

