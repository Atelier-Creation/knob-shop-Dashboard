import React, {useState } from "react";

export function RetryableImage({ src, alt, className }) {
  const [currentSrc, setCurrentSrc] = useState(src?.trim() || "/fallback.png");
  // const [hasRetried, setHasRetried] = useState(false);

  const handleError = () => {
    if (src) {
      setCurrentSrc(src.trim()); 
    } else {
      setCurrentSrc("/fallback.png");
    }
  };

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      loading="lazy"
      onError={handleError}
    />
  );
}
