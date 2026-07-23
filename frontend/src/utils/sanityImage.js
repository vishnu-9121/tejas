/**
 * Sanity Image URL Optimizer & Responsive SrcSet Helper
 */

export const urlForSanityImage = (source, options = {}) => {
  if (!source) return '/placeholder.png';
  if (typeof source === 'string') return source;
  if (source.asset?.url) return source.asset.url;

  const { width = 1200, height, quality = 80, format = 'webp' } = options;
  const baseUrl = source.asset?.url || source.url || '';
  if (!baseUrl) return '/placeholder.png';

  const params = new URLSearchParams();
  if (width) params.append('w', width.toString());
  if (height) params.append('h', height.toString());
  params.append('q', quality.toString());
  params.append('auto', format);

  return `${baseUrl}?${params.toString()}`;
};

export const getSanityImageProps = (source, altFallback = 'Tejas Academy Image') => {
  const src = urlForSanityImage(source);
  const alt = source?.alt || source?.altText || altFallback;
  return {
    src,
    alt,
    loading: 'lazy',
    decoding: 'async'
  };
};
