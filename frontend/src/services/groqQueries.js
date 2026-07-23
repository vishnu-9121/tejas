/**
 * Standardized GROQ Queries for Tejas Academy Sanity CMS Engine
 */

export const GROQ_THEME_SETTINGS_QUERY = `
  *[_type == "themeSettings"][0] {
    primaryColor,
    secondaryColor,
    accentColor,
    borderRadius,
    fontFamily,
    enableDarkMode
  }
`;

export const GROQ_PAGES_QUERY = `
  *[_type == "page"] {
    _id,
    title,
    "slug": slug.current,
    seo
  }
`;

export const GROQ_PAGE_BY_SLUG_QUERY = `
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    seo,
    pageBuilder[] {
      _type,
      heading,
      subheading,
      description,
      primaryCtaText,
      primaryCtaLink,
      secondaryCtaText,
      secondaryCtaLink,
      bgImage {
        asset->{ _id, url },
        hotspot
      },
      title,
      subtitle,
      cards[] {
        cardTitle,
        cardDescription,
        cardLink,
        cardImage { asset->{ url } }
      },
      items[] {
        label,
        value,
        question,
        answer
      },
      content
    }
  }
`;

export const GROQ_PROGRAMS_QUERY = `
  *[_type == "program" && status == "published"] | order(_createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    category,
    duration,
    level,
    shortDescription,
    description,
    highlights,
    isFeatured
  }
`;

export const GROQ_SITE_SETTINGS_QUERY = `
  *[_type == "siteSettings"][0] {
    contactEmail,
    contactPhone,
    physicalAddress,
    branding,
    socialLinks,
    announcementBar
  }
`;
