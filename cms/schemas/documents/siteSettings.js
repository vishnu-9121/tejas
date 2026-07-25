export const siteSettings = {
  name: 'siteSettings',
  title: 'Global Site Settings',
  type: 'document',
  fields: [
    { name: 'siteName', title: 'Website Name', type: 'string', initialValue: 'Tejas Academy of Excellence' },
    { name: 'siteTagline', title: 'Tagline', type: 'string', initialValue: 'Unlocking Leadership & Academic Excellence' },
    { name: 'logo', title: 'Website Logo', type: 'image', options: { hotspot: true } },
    { name: 'favicon', title: 'Favicon Icon', type: 'image' },
    { name: 'contactEmail', title: 'Support Email', type: 'string', initialValue: 'info@unlocktejas.com' },
    { name: 'contactPhone', title: 'Phone Number', type: 'string', initialValue: '+91 98765 43210' },
    { name: 'whatsappNumber', title: 'WhatsApp Contact Number', type: 'string', initialValue: '+91 98765 43210' },
    { name: 'physicalAddress', title: 'Campus Physical Address', type: 'text', initialValue: 'Tejas Academy Campus, Tech Corridor, Jubilee Hills, Hyderabad, Telangana' },
    { name: 'googleMapsUrl', title: 'Google Maps Embedded Link', type: 'url' },
    { name: 'googleAnalyticsId', title: 'Google Analytics Measurement ID', type: 'string' },
    {
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'socialLink',
          fields: [
            { name: 'platform', title: 'Platform Name (e.g. LinkedIn, Instagram, YouTube, Facebook, Twitter)', type: 'string' },
            { name: 'url', title: 'Profile URL', type: 'url' }
          ]
        }
      ]
    },
    {
      name: 'metaDefaults',
      title: 'Global Meta & SEO Defaults',
      type: 'object',
      fields: [
        { name: 'metaTitle', title: 'Default Meta Title', type: 'string', initialValue: 'Tejas Academy of Excellence | Higher Education & Professional Leadership' },
        { name: 'metaDescription', title: 'Default Meta Description', type: 'text', initialValue: 'Empowering India\'s next generation with industry-aligned B.Tech, MBA, Data Science, and AI programs.' },
        { name: 'keywords', title: 'Keywords (Comma separated)', type: 'string', initialValue: 'Tejas Academy, Engineering, MBA, Data Science, AI, Hyderabad Admissions' },
        { name: 'ogImage', title: 'Default Share Banner', type: 'image' }
      ]
    }
  ]
};
