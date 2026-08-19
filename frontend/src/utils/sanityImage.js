/**
 * Sanity & CDN Image URL Optimizer & Responsive Props Helper
 */
export const urlForSanityImage = (source, options = {}) => {
  if (!source) return '/placeholder.png';

  let rawUrl = '';
  if (typeof source === 'string') {
    rawUrl = source;
  } else if (source.asset?.url) {
    rawUrl = source.asset.url;
  } else if (source.url) {
    rawUrl = source.url;
  }

  if (!rawUrl) return '/placeholder.png';

  const { width, height, quality = 80, format = 'webp', fit = 'max' } = options;

  // Optimize Sanity CDN URLs
  if (rawUrl.includes('cdn.sanity.io')) {
    try {
      const urlObj = new URL(rawUrl);
      if (width) urlObj.searchParams.set('w', width.toString());
      if (height) urlObj.searchParams.set('h', height.toString());
      urlObj.searchParams.set('q', quality.toString());
      urlObj.searchParams.set('auto', 'format');
      urlObj.searchParams.set('fit', fit);
      return urlObj.toString();
    } catch {
      return rawUrl;
    }
  }

  // Optimize Unsplash URLs
  if (rawUrl.includes('images.unsplash.com')) {
    try {
      const urlObj = new URL(rawUrl);
      if (width) urlObj.searchParams.set('w', width.toString());
      if (height) urlObj.searchParams.set('h', height.toString());
      urlObj.searchParams.set('q', quality.toString());
      urlObj.searchParams.set('auto', 'format');
      urlObj.searchParams.set('fit', 'crop');
      return urlObj.toString();
    } catch {
      return rawUrl;
    }
  }

  return rawUrl;
};

export const getSanityImageProps = (source, altFallback = 'Tejas Academy of Excellence', options = {}) => {
  const src = urlForSanityImage(source, options);
  const alt = source?.alt || source?.altText || altFallback;
  return {
    src,
    alt,
    loading: options.priority ? 'eager' : 'lazy',
    decoding: 'async',
    ...(options.priority ? { fetchPriority: 'high' } : {}),
    ...(options.width ? { width: options.width } : {}),
    ...(options.height ? { height: options.height } : {})
  };
};
