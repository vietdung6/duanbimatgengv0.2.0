"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { User } from "lucide-react";

interface UserAvatarProps {
  src?: string | null;
  alt: string;
  fallback?: string; // Initials or text
  className?: string;
  size?: number; // Optional size prop for fixed dimensions
}

export default function UserAvatar({
  src,
  alt,
  fallback,
  className = "",
  size,
}: UserAvatarProps) {
  const [error, setError] = useState(false);
  
  // Reset error state when src changes
  useEffect(() => {
    setError(false);
  }, [src]);

  if (!src || error) {
    return (
      <div 
        className={`bg-gray-800 flex items-center justify-center text-gray-400 overflow-hidden ${className}`}
        style={size ? { width: size, height: size } : undefined}
      >
        {fallback ? (
          <span className="font-bold text-xs">{fallback}</span>
        ) : (
          <User size={size ? size * 0.5 : 16} />
        )}
      </div>
    );
  }

  // Use standard img tag for external user-provided URLs to avoid Next.js domain whitelist restrictions
  // or use Next.js Image with unoptimized={true}
  return (
    <div 
      className={`relative overflow-hidden bg-gray-800 ${className}`}
      style={size ? { width: size, height: size } : undefined}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        onError={() => setError(true)}
        unoptimized // Important: allows any domain without config
      />
    </div>
  );
}
