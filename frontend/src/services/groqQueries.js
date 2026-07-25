/**
 * Standardized GROQ Queries for Tejas Academy Sanity CMS Engine
 * Field names MUST match exactly with cms/schemas/documents/*.js
 */

export const GROQ_SITE_SETTINGS_QUERY = `
  *[_type == "siteSettings"][0] {
    siteName,
    siteTagline,
    "logoUrl": logo.asset->url,
    "faviconUrl": favicon.asset->url,
    contactEmail,
    contactPhone,
    whatsappNumber,
    physicalAddress,
    googleMapsUrl,
    googleAnalyticsId,
    socialLinks,
    metaDefaults
  }
`;

export const GROQ_HERO_SLIDER_QUERY = `
  *[_type == "heroSlider" && isActive == true] | order(order asc) {
    _id,
    title,
    subtitle,
    description,
    primaryCtaText,
    primaryCtaLink,
    secondaryCtaText,
    secondaryCtaLink,
    "imageUrl": bgImage.asset->url,
    overlayColor
  }
`;

export const GROQ_COLLABORATIONS_QUERY = `
  *[_type == "collaboration"] | order(order asc) {
    _id,
    name,
    category,
    "logoUrl": logo.asset->url,
    websiteUrl
  }
`;

export const GROQ_EXCELLENCE_FACTOR_QUERY = `
  *[_type == "excellenceFactor"] | order(questionNumber asc) {
    _id,
    questionNumber,
    questionTitle,
    questionSubtitle,
    options
  }
`;

export const GROQ_FREE_PROGRAMS_QUERY = `
  *[_type == "freeProgram"] {
    _id,
    title,
    "slug": slug.current,
    category,
    duration,
    shortDescription,
    modulesCount,
    enrollLink,
    "imageUrl": coverImage.asset->url
  }
`;

export const GROQ_INSTITUTION_SERVICES_QUERY = `
  *[_type == "institutionService"] {
    _id,
    title,
    category,
    description,
    keyBenefits,
    icon
  }
`;

export const GROQ_RECOGNITIONS_QUERY = `
  *[_type == "recognition"] {
    _id,
    title,
    issuingBody,
    year,
    description,
    "imageUrl": image.asset->url
  }
`;

export const GROQ_HOMEPAGE_QUERY = `
  *[_type == "homepage"][0] {
    hero {
      title,
      subtitle,
      description,
      primaryCtaText,
      primaryCtaLink,
      secondaryCtaText,
      secondaryCtaLink,
      "imageUrl": heroImage.asset->url,
      videoUrl
    },
    stats,
    whyChooseUs {
      title,
      subtitle,
      features
    },
    finalCta {
      title,
      description,
      buttonText,
      buttonLink
    }
  }
`;

export const GROQ_ABOUT_PAGE_QUERY = `
  *[_type == "aboutPage"][0] {
    heroTitle,
    heroSubtitle,
    storyText,
    missionText,
    visionText,
    founderMessage {
      founderName,
      founderTitle,
      messageText,
      "founderPhotoUrl": founderPhoto.asset->url
    },
    timeline
  }
`;

export const GROQ_CONTACT_PAGE_QUERY = `
  *[_type == "contactPage"][0] {
    title,
    heroTitle,
    subtitle,
    heroSubtitle,
    email,
    generalEmail,
    supportEmail,
    admissionsEmail,
    phone,
    helplinePhone,
    whatsappSupport,
    address,
    campusAddress,
    workingHours,
    googleMapsEmbedUrl,
    mapEmbedUrl
  }
`;

export const GROQ_NAVIGATION_QUERY = `
  *[_type == "navigation"][0] {
    logoText,
    "logoImageUrl": logoImage.asset->url,
    menuItems[] {
      label,
      url,
      dropdownItems[] {
        label,
        url,
        description
      }
    },
    headerCta {
      buttonText,
      buttonLink
    }
  }
`;

export const GROQ_FOOTER_QUERY = `
  *[_type == "footer"][0] {
    copyrightText,
    accreditationText,
    quickLinks[] {
      label,
      url
    },
    legalLinks[] {
      label,
      url
    }
  }
`;

export const GROQ_GALLERY_QUERY = `
  *[_type == "gallery"] | order(_createdAt desc) {
    _id,
    title,
    category,
    caption,
    "imageUrl": image.asset->url
  }
`;

export const GROQ_TESTIMONIALS_QUERY = `
  *[_type == "testimonial"] | order(_createdAt desc) {
    _id,
    name,
    role,
    company,
    program,
    quote,
    rating,
    "avatarUrl": avatar.asset->url
  }
`;

export const GROQ_EVENTS_QUERY = `
  *[_type == "event"] | order(date asc) {
    _id,
    title,
    "slug": slug.current,
    category,
    date,
    time,
    location,
    description,
    registrationLink,
    "imageUrl": image.asset->url
  }
`;

export const GROQ_BLOGS_QUERY = `
  *[_type == "blog" && status == "Published"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    category,
    excerpt,
    content,
    tags,
    publishedAt,
    "coverImageUrl": coverImage.asset->url
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
    fee,
    shortDescription,
    description,
    highlights,
    "imageUrl": image.asset->url,
    isFeatured
  }
`;

export const GROQ_MENTORS_QUERY = `
  *[_type == "mentor"] {
    _id,
    name,
    "slug": slug.current,
    role,
    department,
    bio,
    "imageUrl": image.asset->url,
    experienceYears,
    linkedInUrl
  }
`;

export const GROQ_FAQS_QUERY = `
  *[_type == "faq"] | order(order asc) {
    _id,
    question,
    answer,
    category,
    order
  }
`;

export const GROQ_POPUP_MODALS_QUERY = `
  *[_type == "popupModal" && isEnabled == true] {
    _id,
    title,
    popupType,
    isEnabled,
    subtitle,
    description,
    "imageUrl": image.asset->url,
    primaryCtaText,
    primaryCtaLink,
    secondaryCtaText,
    secondaryCtaLink,
    displayFrequency,
    targetPages
  }
`;
