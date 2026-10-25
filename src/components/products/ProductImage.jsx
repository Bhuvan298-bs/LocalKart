import { useState } from 'react';
import { getFallbackImage } from '../../utils/imageFallback.js';

export default function ProductImage({
  src,
  alt,
  category = 'grocery',
  className = '',
  loading = 'lazy'
}) {
  const [imgSrc, setImgSrc] = useState(src || getFallbackImage(category));

  const onError = () => {
    setImgSrc(getFallbackImage(category));
  };

  return (
    <img
      src={imgSrc}
      alt={alt || 'Product image'}
      className={className}
      onError={onError}
      loading={loading}
      referrerPolicy="no-referrer"
    />
  );
}
