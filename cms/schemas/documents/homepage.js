export const homepage = {
  name: 'homepage',
  title: 'Homepage Manager',
  type: 'document',
  fields: [
    {
      name: 'hero',
      title: 'Hero Header Section',
      type: 'object',
      fields: [
        { name: 'title', title: 'Main Heading', type: 'string', initialValue: 'Architect Your Career with Industry-Driven Excellence' },
        { name: 'subtitle', title: 'Badge Subtitle', type: 'string', initialValue: '🚀 Admissions Open for Academic Year 2026-27' },
        { name: 'description', title: 'Hero Description Paragraph', type: 'text', initialValue: 'Empowering future leaders with cutting-edge engineering, data science, and management degree programs.' },
        { name: 'primaryCtaText', title: 'Primary Button Label', type: 'string', initialValue: 'Apply for Admissions' },
        { name: 'primaryCtaLink', title: 'Primary Button Link', type: 'string', initialValue: '/admissions' },
        { name: 'secondaryCtaText', title: 'Secondary Button Label', type: 'string', initialValue: 'Explore Programs' },
        { name: 'secondaryCtaLink', title: 'Secondary Button Link', type: 'string', initialValue: '/programs' },
        { name: 'heroImage', title: 'Hero Main Image / Graphic', type: 'image', options: { hotspot: true } },
        { name: 'videoUrl', title: 'Hero Video Reel URL (Optional)', type: 'url' }
      ]
    },
    {
      name: 'stats',
      title: 'Key Academic Statistics',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Statistic Title', type: 'string' },
            { name: 'value', title: 'Statistic Value (e.g., 98.4%, 15+ LPA)', type: 'string' },
            { name: 'icon', title: 'Icon Identifier (Lucide)', type: 'string' }
          ]
        }
      ]
    },
    {
      name: 'whyChooseUs',
      title: 'Why Choose Tejas Section',
      type: 'object',
      fields: [
        { name: 'title', title: 'Section Title', type: 'string', initialValue: 'Why Tejas Academy Leads Higher Education' },
        { name: 'subtitle', title: 'Sub-heading', type: 'string', initialValue: 'Built on rigour, industry mentorship, and cutting-edge practical infrastructure.' },
        {
          name: 'features',
          title: 'Features List',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'title', title: 'Feature Title', type: 'string' },
                { name: 'description', title: 'Feature Description', type: 'text' },
                { name: 'icon', title: 'Lucide Icon Name', type: 'string' }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'finalCta',
      title: 'Bottom Call To Action Banner',
      type: 'object',
      fields: [
        { name: 'title', title: 'Banner Title', type: 'string', initialValue: 'Ready to Transform Your Professional Journey?' },
        { name: 'description', title: 'Banner Description', type: 'text', initialValue: 'Speak with our admissions counselors today and secure your seat in our flagship 2026 programs.' },
        { name: 'buttonText', title: 'Button Text', type: 'string', initialValue: 'Start Application Now' },
        { name: 'buttonLink', title: 'Button Link', type: 'string', initialValue: '/admissions' }
      ]
    }
  ]
};
